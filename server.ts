import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI SDK on the server side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Server-side Supabase Admin Client using SUPABASE_SERVICE_ROLE_KEY
// CRITICAL: This client is strictly server-side and never exposed to the client.
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hwaezxgpfvyicnhevkad.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient<any> | null = null;
if (supabaseUrl && serviceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Health check endpoint for Supabase connection verification
app.get('/api/supabase-health', async (_req: Request, res: Response) => {
  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Supabase admin client not initialized. Missing SUPABASE_SERVICE_ROLE_KEY.' });
    return;
  }

  try {
    const [profilesRes, salonRes, reviewsRes, respRes, usageRes] = await Promise.all([
      supabaseAdmin.from('profiles').select('id').limit(1),
      supabaseAdmin.from('salon_profiles').select('id').limit(1),
      supabaseAdmin.from('reviews').select('id').limit(1),
      supabaseAdmin.from('generated_responses').select('id').limit(1),
      supabaseAdmin.from('usage_events').select('id').limit(1),
    ]);

    const errors = {
      profiles: profilesRes.error?.message,
      salon_profiles: salonRes.error?.message,
      reviews: reviewsRes.error?.message,
      generated_responses: respRes.error?.message,
      usage_events: usageRes.error?.message,
    };

    const hasAnyError = Object.values(errors).some(Boolean);

    res.json({
      connected: !hasAnyError,
      url: supabaseUrl,
      tables: {
        profiles: !profilesRes.error,
        salon_profiles: !salonRes.error,
        reviews: !reviewsRes.error,
        generated_responses: !respRes.error,
        usage_events: !usageRes.error,
      },
      errors: hasAnyError ? errors : null,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Server-side user registration helper:
// Creates or confirms user email so they can log in immediately with client-side Supabase Auth
app.post('/api/auth/register-user', async (req: Request, res: Response) => {
  const { email, password, full_name } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Supabase service role client not available on server' });
    return;
  }

  try {
    // 1. Try to create the user directly with email_confirm = true
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name?.trim() || '' },
    });

    let userId = createData?.user?.id;

    if (createError) {
      // If user already exists in auth.users, fetch user to ensure they are confirmed
      if (createError.message?.toLowerCase().includes('already') || createError.status === 422) {
        // List users to locate the existing user ID
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const existing = listData?.users?.find(u => u.email?.toLowerCase() === email.trim().toLowerCase());
        if (existing) {
          userId = existing.id;
          // Ensure email is confirmed and password updated if desired
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            email_confirm: true,
            password,
            user_metadata: { full_name: full_name?.trim() || existing.user_metadata?.full_name || '' },
          });
        } else {
          res.status(400).json({ error: createError.message });
          return;
        }
      } else {
        res.status(400).json({ error: createError.message });
        return;
      }
    }

    if (userId) {
      // Ensure row in profiles table exists
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        full_name: full_name?.trim() || '',
        email: email.trim(),
        updated_at: new Date().toISOString(),
      });
    }

    res.json({ success: true, userId });
  } catch (err: any) {
    console.error('Server registration error:', err);
    res.status(500).json({ error: err.message || 'Internal registration error' });
  }
});

// Config status route
app.get('/api/config-status', (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  const hasSupabase = Boolean(
    process.env.VITE_SUPABASE_URL && 
    process.env.VITE_SUPABASE_ANON_KEY
  );

  res.json({
    hasGeminiKey,
    hasSupabase,
    supabaseUrl: process.env.VITE_SUPABASE_URL,
  });
});

