"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

type SubmissionFormValues = {
  name: string;
  email: string;
  category: "governance" | "budget" | "contracts" | "people" | "other";
  summary: string;
  sources: string;
  wallet: string;
  consent: boolean;
};

export default function SubmitDataForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormValues>();

  const onSubmit = async (values: SubmissionFormValues) => {
    setSubmitted(false);
    await new Promise((resolve) => setTimeout(resolve, 400));
    // TODO: Wire to Supabase or backend intake table.
    console.log("Community submission", values);
    reset();
    setSubmitted(true);
  };

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="grid gap-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
          <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
            Community Intake
          </p>
          <h3 className="text-2xl font-semibold text-white">
            Submit a lead, document, or anomaly
          </h3>
          <p className="text-sm text-white/60">
            Share credible sources, contract details, or budget anomalies. We verify
            submissions before updating the public dashboard.
          </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/60">
            We never publish private information. If you can, include a link to a
            public document or gov.tools reference.
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Name</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white placeholder:text-white/40 focus:border-emerald-300 focus:outline-none"
                placeholder="Optional"
                {...register("name")}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Email</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white placeholder:text-white/40 focus:border-emerald-300 focus:outline-none"
                placeholder="you@email.com"
                type="email"
                {...register("email", {
                  required: "Email is required for follow-up",
                })}
              />
              {errors.email ? (
                <p className="text-xs text-rose-200">{errors.email.message}</p>
              ) : null}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Category</span>
              <select
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-emerald-300 focus:outline-none"
                {...register("category", { required: true })}
                defaultValue="governance"
              >
                <option value="governance">Governance / Policy</option>
                <option value="budget">Budget / Treasury</option>
                <option value="contracts">Contracts / Vendors</option>
                <option value="people">People / Appointments</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Wallet (optional)</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white placeholder:text-white/40 focus:border-emerald-300 focus:outline-none"
                placeholder="addr1..."
                {...register("wallet")}
              />
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="text-white/70">Summary</span>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-emerald-300 focus:outline-none"
              placeholder="What should we verify?"
              {...register("summary", { required: "Summary is required" })}
            />
            {errors.summary ? (
              <p className="text-xs text-rose-200">{errors.summary.message}</p>
            ) : null}
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-white/70">Source links</span>
            <textarea
              className="min-h-[90px] w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-emerald-300 focus:outline-none"
              placeholder="Paste URLs, docs, or forum threads"
              {...register("sources", { required: "Please add at least one source" })}
            />
            {errors.sources ? (
              <p className="text-xs text-rose-200">{errors.sources.message}</p>
            ) : null}
          </label>

          <label className="flex items-start gap-3 text-xs text-white/60">
            <input
              className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 text-emerald-300 focus:ring-emerald-200"
              type="checkbox"
              {...register("consent", { required: true })}
            />
            I confirm the information is accurate to the best of my knowledge and
            can be reviewed by the Intersect Mirror team.
          </label>
          {errors.consent ? (
            <p className="text-xs text-rose-200">Consent is required.</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full bg-emerald-300/90 px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-emerald-200"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit for review"}
            </button>
            {submitted ? (
              <p className="text-xs text-emerald-200">
                Submitted. We will follow up shortly.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
