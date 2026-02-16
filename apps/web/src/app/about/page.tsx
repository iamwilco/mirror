export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-14">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">
          Methodology
        </p>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">
          Why Intersect Mirror exists
        </h1>
        <p className="max-w-3xl text-base text-white/70 md:text-lg">
          Intersect Mirror is a public, independent transparency index for Intersect
          MBO. We surface what is verified, explicitly mark what is missing, and
          provide sources for every claim.
        </p>
      </header>

      <section className="mt-12 grid gap-8">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Transparency principles</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              <span className="text-white">Verification first:</span> Official docs or
              on-chain proofs take priority.
            </li>
            <li>
              <span className="text-white">Neutral tone:</span> No speculation. We show
              what is known and what is not.
            </li>
            <li>
              <span className="text-white">Community pressure:</span> Missing data is
              visible to incentivize disclosure.
            </li>
          </ul>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Primary sources</h2>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <p>• Intersect Budget Proposal (₳263.6M)</p>
            <p>• On-chain treasury withdrawals (gov.tools, CardanoScan)</p>
            <p>• Intersect GitBook and quarterly reports</p>
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Transparency gaps</h2>
          <p className="mt-4 text-sm text-white/70">
            Compensation, procurement, and committee voting records are still
            incomplete. Those gaps are reflected in the Transparency Score and
            table.
          </p>
        </div>
      </section>
    </div>
  );
}