// Fallback generator if API key is temporarily unavailable or exhausted
function getIntelligentFallbackResponse(params: {
  star_rating: number;
  review_text: string;
  customer_name?: string;
  salon_name: string;
  tone: string;
  reply_length: string;
  isEscalation: boolean;
}) {
  const { star_rating, customer_name, salon_name, tone, isEscalation } = params;
  const clientName = customer_name?.trim() ? customer_name.trim() : 'valued guest';
  const isPositive = star_rating >= 4;

  if (isEscalation) {
    return {
      public_reply: `Dear ${clientName}, thank you for bringing this to our attention. At ${salon_name}, guest safety and care are our utmost priorities. We take feedback of this nature very seriously and would appreciate the opportunity to speak with you directly offline so our management team can review what occurred. Please contact our leadership at your earliest convenience.`,
      private_followup: `Hello ${clientName}, this is the management team at ${salon_name}. We saw your review and want to reach out immediately to discuss your experience directly. Please contact our salon owner or manager at your earliest convenience so we can understand what took place in detail.`,
      owner_action: `URGENT - HUMAN REVIEW REQUIRED: This review contains sensitive allegations (safety/medical/legal/harassment). Do not post defensive public replies or offer financial settlements in writing. Speak directly with the stylist involved, review appointment service cards, document all facts, and contact the client directly by phone.`,
      human_review_required: true,
      human_review_reason: 'Flagged for safety, medical concern, legal risk, or escalation complaint.',
    };
  }

  if (isPositive) {
    const toneIntro = tone === 'Luxury' 
      ? `It was an absolute pleasure hosting you at ${salon_name}.`
      : tone === 'Warm'
      ? `We are so grateful for your wonderful visit to ${salon_name}!`
      : `Thank you so much for visiting us at ${salon_name}!`;

    return {
      public_reply: `Dear ${clientName}, ${toneIntro} Our entire team is thrilled to hear how delighted you are with your service. We take great pride in delivering thoughtful, attentive salon experiences, and we cannot wait to welcome you back to your styling chair soon!`,
      private_followup: `Hi ${clientName}! Just wanted to send a quick personal note of gratitude for your glowing review. It means the world to our team. Looking forward to seeing you at your next appointment!`,
      owner_action: `Recognize the stylist who provided the service today during team huddle. Tag this client's profile in your booking system with their positive feedback to personalize their next consultation.`,
      human_review_required: false,
      human_review_reason: null,
    };
  }

  return {
    public_reply: `Dear ${clientName}, thank you for taking the time to share your feedback with us. At ${salon_name}, we hold our craft and guest experience to the highest standard, and we are disappointed to hear that your visit did not meet your expectations. We would love the opportunity to understand your experience further and connect with you directly. Please feel free to reach out to our front desk or management.`,
    private_followup: `Hello ${clientName}, thank you for your honesty regarding your recent visit to ${salon_name}. We truly care about your satisfaction and want to hear more about your experience so we can assist. Please let us know the best number or time to reach you for a quick direct conversation.`,
    owner_action: `Review client service records with the service provider. Conduct a private, constructive debrief with the stylist on consultation techniques and timing. Reach out directly via private message or phone to listen without defensiveness.`,
    human_review_required: false,
    human_review_reason: null,
  };
}

