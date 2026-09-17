import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GetBrian Healthy",
  other: {
    "impact-site-verification": "76ada0e2-8897-4f30-b9ef-80aebec89d38",
  },
};

export default function HealthyPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold">OK</h1>
        <p className="text-gray-600 mt-2">GetBrian is healthy</p>
      </div>
    </main>
  );
}
