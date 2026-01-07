import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../App.tsx";
import { Langs } from "../../enums.ts";
import Modal from "./Modal.tsx";
import { Link } from "react-router-dom";
import client from "../../components/services";
import { toast } from "react-toastify";
import Loading from "../../components/LoadingComponent/Loading.tsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type TSchedule = {
  id: number;
  day: string;
  starts_at: string;
  ends_at: string;
};

type TGroups = {
  id: number;
  name: string;
  status: string | boolean; 
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    sure_name: string;
  };
  schedule: TSchedule[];
};

type TTeacher = {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    sure_name: string;
  };
};

type TGroupsComponentContent = {
  title: string;
  searchPlaceholder: string;
  copy: string;
  toast1: string;
  toast2: string;
  save: string;
  select: string;
  days: string;
  odd: string;
  couple: string;
  from: string;
  to: string;
  activateGroup: string;
  activating: string;
  activatedSuccess: string;
  activateError: string;
  active: string;
};

const contentsMap = new Map<Langs, TGroupsComponentContent>([
  [
    Langs.UZ,
    {
      title: "Barcha guruhlar",
      searchPlaceholder: "Guruh nomi bo'yicha qidiring",
      copy: "Nusxalandi",
      save: "Saqlash",
      select: "O'qituvchini tanlang",
      toast1: "O'zgarishlar muvaffaqiyatli saqlandi",
      toast2: "O'zgarishl USEDarni saqlashda xatolik yuz berdi",
      days: "Kunlarini tanlash",
      odd: "Toq kunlar",
      couple: "Juft kunlar",
      from: "Boshlanish",
      to: "Tugash",
      activateGroup: "Guruhni faollashtirish",
      activating: "Faollashtirilmoqda...",
      activatedSuccess: "Guruh muvaffaqiyatli faollashtirildi!",
      activateError: "Guruhni faollashtirishda xatolik yuz berdi",
      active: "Faol",
    },
  ],
  [
    Langs.RU,
    {
      title: "Все группы",
      searchPlaceholder: "Поиск по названию группы",
      copy: "Скопировано",
      save: "Сохранить",
      select: "Выберите учителя",
      toast1: "Изменения успешно сохранены",
      toast2: "Произошла ошибка при сохранении изменений",
      days: "Выберите дни",
      odd: "Нечётные дни",
      couple: "Чётные дни",
      from: "Начало",
      to: "Конец",
      activateGroup: "Активировать группу",
      activating: "Активация...",
      activatedSuccess: "Группа успешно активирована!",
      activateError: "Ошибка при активации группы",
      active: "Актив",
    },
  ],
  [
    Langs.EN,
    {
      title: "All Groups",
      searchPlaceholder: "Search by group name",
      copy: "Copied",
      save: "Save",
      select: "Select Teacher",
      toast1: "Changes saved successfully",
      toast2: "An error occurred while saving changes",
      days: "Choose the days",
      odd: "Odd days",
      couple: "Even days",
      from: "Start",
      to: "End",
      activateGroup: "Activate Group",
      activating: "Activating...",
      activatedSuccess: "Group activated successfully!",
      activateError: "Failed to activate group",
      active: "Active",
    },
  ],
]);

const daysOfWeekOdd = ["MO", "WE", "FR"];
const daysOfWeekEven = ["TU", "TH", "SA"];

