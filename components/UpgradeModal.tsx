import React, { useState } from 'react';
import { X, Sparkles, Check, Crown, ShieldCheck } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationsCount: number;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  generationsCount,
}) => {
  const [upgraded, setUpgraded] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#ded8cc] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#ece7de] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2c2724] text-[#d9caa9] flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[#1c1a18]">
                Upgrade to SalonReview Rescue Pro
              </h3>
              <p className="text-xs text-[#736a60]">
                {generationsCount >= 10
                  ? "You've used your 10 free reviews this month."
                  : 'Scale your salon reputation management without limits.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#827465] hover:text-[#1c1a18] hover:bg-[#ede8df] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {upgraded ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl font-semibold text-[#1c1a18]">
                Pro Plan Preview Activated
              </h4>
              <p className="text-xs text-[#5c544c] max-w-sm mx-auto leading-relaxed">
                As specified in the MVP specifications, payment processing (Stripe) is scheduled for the next release. Your monthly generation limit has been expanded for this test session!
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-6 py-2 bg-[#2c2724] text-white text-xs font-semibold rounded-md hover:bg-[#1a1715]"
              >
                Return to Review Dashboard
              </button>
            </div>
          ) : (
            <>
              <div className="bg-[#faf8f4] p-5 rounded-lg border border-[#e5dfd4] flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#827465] uppercase tracking-wider">
                    Monthly Subscription
                  </div>
                  <div className="text-2xl font-display font-bold text-[#1c1a18] mt-1">
                    Upgrade to Pro — $9/month
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#2c2724] text-white">
                  Cancel anytime
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5c544c]">
                  What's included in Pro:
                </div>
                <ul className="space-y-2.5 text-xs text-[#3b3530]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2d7a4d] shrink-0" />
                    <span><strong>Unlimited AI review generations</strong> (no 10/month cap)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2d7a4d] shrink-0" />
                    <span>Full 3-in-1 output: Public Reply, Private Follow-up & Owner Action</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2d7a4d] shrink-0" />
                    <span>Strict safety guardrails & automated human escalation alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2d7a4d] shrink-0" />
                    <span>Dedicated Supabase database isolation per salon</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2d7a4d] shrink-0" />
                    <span>Priority response latency with Gemini 3.8 Flash model</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setUpgraded(true)}
                  className="w-full py-3 px-4 bg-[#2c2724] hover:bg-[#1a1715] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#d9caa9]" />
                  <span>Upgrade to Pro — $9/month</span>
                </button>
                <p className="text-[11px] text-center text-[#827465] mt-2">
                  (Stripe payment integration will be enabled in production release)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
