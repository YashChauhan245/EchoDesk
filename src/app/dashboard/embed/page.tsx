// ===========================================
// Embed Code Page
// ===========================================
// Shows the generated embed script tag with a copy button.
// Also explains how to add it to a website.
// ===========================================

import { getSession } from "@/lib/session";
import EmbedCodeClient from "./EmbedCodeClient";

export default async function EmbedPage() {
  const session = await getSession();
  if (!session) return null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <EmbedCodeClient
      organizationId={session.organizationId}
      appUrl={appUrl}
    />
  );
}
