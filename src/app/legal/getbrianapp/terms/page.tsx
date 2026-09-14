import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GetBrianApp Terms of Service | GetBrian",
  description:
    "The terms governing your use of GetBrianApp and its connection to your TikTok account.",
  alternates: { canonical: "/legal/getbrianapp/terms" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "14 September 2026";

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="text-sm font-medium text-brand-navy-bright hover:underline"
      >
        &larr; Back to GetBrian
      </Link>

      <h1 className="mt-6 font-heading text-3xl font-semibold text-fg sm:text-4xl">
        GetBrianApp Terms of Service
      </h1>
      <p className="mt-2 text-sm text-fg-subtle">
        Effective {EFFECTIVE_DATE}
      </p>

      <div className="prose-legal mt-10 space-y-8 text-fg-muted [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-relaxed [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-brand-navy-bright [&_a]:underline">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
          GetBrianApp (&ldquo;the App&rdquo;), operated by Clifton Flack,
          trading as GetBrian (&ldquo;GetBrian&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;). By creating an account, connecting your TikTok
          account, or otherwise using the App, you agree to these Terms and
          to our{" "}
          <Link href="/legal/getbrianapp/privacy">Privacy Policy</Link>.
        </p>

        <section>
          <h2>1. Eligibility</h2>
          <p>
            You must be old enough to hold a TikTok account in your country
            and have the legal capacity to agree to these Terms. You must
            also comply with TikTok&rsquo;s own Terms of Service and
            Community Guidelines whenever the App acts on your TikTok account.
          </p>
        </section>

        <section>
          <h2>2. What the App does</h2>
          <p>
            GetBrianApp connects to your TikTok account, with your
            authorisation, to:
          </p>
          <ul>
            <li>Read your public TikTok profile and video information.</li>
            <li>
              Publish video or photo content to your TikTok account at your
              direction.
            </li>
          </ul>
          <p>
            The App only performs actions on TikTok that you initiate or
            explicitly enable. We are not responsible for TikTok&rsquo;s
            platform, availability, or policies, which are outside our
            control.
          </p>
        </section>

        <section>
          <h2>3. Your TikTok connection</h2>
          <p>
            Connecting your TikTok account is done through TikTok&rsquo;s own
            OAuth login &mdash; we never see or store your TikTok password.
            You can disconnect the App at any time from within the App or
            from TikTok&rsquo;s app permission settings. See our{" "}
            <Link href="/legal/getbrianapp/privacy">Privacy Policy</Link> for
            what happens to your data when you disconnect.
          </p>
        </section>

        <section>
          <h2>4. Your content</h2>
          <p>
            You retain ownership of everything you upload or publish through
            the App. By submitting content for publishing, you confirm you
            own it or hold the rights necessary to post it, and that it
            complies with TikTok&rsquo;s Community Guidelines and applicable
            law. You are solely responsible for the content you publish
            through the App. We may remove content from the App, or suspend
            your access, if we reasonably believe it violates these Terms,
            TikTok&rsquo;s policies, or the law.
          </p>
        </section>

        <section>
          <h2>5. Acceptable use</h2>
          <p>You agree not to use the App to:</p>
          <ul>
            <li>
              Post spam, unlawful, infringing, or abusive content to TikTok.
            </li>
            <li>
              Circumvent TikTok&rsquo;s rate limits, API terms, or platform
              policies.
            </li>
            <li>
              Access or attempt to access another user&rsquo;s TikTok
              connection without authorisation.
            </li>
            <li>
              Reverse-engineer, resell, or use the App to build a competing
              product.
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Service availability</h2>
          <p>
            The App depends on TikTok&rsquo;s API platform. Features may
            change, be rate-limited, or stop working if TikTok changes or
            restricts its APIs, and we are not liable for any resulting
            disruption. We may modify, suspend, or discontinue any part of
            the App at any time.
          </p>
        </section>

        <section>
          <h2>7. Termination</h2>
          <p>
            You may stop using the App and disconnect your TikTok account at
            any time. We may suspend or terminate your access if you breach
            these Terms, TikTok&rsquo;s policies, or applicable law. On
            termination, Section 5 of our{" "}
            <Link href="/legal/getbrianapp/privacy">Privacy Policy</Link>{" "}
            governs deletion of your data.
          </p>
        </section>

        <section>
          <h2>8. Disclaimer and limitation of liability</h2>
          <p>
            The App is provided &ldquo;as is&rdquo; without warranties of any
            kind. To the fullest extent permitted by law, GetBrian is not
            liable for indirect, incidental, or consequential damages arising
            from your use of the App or its interaction with TikTok,
            including lost content, lost followers, or account action taken
            by TikTok itself.
          </p>
        </section>

        <section>
          <h2>9. Changes to these Terms</h2>
          <p>
            We may update these Terms as the App changes. Material changes
            will update the effective date above; continued use after a
            change means you accept the revised Terms.
          </p>
        </section>

        <section>
          <h2>10. Governing law</h2>
          <p>
            These Terms are governed by the laws of England and Wales,
            without regard to conflict-of-law principles.
          </p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>
            Clifton Flack, trading as GetBrian &mdash;{" "}
            <a href="mailto:hello@getbrian.xyz">hello@getbrian.xyz</a>
          </p>
        </section>
      </div>
    </main>
  );
}
