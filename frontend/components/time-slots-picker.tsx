"use client";

import { useEffect, useState } from "react";

export type TimeSlotCell = {
  value: string;
  label: string;
  available: boolean;
};

type TimeSlotsPickerProps = {
  title: string;
  description: string;
  slots: Array<Array<TimeSlotCell | null>>;
  selectedSlot: string | null;
  buttonLabel: string;
  blockedMessage?: string | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  onSlotChange?: (slot: string | null) => void;
  onBook?: (slot: string) => Promise<{ message: string }>;
};

function SlotButton({
  slot,
  isSelected,
  isDisabled,
  onClick,
}: {
  slot: TimeSlotCell;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      disabled={isDisabled}
      className={`h-10 rounded-lg border px-3.25 text-center text-sm font-semibold leading-5 transition-colors ${
        isSelected
          ? "border-[#0a66d2] bg-[#0a66d2] text-white"
          : isDisabled
            ? "cursor-not-allowed border-[#d0d5dd] bg-[#fcfcfd] text-[#98a2b3]"
            : "border-[#969696] bg-white text-[#1c1c1c] hover:border-[#0a66d2] hover:text-[#0a66d2]"
      }`}
    >
      {slot.label}
    </button>
  );
}

export function TimeSlotsPicker({
  title,
  description,
  slots,
  selectedSlot,
  buttonLabel,
  blockedMessage = null,
  isLoading = false,
  errorMessage = null,
  onSlotChange,
  onBook,
}: TimeSlotsPickerProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState<{
    status: "success" | "error";
    message: string;
    slotLabel: string;
  } | null>(null);

  useEffect(() => {
    if (!selectedSlot) {
      setIsConfirmOpen(false);
    }
  }, [selectedSlot]);

  const hasAnyAvailableSlots = slots.some((row) =>
    row.some((slot) => slot?.available),
  );
  const selectedSlotLabel =
    slots.flat().find((slot) => slot?.value === selectedSlot)?.label ??
    selectedSlot ??
    "";

  function handleSelect(slot: TimeSlotCell) {
    if (!slot.available || isLoading) {
      return;
    }

    setResultModal(null);
    onSlotChange?.(slot.value === selectedSlot ? null : slot.value);
  }

  function handleOpenConfirmation() {
    if (!selectedSlot || isLoading) {
      return;
    }

    if (blockedMessage) {
      setResultModal({
        status: "error",
        message: blockedMessage,
        slotLabel: selectedSlotLabel,
      });
      return;
    }

    setResultModal(null);
    setIsConfirmOpen(true);
  }

  function handleCloseConfirmation() {
    if (isSubmitting) {
      return;
    }

    setIsConfirmOpen(false);
  }

  async function handleConfirmBooking() {
    if (!selectedSlot || !onBook) {
      return;
    }

    const bookedSlotLabel = selectedSlotLabel;

    try {
      setIsSubmitting(true);
      const result = await onBook(selectedSlot);
      setIsConfirmOpen(false);
      setResultModal({
        status: "success",
        message: result.message,
        slotLabel: bookedSlotLabel,
      });
    } catch (error) {
      setIsConfirmOpen(false);
      setResultModal({
        status: "error",
        message:
          error instanceof Error ? error.message : "تعذر إتمام الحجز حالياً.",
        slotLabel: bookedSlotLabel,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="rounded-xl bg-[#f7f7f7] p-6">
      <div className="space-y-4 text-right" dir="rtl">
        <div>
          <h2 className="text-[18px] font-extrabold leading-normal text-[#242431]">
            {title}
          </h2>
          <p className="mt-1 text-sm font-medium leading-normal text-black">
            {description}
          </p>
        </div>

        <div className="space-y-2" dir="ltr">
          {slots.map((row, rowIndex) => (
            <div key={`times-${rowIndex}`} className="grid grid-cols-3 gap-2">
              {row.map((slot, slotIndex) =>
                slot ? (
                  <SlotButton
                    key={slot.value}
                    slot={slot}
                    isSelected={slot.value === selectedSlot}
                    isDisabled={isLoading || !slot.available}
                    onClick={() => handleSelect(slot)}
                  />
                ) : (
                  <div
                    key={`empty-${rowIndex}-${slotIndex}`}
                    aria-hidden="true"
                  />
                ),
              )}
            </div>
          ))}
        </div>

        {isLoading ? (
          <p className="text-[13px] font-medium text-[#667085]">
            جاري تحميل الأوقات المتاحة...
          </p>
        ) : null}

        {!isLoading && !hasAnyAvailableSlots ? (
          <p className="text-[13px] font-medium text-[#667085]">
            لا توجد أوقات متاحة لهذا اليوم.
          </p>
        ) : null}

        {!isLoading && errorMessage ? (
          <p className="text-[13px] font-medium text-[#b42318]">
            {errorMessage}
          </p>
        ) : null}

        {!isLoading && blockedMessage ? (
          <p className="text-[13px] font-medium text-[#b42318]">
            {blockedMessage}
          </p>
        ) : null}

        <div className="pt-5.5">
          <button
            type="button"
            onClick={handleOpenConfirmation}
            className={`flex h-12.25 w-full items-center justify-center rounded-lg px-3.5 py-2 text-sm font-extrabold text-white transition-colors ${
              selectedSlot && !isLoading
                ? "bg-[#0a66d2]"
                : "cursor-not-allowed bg-[#8eb7e9]"
            }`}
            disabled={!selectedSlot || isLoading}
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      {isConfirmOpen && selectedSlot ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            dir="rtl"
          >
            <h3 className="text-right text-[22px] font-extrabold text-[#242431]">
              تأكيد الحجز
            </h3>
            <p className="mt-3 text-right text-[15px] leading-7 text-[#344054]">
              هل تريد تأكيد حجز الجلسة في الموعد التالي؟
            </p>
            <div className="mt-4 rounded-xl bg-[#f7f7f7] px-4 py-3 text-right">
              <p className="text-[13px] font-medium text-[#667085]">
                الوقت المختار
              </p>
              <p
                className="mt-1 text-[20px] font-extrabold text-[#242431]"
                dir="ltr"
              >
                {selectedSlotLabel}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-start">
              <button
                type="button"
                onClick={handleCloseConfirmation}
                className="h-11 rounded-[10px] border border-[#d0d5dd] px-5 text-sm font-semibold text-[#344054]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmBooking()}
                className="h-11 rounded-[10px] bg-[#0a66d2] px-5 text-sm font-extrabold text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري التأكيد..." : "تأكيد الحجز"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {resultModal ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/35 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            dir="rtl"
          >
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
                resultModal.status === "success"
                  ? "bg-[#e8f3ff] text-[#0a66d2]"
                  : "bg-[#fee4e2] text-[#d92d20]"
              }`}
            >
              {resultModal.status === "success" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  className="h-6 w-6"
                >
                  <path
                    d="m5 13 4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  className="h-6 w-6"
                >
                  <path d="M12 8v5" strokeLinecap="round" />
                  <path d="M12 16h.01" strokeLinecap="round" />
                  <path
                    d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <h3 className="mt-4 text-right text-[22px] font-extrabold text-[#242431]">
              {resultModal.status === "success"
                ? "تم الحجز بنجاح"
                : "تعذر إتمام الحجز"}
            </h3>

            <p className="mt-3 text-right text-[15px] leading-7 text-[#344054]">
              {resultModal.message}
            </p>

            <div className="mt-4 rounded-xl bg-[#f7f7f7] px-4 py-3 text-right">
              <p className="text-[13px] font-medium text-[#667085]">
                الوقت المختار
              </p>
              <p
                className="mt-1 text-[20px] font-extrabold text-[#242431]"
                dir="ltr"
              >
                {resultModal.slotLabel}
              </p>
            </div>

            <div className="mt-6 flex justify-start">
              <button
                type="button"
                onClick={() => setResultModal(null)}
                className={`h-11 rounded-[10px] px-5 text-sm font-extrabold text-white ${
                  resultModal.status === "success"
                    ? "bg-[#0a66d2]"
                    : "bg-[#d92d20]"
                }`}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
