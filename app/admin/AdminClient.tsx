"use client";

import { useState } from "react";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard, type AdminView } from "./AdminDashboard";

export function AdminClient({
  initialEmail,
  configured,
  sheetUrl,
  initialView,
}: {
  initialEmail: string | null;
  configured: boolean;
  sheetUrl: string;
  initialView: AdminView;
}) {
  const [email, setEmail] = useState<string | null>(initialEmail);

  if (email) {
    return <AdminDashboard email={email} sheetUrl={sheetUrl} initialView={initialView} onLogout={() => setEmail(null)} />;
  }
  return <AdminLogin configured={configured} onSuccess={setEmail} />;
}
