import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  HeartHandshake,
  Mail,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Star,
  WandSparkles,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

type ExampleKey = 'negative' | 'positive' | 'neutral';

const examples: Record<
  ExampleKey,
  {
    rating: number;
    customer: string;
    review: string;
    publicReply: string;
    privateFollowup: string;
    ownerAction: string;
  }
> = {
  negative: {
    rating: 2,
    customer: 'Elena R.',
    review:
      'I booked a full balayage and the color came out much warmer than I expected. I was also rushed out when I asked about the result. The work took hours and I left feeling disappointed.',
    publicReply:
      'Hi Elena, thank you for taking the time to share this. We’re sorry your color appointment did not leave you feeling confident and cared for. We take both the consultation and the guest experience seriously, and we’d appreciate the opportunity to understand what happened and speak with you directly.',
    privateFollowup:
      'Hi Elena, this is the salon team. I read your review and wanted to reach out personally. I’m sorry the appointment left you disappointed. We’d really value a chance to hear more about your experience and understand where we missed the mark.',
    ownerAction:
      'Review the consultation notes and appointment timeline with the stylist. Identify where expectations and final color result became misaligned.',
  },
  positive: {
    rating: 5,
    customer: 'Samantha M.',
    review:
      'Jordan gave me an amazing haircut and showed me exactly how to style my curtain bangs at home. The whole visit felt thoughtful and personal. I’ll definitely be back.',
    publicReply:
      'Thank you, Samantha. We’re so glad you loved your cut and that Jordan could give you a few styling tips to take home. Creating a thoughtful experience from the chair to the mirror is exactly what we aim for. We can’t wait to welcome you back.',
    privateFollowup:
      'Hi Samantha — thank you again for such a lovely review. Jordan and the team were so happy to hear your styling tips were useful. We’re looking forward to seeing you again.',
    ownerAction:
      'Share the feedback with the team and capture the styling preference in the client’s notes for the next visit.',
  },
  neutral: {
    rating: 3,
    customer: 'David K.',
    review:
      'The haircut itself was great, but my 11:00 appointment started more than 30 minutes late and nobody updated me. I’d appreciate better communication next time.',
    publicReply:
      'Hi David, thank you for the honest feedback. We’re glad you were happy with the haircut, but we’re sorry about the delay and, especially, the lack of communication while you were waiting. Your time matters to us, and we’re reviewing how we communicate delays with guests.',
    privateFollowup:
      'Hi David, thank you for flagging the wait and the communication issue. We understand how frustrating that can be when you’ve planned your day around an appointment. We’re taking a closer look at our process so we can do better.',
    ownerAction:
      'Set a clear front-desk rule for delayed appointments: communicate early, give a realistic updated time, and document recurring scheduling bottlenecks.',
  },
};

