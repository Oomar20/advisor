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

  function handleSelect(slot: string) {
    setSelectedSlot(slot);
    onSlotChange?.(slot);
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
            onClick={() => onBook?.(selectedSlot)}
            className="flex h-[49px] w-full items-center justify-center rounded-[8px] bg-[#0a66d2] px-[14px] py-2 text-[14px] font-extrabold text-white"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
