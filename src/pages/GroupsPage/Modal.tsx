import { useEffect, useRef, useState, useContext, FormEvent } from "react";
import { toast } from "react-toastify";
import {Langs} from "../../enums.ts";
import {GlobalContext} from "../../App.tsx";
import client from "../../components/services";

type TModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

type TCourses = {
  id: string;
  name: string;
};

type TTeachersContent = {
  id: number;
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
};

type TLangSelect = {
  id: string;
  code: string;
  name: string;
};

type TNewsComponentContent = {
  title: string;
  placeholder: string;
  select1: string;
  select2: string;
  select3: string;
  button: string;
  days: string;
  odd: string;
  couple: string;
  from: string;
  to: string;
  required: string;
  toast1: string;
  toast2: string;
  groupName: string
};

const contentsMap = new Map<Langs, TNewsComponentContent>([
  [
    Langs.UZ,
    {
      title: "Yangi guruh qo'shish",
      placeholder: "Guruh nomi",
      select1: "O'qituvchini tanlang",
      select2: "Kursni tanlang",
      select3: "Tilni Tanlang",
      button: "Guruh qo'shish",
      days: "Kunlarini tanlash",
      odd: "Toq kunlar",
      couple: "Juft kunlar",
      from: "nechidan",
      to: "nechigacha",
      required: "Iltimos to'ldiring",
      toast1: "Guruh muvaffaqiyatli qo‘shildi",
      toast2: "Guruh qo‘shib bo‘lmadi",
      groupName: "Guruh nomi quyidagilardan biri bilan boshlanishi kerak"
    },
  ],
  [
    Langs.RU,
    {
      title: "Добавить новую группу",
      placeholder: "Имя группы",
      select1: "Выбрать преподавателя",
      select2: "Выберите Курс",
      select3: "Выберите язык",
      button: "Добавить группу",
      days: "Выберите дни",
      odd: "Нечетные дни",
      couple: "Чётные дни",
      from: "с",
      to: "до",
      required: "Пожалуйста, заполните",
      toast1: "Группа успешно добавлена",
      toast2: "Не удалось добавить группу",
      groupName: "Имя группы должно начинаться с одного из следующих символов"
    },
  ],
  [
    Langs.EN,
    {
      title: "Add new group",
      placeholder: "Group name",
      select1: "Select a teacher",
      select2: "Select a course",
      select3: "Select a language",
      button: "Add Group",
      days: "Choose the days",
      odd: "Odd days",
      couple: "Even days",
      from: "from",
      to: "to",
      required: "Please fill in",
      toast1: "Group added successfully",
      toast2: "Failed to add group",
      groupName: "Group name must start with one of"
    },
  ],
]);

const langSelectData: TLangSelect[] = [
  { id: "uz", code: "UZ", name: "O'zbekcha" },
  { id: "ru", code: "RU", name: "Русский" },
  { id: "en", code: "EN", name: "English" },
];

const daysOfWeekOdd = ["MO", "WE", "FR"];
const daysOfWeekEven = ["TU", "TH", "SA"];

function Modal({ isVisible, onClose }: TModalProps) {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TNewsComponentContent;
  const groupName = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [teachers, setTeachers] = useState<TTeachersContent[]>([]);
  const [module, setModule] = useState<string>("");
  const [courses, setCourses] = useState<TCourses[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [isOddDays, setIsOddDays] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await client.get("education/course/list/");
      setCourses(response.data as TCourses[]);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await client.get("employees/list/by/role/1/");
      setTeachers(response.data as TTeachersContent[]);
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    setSelectedLanguage(langSelectData[0].code); // Set default language
  }, []);

  const addGroup = async (e: FormEvent) => {
    e.preventDefault();
    const groupNameValue = groupName.current?.value ?? "";
    setErrorMessage(""); 

    if (!groupNameValue) {
      setErrorMessage(contents.required); // Set the error message
      return; 
    }
    // Allow any non-empty group name; remove strict prefix validation that blocked valid names like "Boys"
    setError("");

    const daysOfWeek = isOddDays ? daysOfWeekOdd : daysOfWeekEven;
    const schedule = daysOfWeek.map((day) => ({
      day,
      starts_at: startTime,
      ends_at: endTime,
    }));

    const formData = {
      name: groupNameValue,
      status: true,
      schedule,
      teacher: Number(selectedTeacher),
      course: Number(module),
      language: selectedLanguage,
    };

    try {
      await client.post("education/group/create/", formData);
      toast.success(contents.toast1);
      onClose();
    } catch (error) {
      console.error("Failed to add group", error);
      toast.error(contents.toast2);
    }
  };

  if (!isVisible) {
    return null;
  }

  const handleBlur = () => {
    const groupNameValue = groupName.current?.value ?? "";

    if (groupNameValue) {
      setErrorMessage("");
    }
  };


  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70"
    onClick={onClose} 
