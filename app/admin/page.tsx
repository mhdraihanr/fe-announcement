"use client";

import { initialOfficers } from "@/app/officer/data";
import AdminPanel from "@/components/AdminPanel";

export default function AdminPage() {
  return (
    <div className="p-6">
      <AdminPanel initialOfficers={initialOfficers} />
    </div>
  );
}