export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("fr-FR", options ?? { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function buildMonthDays(year: number, monthIndex: number): CalendarDay[] {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const days: CalendarDay[] = [];

  const startWeekDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  for (let i = startWeekDay; i > 0; i -= 1) {
    const date = new Date(year, monthIndex, 1 - i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
    });
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, monthIndex, day);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
    });
  }

  const endWeekDay = lastDay.getDay() === 0 ? 6 : lastDay.getDay() - 1;
  for (let i = 1; i < 7 - endWeekDay; i += 1) {
    const date = new Date(year, monthIndex + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
    });
  }

  return days;
}

export function isToday(date: Date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
