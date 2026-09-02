import "./clay.css";
import { CliftonFlackHeader } from "./nav";

export default function CliftonFlackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cf-scope flex min-h-screen flex-col">
      <CliftonFlackHeader />
      <div className="flex-1 pt-28 sm:pt-32">{children}</div>
      <footer className="border-t border-[var(--cf-line)] px-6 py-10">
        <div className="mx-auto max-w-6xl text-center text-xs text-[var(--cf-ink-subtle)]">
          CiiTECH and CiiTECH Labs screenshots are archived via the Wayback
          Machine; the ventures wound down before Provacan, which is still
          trading. Live properties: vancehealthhub.co.uk · provacan.co.uk ·{" "}
          <a href="/" className="cursor-pointer underline decoration-1 underline-offset-2">
            getbrian.xyz
          </a>
        </div>
      </footer>
    </div>
  );
}
