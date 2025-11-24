
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
  onPrev,
  onNext,
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

  
    </div>
  );
}