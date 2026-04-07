"use client";

import { useState } from "react";

type TimeSlotsPickerProps = {
  title: string;
  description: string;
  slots: Array<Array<string | null>>;
  initialSelectedSlot?: string | null;
  buttonLabel: string;
  onSlotChange?: (slot: string) => void;
  onBook?: (slot: string | null) => void;
};

function SlotButton({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`h-10 rounded-[8px] border px-[13px] text-center text-[14px] font-semibold leading-5 transition-colors ${
        isSelected
          ? "border-[#0a66d2] bg-[#0a66d2] text-white"
          : "border-[#969696] bg-white text-[#1c1c1c] hover:border-[#0a66d2] hover:text-[#0a66d2]"
      }`}
    >
      {label}
    </button>
  );
}

export function TimeSlotsPicker({
  title,
  description,
  slots,
  initialSelectedSlot = null,
  buttonLabel,
  onSlotChange,
  onBook,
}: TimeSlotsPickerProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(initialSelectedSlot);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function handleSelect(slot: string) {
    setSelectedSlot(slot);
    onSlotChange?.(slot);
  }

  function handleOpenConfirmation() {
    if (!selectedSlot) {
      return;
    }

    setIsConfirmOpen(true);
  }

  function handleConfirmBooking() {
    setIsConfirmOpen(false);
    onBook?.(selectedSlot);
  }

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
                    key={slot}
                    label={slot}
                    isSelected={slot === selectedSlot}
                    onClick={() => handleSelect(slot)}
                  />
                ) : (
                  <div key={`empty-${rowIndex}-${slotIndex}`} aria-hidden="true" />
                ),
              )}
            </div>
          ))}
        </div>

        <div className="pt-[22px]">
          <button
            type="button"
            onClick={handleOpenConfirmation}
            className={`flex h-[49px] w-full items-center justify-center rounded-[8px] px-[14px] py-2 text-[14px] font-extrabold text-white transition-colors ${
              selectedSlot
                ? "bg-[#0a66d2]"
                : "cursor-not-allowed bg-[#8eb7e9]"
            }`}
            disabled={!selectedSlot}
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
                {selectedSlot}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-start">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="h-11 rounded-[10px] border border-[#d0d5dd] px-5 text-[14px] font-semibold text-[#344054]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="h-11 rounded-[10px] bg-[#0a66d2] px-5 text-[14px] font-extrabold text-white"
              >
                تأكيد الحجز
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
