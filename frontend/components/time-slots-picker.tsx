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
  isLoading?: boolean;
  errorMessage?: string | null;
  onSlotChange?: (slot: string | null) => void;
  onBook?: (slot: string) => Promise<void>;
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
      className={`h-10 rounded-[8px] border px-[13px] text-center text-[14px] font-semibold leading-5 transition-colors ${
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
  isLoading = false,
  errorMessage = null,
  onSlotChange,
  onBook,
}: TimeSlotsPickerProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSlot) {
      setIsConfirmOpen(false);
    }
  }, [selectedSlot]);

  const hasAnyAvailableSlots = slots.some((row) => row.some((slot) => slot?.available));

  function handleSelect(slot: TimeSlotCell) {
    if (!slot.available || isLoading) {
      return;
    }

    setSubmitError(null);
    onSlotChange?.(slot.value === selectedSlot ? null : slot.value);
  }

  function handleOpenConfirmation() {
    if (!selectedSlot || isLoading) {
      return;
    }

    setSubmitError(null);
    setIsConfirmOpen(true);
  }

  function handleCloseConfirmation() {
    if (isSubmitting) {
      return;
    }

    setSubmitError(null);
    setIsConfirmOpen(false);
  }

  async function handleConfirmBooking() {
    if (!selectedSlot || !onBook) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onBook(selectedSlot);
      setIsConfirmOpen(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "تعذر إتمام الحجز حالياً.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedSlotLabel =
    slots.flat().find((slot) => slot?.value === selectedSlot)?.label ?? selectedSlot;

  return (
    <article className="rounded-[12px] bg-[#f7f7f7] p-6">
      <div className="space-y-4 text-right" dir="rtl">
        <div>
          <h2 className="text-[18px] font-extrabold leading-normal text-[#242431]">{title}</h2>
          <p className="mt-1 text-[14px] font-medium leading-normal text-black">{description}</p>
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
                  <div key={`empty-${rowIndex}-${slotIndex}`} aria-hidden="true" />
                ),
              )}
            </div>
          ))}
        </div>

        {isLoading ? (
          <p className="text-[13px] font-medium text-[#667085]">جاري تحميل الأوقات المتاحة...</p>
        ) : null}

        {!isLoading && !hasAnyAvailableSlots ? (
          <p className="text-[13px] font-medium text-[#667085]">لا توجد أوقات متاحة لهذا اليوم.</p>
        ) : null}

        {!isLoading && errorMessage ? (
          <p className="text-[13px] font-medium text-[#b42318]">{errorMessage}</p>
        ) : null}

        <div className="pt-[22px]">
          <button
            type="button"
            onClick={handleOpenConfirmation}
            className={`flex h-[49px] w-full items-center justify-center rounded-[8px] px-[14px] py-2 text-[14px] font-extrabold text-white transition-colors ${
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
          <div className="w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl" dir="rtl">
            <h3 className="text-right text-[22px] font-extrabold text-[#242431]">
              تأكيد الحجز
            </h3>
            <p className="mt-3 text-right text-[15px] leading-7 text-[#344054]">
              هل تريد تأكيد حجز الجلسة في الموعد التالي؟
            </p>
            <div className="mt-4 rounded-[12px] bg-[#f7f7f7] px-4 py-3 text-right">
              <p className="text-[13px] font-medium text-[#667085]">الوقت المختار</p>
              <p className="mt-1 text-[20px] font-extrabold text-[#242431]" dir="ltr">
                {selectedSlotLabel}
              </p>
            </div>

            {submitError ? (
              <p className="mt-4 text-right text-[13px] font-medium text-[#b42318]">{submitError}</p>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-start">
              <button
                type="button"
                onClick={handleCloseConfirmation}
                className="h-11 rounded-[10px] border border-[#d0d5dd] px-5 text-[14px] font-semibold text-[#344054]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmBooking()}
                className="h-11 rounded-[10px] bg-[#0a66d2] px-5 text-[14px] font-extrabold text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري التأكيد..." : "تأكيد الحجز"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