>
  <div className="relative w-full max-w-lg md:max-w-3xl p-2 md:p-4 mx-auto bg-white rounded-lg shadow-lg"
    onClick={handleModalClick}
    style={{ maxHeight: '90vh' }}  // Limit height to 90% of the viewport
  >
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="text-gray-600 text-2xl md:text-3xl hover:text-gray-900"
      >
        &times;
      </button>
    </div>
    <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: '80vh' }}> {/* Scrollable content */}
      <div className="card bg-gray-200">
        <div className="card-header py-4 md:py-5">
          <h2 className="text-xl md:text-2xl text-center font-semibold text-gray-800">
            {contents.title}
          </h2>
        </div>
        <div className="card-body p-3 md:p-4">
          <form onSubmit={addGroup}>
            <div className="form-group text-center">
              <input
                  ref={groupName}
                  className="w-full md:w-4/5 py-2 md:py-3 px-2 md:px-3 mt-5 md:mt-7 border-slate-400 rounded border"
                  placeholder={contents.placeholder}
                  onBlur={handleBlur}
              />
              {errorMessage && (
                  <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
              {error && (
                  <p className="text-red-700 md:pt-10px md:py-[60px] p-0">
                    {error}
                  </p>
              )}
              <select
                  className="w-full md:w-4/5 py-2 md:py-3 mt-5 md:mt-7 bg-white px-2 md:px-3 border-slate-400 rounded border"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="" disabled>
                  {contents.select1}
                </option>
                {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id} className="uppercase">
                      {teacher.user.first_name} {teacher.user.last_name}
                    </option>
                ))}
              </select>
              {!selectedTeacher && (
                  <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
              <select
                  className="w-full md:w-4/5 py-2 md:py-3 mt-5 md:mt-7 bg-white px-2 md:px-3 border-slate-400 rounded border"
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
              >
                <option value="" disabled>
                  {contents.select2}
                </option>
                {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                ))}
              </select>
              {!module && (
                  <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
              <select
                  className="w-full md:w-4/5 py-2 md:py-3 mt-5 md:mt-7 bg-white px-2 md:px-3 border-slate-400 rounded border"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="" disabled>
                  {contents.select3}
                </option>
                {langSelectData.map((lang) => (
                    <option key={lang.id} value={lang.code}>
                      {lang.name}
                    </option>
                ))}
              </select>

              <div className="w-full md:w-4/5 mx-auto mt-5 md:mt-7">
                <h3 className="text-lg md:text-xl text-center">{contents.days}</h3>
                <div className="flex justify-center mt-2">
                  <button
                      type="button"
                      className={`px-3 md:px-4 py-2 ${
                          isOddDays ? "bg-blue-700" : "bg-blue-300"
                      } text-white rounded-l hover:bg-blue-700`}
                      onClick={() => setIsOddDays(true)}
                  >
                    {contents.odd}
                  </button>
                  <button
                      type="button"
                      className={`px-3 md:px-4 py-2 ${
                          !isOddDays ? "bg-blue-700" : "bg-blue-300"
                      } text-white rounded-r hover:bg-blue-700`}
                      onClick={() => setIsOddDays(false)}
                  >
                    {contents.couple}
                  </button>
                </div>
              </div>

              <div className="w-full md:w-4/5 mx-auto mt-5 md:mt-7">
                <div className="flex flex-wrap md:flex-nowrap mt-2 md:mt-4">
                  <div className="flex flex-col w-full md:w-1/2">
                    <label htmlFor="">{contents.from}</label>
                    <input
                        type="time"
                        className="py-2 px-2 md:px-3 w-full md:w-2/3 mx-auto mb-2 border-slate-400 rounded border"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    {!startTime && (
                        <p className="text-red-500 mt-2">{errorMessage}</p>
                    )}
                  </div>
                  <div className="flex flex-col w-full md:w-1/2">
                    <label htmlFor="">{contents.to}</label>
                    <input
                        type="time"
                        className="py-2 px-2 md:px-3 w-full md:w-2/3 mx-auto mb-2 border-slate-400 rounded border"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                    {!endTime && (
                        <p className="text-red-500 mt-2">{errorMessage}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                  type="submit"
                  className="px-3 py-2 mt-5 md:mt-7 text-white bg-blue-400 rounded hover:bg-blue-700"
              >
                {contents.button}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
    </div>


  );
}

export default Modal;
