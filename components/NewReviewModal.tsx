import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  MessageSquare, 
  Mail, 
  HeartHandshake, 
  Copy, 
  Check, 
  ShieldAlert, 
  AlertCircle, 
  BookmarkCheck, 
  ArrowLeft,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import type { SalonProfile, GenerationResult, Review, GeneratedResponse } from '../types/database';

interface NewReviewModalProps {
  salonProfile: SalonProfile;
  remainingGenerations: number;
  onProcessReview: (data: {
    review_text: string;
    star_rating: number;
    customer_name?: string;
  }) => Promise<{ result: GenerationResult; review: Review; response: GeneratedResponse }>;
  onBackToDashboard: () => void;
  onOpenUpgradeModal: () => void;
}

export const NewReviewModal: React.FC<NewReviewModalProps> = ({
  salonProfile,
  remainingGenerations,
  onProcessReview,
  onBackToDashboard,
  onOpenUpgradeModal,
}) => {
  const [starRating, setStarRating] = useState<number>(2);
  const [customerName, setCustomerName] = useState<string>('Sarah');
  const [reviewText, setReviewText] = useState<string>(
    'I waited almost 40 minutes for my appointment. Nobody explained the delay and I felt ignored. Very disappointing experience.'
  );

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedOutput, setGeneratedOutput] = useState<GenerationResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const [copiedSection, setCopiedSection] = useState<'public' | 'private' | 'action' | null>(null);

  const copyToClipboard = (text: string, section: 'public' | 'private' | 'action') => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleQuickPreset = (preset: { rating: number; name: string; text: string }) => {
    setStarRating(preset.rating);
    setCustomerName(preset.name);
    setReviewText(preset.text);
    setGeneratedOutput(null);
    setIsSaved(false);
    setErrorMsg(null);
  };

  const presets = [
    {
      title: 'Sarah - 40 Min Delay (2★)',
      rating: 2,
      name: 'Sarah',
      text: 'I waited almost 40 minutes for my appointment. Nobody explained the delay and I felt ignored. Very disappointing experience.',
    },
    {
      title: 'Brassy Balayage (2★)',
      rating: 2,
      name: 'Jessica T.',
      text: 'Came in for an expensive balayage and my highlights are brassy orange and stripey. When I pointed it out, the stylist seemed impatient and rushed me out. Very disappointed given the price.',
    },
    {
      title: 'Bridal Perfection (5★)',
      rating: 5,
      name: 'Chloe V.',
      text: 'Had my bridal styling here yesterday with Sophia and I am blown away! She listened so carefully to what I wanted and made my hair feel weightless yet secure. The team made me feel like royalty.',
    },
    {
      title: 'Scalp Reaction Escalation (1★)',
      rating: 1,
      name: 'Rachel B.',
      text: 'The bleach burned my scalp during the treatment and when I complained the stylist said it was normal tingling. My scalp is blistered and red today. I am seeing a doctor and will contact my attorney if this is not addressed.',
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setErrorMsg('Please enter or paste the customer review text.');
      return;
    }

    if (remainingGenerations <= 0) {
      onOpenUpgradeModal();
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    setGeneratedOutput(null);
    setIsSaved(false);

    try {
      const { result } = await onProcessReview({
        review_text: reviewText.trim(),
        star_rating: starRating,
        customer_name: customerName.trim() || undefined,
      });

      setGeneratedOutput(result);
      setIsSaved(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate review response with Gemini.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c544c] hover:text-[#1c1a18] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main Review Form Card */}
      <div className="bg-white rounded-xl border border-[#ded8cc] shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-[#ece7de] bg-[#faf8f4]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold text-[#1c1a18]">
                Handle New Customer Review
              </h1>
              <p className="text-xs sm:text-sm text-[#736a60] mt-0.5">
                Generate tailored Public Reply, Private Follow-up, and Owner Action via Gemini AI.
              </p>
            </div>
            <div className="text-xs text-[#736a60] bg-[#f0eae0] px-3 py-1.5 rounded-md border border-[#e2dacd] self-start sm:self-auto">
              <span>Tone: <strong>{salonProfile.tone}</strong> · Length: <strong>{salonProfile.reply_length}</strong></span>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="mt-4 pt-4 border-t border-[#ece7de]">
            <div className="text-[11px] font-semibold text-[#827465] uppercase tracking-wider mb-2">
              Quick Test Presets (Click to Auto-fill):
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPreset(p)}
                  className="px-3 py-1 text-xs font-medium bg-white hover:bg-[#ede7dd] border border-[#ded8cc] rounded text-[#423b36] transition-colors"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mx-6 sm:mx-8 mt-6 p-3.5 rounded-md bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Generation Failed: </span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerate} className="p-6 sm:p-8 space-y-6">
          {/* Star Rating Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c544c] mb-2">
              Star Rating (1–5) *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setStarRating(star)}
                  className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                  aria-label={`${star} star rating`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= starRating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                        : 'text-neutral-200 hover:text-amber-200'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-semibold text-[#5c544c] ml-2">
                {starRating} of 5 Stars
              </span>
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c544c] mb-1.5">
              Customer Name <span className="font-normal lowercase text-[#8c8275]">(optional)</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Sarah or leave blank"
              className="w-full px-3 py-2 text-sm bg-white border border-[#ded8cc] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c2724] focus:border-[#2c2724]"
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c544c] mb-1.5">
              Customer Review Text *
            </label>
            <textarea
              rows={4}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Paste customer review here directly from Google, Yelp, Fresha, or Vagaro..."
              className="w-full p-3 text-sm bg-white border border-[#ded8cc] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c2724] focus:border-[#2c2724] leading-relaxed"
            />
          </div>

          {/* Monthly Usage & Progress Indicator */}
          <div className="p-4 rounded-lg bg-[#faf8f4] border border-[#e8e2d8] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#423b36]">
                Used: {10 - remainingGenerations} / 10
              </span>
              <span className={`font-semibold ${remainingGenerations === 0 ? 'text-[#c2411f]' : 'text-[#2d7a4d]'}`}>
                Remaining: {remainingGenerations}
              </span>
            </div>
            <div className="w-full bg-[#ede8df] rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  remainingGenerations === 0
                    ? 'bg-[#c2411f]'
                    : remainingGenerations <= 3
                    ? 'bg-[#d48b28]'
                    : 'bg-[#2c2724]'
                }`}
                style={{ width: `${Math.min(100, ((10 - remainingGenerations) / 10) * 100)}%` }}
              />
            </div>
          </div>

          {/* Blocked message if 10/10 reached */}
          {remainingGenerations <= 0 ? (
            <div className="p-5 rounded-lg border-2 border-[#b07b39] bg-[#fffaf2] space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#b07b39] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#6b4716]">
                    You've used all 10 free reviews this month.
                  </h4>
                  <p className="text-xs text-[#825c27] mt-0.5">
                    Upgrade to Pro for unlimited AI generations, custom voice tuning, and priority speed.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="w-full py-2.5 px-4 bg-[#2c2724] hover:bg-[#1a1715] text-white text-xs font-semibold rounded-md transition-colors shadow-sm"
              >
                Upgrade to Pro — $9/month
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                disabled={loading || !reviewText.trim()}
                className="w-full sm:w-auto px-7 py-3 bg-[#2c2724] hover:bg-[#1a1715] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold rounded-md transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#d9caa9]" />
                    <span>Generating response with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#d9caa9]" />
                    <span>Generate Response</span>
                  </>
                )}
              </button>

              <div className="text-xs text-[#736a60]">
                Monthly limit resets automatically next calendar month
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Generated AI Output Display */}
      {generatedOutput && (
        <div className="bg-white rounded-xl border border-[#ded8cc] shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ece7de] gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#827465]">Generated Response Package</span>
              <h2 className="font-display text-xl font-semibold text-[#1c1a18]">
                Ready for Review & Action
              </h2>
            </div>

            {/* Save Confirmation Badge */}
            {isSaved && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Saved to Supabase database & review history</span>
              </div>
            )}
          </div>

          {/* Human Review Required Alert Banner */}
          {generatedOutput.human_review_required && (
            <div className="p-4 rounded-lg bg-[#fff4f0] border-2 border-[#e69880] text-xs text-[#8c3518] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm text-[#8c3518]">
                <ShieldAlert className="w-5 h-5 text-[#c2411f]" />
                <span>HUMAN REVIEW REQUIRED</span>
              </div>
              <p className="leading-relaxed">
                {generatedOutput.human_review_reason || 
                  'This review involves potential medical issues, safety violations, legal claims, harassment, or sensitive personal information.'}
              </p>
              <div className="font-medium text-[11px] text-[#732912] pt-1">
                Advisory: Do NOT post automated or defensive responses publicly. Review client records with the stylist and consult salon leadership or legal counsel before proceeding.
              </div>
            </div>
          )}

          {/* 1. PUBLIC REPLY */}
          <div className="rounded-lg border border-[#ded8cc] bg-[#fdfcf9] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#8a684b]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2c2724]">
                  PUBLIC REPLY
                </h3>
                <span className="text-[11px] text-[#8c8275]">(For Google, Yelp, or Facebook)</span>
              </div>
              <button
                onClick={() => copyToClipboard(generatedOutput.public_reply, 'public')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#ded8cc] bg-white hover:bg-[#f5f1ea] text-[#423b36] transition-colors shadow-2xs"
              >
                {copiedSection === 'public' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied Public Reply</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#736a60]" />
                    <span>Copy Public Reply</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-white rounded-md border border-[#ede7dd] text-sm text-[#3b3530] leading-relaxed whitespace-pre-wrap">
              {generatedOutput.public_reply}
            </div>
          </div>

          {/* 2. PRIVATE FOLLOW-UP */}
          <div className="rounded-lg border border-[#ded8cc] bg-[#fdfcf9] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4b7a8a]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2c2724]">
                  PRIVATE FOLLOW-UP
                </h3>
                <span className="text-[11px] text-[#8c8275]">(Direct SMS, Email, or DM)</span>
              </div>
              <button
                onClick={() => copyToClipboard(generatedOutput.private_followup, 'private')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#ded8cc] bg-white hover:bg-[#f5f1ea] text-[#423b36] transition-colors shadow-2xs"
              >
                {copiedSection === 'private' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied Message</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#736a60]" />
                    <span>Copy Private Follow-up</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-white rounded-md border border-[#ede7dd] text-sm text-[#3b3530] leading-relaxed whitespace-pre-wrap">
              {generatedOutput.private_followup}
            </div>
          </div>

          {/* 3. OWNER ACTION */}
          <div className="rounded-lg border border-[#ded4c6] bg-[#f8f5ee] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#2d7a4d]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2c2724]">
                  OWNER ACTION
                </h3>
                <span className="text-[11px] text-[#8c8275]">(One Concise Practical Action)</span>
              </div>
              <button
                onClick={() => copyToClipboard(generatedOutput.owner_action, 'action')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#ded8cc] bg-white hover:bg-[#f5f1ea] text-[#423b36] transition-colors shadow-2xs"
              >
                {copiedSection === 'action' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied Action</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#736a60]" />
                    <span>Copy Owner Action</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-[#f3efe5] rounded-md border border-[#e2d9cb] text-sm font-medium text-[#2f3d2f] leading-relaxed">
              {generatedOutput.owner_action}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
