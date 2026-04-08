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
      className="whitespace-nowrap rounded-[10px] border border-[#d0d5dd] bg-white px-3 py-2 text-[12px] font-semibold text-[#344054] shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-[#98a2b3] sm:px-3 sm:py-2 sm:text-[13px] disabled:cursor-not-allowed disabled:opacity-70"
      dir="rtl"
    >
      {isSubmitting ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
    </button>
  );
}
