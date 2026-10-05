import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  History, 
  MessageSquare, 
  Mail, 
  HeartHandshake, 
  ChevronRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import type { SalonProfile, ReviewWithResponse } from '../types/database';

interface DashboardProps {
  salonProfile: SalonProfile;
  reviewsWithResponses: ReviewWithResponse[];
  generationsThisMonth: number;
  maxFreeGenerations: number;
  onNavigateToNewReview: () => void;
  onNavigateToHistory: () => void;
  onOpenUpgradeModal: () => void;
  onEditSalonProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  salonProfile,
  reviewsWithResponses,
  generationsThisMonth,
  maxFreeGenerations,
  onNavigateToNewReview,
  onNavigateToHistory,
  onOpenUpgradeModal,
  onEditSalonProfile,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedReviewItem, setSelectedReviewItem] = useState<ReviewWithResponse | null>(null);

  const remainingFreeReviews = Math.max(0, maxFreeGenerations - generationsThisMonth);
  const isLimitReached = generationsThisMonth >= maxFreeGenerations;

  // Monthly stats
  const handledCount = reviewsWithResponses.length;
  const positiveCount = reviewsWithResponses.filter(r => r.review.star_rating >= 4).length;
  const negativeCount = reviewsWithResponses.filter(r => r.review.star_rating <= 3).length;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Salon Summary & Main Action */}
      <div className="bg-white rounded-xl border border-[#ded8cc] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#827465]">
            <span>Salon Dashboard</span>
            <span aria-hidden="true">·</span>
            <span>{salonProfile.location || 'Boutique Studio'}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1c1a18] mt-1">
            {salonProfile.salon_name}
          </h1>
          <p className="text-xs sm:text-sm text-[#736a60] mt-1 flex items-center gap-3">
            <span>Tone: <strong>{salonProfile.tone}</strong></span>
            <span>·</span>
            <span>Length: <strong>{salonProfile.reply_length}</strong></span>
            <span>·</span>
            <button 
              onClick={onEditSalonProfile}
              className="text-[#2c2724] underline hover:text-[#5c544c] font-medium"
            >
              Edit Salon Settings
            </button>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToNewReview}
            className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#2c2724] hover:bg-[#1a1715] rounded-md transition-all shadow-md flex items-center justify-center gap-2 group whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-[#d9caa9]" />
            <span>Handle New Review</span>
          </button>
        </div>
      </div>

      {/* Usage Limit Banner (If used up or nearing) */}
      {isLimitReached ? (
        <div className="rounded-xl border-2 border-[#b07b39] bg-[#fffaf2] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#b07b39]/15 text-[#915f20] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#6b4716]">
                You've used all 10 free reviews this month.
              </h3>
              <p className="text-xs text-[#825c27] mt-0.5">
                Upgrade to Pro to handle unlimited reviews, unlock multi-location routing, and prioritize AI generation speed.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenUpgradeModal}
            className="px-5 py-2.5 bg-[#2c2724] hover:bg-[#1a1715] text-white text-xs font-semibold rounded-md transition-colors whitespace-nowrap shadow-sm"
          >
            Upgrade to Pro — $9/month
          </button>
        </div>
      ) : generationsThisMonth >= 7 ? (
        <div className="rounded-lg border border-[#e2dcd2] bg-[#fbf9f4] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#6e5d48]">
            <TrendingUp className="w-4 h-4 text-[#a67c3b]" />
            <span>
              You have used <strong>{generationsThisMonth}</strong> of <strong>{maxFreeGenerations}</strong> free monthly reviews ({remainingFreeReviews} remaining).
            </span>
          </div>
          <button
            onClick={onOpenUpgradeModal}
            className="text-xs font-semibold text-[#2c2724] hover:underline"
          >
            Upgrade to Pro ($9/mo) →
          </button>
        </div>
      ) : null}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Reviews Handled */}
        <div className="bg-white rounded-lg border border-[#ded8cc] p-5">
          <div className="text-xs font-medium text-[#736a60] uppercase tracking-wider">
            Reviews Handled This Month
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#1c1a18] tabular-nums">
              {handledCount}
            </span>
            <span className="text-xs text-[#2d7a4d] flex items-center font-medium">
              Active
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#8c8275]">
            Processed across your salon profile
          </div>
        </div>

        {/* Metric 2: Positive Reviews */}
        <div className="bg-white rounded-lg border border-[#ded8cc] p-5">
          <div className="text-xs font-medium text-[#736a60] uppercase tracking-wider">
            Positive Reviews (4–5★)
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#1c1a18] tabular-nums">
              {positiveCount}
            </span>
            <span className="text-xs text-[#2d7a4d] font-medium">
              {handledCount > 0 ? `${Math.round((positiveCount / handledCount) * 100)}%` : '—'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#8c8275]">
            Gratitude & stylist recognition
          </div>
        </div>

        {/* Metric 3: Negative Reviews */}
        <div className="bg-white rounded-lg border border-[#ded8cc] p-5">
          <div className="text-xs font-medium text-[#736a60] uppercase tracking-wider">
            Negative Reviews (1–3★)
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#1c1a18] tabular-nums">
              {negativeCount}
            </span>
            <span className="text-xs text-[#9c5332] font-medium">
              {handledCount > 0 ? `${Math.round((negativeCount / handledCount) * 100)}%` : '—'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#8c8275]">
            Recovered via private follow-up
          </div>
        </div>

        {/* Metric 4: Monthly Usage & Progress */}
        <div className="bg-white rounded-lg border border-[#ded8cc] p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-medium text-[#736a60] uppercase tracking-wider flex items-center justify-between">
              <span>Monthly Usage</span>
              <span className="text-[11px] font-semibold text-[#1c1a18]">
                {Math.min(100, Math.round((generationsThisMonth / maxFreeGenerations) * 100))}%
              </span>
            </div>
            
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-display text-[#1c1a18] tabular-nums">
                Used: {generationsThisMonth} / {maxFreeGenerations}
              </span>
              <span className={`text-xs font-semibold ${remainingFreeReviews === 0 ? 'text-[#c2411f]' : 'text-[#2d7a4d]'}`}>
                Remaining: {remainingFreeReviews}
              </span>
            </div>

            {/* Progress indicator for monthly usage */}
            <div className="mt-3 w-full bg-[#ede8df] rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  generationsThisMonth >= maxFreeGenerations
                    ? 'bg-[#c2411f]'
                    : generationsThisMonth >= 7
                    ? 'bg-[#d48b28]'
                    : 'bg-[#2c2724]'
                }`}
                style={{ width: `${Math.min(100, (generationsThisMonth / maxFreeGenerations) * 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#f0ece4] flex items-center justify-between text-[11px]">
            <span className="text-[#8c8275]">Resets calendar month</span>
            {generationsThisMonth >= maxFreeGenerations ? (
              <button
                onClick={onOpenUpgradeModal}
                className="font-semibold text-[#c2411f] hover:underline"
              >
                Upgrade to Pro →
              </button>
            ) : (
              <button
                onClick={onOpenUpgradeModal}
                className="font-medium text-[#2c2724] hover:underline"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Reviews Section */}
      <div className="bg-white rounded-xl border border-[#ded8cc] overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#ece7de] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-lg text-[#1c1a18]">
              Recent Reviews
            </h2>
            <span className="text-xs text-[#736a60]">
              ({reviewsWithResponses.length} total)
            </span>
          </div>
          {reviewsWithResponses.length > 0 && (
            <button
              onClick={onNavigateToHistory}
              className="text-xs font-semibold text-[#2c2724] hover:underline flex items-center gap-1"
            >
              <span>View Full History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {reviewsWithResponses.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#faf6f0] border border-[#e8dfd2] flex items-center justify-center text-[#8c8275] mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-[#a88d5e]" />
            </div>
            <h3 className="font-display font-semibold text-base text-[#1c1a18]">
              No reviews handled yet
            </h3>
            <p className="text-xs text-[#5c544c] mt-1.5 leading-relaxed">
              When a client leaves a review on Google or Yelp, paste it into SalonReview Rescue to get your Public Reply, Private Follow-up, and Owner Action.
            </p>
            <button
              onClick={onNavigateToNewReview}
              className="mt-5 px-5 py-2.5 bg-[#2c2724] hover:bg-[#1a1715] text-white text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d9caa9]" />
              <span>Handle First Review</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#ece7de]">
            {reviewsWithResponses.slice(0, 5).map((item) => {
              const { review, response } = item;
              const dateStr = new Date(review.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={review.id} className="p-6 hover:bg-[#faf9f6] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= review.star_rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-[#1c1a18]">
                        {review.customer_name || 'Anonymous Guest'}
                      </span>
                      <span className="text-xs text-[#8c8275]">·</span>
                      <span className="text-xs text-[#8c8275]">{dateStr}</span>
                    </div>

                    {response.human_review_required && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9c5332] bg-[#fbf0eb] px-2 py-0.5 rounded border border-[#f2d0c2]">
                        <ShieldAlert className="w-3 h-3" />
                        Human Review Flagged
                      </span>
                    )}
                  </div>

                  {/* Customer Review Quote */}
                  <p className="text-xs sm:text-sm text-[#423b36] italic mb-4 bg-[#f8f5ee] p-3 rounded-md border border-[#eee8dc]">
                    "{review.review_text}"
                  </p>

                  {/* 3 Outputs Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {/* Public Reply */}
                    <div className="bg-white p-3 rounded border border-[#ded8cc]">
                      <div className="flex items-center justify-between mb-1.5 font-semibold text-[#2c2724]">
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#8a684b]" />
                          Public Reply
                        </span>
                        <button
                          onClick={() => copyToClipboard(response.public_reply, `pub_${review.id}`)}
                          className="text-[11px] text-[#5c544c] hover:text-[#1c1a18] p-1"
                          title="Copy public reply"
                        >
                          {copiedId === `pub_${review.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <p className="text-[#5c544c] line-clamp-3 leading-relaxed">
                        {response.public_reply}
                      </p>
                    </div>

                    {/* Private Follow-up */}
                    <div className="bg-white p-3 rounded border border-[#ded8cc]">
                      <div className="flex items-center justify-between mb-1.5 font-semibold text-[#2c2724]">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#4b7a8a]" />
                          Private Follow-up
                        </span>
                        <button
                          onClick={() => copyToClipboard(response.private_followup, `priv_${review.id}`)}
                          className="text-[11px] text-[#5c544c] hover:text-[#1c1a18] p-1"
                          title="Copy private follow-up"
                        >
                          {copiedId === `priv_${review.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <p className="text-[#5c544c] line-clamp-3 leading-relaxed">
                        {response.private_followup}
                      </p>
                    </div>

                    {/* Owner Action */}
                    <div className="bg-[#f8f5ee] p-3 rounded border border-[#ded4c6]">
                      <div className="flex items-center justify-between mb-1.5 font-semibold text-[#2c2724]">
                        <span className="flex items-center gap-1.5">
                          <HeartHandshake className="w-3.5 h-3.5 text-[#2d7a4d]" />
                          Owner Action
                        </span>
                        <button
                          onClick={() => copyToClipboard(response.owner_action, `act_${review.id}`)}
                          className="text-[11px] text-[#5c544c] hover:text-[#1c1a18] p-1"
                          title="Copy owner action"
                        >
                          {copiedId === `act_${review.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <p className="text-[#3a473a] line-clamp-3 leading-relaxed font-medium">
                        {response.owner_action}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => setSelectedReviewItem(item)}
                      className="text-xs font-semibold text-[#2c2724] hover:underline"
                    >
                      View Full Details & All Actions →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedReviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#ded8cc] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#ece7de] flex items-center justify-between bg-[#faf8f4]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= selectedReviewItem.review.star_rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-xs text-[#1c1a18]">
                    {selectedReviewItem.review.customer_name || 'Anonymous Guest'}
                  </span>
                </div>
                <div className="text-xs text-[#736a60]">
                  Saved on {new Date(selectedReviewItem.review.created_at).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedReviewItem(null)}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-[#ede8df] hover:bg-[#e2dcd2]"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#827465] block mb-1.5">
                  Original Review
                </label>
                <div className="p-4 bg-[#fbf9f4] border border-[#e8e2d8] rounded-md text-xs sm:text-sm text-[#3b3530] italic">
                  "{selectedReviewItem.review.review_text}"
                </div>
              </div>

              {selectedReviewItem.response.human_review_required && (
                <div className="p-4 rounded-md bg-[#fff5f2] border border-[#f4c7b8] text-xs text-[#9c5332] flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Human Review Flagged:</strong> Review touches on sensitive complaints, legal threats, or medical/safety matters. Salon leadership should review appointment records directly before posting public replies.
                  </div>
                </div>
              )}

              {/* 1. Public Reply */}
              <div className="p-4 rounded-lg border border-[#ded8cc] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-[#2c2724] flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#8a684b]" />
                    1. Public Reply
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedReviewItem.response.public_reply, 'modal_pub')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-[#ded8cc] hover:bg-[#f5f1ea]"
                  >
                    {copiedId === 'modal_pub' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'modal_pub' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#423b36] leading-relaxed">
                  {selectedReviewItem.response.public_reply}
                </p>
              </div>

              {/* 2. Private Follow-up */}
              <div className="p-4 rounded-lg border border-[#ded8cc] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-[#2c2724] flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#4b7a8a]" />
                    2. Private Follow-up Message
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedReviewItem.response.private_followup, 'modal_priv')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-[#ded8cc] hover:bg-[#f5f1ea]"
                  >
                    {copiedId === 'modal_priv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'modal_priv' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#423b36] leading-relaxed">
                  {selectedReviewItem.response.private_followup}
                </p>
              </div>

              {/* 3. Owner Action */}
              <div className="p-4 rounded-lg border border-[#ded4c6] bg-[#f8f5ee]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-[#2c2724] flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-[#2d7a4d]" />
                    3. Owner Action
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedReviewItem.response.owner_action, 'modal_act')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-[#ded8cc] hover:bg-[#f5f1ea]"
                  >
                    {copiedId === 'modal_act' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'modal_act' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#2f3d2f] font-medium leading-relaxed">
                  {selectedReviewItem.response.owner_action}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
