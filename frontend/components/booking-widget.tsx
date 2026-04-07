"use client";

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
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const slotGrid = useMemo(() => buildSlotGrid(availableSlots), [availableSlots]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  useEffect(() => {
    let isCancelled = false;

    async function loadAvailability() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const date = formatDateForApi(selectedDate);
        const timezone = getBrowserTimeZone();
        const response = await fetch(
          `/api/bookings/available?date=${encodeURIComponent(date)}&timezone=${encodeURIComponent(timezone)}`,
          {
            cache: "no-store",
          },
        );
        const payload = (await response.json()) as AvailabilityResponse | { message?: string };

        if (!response.ok) {
          throw new Error(
            "message" in payload && payload.message
              ? payload.message
              : "Failed to load availability.",
          );
        }

        if (!isCancelled) {
          const availabilityPayload = payload as AvailabilityResponse;
          setAvailableSlots(availabilityPayload.availableSlots);
        }
      } catch (error) {
        if (!isCancelled) {
          setAvailableSlots([]);
          setLoadError(
            error instanceof Error ? error.message : "Failed to load availability.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      isCancelled = true;
    };
  }, [selectedDate]);

  async function refreshAvailability() {
    const date = formatDateForApi(selectedDate);
    const timezone = getBrowserTimeZone();
    const response = await fetch(
      `/api/bookings/available?date=${encodeURIComponent(date)}&timezone=${encodeURIComponent(timezone)}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      throw new Error(payload.message ?? "Failed to refresh availability.");
    }

    const payload = (await response.json()) as AvailabilityResponse;
    setAvailableSlots(payload.availableSlots);
  }

  async function handleBooking(slot: string) {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "demo-user",
        date: formatDateForApi(selectedDate),
        timeSlot: slot,
        timezone: getBrowserTimeZone(),
      }),
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      throw new Error(payload.message ?? "Booking failed.");
    }

    setSelectedSlot(null);
    await refreshAvailability();
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
