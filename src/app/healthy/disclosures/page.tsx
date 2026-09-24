import type { Metadata } from "next";
import { healthyOpenGraph } from "../layout";
import { FdaDisclaimer, PageHeading, Prose } from "../components";
import { CONTACT_EMAIL, PROGRAM_NAME } from "../data";

const title = "Disclosures";
const description =
  `Affiliate disclosure, medical disclaimer and privacy note for ${PROGRAM_NAME}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/healthy/disclosures" },
  openGraph: { ...healthyOpenGraph, title, description, url: "/healthy/disclosures" },
};

const UPDATED = "September 24, 2026";

export default function DisclosuresPage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <PageHeading eyebrow="Disclosures" title="How this site earns money, and what it is not" />
        <p className="mt-4 text-base text-fg-subtle">Last updated {UPDATED}</p>

        <div className="mt-12">
          <Prose>
            <h2>Affiliate links</h2>
            <p>
              Some links to retailers and brands are affiliate links. If you click one and buy, the
              retailer may pay GetBrian a commission. You pay the same price. Every such link is
              labeled where it appears.
            </p>
            <p>
              Commissions do not decide which products are listed or how they are graded. A product
              that stops meeting the method is removed, whatever it earns. Brands do not pay to be
              included. If a brand ever sends us a free sample, the review will say so.
            </p>

            <h2>Not medical advice</h2>
            <p>
              Everything on these pages is general information for healthy adults. It is not
              medical advice, diagnosis or treatment, and it does not take your health, medication
              or history into account. Speak to your doctor or pharmacist before starting a
              supplement, and especially if you are pregnant or breastfeeding, have a medical
              condition, or take prescription medication.
            </p>
          </Prose>
          <div className="mt-6">
            <FdaDisclaimer />
          </div>
          <Prose>
            <h2>How reviews are made</h2>
            <p>
              Reviews are based on published research and product labels, gathered with the help of
              AI tools and checked by a person before publishing. No doctor or patient panel has
              evaluated these products yet. Prices and labels change; the retailer&apos;s own page
              is always the current source.
            </p>

            <h2>Names and trademarks</h2>
            <p>
              {PROGRAM_NAME} is an independent project of GetBrian. It is not affiliated with,
              endorsed by or connected to Human Longevity, Inc., L-Nutra, Qualia or any other
              company using similar names. Product and brand names belong to their owners.
            </p>

            <h2 id="privacy">Privacy</h2>
            <p>
              When you click a link to a retailer, we count the click against the product, without
              recording who you are. Retailers and affiliate networks set their own cookies once you
              reach their sites, under their own privacy policies.
            </p>
            <p>
              The only personal information these pages ask for is an email address, and only if you
              sign up to hear when a pick changes. It is used for nothing else: at most two emails a
              year, sent through our email provider, Resend, which stores the address for us. You are
              added only after you confirm from the email we send, every update has an unsubscribe
              link, and you can ask us to delete your address at any time by emailing{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>Contact</h2>
            <p>
              Questions or corrections: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Prose>
        </div>
      </div>
    </div>
  );
}
