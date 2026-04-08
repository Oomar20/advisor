"use client";

import { useState } from "react";

type CalendarPickerProps = {
  title: string;
  description: string;
  initialSelectedDate?: Date;
  highlightedDate?: Date;
  onDateChange?: (date: Date) => void;
};

type DayCell = {
  date: Date;
  inCurrentMonth: boolean;
  isPrevMonth: boolean;
  isNextMonth: boolean;
};

const weekdayLabels = [
  { full: "الاثنين", short: "الإث" },
  { full: "الثلاثاء", short: "الثلا" },
  { full: "الاربعاء", short: "الأرب" },
  { full: "الخميس", short: "الخمي" },
  { full: "الجمعة", short: "الجمع" },
  { full: "السبت", short: "السبت" },
  { full: "الأحد", short: "الأحد" },
];

const monthFormatter = new Intl.DateTimeFormat("ar", {
  month: "long",
  year: "numeric",
});

function getYearPageStart(year: number, pageSize = 12) {
  return Math.floor(year / pageSize) * pageSize;
}

function buildYearOptions(startYear: number, count = 12) {
  return Array.from({ length: count }, (_, index) => startYear + index);
}

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isBeforeDay(left: Date, right: Date) {
  return normalizeDate(left).getTime() < normalizeDate(right).getTime();
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getMonthLabel(date: Date) {
  return monthFormatter.format(date);
}

function getStartOfGrid(monthDate: Date) {
  const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const mondayBasedOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - mondayBasedOffset);
  return startDate;
}

function buildCalendarDays(monthDate: Date) {
  const startDate = getStartOfGrid(monthDate);
  const days: DayCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    days.push({
      date,
      inCurrentMonth: date.getMonth() === monthDate.getMonth(),
      isPrevMonth:
        date.getFullYear() < monthDate.getFullYear() ||
        (date.getFullYear() === monthDate.getFullYear() && date.getMonth() < monthDate.getMonth()),
      isNextMonth:
        date.getFullYear() > monthDate.getFullYear() ||
        (date.getFullYear() === monthDate.getFullYear() && date.getMonth() > monthDate.getMonth()),
    });
  }

  return days;
}

function DayButton({
  cell,
  isSelected,
  isHighlighted,
  isDisabled,
  onSelect,
}: {
  cell: DayCell;
  isSelected: boolean;
  isHighlighted: boolean;
  isDisabled: boolean;
  onSelect: (date: Date) => void;
}) {
  let textClassName = "text-[#344054]";
  if (cell.isPrevMonth) textClassName = "text-[#e8e8e8]";
  if (!cell.inCurrentMonth && cell.isNextMonth) textClassName = "text-[#667085]";
  if (cell.inCurrentMonth) textClassName = "font-extrabold text-[#344054]";
  if (isDisabled) textClassName = "text-[#d0d5dd]";

  let surfaceClassName = "rounded-[20px] bg-transparent";
  if (isHighlighted) surfaceClassName = "rounded-[8px] bg-white";
  if (isSelected) surfaceClassName = "rounded-[8px] bg-[#4395ff]";
  if (isDisabled) surfaceClassName = "rounded-[20px] bg-transparent";

  if (isSelected) {
    textClassName = "font-extrabold text-white";
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(cell.date)}
      disabled={isDisabled}
      className={`flex h-10 items-center justify-center text-sm leading-5 transition-colors ${surfaceClassName} ${textClassName} ${
        isDisabled ? "cursor-not-allowed" : ""
      }`}
      aria-pressed={isSelected}
    >
      {cell.date.getDate()}
    </button>
  );
}

