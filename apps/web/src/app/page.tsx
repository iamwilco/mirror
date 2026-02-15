import TransparencyMeter from "@/components/TransparencyMeter";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[radial-gradient(circle_at_top,_#5eead4,_#0f766e)]" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Intersect Mirror
              </p>
              <p className="text-lg font-semibold text-white">Transparency Console</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a className="transition hover:text-white" href="#dashboard">
              Dashboard
            </a>
            <a className="transition hover:text-white" href="#budget">
              Budget
            </a>
            <a className="transition hover:text-white" href="#network">
              Network
            </a>
            <a className="transition hover:text-white" href="#about">
              About
            </a>
          </nav>
          <button className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:border-white/50">
            Contribute Data
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-14">
        <section className="grid gap-8" id="dashboard">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                Transparency Meter
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                Measure the truth. Map the influence. Track every ADA.
              </h1>
              <p className="max-w-2xl text-base text-white/70 md:text-lg">
                A radical transparency dashboard for Intersect MBO. We surface what
                is verified, expose what is missing, and keep the community informed.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 px-6 py-5 text-sm text-white/70">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Data Points</p>
              <p className="text-3xl font-semibold text-white">87 / 142</p>
              <p className="text-xs text-white/50">Last verified 2 days ago</p>
            </div>
          </div>
          <TransparencyMeter />
        </section>

        <section className="mt-16 grid gap-6" id="budget">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              2025 Budget Overview
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              ₳263.6M Treasury Flow
            </h2>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <div className="h-72 rounded-3xl border border-dashed border-white/20 bg-black/30" />
          </div>
        </section>

        <section className="mt-16 grid gap-6" id="network">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Network</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Influence & Overlap
            </h2>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <div className="h-72 rounded-3xl border border-dashed border-white/20 bg-black/30" />
          </div>
        </section>

        <section className="mt-16 grid gap-6" id="about">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Methodology</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Neutral. Verifiable. Public.</h2>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-sm text-white/70">
            This is a placeholder section for the About page. We document sources,
            verification criteria, and how the transparency score is calculated.
          </div>
        </section>
      </main>
    </div>
  );
}