const outputMeta = [
  {
    number: '01',
    title: 'Public reply',
    icon: MessageSquare,
    description:
      'A polished response designed for the review page your next customer will see.',
  },
  {
    number: '02',
    title: 'Private follow-up',
    icon: Mail,
    description:
      'A thoughtful message that moves the conversation into a more personal channel.',
  },
  {
    number: '03',
    title: 'Owner action',
    icon: HeartHandshake,
    description:
      'A practical next step for you or your team — not another generic AI paragraph.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenAuth,
}) => {
  const [selectedExample, setSelectedExample] =
    useState<ExampleKey>('negative');
  const [copied, setCopied] = useState<string | null>(null);

  const currentExample = examples[selectedExample];

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);

      window.setTimeout(() => {
        setCopied(null);
      }, 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#11110f]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#ddd7cf]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-[#e7d8d2]/60 blur-3xl" />
          <div className="absolute top-1/2 -left-32 h-72 w-72 rounded-full bg-[#ede5dc]/80 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          {/* Editorial nav */}
          <div className="flex items-center justify-between border-b border-[#ddd7cf] pb-5">
            <button
              onClick={() => onGetStarted()}
              className="group flex items-center gap-3 text-left"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#11110f] text-sm font-semibold text-[#f5f1ea]">
                S
              </span>

              <span className="font-display text-lg tracking-tight">
                SalonReview Rescue
              </span>
            </button>

            <div className="hidden items-center gap-7 text-sm text-[#77716a] sm:flex">
              <a
                href="#how-it-works"
                className="transition-colors hover:text-[#11110f]"
              >
                How it works
              </a>
              <a
                href="#why"
                className="transition-colors hover:text-[#11110f]"
              >
                Why it matters
              </a>
              <a
                href="#pricing"
                className="transition-colors hover:text-[#11110f]"
              >
                Pricing
              </a>
              <button
                onClick={() => onOpenAuth('signin')}
                className="text-[#11110f] transition-opacity hover:opacity-60"
              >
                Sign in
              </button>
            </div>
          </div>

          <div className="grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:py-28">
            <div className="max-w-3xl">
              <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#672a35]">
                <span>Reputation management for independent salons</span>
                <span className="h-px w-8 bg-[#672a35]" />
              </div>

              <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-8xl">
                Every review
                <br />
                deserves a
                <br />
                <span className="text-[#672a35]">better response.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-[#5f5a54] sm:text-lg">
                Turn customer feedback into a polished public reply, a
                thoughtful private follow-up, and a clear next step for your
                team — in seconds.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onGetStarted}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#11110f] px-7 py-4 text-sm font-semibold text-[#f5f1ea] transition-all hover:-translate-y-0.5 hover:bg-[#672a35]"
                >
                  Try it free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-full border border-[#cfc7bd] px-7 py-4 text-sm font-medium text-[#11110f] transition-colors hover:bg-[#fbfaf7]"
                >
                  See how it works
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#77716a]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#672a35]" />
                  10 reviews free every month
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#672a35]" />
                  No credit card required
                </span>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] border border-[#e2d8cf] opacity-60" />
              <div className="relative overflow-hidden rounded-[1.6rem] border border-[#d8d0c6] bg-[#fbfaf7] shadow-[0_30px_80px_rgba(24,20,17,0.10)]">
                <div className="flex items-center justify-between border-b border-[#e2dcd4] px-5 py-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a8178]">
                      Live example
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      A 2-star color review
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= 2
                            ? 'fill-[#672a35] text-[#672a35]'
                            : 'text-[#d3cbc2]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6 p-6 sm:p-7">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8178]">
                      Customer says
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#45413d]">
                      “The color came out much warmer than I expected. I left
                      feeling disappointed.”
                    </p>
                  </div>

                  <div className="h-px bg-[#e8e1d9]" />

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#672a35]">
                        <Sparkles className="h-3.5 w-3.5" />
                        SalonReview Rescue
                      </div>

                      <span className="text-[10px] text-[#8a8178]">
                        3 outputs
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-xl bg-[#f2ede6] p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#77716a]">
                          Public reply
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#3f3a35]">
                          Thank you for sharing your experience. We’re sorry
                          your appointment did not leave you feeling confident
                          and cared for...
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#efe4e1] p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#672a35]">
                          Private follow-up
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#3f3a35]">
                          We’d really value a chance to hear more about your
                          experience and understand where we missed the mark.
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#11110f] p-4 text-[#f5f1ea]">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d9b7b8]">
                          Owner action
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#eae4dc]">
                          Review consultation notes and appointment timing with
                          the stylist.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#ddd7cf] py-5">
            <div className="flex flex-col gap-3 text-xs text-[#77716a] sm:flex-row sm:items-center sm:justify-between">
              <span>Built for the moments between appointments.</span>
              <span>One review → three useful actions.</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#672a35]">
              Why it matters
            </div>

            <h2 className="mt-5 max-w-lg font-display text-4xl leading-tight tracking-[-0.025em] sm:text-5xl">
              A bad review is public.
              <br />
              Your response should be <em>thoughtful.</em>
            </h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <div className="text-sm font-semibold">01</div>
              <h3 className="mt-4 text-lg font-semibold">The delay</h3>
              <p className="mt-3 text-sm leading-6 text-[#77716a]">
                You know you need to respond, but the day gets busy and the
                review sits there longer than it should.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold">02</div>
              <h3 className="mt-4 text-lg font-semibold">The wording</h3>
              <p className="mt-3 text-sm leading-6 text-[#77716a]">
                You want to sound human, accountable and professional — not
                defensive or like a copy-paste bot.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold">03</div>
              <h3 className="mt-4 text-lg font-semibold">The aftermath</h3>
              <p className="mt-3 text-sm leading-6 text-[#77716a]">
                A review often points to a real operational issue. Your team
                needs to know what to do next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 OUTPUTS */}
      <section className="border-y border-[#ddd7cf] bg-[#fbfaf7]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#672a35]">
              The core experience
            </div>

            <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-0.025em] sm:text-5xl">
              One review.
              <br />
              Three useful outcomes.
            </h2>

            <p className="mt-5 text-base leading-7 text-[#77716a]">
              SalonReview Rescue does more than generate a sentence. It turns
              feedback into something you can actually use.
            </p>
          </div>

          <div className="mt-16 divide-y divide-[#e2dcd4] border-y border-[#e2dcd4]">
            {outputMeta.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="grid gap-5 py-8 sm:grid-cols-[80px_220px_1fr] sm:items-center"
                >
                  <div className="text-sm font-semibold text-[#672a35]">
                    {item.number}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#efe4e1] text-[#672a35]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>

                  <p className="max-w-xl text-sm leading-6 text-[#77716a]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#672a35]">
              See it in action
            </div>

            <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-0.025em] sm:text-5xl">
              From messy feedback
              <br />
              to a clear next move.
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ['negative', '2-star review'],
                ['neutral', '3-star review'],
                ['positive', '5-star review'],
              ] as [ExampleKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedExample(key)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  selectedExample === key
                    ? 'bg-[#11110f] text-[#f5f1ea]'
                    : 'border border-[#d5cec5] text-[#77716a] hover:bg-[#fbfaf7] hover:text-[#11110f]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-[#d7d0c6] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(24,20,17,0.08)]">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            {/* REVIEW */}
            <div className="border-b border-[#ded7cf] p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8178]">
                  Customer review
                </span>

                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= currentExample.rating
                          ? 'fill-[#672a35] text-[#672a35]'
                          : 'text-[#d7d0c7]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="text-sm font-semibold">
                  {currentExample.customer}
                </div>

                <p className="mt-4 text-sm leading-7 text-[#4c4742]">
                  “{currentExample.review}”
                </p>
              </div>

              <div className="mt-10 border-t border-[#e5ded6] pt-5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#672a35]">
                  <WandSparkles className="h-3.5 w-3.5" />
                  Rescue in seconds
                </div>

                <button
                  onClick={onGetStarted}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#11110f] px-5 py-3 text-sm font-semibold text-[#f5f1ea] transition-colors hover:bg-[#672a35]"
                >
                  Handle a review for your salon
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* OUTPUTS */}
            <div className="space-y-4 p-7">
              <OutputCard
                title="Public reply"
                icon={<MessageSquare className="h-4 w-4" />}
                text={currentExample.publicReply}
                copied={copied === 'public'}
                onCopy={() =>
                  handleCopy(currentExample.publicReply, 'public')
                }
              />

              <OutputCard
                title="Private follow-up"
                icon={<Mail className="h-4 w-4" />}
                text={currentExample.privateFollowup}
                copied={copied === 'private'}
                onCopy={() =>
                  handleCopy(currentExample.privateFollowup, 'private')
                }
              />

              <OutputCard
                title="Owner action"
                icon={<HeartHandshake className="h-4 w-4" />}
                text={currentExample.ownerAction}
                copied={copied === 'action'}
                dark
                onCopy={() =>
                  handleCopy(currentExample.ownerAction, 'action')
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-y border-[#ddd7cf] bg-[#11110f] text-[#f5f1ea]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d9b7b8]">
              How it works
            </div>

            <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-0.025em] sm:text-5xl">
              Built for the ten minutes
              <br />
              between appointments.
            </h2>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-4">
            {[
              ['01', 'Create your salon profile', 'Set your voice, location and service context once.'],
              ['02', 'Paste the review', 'Add the review and its star rating.'],
              ['03', 'Generate three outputs', 'Get the public reply, private follow-up and owner action.'],
              ['04', 'Copy, send, improve', 'Use the response, save the history and learn from patterns.'],
            ].map(([number, title, body]) => (
              <div
                key={number}
                className="border-t border-white/15 pt-5"
              >
                <div className="text-xs font-semibold text-[#d9b7b8]">
                  {number}
                </div>

                <h3 className="mt-5 text-base font-semibold">{title}</h3>

                <p className="mt-3 text-sm leading-6 text-[#aaa39a]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#672a35]">
              <ShieldAlert className="h-4 w-4" />
              Built with restraint
            </div>

            <h2 className="mt-5 max-w-lg font-display text-4xl leading-tight tracking-[-0.025em] sm:text-5xl">
              AI that knows
              <br />
              when to <em>step back.</em>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#77716a]">
              The goal is not to automate every sensitive conversation. The
              goal is to help you respond quickly while keeping important
              judgment with the owner or team.
            </p>
          </div>

          <div className="divide-y divide-[#e1dad2] border-y border-[#e1dad2]">
            {[
              'No invented promises, refunds or compensation.',
              'No defensive language or counter-accusations.',
              'No made-up facts that were not present in the review.',
              'Sensitive complaints can be flagged for human review.',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 py-5 text-sm text-[#4d4842]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#672a35]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="border-y border-[#ddd7cf] bg-[#fbfaf7]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#672a35]">
              Pricing
            </div>

            <h2 className="mt-5 font-display text-4xl tracking-[-0.025em] sm:text-5xl">
              Start free.
              <br />
              Keep your reputation moving.
            </h2>

            <p className="mt-5 text-sm leading-6 text-[#77716a]">
              Simple enough to try without a meeting. Useful enough to keep
              once reviews become part of your weekly workflow.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
            {/* FREE */}
            <div className="rounded-[1.4rem] border border-[#d8d1c8] bg-[#f5f1ea] p-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#77716a]">
                Starter
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="font-display text-5xl">$0</span>
                <span className="pb-2 text-sm text-[#77716a]">/ month</span>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#77716a]">
                For salon owners who want to try a better review workflow.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  '10 review generations',
                  'Public reply',
                  'Private follow-up',
                  'Owner action',
                  'Review history',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <Check className="h-4 w-4 text-[#672a35]" />
                    {item}
                  </div>
                ))}
              </div>

              <button
                onClick={onGetStarted}
                className="mt-9 w-full rounded-full border border-[#bfb7ad] px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-[#fbfaf7]"
              >
                Start free
              </button>
            </div>

            {/* PRO */}
            <div className="relative overflow-hidden rounded-[1.4rem] bg-[#11110f] p-8 text-[#f5f1ea]">
              <div className="absolute right-7 top-7 rounded-full bg-[#672a35] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]">
                Pro
              </div>

              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d9b7b8]">
                For active salons
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="font-display text-5xl">$9</span>
                <span className="pb-2 text-sm text-[#aaa39a]">/ month</span>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-6 text-[#aaa39a]">
                For salon owners who want unlimited review assistance as part
                of their regular workflow.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  'Unlimited review generations',
                  'All three outputs',
                  'Custom salon tone',
                  'Adjustable reply length',
                  'Full review history',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-[#eae4dc]"
                  >
                    <Check className="h-4 w-4 text-[#d9b7b8]" />
                    {item}
                  </div>
                ))}
              </div>

              <button
                onClick={onGetStarted}
                className="mt-9 w-full rounded-full bg-[#f5f1ea] px-5 py-3.5 text-sm font-semibold text-[#11110f] transition-colors hover:bg-white"
              >
                Try Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / OBJECTION */}
      <section className="mx-auto max-w-4xl px-6 py-24 sm:px-8">
        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#672a35]">
            One last thing
          </div>

          <h2 className="mt-5 font-display text-4xl tracking-[-0.025em] sm:text-5xl">
            You already have the reviews.
            <br />
            Now respond like it matters.
          </h2>

          <button
            onClick={onGetStarted}
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#11110f] px-7 py-4 text-sm font-semibold text-[#f5f1ea] transition-all hover:-translate-y-0.5 hover:bg-[#672a35]"
          >
            Try SalonReview Rescue free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#ddd7cf] bg-[#f0ebe4]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-xs text-[#77716a] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm text-[#11110f]">
              SalonReview Rescue
            </span>
            <span>· Reputation workflow for independent salons</span>
          </div>

          <div className="flex items-center gap-5">
            <span>Simple. Private. Practical.</span>
            <button
              onClick={() => onOpenAuth('signin')}
              className="text-[#11110f] hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface OutputCardProps {
  title: string;
  icon: React.ReactNode;
  text: string;
  copied: boolean;
  onCopy: () => void;
  dark?: boolean;
}

const OutputCard: React.FC<OutputCardProps> = ({
  title,
  icon,
  text,
  copied,
  onCopy,
  dark = false,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        dark
          ? 'border-[#27231f] bg-[#11110f] text-[#f5f1ea]'
          : 'border-[#ded8d0] bg-[#f7f3ed]'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div
          className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${
            dark ? 'text-[#d9b7b8]' : 'text-[#672a35]'
          }`}
        >
          {icon}
          {title}
        </div>

        <button
          onClick={onCopy}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition-colors ${
            dark
              ? 'border-white/15 text-[#eae4dc] hover:bg-white/5'
              : 'border-[#d4ccc3] text-[#514b45] hover:bg-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      <p
        className={`mt-4 text-sm leading-6 ${
          dark ? 'text-[#ddd6ce]' : 'text-[#4c4742]'
        }`}
      >
        {text}
      </p>
    </div>
  );
};
