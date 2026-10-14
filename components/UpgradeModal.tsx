import React, { useEffect, useRef, useState } from 'react';
import { X, Check, Crown, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationsCount: number;
}

const PAYPAL_CLIENT_ID =
  'AWHJBFNGB0lkS-dv7xktpuwewz749eoLMth5oM6Nx7Y2jgsU6SVzcBht5Cn8PdVmKAx_W_XSibZXNsVn';

const PAYPAL_PLAN_ID = 'P-5VP88354T58055229NLH4LUA';

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  generationsCount,
}) => {
  const paypalContainerRef = useRef<HTMLDivElement | null>(null);
  const [loadingPayPal, setLoadingPayPal] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setSuccess(false);
    setErrorMessage('');
    setLoadingPayPal(true);

    const renderPayPalButton = () => {
      if (!window.paypal || !paypalContainerRef.current) {
        setErrorMessage('PayPal could not be loaded. Please refresh and try again.');
        setLoadingPayPal(false);
        return;
      }

      paypalContainerRef.current.innerHTML = '';

      window.paypal
        .Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'subscribe',
          },

          createSubscription: (_data: any, actions: any) => {
            return actions.subscription.create({
              plan_id: PAYPAL_PLAN_ID,
            });
          },

          onApprove: async (data: any) => {
            setProcessingPayment(true);
            setErrorMessage('');

            try {
              const { data: sessionData, error: sessionError } =
                await supabase.auth.getSession();

              if (sessionError || !sessionData.session) {
                throw new Error(
                  'Your login session has expired. Please sign in again.'
                );
              }

              const response = await fetch('/api/paypal/activate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${sessionData.session.access_token}`,
                },
                body: JSON.stringify({
                  subscriptionId: data.subscriptionID,
                }),
              });

              const result = await response.json().catch(() => ({}));

              if (!response.ok || !result.success) {
                throw new Error(
                  result.error ||
                    'Payment completed, but we could not activate your Pro account yet.'
                );
              }

              setSuccess(true);
            } catch (error: any) {
              console.error('PayPal activation error:', error);
              setErrorMessage(
                error?.message ||
                  'Something went wrong while activating your Pro account.'
              );
            } finally {
              setProcessingPayment(false);
            }
          },

          onCancel: () => {
            setErrorMessage('Payment was cancelled.');
          },

          onError: (err: any) => {
            console.error('PayPal button error:', err);
            setErrorMessage(
              'PayPal encountered an error. Please try again.'
            );
          },
        })
        .render(paypalContainerRef.current)
        .finally(() => {
          setLoadingPayPal(false);
        });
    };

    const existingScript = document.getElementById('paypal-sdk-script');

    if (existingScript) {
      if (window.paypal) {
        renderPayPalButton();
      } else {
        existingScript.addEventListener('load', renderPayPalButton, {
          once: true,
        });
      }

      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-sdk-script';
    script.src =
      `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        PAYPAL_CLIENT_ID
      )}&vault=true&intent=subscription`;

    script.async = true;

    script.onload = renderPayPalButton;

    script.onerror = () => {
      setLoadingPayPal(false);
      setErrorMessage(
        'Unable to load PayPal. Please check your connection and try again.'
      );
    };

    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#ded8cc] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#ece7de] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2c2724] text-[#d9caa9] flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>

            <div>
              <h3 className="font-display font-semibold text-lg text-[#1c1a18]">
                Upgrade to SalonReview Rescue Pro
              </h3>

              <p className="text-xs text-[#736a60]">
                {generationsCount >= 10
                  ? "You've used your 10 free reviews this month."
                  : 'Scale your salon reputation management with Pro.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#827465] hover:text-[#1c1a18] hover:bg-[#ede8df] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>

              <h4 className="font-display text-2xl font-semibold text-[#1c1a18]">
                Welcome to Pro
              </h4>

              <p className="text-sm text-[#5c544c] max-w-sm mx-auto leading-relaxed">
                Your PayPal subscription is active and your Pro access has
                been enabled.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-6 py-3 bg-[#2c2724] text-white text-sm font-semibold rounded-md hover:bg-[#1a1715] transition-colors"
              >
                Continue to Pro
              </button>
            </div>
          ) : (
            <>
              <div className="bg-[#faf8f4] p-5 rounded-lg border border-[#e5dfd4]">
                <div className="text-xs font-semibold text-[#827465] uppercase tracking-wider">
                  Monthly Subscription
                </div>

                <div className="text-3xl font-display font-bold text-[#1c1a18] mt-2">
                  $9<span className="text-base font-medium">/month</span>
                </div>

                <div className="text-xs text-[#736a60] mt-2">
                  Cancel anytime through PayPal.
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5c544c]">
                  What's included
                </div>

                <ul className="space-y-3 text-sm text-[#3b3530]">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2d7a4d] shrink-0 mt-0.5" />
                    <span>Unlimited AI review generations</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2d7a4d] shrink-0 mt-0.5" />
                    <span>
                      Public Reply, Private Follow-up & Owner Action
                    </span>
                  </li>

                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2d7a4d] shrink-0 mt-0.5" />
                    <span>Safety guardrails and human review flags</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2d7a4d] shrink-0 mt-0.5" />
                    <span>Secure account-based access</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <div
                  ref={paypalContainerRef}
                  className="min-h-[48px]"
                />

                {loadingPayPal && (
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-[#736a60]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading PayPal...
                  </div>
                )}

                {processingPayment && (
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-[#736a60]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Activating your Pro account...
                  </div>
                )}

                {errorMessage && (
                  <div className="mt-3 p-3 rounded-md bg-[#fff4f0] border border-[#efc8bb] text-xs text-[#9c5332]">
                    {errorMessage}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
