import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import client from "../../components/services";
import { Link } from "react-router-dom";

type TStudent = {
  id: number;
  first_name: string;
  last_name: string;
};


type TDashboardData = {
  active_groups: number;
  students_count: number;
  new_students_count: number;
  groups_on_recruitment: {
    id: number;
    name: string;
    students_count: number;
    limit: number;
  }[];
};

type TUser = {
  first_name: string;
  last_name: string;
};

type TContent = {
  title1: string;
  title2: string;
  today: string;
  studentsCount: string;
  activeGroups: string;
  newStudents: string;
  recruitingGroups: string;
  noRecruitingGroups: string;
  btn: string;
};

const contentsMap = new Map<Langs, TContent>([
  [Langs.UZ, {
    title1: "Boshqaruv paneli",
    title2: "Xush kelibsiz,",
    today: "Bugun",
    studentsCount: "Talabalar soni",
    activeGroups: "Faol guruhlar",
    newStudents: "Yangi talabalar (oylik)",
    recruitingGroups: "Yangi guruhga yig'ilish",
    noRecruitingGroups: "Hozircha yig'ilayotgan guruh yo'q",
    btn: "Shaxsiy kabinetga kirish"
  }],
  [Langs.RU, {
    title1: "Панель управления",
    title2: "Добро пожаловать,",
    today: "Сегодня",
    studentsCount: "Количество студентов",
    activeGroups: "Активные группы",
    newStudents: "Новые студенты (месяц)",
    recruitingGroups: "Набор в группы",
    noRecruitingGroups: "Нет групп в наборе",
    btn: "Перейти в личный кабинет"
  }],
  [Langs.EN, {
    title1: "Dashboard",
    title2: "Welcome,",
    today: "Today",
    studentsCount: "Total Students",
    activeGroups: "Active Groups",
    newStudents: "New Students (Month)",
    recruitingGroups: "Recruiting Groups",
    noRecruitingGroups: "No groups are recruiting",
    btn: "Go to personal cabinet"
  }]
]);

const DEFAULT_SLOTS = { "1": "a", "2": "b", "3": "c", "4": "d" };
const SLOT_KEYS = ["1", "2", "3", "4"];

const TodayCard: React.FC<{ date: string; title: string }> = ({ date, title }) => (
  <div data-swapy-item="a" className="h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 flex flex-col justify-between shadow-2xl">
    <h3 className="text-xl font-medium opacity-90">{title}</h3>
    <p className="text-3xl lg:text-[40px] font-extrabold">{date}</p>
  </div>
);

const StudentsCard: React.FC<{ count: number; title: string }> = ({ count, title }) => (
  <div data-swapy-item="b" className="h-full rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-8 flex flex-col justify-between shadow-2xl">
    <h3 className="text-xl font-medium opacity-90">{title}</h3>
    <p className="text-3xl md:text-[65px] font-extrabold">{count}</p>
  </div>
);

const GroupsCard: React.FC<{ count: number; title: string }> = ({ count, title }) => (
  <div data-swapy-item="c" className="h-full rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white p-8 flex flex-col justify-between shadow-2xl">
    <h3 className="text-xl font-medium opacity-90">{title}</h3>
    <p className="text-3xl md:text-[65px] font-extrabold">{count}</p>
  </div>
);

const NewStudentsCard: React.FC<{ count: number; title: string }> = ({ count, title }) => (
  <div data-swapy-item="d" className="h-full rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 flex flex-col justify-between shadow-2xl">
    <h3 className="text-xl font-medium opacity-90">{title}</h3>
    <p className="text-3xl md:text-[65px] font-extrabold">{count}</p>
  </div>
);

