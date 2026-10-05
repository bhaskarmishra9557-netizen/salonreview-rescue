import React, { useState } from 'react';
import { 
  Star, 
  Search, 
  Copy, 
  Check, 
  ShieldAlert, 
  MessageSquare, 
  Mail, 
  HeartHandshake, 
  Sparkles,
  Calendar,
  Filter
} from 'lucide-react';
import type { ReviewWithResponse } from '../types/database';

interface ReviewHistoryProps {
  reviewsWithResponses: ReviewWithResponse[];
  onNavigateToNewReview: () => void;
}

export const ReviewHistory: React.FC<ReviewHistoryProps> = ({
  reviewsWithResponses,
  onNavigateToNewReview,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredReviews = reviewsWithResponses.filter((item) => {
    // Rating / flagged filter
    if (filterType === 'positive' && item.review.star_rating < 4) return false;
    if (filterType === 'negative' && item.review.star_rating >= 4) return false;
    if (filterType === 'flagged' && !item.response.human_review_required) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = item.review.customer_name?.toLowerCase().includes(q);
      const textMatch = item.review.review_text.toLowerCase().includes(q);
      const replyMatch = item.response.public_reply.toLowerCase().includes(q);
      return nameMatch || textMatch || replyMatch;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1c1a18]">
            Saved Review History
          </h1>
          <p className="text-xs sm:text-sm text-[#736a60] mt-0.5">
            Access past customer feedback, generated responses, and recorded owner actions.
          </p>
        </div>

        <button
          onClick={onNavigateToNewReview}
          className="px-5 py-2.5 bg-[#2c2724] hover:bg-[#1a1715] text-white text-xs font-semibold rounded-md transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d9caa9]" />
          <span>Handle New Review</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#ded8cc] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#f4f0e8] rounded-lg w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-white text-[#1c1a18] shadow-xs'
                : 'text-[#696156] hover:text-[#1c1a18]'
            }`}
          >
            All Reviews ({reviewsWithResponses.length})
          </button>
          <button
            onClick={() => setFilterType('positive')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterType === 'positive'
                ? 'bg-white text-[#1c1a18] shadow-xs'
                : 'text-[#696156] hover:text-[#1c1a18]'
            }`}
          >
            Positive 4–5★ ({reviewsWithResponses.filter(r => r.review.star_rating >= 4).length})
          </button>
          <button
            onClick={() => setFilterType('negative')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterType === 'negative'
                ? 'bg-white text-[#1c1a18] shadow-xs'
                : 'text-[#696156] hover:text-[#1c1a18]'
            }`}
          >
            Critical 1–3★ ({reviewsWithResponses.filter(r => r.review.star_rating <= 3).length})
          </button>
          <button
            onClick={() => setFilterType('flagged')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterType === 'flagged'
                ? 'bg-white text-[#1c1a18] shadow-xs'
                : 'text-[#696156] hover:text-[#1c1a18]'
            }`}
          >
            Flagged ({reviewsWithResponses.filter(r => r.response.human_review_required).length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c8275]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews or guests..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#faf8f4] border border-[#ded8cc] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c2724] focus:border-[#2c2724]"
          />
        </div>
      </div>

      {/* Review List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#ded8cc] p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#faf6f0] border border-[#e8dfd2] flex items-center justify-center text-[#8c8275] mx-auto mb-3">
            <Filter className="w-5 h-5 text-[#8c8275]" />
          </div>
          <h3 className="font-display font-semibold text-base text-[#1c1a18]">
            No reviews match your filter
          </h3>
          <p className="text-xs text-[#5c544c] mt-1">
            Try adjusting your search criteria or handle a new customer review.
          </p>
          <button
            onClick={onNavigateToNewReview}
            className="mt-4 px-4 py-2 bg-[#2c2724] text-white text-xs font-semibold rounded-md hover:bg-[#1a1715] transition-colors"
          >
            Handle New Review
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((item) => {
            const { review, response } = item;
            const dateStr = new Date(review.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div 
                key={review.id}
                className="bg-white rounded-xl border border-[#ded8cc] shadow-xs overflow-hidden"
              >
                {/* Header row */}
                <div className="p-5 sm:px-6 bg-[#faf8f4] border-b border-[#ece7de] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.star_rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-sm text-[#1c1a18]">
                      {review.customer_name || 'Anonymous Guest'}
                    </span>
                    <span className="text-xs text-[#8c8275]">·</span>
                    <span className="text-xs text-[#736a60] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8c8275]" />
                      {dateStr}
                    </span>
                  </div>

                  {response.human_review_required && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8c3518] bg-[#fbf0eb] px-2.5 py-1 rounded border border-[#f2d0c2] self-start sm:self-auto">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#c2411f]" />
                      Human Review Required
                    </span>
                  )}
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* Original Review */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#827465] block mb-1">
                      Customer Review:
                    </span>
                    <div className="p-3.5 rounded-lg bg-[#faf8f4] border border-[#ece7de] text-xs sm:text-sm text-[#3b3530] italic leading-relaxed">
                      "{review.review_text}"
                    </div>
                  </div>

                  {/* 3 Core Outputs */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* 1. Public Reply */}
                    <div className="rounded-lg border border-[#ded8cc] bg-white p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#2c2724] flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-[#8a684b]" />
                            Public Reply
                          </span>
                          <button
                            onClick={() => copyText(response.public_reply, `h_pub_${review.id}`)}
                            className="p-1 rounded text-[#736a60] hover:text-[#1c1a18] hover:bg-[#f0ece4] transition-colors"
                            title="Copy public reply"
                          >
                            {copiedId === `h_pub_${review.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-[#423b36] leading-relaxed">
                          {response.public_reply}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#f2ece3] text-[10px] text-[#8c8275]">
                        Suitable for public posting
                      </div>
                    </div>

                    {/* 2. Private Follow-up */}
                    <div className="rounded-lg border border-[#ded8cc] bg-white p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#2c2724] flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#4b7a8a]" />
                            Private Follow-up
                          </span>
                          <button
                            onClick={() => copyText(response.private_followup, `h_priv_${review.id}`)}
                            className="p-1 rounded text-[#736a60] hover:text-[#1c1a18] hover:bg-[#f0ece4] transition-colors"
                            title="Copy private follow-up"
                          >
                            {copiedId === `h_priv_${review.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-[#423b36] leading-relaxed">
                          {response.private_followup}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#f2ece3] text-[10px] text-[#8c8275]">
                        Direct SMS or private message
                      </div>
                    </div>

                    {/* 3. Owner Action */}
                    <div className="rounded-lg border border-[#ded4c6] bg-[#f8f5ee] p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#2c2724] flex items-center gap-1.5">
                            <HeartHandshake className="w-3.5 h-3.5 text-[#2d7a4d]" />
                            Owner Action
                          </span>
                          <button
                            onClick={() => copyText(response.owner_action, `h_act_${review.id}`)}
                            className="p-1 rounded text-[#736a60] hover:text-[#1c1a18] hover:bg-[#eae4d8] transition-colors"
                            title="Copy owner action"
                          >
                            {copiedId === `h_act_${review.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-[#2f3d2f] font-medium leading-relaxed">
                          {response.owner_action}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#ebe3d4] text-[10px] text-[#786c5e]">
                        Operational team direction
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
