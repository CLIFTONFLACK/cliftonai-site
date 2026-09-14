import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TikTok connected | GetBrian",
  robots: { index: false, follow: false },
};

/**
 * TikTok's OAuth redirect target. Per TikTok's own Login Kit docs, this page
 * doesn't have to do anything — the authorization `code` is in the URL's
 * query string, which is all the follow-up token exchange needs. Same
 * "doesn't have to render" pattern as merlow.space/tiktok-callback.
 */
export default async function TikTokCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const { code, error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      {error ? (
        <>
          <h1 className="font-heading text-2xl font-semibold text-fg">
            TikTok authorization failed
          </h1>
          <p className="mt-3 text-fg-muted">
            TikTok reported: <code className="text-fg">{error}</code>. You can
            close this tab and try connecting again.
          </p>
        </>
      ) : code ? (
        <>
          <h1 className="font-heading text-2xl font-semibold text-fg">
            TikTok connected
          </h1>
          <p className="mt-3 text-fg-muted">
            Authorization received. You can close this tab now.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-heading text-2xl font-semibold text-fg">
            GetBrianApp &ndash; TikTok callback
          </h1>
          <p className="mt-3 text-fg-muted">
            This page is TikTok&rsquo;s OAuth redirect target for
            GetBrianApp. It has nothing to show on its own &mdash; you
            shouldn&rsquo;t be here unless you were sent by TikTok during
            sign-in.
          </p>
        </>
      )}
    </main>
  );
}