function GroupsPage() {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TGroupsComponentContent;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groups, setGroups] = useState<TGroups[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<TGroups[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<TTeacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isOddDays, setIsOddDays] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [activatingId, setActivatingId] = useState<number | null>(null);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await client.get("education/group/list/?needed_role=admin");
      if (Array.isArray(response.data)) {
        setGroups(response.data as TGroups[]);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await client.get("employees/list/by/role/1/");
      if (Array.isArray(response.data)) {
        setTeachers(response.data);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const openDeleteModal = (groupId: number) => {
    setSelectedGroupId(groupId);
    setIsDeleteModalVisible(true);
  };

  const deleteGroup = (groupId: number) => {
    openDeleteModal(groupId);
  };

  const handleActivateGroup = async (groupId: number) => {
    setActivatingId(groupId);
    try {
      await client.put(`education/group/activate/${groupId}/`);
      toast.success(contents.activatedSuccess);
      fetchGroups();
    } catch (err: any) {
      console.error("Activate error:", err);
      toast.error(contents.activateError);
    } finally {
      setActivatingId(null);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchTeachers();
  }, [isModalVisible]);

 useEffect(() => {
  let result = groups.filter(
    (item) => item.status !== "inactive" 
  );

  if (searchQuery !== "") {
    result = result.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  setFilteredGroups(result);
}, [searchQuery, groups]);


  const handleEditClick = (groupId: number) => {
    if (editingGroupId === groupId) {
      setEditingGroupId(null);
      setEditingGroupName(null);
      setSelectedTeacherId(null);
      setStartTime("");
      setEndTime("");
      setIsOddDays(true);
    } else {
      const group = groups.find((g) => g.id === groupId);
      if (group) {
        setEditingGroupId(groupId);
        setEditingGroupName(group.name);
        setSelectedTeacherId(group.teacher.id);

        if (group.schedule && group.schedule.length > 0) {
          const first = group.schedule[0];
          setStartTime(first.starts_at.substring(0, 5));
          setEndTime(first.ends_at.substring(0, 5));

          const days = group.schedule.map((s) => s.day);
          const isOdd = days.length === 3 && daysOfWeekOdd.every((d) => days.includes(d));
          setIsOddDays(isOdd);
        }
      }
    }
  };

 const handleSaveTeacher = async (id: number) => {
  try {
    const daysOfWeek = isOddDays ? daysOfWeekOdd : daysOfWeekEven;

    const schedule = daysOfWeek.map((day) => ({
      day,
      starts_at: `${startTime}:00`,
      ends_at: `${endTime}:00`,
    }));

    // 🚀 JSON object yuboramiz
    const payload: any = {
      name: editingGroupName ?? "",
    };

    if (selectedTeacherId) {
      payload.teacher = selectedTeacherId;
    }

    await client.patch(
      `education/group/update/${id}/`,
      payload, // <-- JSON
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // schedule alohida PUT bo‘lib qoladi
    await client.put(`education/group/${id}/schedule/update/`, { schedule });

    toast.success(contents.toast1);
    setEditingGroupId(null);
    fetchGroups();

  } catch (err: any) {
    console.error(err.response?.data);
    toast.error(contents.toast2);
  }
};

  return (
    <div className="w-full mt-12 md:mt-0">
      <div className="header w-full flex justify-end">
        <div className="my-5 flex justify-between w-3/5">
          <h1 className="2xl:text-4xl text-3xl font-bold dark:text-customText">
            {contents.title}
          </h1>
          <div className="flex items-center">
            <button
              onClick={openModal}
              className="py-3 px-4 text-white mr-5 md:mr-0 bg-blue-400 rounded hover:bg-blue-700"
            >
              <i className="fa-solid fa-plus" />
            </button>
            <div
              className={`transition-all hidden md:block duration-300 ${
                isSearchVisible ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"
              } mx-2`}
            >
              <input
                type="text"
                placeholder={contents.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="bg-gray-200 me-5 hidden md:block hover:bg-gray-300 rounded py-3 px-4"
            >
              <i className="fa fa-search"></i>
            </button>
          </div>
          <Modal isVisible={isModalVisible} onClose={closeModal} />
        </div>
      </div>

      <div className="flex justify-end mb-6 items-center md:hidden">
        <div
          className={`transition-all duration-300 ${
            isSearchVisible ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"
          } mx-2`}
        >
          <input
            type="text"
            placeholder={contents.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          className="bg-gray-200 me-5 hover:bg-gray-300 rounded py-3 px-4"
        >
          <i className="fa fa-search"></i>
        </button>
      </div>

      <div className="w-full 2xl:h-[88%] h-[70%] overflow-y-auto">
        <div className="courses pt-6 pb-12 flex flex-col gap-5 justify-center content-center">
          {loading ? (
            <Loading />
          ) : (
            filteredGroups.map((item) => (
              <div
                key={item.id}
                className="relative w-5/6 flex flex-col rounded-md mx-auto drop-shadow-lg bg-white dark:bg-gray-700"
              >
                <div className="flex justify-between min-h-14 items-center px-4 py-2">
                  <Link
                    to={`${item.id}`}
                    className="block uppercase text-xl border-gray-300 duration-300 ease-in-out hover:text-blue-400 dark:hover:text-blue-400 dark:text-white"
                  >
                    {item.name}
                  </Link>

                  <div className="flex items-center gap-3">

                    {(item.status === "recruiting" || item.status === "exam") && (
                      <button
                        onClick={() => handleActivateGroup(item.id)}
                        disabled={activatingId === item.id}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all ${
                          activatingId === item.id
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {activatingId === item.id ? contents.activating : contents.activateGroup}
                      </button>
                    )}

                    {(item.status === "true" || item.status === true || item.status === "active") && (
                      <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        {contents.active}
                      </span>
                    )}

                    <button
                      className={`${
                        editingGroupId === item.id ? "bg-red-600" : "bg-yellow-500"
                      } w-[30px] h-[30px] text-white rounded-md hover:opacity-90`}
                      onClick={() => handleEditClick(item.id)}
                    >
                      <i className={`fa-solid ${editingGroupId === item.id ? "fa-close" : "fa-pen"}`} />
                    </button>

                    <button
                      onClick={() => deleteGroup(item.id)}
                      className="bg-red-600 w-[30px] h-[30px] text-white rounded-md hover:opacity-90"
                    >
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  </div>
                </div>

                {editingGroupId === item.id && (
                  <div className="mt-4 p-4 text-center border-t-2">
                    <input
                      type="text"
                      value={editingGroupName ?? ""}
                      onChange={(e) => setEditingGroupName(e.target.value)}
                      className="p-2 border rounded w-full mb-2 dark:bg-slate-700 dark:text-white"
                      placeholder="Guruh nomi"
                    />

                    <select
                      value={selectedTeacherId ?? ""}
                      onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                      className="p-2 border rounded w-full mb-2 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">{contents.select}</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.user.first_name} {teacher.user.last_name} {teacher.user.sure_name}
                        </option>
                      ))}
                    </select>

                    <div className="w-full mx-auto mt-5">
                      <h3 className="text-lg text-center mb-3">{contents.days}</h3>
                      <div className="flex justify-center mb-4">
                        <button
                          type="button"
                          className={`px-4 py-2 ${isOddDays ? "bg-blue-700" : "bg-blue-300"} text-white rounded-l hover:bg-blue-700`}
                          onClick={() => setIsOddDays(true)}
                        >
                          {contents.odd}
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-2 ${!isOddDays ? "bg-blue-700" : "bg-blue-300"} text-white rounded-r hover:bg-blue-700`}
                          onClick={() => setIsOddDays(false)}
                        >
                          {contents.couple}
                        </button>
                      </div>

                      <div className="flex gap-4 justify-center mb-4">
                        <div className="flex flex-col w-1/2">
                          <label className="mb-1">{contents.from}</label>
                          <input
                            type="time"
                            className="p-2 border-slate-400 rounded border dark:bg-slate-700 dark:text-white"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col w-1/2">
                          <label className="mb-1">{contents.to}</label>
                          <input
                            type="time"
                            className="p-2 border-slate-400 rounded border dark:bg-slate-700 dark:text-white"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSaveTeacher(item.id)}
                      className="py-3 px-4 text-white bg-blue-400 rounded hover:bg-blue-700"
                    >
                      {contents.save}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        groupId={selectedGroupId}
        fetchGroups={fetchGroups}
      />
    </div>
  );
}

export default GroupsPage;