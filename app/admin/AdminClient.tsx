"use client";

import { useState } from "react";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

export function AdminClient({ initialEmail, configured }: { initialEmail: string | null; configured: boolean }) {
  const [email, setEmail] = useState<string | null>(initialEmail);

  if (email) return <AdminDashboard email={email} onLogout={() => setEmail(null)} />;
  return <AdminLogin configured={configured} onSuccess={setEmail} />;
}