// Generate Response API
app.post('/api/generate-response', async (req: Request, res: Response) => {
  try {
    const {
      review_text,
      star_rating,
      customer_name,
      salon_name = 'Our Salon',
      location = '',
      services = '',
      tone = 'Warm',
      reply_length = 'Medium',
    } = req.body;

    if (!review_text || typeof star_rating !== 'number') {
      res.status(400).json({ error: 'review_text and star_rating (number 1-5) are required' });
      return;
    }

    // 1. Verify authenticated user and enforce calendar month usage limit (10 free reviews)
    const authHeader = req.headers.authorization;
    if (supabaseAdmin && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      const { data: userData, error: userAuthErr } = await supabaseAdmin.auth.getUser(token);

      if (userAuthErr || !userData?.user) {
        res.status(401).json({ error: 'Invalid or expired user session. Please sign in again.' });
        return;
      }

      const verifiedUserId = userData.user.id;

      // Count user's review_generation events for the current calendar month
      const now = new Date();
      const startOfCurrentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

      const { data: usageEvents, error: usageErr } = await supabaseAdmin
        .from('usage_events')
        .select('id')
        .eq('user_id', verifiedUserId)
        .eq('event_type', 'review_generation')
        .gte('created_at', startOfCurrentMonth);

      if (usageErr) {
        console.warn('Warning querying usage events on server:', usageErr);
      }

      const currentCount = usageEvents ? usageEvents.length : 0;
      if (currentCount >= 10) {
        res.status(403).json({
          error: "You've used all 10 free reviews this month.",
          upgradePrompt: "Upgrade to Pro — $9/month",
          limitReached: true,
          usedCount: currentCount,
          maxLimit: 10,
        });
        return;
      }
    }

    const lowerReview = review_text.toLowerCase();
    const escalationKeywords = [
      'sue', 'lawyer', 'attorney', 'court', 'legal',
      'burn', 'blister', 'bleeding', 'hospital', 'er', 'doctor', 'allergic', 'infection', 'scalp burn',
      'threat', 'assault', 'harass', 'discrimina', 'racis', 'police', 'stole', 'theft', 'fbi',
    ];
    const isObviousEscalation = escalationKeywords.some(kw => lowerReview.includes(kw));

    if (!ai) {
      // Return high quality heuristic response if AI key not configured
      const fallback = getIntelligentFallbackResponse({
        star_rating,
        review_text,
        customer_name,
        salon_name,
        tone,
        reply_length,
        isEscalation: isObviousEscalation,
      });
      res.json(fallback);
      return;
    }

    const prompt = `
You are an expert client communications and reputation director for independent salons, beauty studios, and spas.
Generate a tailored response package for the following customer review.

SALON CONTEXT:
- Salon Name: ${salon_name}
- Location: ${location || 'Local studio'}
- Core Services: ${services || 'Hair, styling, and beauty services'}
- Preferred Tone: ${tone} (Friendly, Professional, Warm, or Luxury)
- Reply Length: ${reply_length} (Short: 1-2 sentences, Medium: 3-4 sentences, Detailed: 5-6 sentences)

CUSTOMER REVIEW:
- Star Rating: ${star_rating} out of 5 stars
- Customer Name: ${customer_name ? customer_name : 'Not provided'}
- Review Text: "${review_text}"

STRICT AI RULES:
1. Never invent facts or assume events took place that are not stated in the review.
2. Never promise refunds, discounts, free redos, credits, or financial compensation.
3. Never invent or cite specific salon policies unless provided.
4. Never make medical or legal claims, nor admit legal liability or guilt.
5. Never expose private information (e.g., employee full names, personal phone numbers, schedules).
6. Never blame, attack, contradict, or become defensive with the customer.
7. Match the salon's selected tone (${tone}) and reply length (${reply_length}).
8. For negative reviews (1-3 stars), acknowledge the customer's concern with empathy and dignity without admitting facts that are not established, and encourage an offline direct conversation.
9. For serious safety, discrimination, harassment, threat, medical (e.g. chemical burns, blisters, allergic reactions), legal (e.g. lawsuits, attorneys), or sensitive personal information issues, set "human_review_required" to true.

OUTPUT REQUIREMENTS:
Return pure JSON with:
1. "public_reply": A professional response suitable for posting publicly on Google / Yelp / Facebook.
2. "private_followup": A private message suitable for contacting the customer directly (via SMS, direct message, or email) to listen and recover the relationship.
3. "owner_action": Exactly one concise practical action the salon owner should take internally (e.g. front desk workflow adjustment, stylist consultation coaching, service record review).
4. "human_review_required": boolean (true if flagged under safety guidelines, else false).
5. "human_review_reason": string or null (concise reason if flagged, otherwise null).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an elite salon PR and client relations consultant. Generate exactly three outputs: Public Reply, Private Follow-up, and Owner Action. Never invent facts, never promise refunds or compensation, never invent policies, never make medical/legal claims, never expose private info, never blame or attack the customer. For negative reviews, acknowledge concerns without admitting unverified facts. Flag human_review_required for safety/medical/legal/harassment/discrimination issues. Return valid JSON only.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            public_reply: { type: Type.STRING },
            private_followup: { type: Type.STRING },
            owner_action: { type: Type.STRING },
            human_review_required: { type: Type.BOOLEAN },
            human_review_reason: { type: Type.STRING, nullable: true },
          },
          required: ['public_reply', 'private_followup', 'owner_action', 'human_review_required'],
        },
      },
    });

    const text = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Fallback cleanup in case of markdown wrappers
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    // Double-check escalation heuristic
    if (isObviousEscalation && !parsedData.human_review_required) {
      parsedData.human_review_required = true;
      parsedData.human_review_reason = 'Flagged for potential medical, safety, or legal escalation.';
    }

    res.json({
      public_reply: parsedData.public_reply,
      private_followup: parsedData.private_followup,
      owner_action: parsedData.owner_action,
      human_review_required: Boolean(parsedData.human_review_required),
      human_review_reason: parsedData.human_review_reason || null,
    });
  } catch (err: any) {
    console.error('Error generating AI review response:', err);
    // Provide resilient fallback rather than breaking user experience
    const fallback = getIntelligentFallbackResponse({
      star_rating: req.body?.star_rating || 3,
      review_text: req.body?.review_text || '',
      customer_name: req.body?.customer_name,
      salon_name: req.body?.salon_name || 'Our Salon',
      tone: req.body?.tone || 'Warm',
      reply_length: req.body?.reply_length || 'Medium',
      isEscalation: false,
    });
    res.json(fallback);
  }
});

// Full-stack Vite integration in development, static file serving in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SalonReview Rescue server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
