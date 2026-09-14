import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GetBrianApp Privacy Policy | GetBrian",
  description:
    "How GetBrianApp collects, uses, and protects data from your TikTok account when you connect it to GetBrianApp.",
  alternates: { canonical: "/legal/getbrianapp/privacy" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "14 September 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="text-sm font-medium text-brand-navy-bright hover:underline"
      >
        &larr; Back to GetBrian
      </Link>

      <h1 className="mt-6 font-heading text-3xl font-semibold text-fg sm:text-4xl">
        GetBrianApp Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-fg-subtle">
        Effective {EFFECTIVE_DATE}
      </p>

      <div className="prose-legal mt-10 space-y-8 text-fg-muted [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-relaxed [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-brand-navy-bright [&_a]:underline">
        <p>
          GetBrianApp (&ldquo;the App&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is
          operated by Clifton Flack, trading as GetBrian (&ldquo;GetBrian&rdquo;).
          This policy explains what data the App collects when you connect
          your TikTok account, why, and how you can control or delete it. It
          applies only to GetBrianApp and its use of the TikTok API Platform
          &mdash; not to TikTok itself, which has its own privacy policy. See
          also our{" "}
          <Link href="/legal/getbrianapp/terms">Terms of Service</Link>.
        </p>

        <section>
          <h2>1. Data we collect from TikTok</h2>
          <p>
            When you authorise GetBrianApp to connect to your TikTok account
            (via TikTok Login Kit), TikTok shares the following with us,
            scoped to only what each feature needs:
          </p>
          <ul>
            <li>
              <strong>Basic profile</strong> &mdash; your TikTok open ID, union
              ID, display name, username, and avatar image URL.
            </li>
            <li>
              <strong>Video/content data</strong> (Display API) &mdash; metadata
              about videos on your TikTok account that you choose to make
              available to the App: video ID, caption, cover image, duration,
              view/like/comment counts, and privacy status.
            </li>
            <li>
              <strong>Published content</strong> (Content Posting API) &mdash;
              the video or photo files, captions, and publish settings you
              submit through the App to be posted to your TikTok account, and
              the resulting post status TikTok returns to us.
            </li>
            <li>
              <strong>OAuth tokens</strong> &mdash; the access and refresh
              tokens TikTok issues so the App can act on your behalf until you
              revoke access.
            </li>
          </ul>
          <p>
            We do not receive your TikTok password, and we do not access any
            TikTok data beyond what you explicitly authorise through the
            TikTok consent screen.
          </p>
        </section>

        <section>
          <h2>2. How we use this data</h2>
          <ul>
            <li>To authenticate you and maintain your session in the App.</li>
            <li>
              To display your TikTok profile and video information back to
              you inside the App.
            </li>
            <li>
              To publish content to your TikTok account at your direction.
            </li>
            <li>
              To diagnose faults and keep the App&rsquo;s TikTok integration
              working.
            </li>
          </ul>
          <p>
            We do not sell this data, use it for advertising, or share it
            with third parties, except infrastructure providers (hosting,
            storage) strictly needed to run the App, each bound to protect it
            under a data processing agreement.
          </p>
        </section>

        <section>
          <h2>3. Storage, security and retention</h2>
          <p>
            Data is stored on servers operated by our hosting provider and
            encrypted in transit. OAuth tokens and cached profile/content data
            are kept only for as long as your account is connected, plus a
            short grace period for support purposes, and are deleted on
            disconnection or account deletion (see Section 5). Uploaded video
            or photo files are retained only until publish to TikTok
            completes, or until you delete them from the App.
          </p>
        </section>

        <section>
          <h2>4. Revoking access</h2>
          <p>
            You can disconnect GetBrianApp from your TikTok account at any
            time, either inside the App&rsquo;s settings or directly from
            TikTok: TikTok app &rarr; Profile &rarr; Settings and privacy
            &rarr; Security &rarr; Manage app permissions. Revoking access
            immediately invalidates our tokens; TikTok stops sharing new data
            with us from that point.
          </p>
        </section>

        <section>
          <h2>5. Data deletion</h2>
          <p>
            To request deletion of all data GetBrianApp holds about you,
            email{" "}
            <a href="mailto:hello@getbrian.xyz">hello@getbrian.xyz</a> with
            the subject line &ldquo;GetBrianApp data deletion&rdquo; from the
            email address linked to your account. We will confirm deletion
            within 30 days. Disconnecting the App in TikTok&rsquo;s own
            settings stops future data sharing but does not itself erase data
            we already hold &mdash; use the email request for that.
          </p>
        </section>

        <section>
          <h2>6. Children</h2>
          <p>
            GetBrianApp is not directed at, and is not knowingly used by,
            anyone under the minimum age TikTok itself requires for an
            account in their country. If we learn a user is under that age,
            we will delete their data.
          </p>
        </section>

        <section>
          <h2>7. Your rights</h2>
          <p>
            Depending on where you live, you may have rights to access,
            correct, port, or delete your data, and to object to or restrict
            our processing of it. Contact{" "}
            <a href="mailto:hello@getbrian.xyz">hello@getbrian.xyz</a> to
            exercise any of these.
          </p>
        </section>

        <section>
          <h2>8. Changes to this policy</h2>
          <p>
            We may update this policy as the App&rsquo;s features change.
            Material changes will update the effective date above; continued
            use of the App after a change means you accept the revised
            policy.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            Clifton Flack, trading as GetBrian &mdash;{" "}
            <a href="mailto:hello@getbrian.xyz">hello@getbrian.xyz</a>
          </p>
        </section>
      </div>
    </main>
  );
}
