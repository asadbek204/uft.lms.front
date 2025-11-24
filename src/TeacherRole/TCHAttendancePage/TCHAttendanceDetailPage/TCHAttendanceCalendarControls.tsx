
import dayjs from "dayjs";

type Props = {
  currentMonth: dayjs.Dayjs;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  monthName: string;
  year: number;
};

export default function AttendanceCalendarControls({
  currentMonth,
  onPrev,
  onNext,
  onToday,
  monthName,
  year,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      <button
        onClick={onPrev}
        className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      <h2 className="text-2xl font-semibold dark:text-white text-center">
        {monthName} {year}
      </h2>

      <button
        onClick={onNext}
        className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
      >
        <i className="fa-solid fa-arrow-right"></i>
      </button>

      <button
        onClick={onToday}
        className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center gap-2"
      >
        <i className="fa fa-calendar"></i>
        <span className="hidden sm:inline">Joriy oy</span>
      </button>
    </div>
  );
}