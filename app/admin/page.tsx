import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getSessionEmail, SESSION_COOKIE, isAdminConfigured } from "../../lib/admin/auth";
import { AdminClient } from "./AdminClient";

// Never indexed, always server-evaluated (reads the session cookie).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function AdminPage() {
  const email = getSessionEmail((await cookies()).get(SESSION_COOKIE)?.value);
  return <AdminClient initialEmail={email} configured={isAdminConfigured()} />;
}
