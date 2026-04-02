"use client";

import SubmitDataForm from "@/components/SubmitDataForm";

export default function ContributePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-10">
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Community Submissions
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Help make Intersect more transparent
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/50">
          If you have documents, budget data, meeting recordings, salary information,
          or any other evidence — submit it here. We verify everything before publishing.
        </p>
      </section>

      <section className="mt-10">
        <SubmitDataForm />
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-semibold text-white">What we are looking for</h3>
        <ul className="mt-3 space-y-2 text-sm text-white/50">
          <li>Salary or compensation data for any Intersect role</li>
          <li>Board meeting minutes or agendas</li>
          <li>Committee meeting recordings (especially GMC, MCC, CPC, CCC)</li>
          <li>Detailed cost breakdowns within large proposals (especially IOG's omnibus proposals)</li>
          <li>Names and roles of the ~19 unnamed Intersect staff members</li>
          <li>Any official Intersect documents not already in our sources</li>
        </ul>
      </section>
    </main>
  );
}
