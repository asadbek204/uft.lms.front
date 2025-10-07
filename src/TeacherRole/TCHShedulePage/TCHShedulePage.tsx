import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../App.tsx";
import { Langs } from "../../enums.ts";
import client from "../../components/services";
import Loading from "../../components/LoadingComponent/Loading.tsx";

type TSchedule = {
    id: number;
    day: string;
    starts_at: string;
    ends_at: string;
};

type TCourse = {
    id: number;
    name: string;
};

type TGroups = {
    id: number;
    name: string;
    schedule: TSchedule[];
    course: TCourse;
    status: boolean;
};

type TGroupsComponentContent = {
    title: string;
    groupName: string;
    courseName: string;
    days: string;
    classTime: string;
    noGroups: string;
    error: string;
};

// Translation for days of the week
const weekdaysMap = new Map<Langs, { [key: string]: string }>([
    [Langs.UZ, {
        MO: "Dushanba",
        TU: "Seshanba",
        WE: "Chorshanba",
        TH: "Payshanba",
        FR: "Juma",
        SA: "Shanba",
        SU: "Yakshanba"
    }],
    [Langs.RU, {
        MO: "Понедельник",
        TU: "Вторник",
        WE: "Среда",
        TH: "Четверг",
        FR: "Пятница",
        SA: "Суббота",
        SU: "Воскресенье"
    }],
    [Langs.EN, {
        MO: "Monday",
        TU: "Tuesday",
        WE: "Wednesday",
        TH: "Thursday",
        FR: "Friday",
        SA: "Saturday",
        SU: "Sunday"
    }]
]);

const contentsMap = new Map<Langs, TGroupsComponentContent>([
    [Langs.UZ, { 
        title: "Sizning guruhlaringiz",
        groupName: "Guruh nomi",
        courseName: "Kurs nomi",
        days: "Kunlar",
        classTime: "Dars vaqti",
        noGroups: "Guruhlar mavjud emas.",
        error: "Guruhlarni yuklab bo'lmadi."
    }],
    [Langs.RU, { 
        title: "Ваши группы",
        groupName: "Название группы",
        courseName: "Название курса",
        days: "Дни",
        classTime: "Время занятия",
        noGroups: "Группы недоступны.",
        error: "Не удалось загрузить группы."
    }],
    [Langs.EN, { 
        title: "Your groups",
        groupName: "Group Name",
        courseName: "Course Name",
        days: "Days",
        classTime: "Class Time",
        noGroups: "No groups available.",
        error: "Failed to fetch groups."
    }],
]);

const weekdaysOrder: { [key: string]: number } = {
    MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6, SU: 7
};

function TCHSHedulePage() {
  const { lang, userId } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TGroupsComponentContent;
    const weekdays = weekdaysMap.get(lang) || {};

    const [groups, setGroups] = useState<TGroups[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const fetchGroups = async () => {
            try {
        const response = await client.get<TGroups[]>(`education/group/list/?needed_role=teacher&teacher=${userId}`);
                setGroups(response.data);
            } catch (error) {
                setError(contents.error);
            } finally {
                setLoading(false);
            }
        };

    fetchGroups();
  }, [contents.error, userId]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }


    const sortedGroups = groups
        .map(group => ({
            ...group,
            schedule: group.schedule.sort((a, b) => weekdaysOrder[a.day] - weekdaysOrder[b.day])
        }))
        .sort((a, b) => Number(b.status) - Number(a.status)); 

    return (
        <div className="container mx-auto p-4 overflow-y-auto mt-12 md:mt-0">
            <h1 className="text-2xl text-center font-bold mb-4 dark:text-customText ">{contents.title}</h1>
            {sortedGroups.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <thead>
        <tr className="w-full bg-gray-100 dark:bg-gray-900 text-left text-gray-900 dark:text-gray-300">
          <th className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 whitespace-nowrap">
            {contents.groupName}
          </th>
          <th className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 whitespace-nowrap">
            {contents.courseName}
          </th>
          <th className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 whitespace-nowrap">
            {contents.days}
          </th>
          <th className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 whitespace-nowrap">
            {contents.classTime}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedGroups.map((group) => (
          <tr
            key={group.id}
            className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
              group.status === false
                ? "text-red-500 dark:text-red-400"
                : "text-gray-900 dark:text-gray-300"
            }`}
          >
            <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 whitespace-nowrap">
              {group.name}
            </td>
            <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 whitespace-nowrap">
              {group.course.name}
            </td>
            <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 whitespace-nowrap">
              {group.schedule.map((s) => weekdays[s.day]).join(", ")}
            </td>
            <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 whitespace-nowrap">
              {group.schedule[0].starts_at.slice(0, 5)} - {group.schedule[0].ends_at.slice(0, 5)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <div className="text-center">{contents.noGroups}</div>
)}


        </div>
    );
}

export default TCHSHedulePage;
