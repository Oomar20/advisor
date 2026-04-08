"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CalendarPicker } from "@/components/calendar-picker";
import {
  TimeSlotsPicker,
  type TimeSlotCell,
} from "@/components/time-slots-picker";

const slotLayout = [
  ["11:00", "10:00", "09:00"],
  ["14:00", "13:00", "12:00"],
  [null, "16:00", "15:00"],
] as const;

type AvailabilityResponse = {
  date: string;
  timezone: string;
  sessionDurationMinutes: number;
  availableSlots: string[];
};

type ActionResponse = {
  message?: string;
  code?: string;
};

type BookingWidgetProps = {
  calendarTitle: string;
  calendarDescription: string;
  slotsTitle: string;
  slotsDescription: string;
  buttonLabel: string;
};

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getBrowserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function formatSlotLabel(slot: string) {
  const [hourText, minute] = slot.split(":");
  const hour = Number(hourText);
  const suffix = hour < 12 ? (hour === 9 ? "am" : "AM") : "PM";
  const displayHour = hour > 12 ? hour - 12 : hour;

  return `${`${displayHour}`.padStart(2, "0")}:${minute} ${suffix}`;
}

function buildSlotGrid(availableSlots: string[]) {
  const availableSet = new Set(availableSlots);

  return slotLayout.map((row) =>
    row.map((slot) => {
      if (!slot) {
        return null;
      }

      return {
        value: slot,
        label: formatSlotLabel(slot),
        available: availableSet.has(slot),
      } satisfies TimeSlotCell;
    }),
  );
}

export function BookingWidget({
  calendarTitle,
  calendarDescription,
  slotsTitle,
  slotsDescription,
  buttonLabel,
}: BookingWidgetProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const slotGrid = useMemo(
    () => buildSlotGrid(availableSlots),
    [availableSlots],
  );

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  useEffect(() => {
    let isCancelled = false;

    async function loadAvailabilityForSelectedDate() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const availability = await loadAvailability(selectedDate);

        if (!isCancelled) {
          setAvailableSlots(availability.availableSlots);
        }
      } catch (error) {
        if (!isCancelled) {
          setAvailableSlots([]);
          setLoadError(
            error instanceof Error
              ? error.message
              : "تعذر تحميل الأوقات المتاحة.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadAvailabilityForSelectedDate();

    return () => {
      isCancelled = true;
    };
  }, [selectedDate]);

  async function loadAvailability(dateValue: Date) {
    const date = formatDateForApi(dateValue);
    const timezone = getBrowserTimeZone();
    const response = await fetch(
      `/api/bookings/available?date=${encodeURIComponent(date)}&timezone=${encodeURIComponent(timezone)}`,
      {
        cache: "no-store",
      },
    );
    const payload = (await response.json()) as AvailabilityResponse &
      ActionResponse;

    if (!response.ok) {
      throw new Error(payload.message ?? "تعذر تحديث الأوقات المتاحة.");
    }

    return payload;
  }

  async function refreshAvailability() {
    const payload = await loadAvailability(selectedDate);
    setAvailableSlots(payload.availableSlots);
    return payload;
  }

  async function handleBooking(slot: string) {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: formatDateForApi(selectedDate),
        timeSlot: slot,
        timezone: getBrowserTimeZone(),
      }),
    });

    const payload = (await response.json()) as ActionResponse;

    if (!response.ok) {
      if (payload.code === "auth_required") {
        router.push("/login");
        router.refresh();
        throw new Error("انتهت جلسة المستخدم. سجل الدخول مرة أخرى للمتابعة.");
      }

      if (
        payload.code === "slot_taken" ||
        payload.code === "slot_expired" ||
        payload.code === "slot_unavailable"
      ) {
        try {
          await refreshAvailability();
        } catch {
          setLoadError("تعذر تحديث الأوقات المتاحة بعد محاولة الحجز.");
        }
      }

      throw new Error(
        payload.message ?? "تعذر إتمام الحجز. يرجى المحاولة مرة أخرى.",
      );
    }

    setSelectedSlot(null);
    await refreshAvailability();

    return {
      message: "تم تأكيد الحجز بنجاح.",
    };
  }

  return (
    <div className="space-y-5">
      <CalendarPicker
        title={calendarTitle}
        description={calendarDescription}
        onDateChange={setSelectedDate}
      />

      <TimeSlotsPicker
        title={slotsTitle}
        description={slotsDescription}
        slots={slotGrid}
        selectedSlot={selectedSlot}
        buttonLabel={buttonLabel}
        isLoading={isLoading}
        errorMessage={loadError}
        onSlotChange={setSelectedSlot}
        onBook={handleBooking}
      />
    </div>
  );
}
