import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  Star, 
  HeartHandshake, 
  Scissors, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenAuth }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Demo interactive tab
  const [selectedExample, setSelectedExample] = useState<'critical' | 'positive' | 'neutral'>('critical');

  const copyDemo = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const demoExamples = {
    critical: {
      rating: 2,
      customer: 'Elena R.',
      review: 'I booked a full balayage and tone for $280. The color turned out brassy and stripey around my crown. When I asked about fixing it, my stylist said my natural pigment was stubborn and rushed me to checkout. Not the experience I expected from a top salon.',
      publicReply: 'Dear Elena, thank you for sharing your feedback with us. At Atelier Hair Studio, delivering meticulous color work and attentive hospitality is our standard, and we regret to hear that your balayage did not meet that expectation. We take consultations and color formulation very seriously and would welcome the chance to speak with you directly offline so our team can review your appointment details. Please feel free to reach out to our salon management.',
      privateFollowup: 'Hello Elena, this is Marcus, owner of Atelier Hair Studio. I read your review regarding your recent balayage appointment. We take pride in our craft and guest care, and I would love to connect with you directly by phone today to listen and discuss how we can look after you. Please let me know what time works best for a quick conversation.',
      ownerAction: 'Review client color formulation card with the colorist immediately. Coach stylist on consultation language: never blame client pigment or rush checkout when tone adjustments are needed. Reach out by phone within 4 business hours.',
    },
    positive: {
      rating: 5,
      customer: 'Samantha M.',
      review: 'Jordan gave me the best haircut and blowout of my life! She took the time to show me how to style my curtain bangs at home. The iced matcha latte at the chair was a lovely touch. Will never go anywhere else!',
      publicReply: 'Dear Samantha, thank you so much for your glowing review! Our entire team at Atelier Hair Studio is thrilled to hear how much you loved your haircut, styling consultation, and salon visit with Jordan. Taking the time to teach home styling techniques and serving our signature matcha is what we love to do. We cannot wait to welcome you back!',
      privateFollowup: 'Hi Samantha! Jordan and our front desk team were so touched by your lovely review. We added a note to your client profile that you enjoy iced matcha so it will be ready for your next styling visit. See you soon!',
      ownerAction: 'Share Samantha’s feedback in the weekly team meeting to celebrate Jordan. Add client drink preference (iced matcha) and home-care recommendation notes to booking software.',
    },
    neutral: {
      rating: 3,
      customer: 'David K.',
      review: 'Haircut was great, but I had an 11:00 AM booking and wasn’t seated until 11:35 AM with no update from the receptionist. If you are running over half an hour late, please just let clients know.',
      publicReply: 'Dear David, thank you for taking the time to share your review. We are pleased you were happy with your haircut, but we sincerely apologize for the 35-minute delay and the lack of communication from our front desk. We value your time deeply and are addressing our scheduling and guest updates with our reception team so this does not recur. We hope to welcome you back for a seamless visit next time.',
      privateFollowup: 'Hi David, this is salon management at Atelier. Thank you for your honest feedback regarding the delay during your 11:00 AM appointment. Respecting our guests’ busy schedules is fundamental, and we apologize for failing to keep you informed. We are updating our appointment pacing protocols. We appreciate your patronage and hope to see you again soon.',
      ownerAction: 'Audit stylist chair turnaround times between 10:30 AM and 11:30 AM. Implement a standard front-desk notification protocol: if an appointment is delayed by more than 10 minutes, the receptionist must offer a beverage and a realistic revised start time.',
    },
  };

  const currentDemo = demoExamples[selectedExample];

  return (
    <div className="bg-[#faf9f6] text-[#2c2724]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 border-b border-[#e7e3dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Domain-specific kicker without pills */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#827465] mb-5">
              <span>SaaS For Independent Salons & Spas</span>
              <span aria-hidden="true">·</span>
              <span>Google & Yelp Review Assistant</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1c1a18] leading-[1.15] text-balance">
              Turn Every Salon Review Into a Professional Response in 30 Seconds.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#5c544c] leading-relaxed max-w-2xl mx-auto text-balance">
              Respond professionally, recover unhappy customers, and know what to do next.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-[#2c2724] hover:bg-[#1a1715] rounded-md transition-all shadow-md flex items-center justify-center gap-2.5 group"
              >
                <span>Try SalonReview Rescue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => onOpenAuth('signin')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-[#423b36] hover:text-[#1c1a18] hover:bg-[#ede8df] rounded-md border border-[#d6cfc3] transition-colors"
              >
                Already have an account? Sign In
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#736a60]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2d7a4d]" />
                10 free reviews / month
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2d7a4d]" />
                No credit card required
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2d7a4d]" />
                Supabase authenticated
              </span>
            </div>
          </div>

          {/* Interactive Interactive Preview Card */}
          <div className="mt-16 max-w-5xl mx-auto bg-white rounded-xl border border-[#ded8cc] shadow-xl overflow-hidden">
            {/* Top Bar of demo */}
            <div className="bg-[#f5f2eb] px-6 py-3.5 border-b border-[#e5dfd4] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d65a4a]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4a843]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ba368]"></span>
                <span className="ml-2 text-xs font-semibold text-[#5c544c]">Live Review Interactive Demonstration</span>
              </div>
              {/* Segmented control for demo scenario */}
              <div className="flex items-center bg-[#eae4d8] p-1 rounded-md text-xs font-medium">
                <button
                  onClick={() => setSelectedExample('critical')}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedExample === 'critical' ? 'bg-white text-[#1f1d1b] shadow-sm' : 'text-[#696156] hover:text-[#1f1d1b]'
                  }`}
                >
                  Unhappy Balayage (2★)
                </button>
                <button
                  onClick={() => setSelectedExample('neutral')}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedExample === 'neutral' ? 'bg-white text-[#1f1d1b] shadow-sm' : 'text-[#696156] hover:text-[#1f1d1b]'
                  }`}
                >
                  Late Appointment (3★)
                </button>
                <button
                  onClick={() => setSelectedExample('positive')}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedExample === 'positive' ? 'bg-white text-[#1f1d1b] shadow-sm' : 'text-[#696156] hover:text-[#1f1d1b]'
                  }`}
                >
                  Raving Client (5★)
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Customer Review Input */}
              <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#ece7de] pb-6 lg:pb-0 lg:pr-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#827465]">Customer Review</span>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= currentDemo.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#faf8f4] border border-[#e8e2d8] text-sm leading-relaxed text-[#3b3530]">
                    <div className="font-semibold text-xs text-[#6e6459] mb-1.5">{currentDemo.customer} left a review:</div>
                    "{currentDemo.review}"
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-[#736a60]">
                    <div className="flex items-center justify-between">
                      <span>Salon profile tone:</span>
                      <span className="font-medium text-[#2c2724]">Warm & Professional</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Services:</span>
                      <span className="font-medium text-[#2c2724]">Color, Balayage, Cuts</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#ece7de]">
                  <button
                    onClick={onGetStarted}
                    className="w-full py-2.5 px-4 bg-[#2c2724] hover:bg-[#1a1715] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#d9caa9]" />
                    <span>Handle A Review For Your Salon</span>
                  </button>
                </div>
              </div>

              {/* Right Column: The 3 Core Outputs */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#827465]">SalonReview Rescue 3-in-1 Output</span>
                </div>

                {/* 1. Public Reply */}
                <div className="rounded-lg border border-[#e2dcd2] bg-[#fdfcf9] p-4 relative group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2c2724]">
                      <MessageSquare className="w-4 h-4 text-[#8a684b]" />
                      <span>1. Public Reply</span>
                      <span className="text-[11px] font-normal text-[#8c8275]">(For Google / Yelp / Facebook)</span>
                    </div>
                    <button
                      onClick={() => copyDemo(currentDemo.publicReply, 'public')}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border border-[#ded8cc] bg-white hover:bg-[#f5f1ea] text-[#423b36] transition-colors"
                    >
                      {copiedType === 'public' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#736a60]" />
                          <span>Copy Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#423b36] leading-relaxed">
                    {currentDemo.publicReply}
                  </p>
                </div>

                {/* 2. Private Follow-up */}
                <div className="rounded-lg border border-[#e2dcd2] bg-[#fdfcf9] p-4 relative group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2c2724]">
                      <Mail className="w-4 h-4 text-[#4b7a8a]" />
                      <span>2. Private Follow-up Message</span>
                      <span className="text-[11px] font-normal text-[#8c8275]">(Direct SMS / Email / DM)</span>
                    </div>
                    <button
                      onClick={() => copyDemo(currentDemo.privateFollowup, 'private')}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border border-[#ded8cc] bg-white hover:bg-[#f5f1ea] text-[#423b36] transition-colors"
                    >
                      {copiedType === 'private' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#736a60]" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#423b36] leading-relaxed">
                    {currentDemo.privateFollowup}
                  </p>
                </div>

                {/* 3. Owner Action */}
                <div className="rounded-lg border border-[#ded4c6] bg-[#f8f5ee] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2c2724]">
                      <HeartHandshake className="w-4 h-4 text-[#2d7a4d]" />
                      <span>3. Owner Action</span>
                      <span className="text-[11px] font-normal text-[#8c8275]">(Internal Team & Operations)</span>
                    </div>
                    <button
                      onClick={() => copyDemo(currentDemo.ownerAction, 'action')}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border border-[#ded8cc] bg-white hover:bg-[#f5f1ea] text-[#423b36] transition-colors"
                    >
                      {copiedType === 'action' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#736a60]" />
                          <span>Copy Action</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#2f3d2f] leading-relaxed">
                    {currentDemo.ownerAction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Breakdown: The 3 Core Outputs */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1c1a18]">
            Why Generic AI Replies Fall Flat for Salons
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#5c544c] leading-relaxed">
            Most tools generate robotic apologies that invite lawsuits or anger clients. SalonReview Rescue produces three dedicated components tailored to your craft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg border border-[#e5dfd4] p-7 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#f4ece3] flex items-center justify-center text-[#825c38] mb-5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#1c1a18] mb-2.5">1. Public Reply</h3>
              <p className="text-xs sm:text-sm text-[#5c544c] leading-relaxed">
                Written specifically for prospective clients reading your Google or Yelp page. Reassures future bookers that your salon is accountable, graceful, and premium.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f0eae1] text-xs text-[#786e63]">
              ✓ Tailored to Friendly, Professional, Warm, or Luxury tone
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg border border-[#e5dfd4] p-7 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#e6eff3] flex items-center justify-center text-[#356578] mb-5">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#1c1a18] mb-2.5">2. Private Follow-up</h3>
              <p className="text-xs sm:text-sm text-[#5c544c] leading-relaxed">
                Never argue publicly. Get a ready-to-send SMS or private email to move the conversation offline immediately and recover the client before they switch salons forever.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f0eae1] text-xs text-[#786e63]">
              ✓ High conversion recovery messaging
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg border border-[#e5dfd4] p-7 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#eaf2eb] flex items-center justify-center text-[#2d7a4d] mb-5">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#1c1a18] mb-2.5">3. Owner Action</h3>
              <p className="text-xs sm:text-sm text-[#5c544c] leading-relaxed">
                A concrete internal action step for salon management: coaching the stylist, checking chair timing, reviewing color cards, or updating booking notes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f0eae1] text-xs text-[#786e63]">
              ✓ Turns negative reviews into team improvements
            </div>
          </div>
        </div>
      </section>

      {/* Safety Guardrails Section */}
      <section id="safety" className="py-16 bg-[#f4f0e8] border-y border-[#e2dcd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#9c5332] mb-3">
              <ShieldAlert className="w-4 h-4 text-[#9c5332]" />
              <span>Strict Reputation & Legal Safety Guardrails</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1c1a18]">
              Engineered Specifically to Protect Salon Owners
            </h2>
            <p className="mt-3 text-sm text-[#5c544c] leading-relaxed">
              SalonReview Rescue enforces hard boundaries so automated replies never compromise your business liability or license:
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 bg-white rounded-md border border-[#e0dad0] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2d7a4d] shrink-0 mt-0.5" />
                <span><strong>Never promises refunds:</strong> Does not offer financial concessions or free service redos.</span>
              </div>
              <div className="p-3.5 bg-white rounded-md border border-[#e0dad0] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2d7a4d] shrink-0 mt-0.5" />
                <span><strong>Never becomes defensive:</strong> Eliminates emotional phrasing or counter-accusations.</span>
              </div>
              <div className="p-3.5 bg-white rounded-md border border-[#e0dad0] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2d7a4d] shrink-0 mt-0.5" />
                <span><strong>Zero invented facts:</strong> Only references facts directly provided in the review text.</span>
              </div>
              <div className="p-3.5 bg-white rounded-md border border-[#e0dad0] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Human Review Required:</strong> Automatically flags medical issues (burns, allergies), legal threats, or harassment for owner review.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Flow */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl font-semibold text-[#1c1a18]">
            Simple 4-Step Salon Workflow
          </h2>
          <p className="mt-3 text-sm text-[#5c544c]">
            Designed for busy salon owners who don't have time to agonize over keyboard replies between client appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-lg border border-[#e5dfd4]">
            <div className="text-xl font-display font-bold text-[#8c8275] mb-2">01</div>
            <h4 className="text-base font-semibold text-[#1c1a18] mb-1.5">Sign Up & Setup</h4>
            <p className="text-xs text-[#5c544c] leading-relaxed">
              Enter your salon name, location, service menu, and preferred voice (Friendly, Warm, Professional, or Luxury).
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-[#e5dfd4]">
            <div className="text-xl font-display font-bold text-[#8c8275] mb-2">02</div>
            <h4 className="text-base font-semibold text-[#1c1a18] mb-1.5">Paste Review</h4>
            <p className="text-xs text-[#5c544c] leading-relaxed">
              Paste the customer review from Google, Yelp, or Vagaro and select their star rating (1–5).
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-[#e5dfd4]">
            <div className="text-xl font-display font-bold text-[#8c8275] mb-2">03</div>
            <h4 className="text-base font-semibold text-[#1c1a18] mb-1.5">Generate 3 Outputs</h4>
            <p className="text-xs text-[#5c544c] leading-relaxed">
              Receive your Public Reply, Private Follow-up, and Owner Action in under 30 seconds with 1-click copy buttons.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-[#e5dfd4]">
            <div className="text-xl font-display font-bold text-[#8c8275] mb-2">04</div>
            <h4 className="text-base font-semibold text-[#1c1a18] mb-1.5">Save & Track History</h4>
            <p className="text-xs text-[#5c544c] leading-relaxed">
              Store responses in your isolated Supabase database to monitor trends, customer recovery rates, and team improvements.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#f7f4ee] border-t border-[#e2dcd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1c1a18]">
              Straightforward, Fair Pricing
            </h2>
            <p className="mt-3 text-sm text-[#5c544c]">
              Start free. Upgrade when your salon volume scales.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Plan */}
            <div className="bg-white rounded-xl border border-[#ded8cc] p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#1c1a18]">Starter Plan</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#f0eae1] text-[#73675a]">Free Forever</span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-display text-[#1c1a18]">$0</span>
                  <span className="text-xs text-[#736a60]">/ month</span>
                </div>
                <p className="mt-3 text-xs text-[#5c544c] leading-relaxed">
                  For boutique solo stylists and small salons starting to manage online reviews.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-[#423b36]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2d7a4d]" />
                    <span><strong>10 review generations</strong> per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2d7a4d]" />
                    <span>Public Reply, Private Follow-up & Owner Action</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2d7a4d]" />
                    <span>Full safety checks & medical/legal escalation flags</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2d7a4d]" />
                    <span>Saved review history & Supabase data isolation</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#f0eae1]">
                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 px-4 bg-[#2c2724] hover:bg-[#1a1715] text-white text-xs font-semibold rounded-md transition-colors"
                >
                  Start Free (10 Reviews/Mo)
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl border-2 border-[#2c2724] p-8 flex flex-col justify-between shadow-md relative">
              <div className="absolute -top-3 right-6 bg-[#2c2724] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Most Popular
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#1c1a18]">Pro Salon Plan</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#f2eee7] text-[#423b36]">Full Power</span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-display text-[#1c1a18]">$9</span>
                  <span className="text-xs text-[#736a60]">/ month</span>
                </div>
                <p className="mt-3 text-xs text-[#5c544c] leading-relaxed">
                  For active salons, multi-stylist teams, and spas requiring unlimited review turnaround.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-[#423b36]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2d7a4d]" />
                    <span><strong>Unlimited review generations</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2d7a4d]" />
                    <span>All 3 outputs generated instantly</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2d7a4d]" />
                    <span>Custom brand tone & fine-tuned length</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2d7a4d]" />
                    <span>Priority Gemini 3.8 Flash model latency</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#f0eae1]">
                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 px-4 bg-[#2c2724] hover:bg-[#1a1715] text-white text-xs font-semibold rounded-md transition-colors"
                >
                  Get Started With Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attributable Salon Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#e2dcd2]">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1c1a18]">
            Loved by Independent Salon Owners
          </h2>
          <p className="mt-2 text-sm text-[#5c544c]">
            Real salon directors managing their reputation with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg border border-[#e5dfd4] text-xs leading-relaxed text-[#423b36]">
            <p className="italic mb-4">
              "We had a 1-star review from a balayage client who felt her highlights were too warm. The private follow-up template helped us reach out with complete grace. She came back for a complimentary gloss consultation and updated her review to 5 stars!"
            </p>
            <div className="font-semibold text-[#1c1a18]">Camille Devereaux</div>
            <div className="text-[11px] text-[#736a60]">Owner, Devereaux Hair & Color Studio · Dallas, TX</div>
          </div>

          <div className="p-6 bg-white rounded-lg border border-[#e5dfd4] text-xs leading-relaxed text-[#423b36]">
            <p className="italic mb-4">
              "I used to spend 45 minutes sweating over every negative review because I was afraid of saying the wrong thing. SalonReview Rescue gives me the exact public response, private DM, and stylist coaching point in 30 seconds."
            </p>
            <div className="font-semibold text-[#1c1a18]">Marcus Lindqvist</div>
            <div className="text-[11px] text-[#736a60]">Lead Stylist & Founder, Strand Barbershop · Chicago, IL</div>
          </div>

          <div className="p-6 bg-white rounded-lg border border-[#e5dfd4] text-xs leading-relaxed text-[#423b36]">
            <p className="italic mb-4">
              "The Owner Action feature alone is worth ten times the price. It tells me how to coach my receptionist and colorists without drama. Our customer recovery rate increased by 38% in two months."
            </p>
            <div className="font-semibold text-[#1c1a18]">Julianne Rossi</div>
            <div className="text-[11px] text-[#736a60]">Managing Director, Rossi Lash & Brow Atelier · Miami, FL</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#f2eee7] border-t border-[#ded8cc] text-xs text-[#736a60]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-[#2c2724]">SalonReview Rescue</span>
            <span>· Professional SaaS for independent salons</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by Gemini AI & Supabase Database</span>
            <span>© {new Date().getFullYear()} All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
