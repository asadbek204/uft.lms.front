import {useEffect, useRef, useState, useContext, FormEvent} from "react";
import {toast} from "react-toastify";
import {Langs} from "../../../enums.ts";
import {GlobalContext} from "../../../App.tsx";
import client from "../../../components/services";
import {useParams} from "react-router-dom";

type TModalProps = {
    isVisible: boolean;
    onClose: () => void;
};

type TCourses = {
    id: string;
    name: string;
};

type TLangSelect = {
    id: string;
    code: string;
    name: string;
};

type TNewsComponentContent = {
    title: string,
    placeholder: string,
    select1: string,
    select2: string,
    select3: string,
    button: string,
    days:string,
    odd: string,
    couple: string,
    from : string,
    to: string,
    error: string,
    toast: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
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
        error: "Guruh nomi quyidagilardan biri bilan boshlanishi kerak",
        toast: "Guruh qo‘shib bo‘lmadi"
    }],
    [Langs.RU, {
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
        error: "Имя группы должно начинаться с одного из",
        toast: "Не удалось добавить группу"
    }],
    [Langs.EN, {
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
        error: "Group name must start with one of",
        toast: "Failed to add group"
    }],
]);

const langSelectData: TLangSelect[] = [
    {id: 'uz', code: 'UZ', name: 'O\'zbekcha'},
    {id: 'ru', code: 'RU', name: 'Русский'},
    {id: 'en', code: 'EN', name: 'English'},
];

const daysOfWeekOdd = ["MO", "WE", "FR"];
const daysOfWeekEven = ["TU", "TH", "SA"];

function Modal({isVisible, onClose}: TModalProps) {
    const {lang} = useContext(GlobalContext);
    const {id} = useParams();
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const groupName = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");
    const [module, setModule] = useState<string>("");
    const [courses, setCourses] = useState<TCourses[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [isOddDays, setIsOddDays] = useState<boolean>(true);
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await client.get('education/course/list/');
            setCourses(response.data as TCourses[]);
        };
        fetchCourses();
        setSelectedLanguage(langSelectData[0].code); 
    }, []);

    const addGroup = async (e: FormEvent) => {
        e.preventDefault();
        const groupNameValue = groupName.current?.value ?? "";
        const pattern = /^(FSP-U-|FSP-R-|FSJ-U-|FSJ-R-|C#-U-|C#-R-|AI-U-|AI-R-)/;

        if (!pattern.test(groupNameValue)) {
            setError(`${contents.error}: FSP-U-, FSP-R-, FSJ-U-, FSJ-R-, C#-U-, C#-R-, AI-U-, AI-R-`);
            return;
        }

        setError("");

        const daysOfWeek = isOddDays ? daysOfWeekOdd : daysOfWeekEven;
        const schedule = daysOfWeek.map((day) => ({
            day,
            starts_at: startTime,
            ends_at: endTime
        }));

        const formData = {
            name: groupNameValue,
            status: true,
            teacher: id,
            course: Number(module),
            schedule,
            language: selectedLanguage
        };

        try {
            await client.post('education/group/create/', formData);
            toast.success(contents.button);
            onClose();
        } catch (error) {
            console.error("Failed to add group", error);
            toast.error(contents.toast);
        }
    };

    if (!isVisible) {
        return null;
    }
    return (


        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70">
    <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-lg shadow-lg"> 
        <div className="flex justify-end">
            <button onClick={onClose} className="text-gray-600 text-3xl hover:text-gray-900">
                &times;
            </button>
        </div>
        <div className="px-4 pb-6"> 
            <div className="card bg-gray-200">
                <div className="card-header py-4">
                    <h2 className="text-xl text-center font-semibold text-gray-800">{contents.title}</h2> 
                </div>
                <div className="card-body p-2"> 
                    <form onSubmit={addGroup}>
                        <div className="form-group text-center">
                            <input
                                ref={groupName}
                                className="w-11/12 py-2 mt-4 px-3 border-slate-400 rounded border"
                                placeholder={contents.placeholder}
                                required
                            />
                            {error &&
                                <p className="text-red-700 mt-2">{error}</p>} 
                            
                            <select
                                className="w-11/12 py-2 mt-4 bg-white px-3 border-slate-400 rounded border"
                                value={module}
                                onChange={(e) => setModule(e.target.value)}
                                required
                            >
                                <option value="" className="font-sans" disabled>
                                    {contents.select2}
                                </option>
                                {courses.map((course) => (
                                    <option className="font-sans" key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="w-11/12 py-2 mt-4 bg-white px-3 border-slate-400 rounded border"
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                required
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

                            <div className="w-11/12 mx-auto mt-4">
                                <h3 className="text-lg text-center">{contents.days}</h3>
                                <div className="flex justify-center mt-2">
                                    <button
                                        type="button"
                                        className={`px-3 py-1 ${isOddDays ? 'bg-blue-700' : 'bg-blue-300'} text-white rounded-l hover:bg-blue-700`}
                                        onClick={() => setIsOddDays(true)}
                                    >
                                        {contents.odd}
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-3 py-1 ${!isOddDays ? 'bg-blue-700' : 'bg-blue-300'} text-white rounded-r hover:bg-blue-700`}
                                        onClick={() => setIsOddDays(false)}
                                    >
                                        {contents.couple}
                                    </button>
                                </div>
                            </div>

                            <div className="w-11/12 mx-auto mt-4">
                                <div className="flex flex-col md:flex-row md:justify-between">
                                    <div className="flex flex-col w-full md:w-1/2">
                                        <label htmlFor="">{contents.from}</label>
                                        <input
                                            type="time"
                                            className="py-2 px-3 w-full mb-2 border-slate-400 rounded border"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col w-full md:w-1/2 md:ml-4">
                                        <label htmlFor="">{contents.to}</label>
                                        <input
                                            type="time"
                                            className="py-2 px-3 w-full mb-2 border-slate-400 rounded border"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
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
