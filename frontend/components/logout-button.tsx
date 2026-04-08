"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={isSubmitting}
      className="rounded-[8px] border border-[#d0d5dd] px-3 py-2 text-[13px] font-semibold text-[#344054] transition-colors hover:border-[#98a2b3] disabled:cursor-not-allowed disabled:opacity-70"
      dir="rtl"
    >
      {isSubmitting ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
    </button>
  );
}