export function CalendarPicker({
  title,
  description,
  initialSelectedDate = new Date(),
  highlightedDate = new Date(),
  onDateChange,
}: CalendarPickerProps) {
  const normalizedInitialDate = normalizeDate(initialSelectedDate);
  const normalizedHighlightedDate = normalizeDate(highlightedDate);
  const today = normalizeDate(new Date());
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(normalizedInitialDate.getFullYear(), normalizedInitialDate.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(normalizedInitialDate);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [yearPageStart, setYearPageStart] = useState(
    getYearPageStart(normalizedInitialDate.getFullYear()),
  );

  const calendarDays = buildCalendarDays(visibleMonth);
  const yearOptions = buildYearOptions(yearPageStart);
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const isPreviousMonthDisabled = visibleMonth <= currentMonthStart;

  function handleSelect(date: Date) {
    const normalizedDate = normalizeDate(date);

    if (isBeforeDay(normalizedDate, today)) {
      return;
    }

    setSelectedDate(normalizedDate);
    setVisibleMonth(new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), 1));
    onDateChange?.(normalizedDate);
  }

  function handleMonthChange(direction: -1 | 1) {
    setVisibleMonth((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
    setIsYearPickerOpen(false);
  }

  function handleYearSelect(year: number) {
    setVisibleMonth((currentMonth) => new Date(year, currentMonth.getMonth(), 1));
    setIsYearPickerOpen(false);
  }

  return (
    <article className="rounded-[12px] bg-[#f7f7f7] p-4 sm:p-6">
      <div className="space-y-3 text-right" dir="rtl">
        <div>
          <h2 className="text-[17px] font-extrabold leading-normal text-[#242431] sm:text-[18px]">
            {title}
          </h2>
          <p className="mt-1 text-[13px] font-medium leading-normal text-black sm:text-[14px]">
            {description}
          </p>
        </div>

        <div className="relative" dir="ltr">
          <div className="flex items-center justify-between py-1">
            <button
              type="button"
              aria-label="Previous month"
              className={`flex h-8 w-8 items-center justify-center rounded-[8px] sm:h-9 sm:w-9 ${
                isPreviousMonthDisabled
                  ? "cursor-not-allowed text-[#d0d5dd]"
                  : "text-[#667085]"
              }`}
              onClick={() => handleMonthChange(-1)}
              disabled={isPreviousMonthDisabled}
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={() => setIsYearPickerOpen((currentValue) => !currentValue)}
              className="rounded-[8px] px-3 py-1 text-center text-[15px] font-extrabold leading-5 text-[#344054] transition-colors hover:bg-white/70 sm:text-[16px]"
              dir="rtl"
              aria-haspopup="dialog"
              aria-expanded={isYearPickerOpen}
            >
              {getMonthLabel(visibleMonth)}
            </button>
            <button
              type="button"
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[#667085] sm:h-9 sm:w-9"
              onClick={() => handleMonthChange(1)}
            >
              &#8250;
            </button>
          </div>

          {isYearPickerOpen ? (
            <div className="absolute left-1/2 top-full z-10 mt-2 w-[220px] -translate-x-1/2 rounded-[12px] border border-[#e5e7eb] bg-white p-3 shadow-lg">
              <div className="mb-2 flex items-center justify-between gap-2" dir="ltr">
                <button
                  type="button"
                  onClick={() => setYearPageStart((currentYear) => currentYear - 12)}
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#f7f7f7] text-[#344054] transition-colors hover:bg-[#eef4ff]"
                  aria-label="Previous years"
                >
                  &#8249;
                </button>
                <p className="text-right text-[13px] font-semibold text-[#344054]" dir="rtl">
                  اختر السنة
                </p>
                <button
                  type="button"
                  onClick={() => setYearPageStart((currentYear) => currentYear + 12)}
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#f7f7f7] text-[#344054] transition-colors hover:bg-[#eef4ff]"
                  aria-label="Next years"
                >
                  &#8250;
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {yearOptions.map((year) => {
                  const isActiveYear = year === visibleMonth.getFullYear();

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      className={`rounded-[8px] px-2 py-2 text-sm transition-colors ${
                        isActiveYear
                          ? "bg-[#4395ff] font-extrabold text-white"
                          : "bg-[#f7f7f7] font-semibold text-[#344054] hover:bg-[#eef4ff]"
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  setYearPageStart(getYearPageStart(today.getFullYear()));
                  setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSelectedDate(today);
                  setIsYearPickerOpen(false);
                  onDateChange?.(today);
                }}
                className="mt-3 w-full rounded-[8px] bg-[#f7f7f7] px-3 py-2 text-sm font-semibold text-[#344054] transition-colors hover:bg-[#eef4ff]"
                dir="rtl"
              >
                الانتقال إلى تاريخ اليوم
              </button>
            </div>
          ) : null}
        </div>

        <div className="space-y-1 pt-1" dir="ltr">
          <div className="grid grid-cols-7 gap-0 text-center">
            {weekdayLabels.map((day) => (
              <div
                key={day.full}
                className="flex h-9 items-center justify-center px-0.5 text-[10px] font-medium leading-4 sm:h-10 sm:text-[14px] sm:leading-5"
                dir="rtl"
              >
                <span className="sm:hidden">{day.short}</span>
                <span className="hidden sm:inline">{day.full}</span>
              </div>
            ))}
          </div>

          {Array.from({ length: 6 }, (_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-7 gap-0 text-center">
              {calendarDays.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell) => (
                <DayButton
                  key={cell.date.toISOString()}
                  cell={cell}
                  isSelected={isSameDay(cell.date, selectedDate)}
                  isHighlighted={
                    !isSameDay(cell.date, selectedDate) &&
                    isSameDay(cell.date, normalizedHighlightedDate)
                  }
                  isDisabled={isBeforeDay(cell.date, today)}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
