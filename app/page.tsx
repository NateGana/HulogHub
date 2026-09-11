import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Users2,
  Repeat,
  ListOrdered,
  LineChart,
  Sparkles,
  Landmark,
  Lock,
  Eye,
} from "lucide-react";

const STEPS = [
  {
    icon: Users2,
    title: "1. Create a group",
    desc: "Start your savings circle and set your contribution schedule.",
  },
  {
    icon: Repeat,
    title: "2. Invite members",
    desc: "Bring your trusted friends, family, or coworkers together.",
  },
  {
    icon: Landmark,
    title: "3. Contribute regularly",
    desc: "Everyone contributes the agreed amount on schedule.",
  },
  {
    icon: ListOrdered,
    title: "4. Follow the payout order",
    desc: "Members receive their scheduled group payout.",
  },
  {
    icon: LineChart,
    title: "5. Track everything",
    desc: "View contributions, payouts, and transaction records in one place.",
  },
];

const FAQS = [
  {
    q: "Is HulogHub a bank or investment platform?",
    a: "No. HulogHub is a group savings coordination tool for traditional Paluwagan circles. It does not hold deposits as a bank would, and it does not offer investment products or guaranteed returns.",
  },
  {
    q: "What does 'blockchain verification' mean here?",
    a: "Supported transactions can be associated with a record on the Stellar Network, giving your group a transparent, shared reference for who contributed and when. This build runs in Demo Mode with simulated records.",
  },
  {
    q: "Do I need a crypto wallet to use HulogHub?",
    a: "No. You can use a HulogHub Wallet for demo contributions. Connecting a Stellar wallet is optional, and HulogHub never asks for a private key or seed phrase.",
  },
  {
    q: "Can I use this with my existing paluwagan group?",
    a: "Yes — HulogHub is designed to digitize the exact structure most Filipino paluwagan groups already use: fixed contributions, a set order, and a shared ledger everyone can see.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700 font-display text-sm font-bold text-white">
              H
            </div>
            <span className="font-display text-[17px] font-bold tracking-tight">HulogHub</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#how-it-works" className="hover:text-foreground">How it works</a>
            <a href="#transparency" className="hover:text-foreground">Transparency</a>
            <a href="#stellar" className="hover:text-foreground">Why Stellar</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
              Explore Demo
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary-700 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-800"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary-50/60 to-background dark:from-primary-950/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
              <Sparkles className="h-3.5 w-3.5" /> Built on the Stellar Network · Demo Mode
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
              Save together.
              <br />
              <span className="text-primary-700 dark:text-primary-400">Grow together.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              A smarter and more transparent way to manage your Paluwagan — group
              savings, clear schedules, and a shared record everyone can trust.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-700 px-6 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-800 sm:w-auto"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border px-6 text-[15px] font-semibold hover:bg-muted sm:w-auto"
              >
                Explore Demo
              </Link>
            </div>
          </div>

          {/* Product preview mock */}
          <div className="relative mx-auto mt-16 max-w-4xl rounded-2xl border border-border bg-card p-3 shadow-popover sm:p-4">
            <div className="rounded-xl border border-border bg-muted/40 p-5 sm:p-8">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                  { label: "Total Saved", value: "₱18,500" },
                  { label: "Active Groups", value: "3" },
                  { label: "Upcoming", value: "₱1,500" },
                  { label: "Next Payout", value: "₱12,000" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-left shadow-card">
                    <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
                    <p className="mt-1.5 font-display text-xl font-bold tabular">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-border bg-card p-4 text-left shadow-card sm:p-5">
                <p className="mb-3 text-xs font-semibold text-muted-foreground">Barkada Savings Circle</p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary-600 to-primary-400" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Cycle 5 of 8 · 68% complete</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight">How Paluwagan works on HulogHub</h2>
          <p className="mt-3 text-muted-foreground">Five simple steps to digitize the savings circle you already know.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section id="transparency" className="border-y border-border/60 bg-muted/30 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
              <Eye className="h-3.5 w-3.5" /> Transparency
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">
              Every member sees the same ledger.
            </h2>
            <p className="mt-3 text-muted-foreground">
              No more chasing screenshots or relying on one person's notebook. HulogHub
              keeps contributions, payouts, and status visible to your whole group —
              with an optional Stellar-backed record for extra confidence.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "See who has paid and who hasn't, in real time",
                "Payout order and schedule visible to everyone",
                "Full transaction history, exportable anytime",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="text-xs font-semibold text-muted-foreground">Blockchain Transparency</p>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["Network", "Stellar (Demo)"],
                ["Verification", "Verified"],
                ["Group Ledger", "Available"],
                ["Last Sync", "2 minutes ago"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-border/70 pb-3 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STELLAR */}
      <section id="stellar" className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight">Why Stellar?</h2>
        <p className="mt-4 text-muted-foreground">
          HulogHub uses the Stellar Network as the foundation for transparent digital
          transaction records. Each supported transaction can be associated with a
          Stellar transaction record, allowing members to verify activity through the
          network — without needing to understand blockchain technology themselves.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          This build runs in Demo Mode: transactions shown are simulated and are not
          live Stellar network activity.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/60 bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-10 space-y-4">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-card p-5 shadow-card">
                <summary className="cursor-pointer list-none font-display text-sm font-semibold">
                  {f.q}
                </summary>
                <p className="mt-2.5 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-700 text-[11px] font-bold text-white">H</div>
            <span className="text-sm font-semibold">HulogHub</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HulogHub. Demo prototype — not a licensed financial institution.
          </p>
        </div>
      </footer>
    </div>
  );
}