const HomePage: React.FC = () => {
  const { lang, role } = useContext(GlobalContext);
  const t = contentsMap.get(lang)!;
  const [student, setStudent] = useState<TStudent | null>(null);  
  const [user, setUser] = useState<TUser>({ first_name: "", last_name: "" });
  const [data, setData] = useState<TDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<Record<string, string>>(DEFAULT_SLOTS);

  const today = new Date().toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).replace(/\//g, '.');

   useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await client.get("students/me/");
        
        setStudent(response.data[0]);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchUser();
  }, []);

  const { userId } = useContext(GlobalContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, dashRes] = await Promise.all([
          client.get("accounts/me/"),
          client.get("dashboard/")
        ]);
        setUser(userRes.data);
        setData(dashRes.data);
      } catch (err) {
        console.error("Ma'lumotlar yuklanmadi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const saved = localStorage.getItem("dashboardSlots");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const validSlots: Record<string, string> = {};
        SLOT_KEYS.forEach(key => {
          validSlots[key] = ['a', 'b', 'c', 'd'].includes(parsed[key]) ? parsed[key] : DEFAULT_SLOTS[key as keyof typeof DEFAULT_SLOTS];
        });
        setSlots(validSlots);
      } catch {
        setSlots(DEFAULT_SLOTS);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("dashboardSlots", JSON.stringify(slots));
    }
  }, [slots, loading]);

  const getCardForSlot = (slotId: string) => {
    if (!data) return <div className="h-full rounded-3xl bg-gray-200 animate-pulse" />;

    const type = slots[slotId];
    switch (type) {
      case "a": return <TodayCard date={today} title={t.today} />;
      case "b": return <StudentsCard count={data.students_count} title={t.studentsCount} />;
      case "c": return <GroupsCard count={data.active_groups} title={t.activeGroups} />;
      case "d": return <NewStudentsCard count={data.new_students_count} title={t.newStudents} />;
      default: return <TodayCard date={today} title={t.today} />;
    }
  };

  const handleDragStart = (e: React.DragEvent, cardType: string) => {
    e.dataTransfer.setData('cardType', cardType);
    e.dataTransfer.setData('sourceSlot', (e.currentTarget as HTMLElement).dataset.slot || '');
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, targetSlot: string) => {
    e.preventDefault();
    const cardType = e.dataTransfer.getData('cardType');
    const sourceSlot = e.dataTransfer.getData('sourceSlot');

    if (cardType && sourceSlot && sourceSlot !== targetSlot) {
      setSlots(prev => {
        const sourceCard = prev[sourceSlot];
        const targetCard = prev[targetSlot];
        return {
          ...prev,
          [sourceSlot]: targetCard,
          [targetSlot]: sourceCard
        };
      });
    }
  };

  const RecruitingGroups = () => {
    if (!data?.groups_on_recruitment?.length) {
      return (
        <div className="col-span-full text-center py-20">
          <p className="text-2xl text-gray-500">{t.noRecruitingGroups}</p>
        </div>
      );
    }

    return (
      <div className="col-span-full mt-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          {t.recruitingGroups}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.groups_on_recruitment.map((g) => {
            const percent = Math.round((g.students_count / g.limit) * 100);
            return (
              <div
                key={g.id}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                  {g.name}
                </h3>
                <div className="text-center mb-6">
                  <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {g.students_count}
                  </span>
                  <span className="text-5xl text-gray-500">/{g.limit}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto">
      <div className="px-6 ">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          {t.title1}
        </h1>
          {(role === "student" ) && (
          <Link to={`/debts/${student?.id}`}>
        <button className="  px-3 ml-10 py-2 text-sm lg:text-base text-white bg-blue-400 rounded hover:bg-blue-700">
          {t.btn}
        </button>
      </Link> 
          )}
        </div>
        <p className="mt-4 text-2xl text-gray-700 dark:text-gray-300">
          {t.title2}{" "}
          <span className="font-bold text-black dark:text-white">
            {user.first_name} {user.last_name}
          </span>
        </p>
        
      </div>

      <div className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {SLOT_KEYS.map((slotId) => (
              <div
                key={slotId}
                data-slot={slotId}
                draggable
                onDragStart={(e) => handleDragStart(e, slots[slotId])}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slotId)}
                className="slot min-h-[200px] cursor-move transition-all duration-200 hover:scale-[1.02] rounded-xl overflow-hidden"
              >
                {getCardForSlot(slotId)}
              </div>
            ))}
          </div>

          <RecruitingGroups />
        </div>
      </div>
    </div>
  );
};

export default HomePage;