import Loading from "../../components/LoadingComponent/Loading.tsx";
import {
    useEffect,
    useState,
    useContext,
    ChangeEvent,
    FormEvent,
    useRef,
} from "react";
import {GlobalContext} from "../../App";
import {Langs} from "../../enums";
import client from "../../components/services";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";
import AddNewRole from "./AddNewRole.tsx";

type Document = {
    passport_seria: string;
    pinfl: string;
    created_at: string;
    document: {
        file: string;
    };
};

type Father = {
    first_name?: string;
    last_name?: string;
    sure_name?: string;
    passport: string;
    pinfl: string;
    email?: string;
    birthday: string;
    phone_number: string;
};

type Mother = {
    first_name?: string;
    last_name?: string;
    sure_name?: string;
    passport: string;
    pinfl: string;
    email?: string;
    birthday: string;
    phone_number: string;
};

type TUser = {
    phone_number: string;
    password: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    sure_name?: string;
    passport: string;
    pinfl: string;
    gender?: string;
    birthday: string;
};

interface StudentData {
    birthday: string;
    email: string;
    first_name: string;
    gender?: string;
    last_name: string;
    passport: string;
    phone_number: string;
    pinfl: string;
    sure_name: string;
    document: Document[];
    father?: Father;
    // father?: TUser;
    mother?: TUser;
    university?: string;
}

const defaultStudent = {
    birthday: "",
    email: "",
    first_name: "",
    gender: "M",
    last_name: "",
    passport: "",
    phone_number: "",
    pinfl: "",
    sure_name: "",
    document: [],
};

// Simple group type used for moving students between groups
type TGroup = {
    id: number;
    name: string;
    status: boolean;
};

interface TNewsComponentContent {
    title1: string;
    title2: string;
    title3: string;
    birth_date: string;
    email: string;
    first_name: string;
    gender: string;
    last_name: string;
    passport: string;
    phone_number: string;
    pinfl: string;
    sure_name: string;
    student: string;
    studentka: string;
    male: string;
    female: string;
    father_i: string;
    mother_i: string;
    password: string;
    toast1: string;
    toast2: string;
    toast3: string;
    toast4: string;
    choose_gender: string;
    document: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [
        Langs.UZ,
        {
            title1: "Shaxsiy ma'lumotlar",
            title2: "Oilaviy ma'lumotlar",
            title3: "Qo'shimcha ma'lumotlar",
            birth_date: "Tug'ilgan sana",
            email: "Elektron pochta",
            first_name: "Ism",
            gender: "Jins",
            last_name: "Familiya",
            passport: "Passport",
            phone_number: "Telefon raqami",
            pinfl: "PINFL",
            sure_name: "Otasining ismi",
            student: "O'quvchi",
            studentka: "O'quvchi",
            male: "Erkak",
            female: "Ayol",
            father_i: "Otasining ma'lumotlari",
            mother_i: "Onasining ma'lumotlari",
            password: "Parol",
            toast1: "Talaba maʼlumotlarini saqlab boʻlmadi",
            toast2: "Ota-ona maʼlumotlarini saqlab boʻlmadi",
            toast3: "Talaba ma'lumotlari muvaffaqiyatli saqlandi",
            toast4: "Ota-ona ma'lumotlari muvaffaqiyatli saqlandi",
            choose_gender: "Jinsni tanlang",
            document: "Dokument"

        },
    ],

    [
        Langs.RU,
        {
            title1: "Личные данные",
            title2: "Семейные данные",
            title3: "Дополнительная информация",
            birth_date: "Дата рождения",
            email: "Электронная почта",
            first_name: "Имя",
            gender: "Пол",
            last_name: "Фамилия",
            passport: "Паспорт",
            phone_number: "Номер телефона",
            pinfl: "ПИНФЛ",
            sure_name: "Отчество",
            student: "Ученик",
            studentka: "Ученица",
            male: "Мужской",
            female: "Женский",
            father_i: "Информация об отце",
            mother_i: "Информация о матери",
            password: "Пароль",
            toast1: "Не удалось сохранить данные студента.",
            toast2: "Не удалось сохранить данные родителей.",
            toast3: "данные студента успешно сохранены",
            toast4: "данные родителей успешно сохранены",
            choose_gender: "Выберите пол",
            document: "Документ"
        },
    ],
    [
        Langs.EN,
        {
            title1: "Personal Information",
            title2: "Family Information",
            title3: "Additional Information",
            birth_date: "Birth Date",
            email: "Email",
            first_name: "First Name",
            gender: "Gender",
            last_name: "Last Name",
            passport: "Passport",
            phone_number: "Phone Number",
            pinfl: "PINFL",
            sure_name: "Middle Name",
            student: "Student",
            studentka: "Student",
            male: "Male",
            female: "Female",
            father_i: "Father's information",
            mother_i: "Mother's information",
            password: "Password",
            toast1: "Failed to save student data",
            toast2: "Failed to save parents data",
            toast3: "Student data saved successfully",
            toast4: "Parents data saved successfully",
            choose_gender: "Select gender",
            document: "Document"
        },
    ],
]);

function DebtorsPageUsers() {
    const {id} = useParams<{ id: string }>();
    const {lang, role} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<StudentData>(defaultStudent);
    const [documentsFile, setDocumentsFile] = useState<Document[]>([]);
    const [fatherData, setFatherData] = useState<Father>();
    const [motherData, setMotherData] = useState<Mother>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<StudentData>(defaultStudent);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isModalAddRoleOpen, setIsModalAddRoleOpen] = useState<boolean>(false);
    const formRef = useRef(null);
    const [userId, setUserId] = useState(0)
    // For moving student to another group
    const [groups, setGroups] = useState<TGroup[]>([]);
    const [isMoveOpen, setIsMoveOpen] = useState(false);
    const [selectedMoveGroup, setSelectedMoveGroup] = useState<number | null>(null);
    const moveMenuRef = useRef<HTMLDivElement | null>(null);
    const moveToggleRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await client.get(`students/retrive/${id}/`);
                console.log(response)
                const userData = response.data.user;
                setUserId(userData.id)
                const documents: Document[] = response.data.document;
                const fatherDatas: Father = response.data.father;
                const motherDatas: Mother = response.data.mother;

                if (!userData.pinfl && documents[0]?.pinfl) {
                    userData.pinfl = documents[0].pinfl;
                }
                if (!userData.passport && documents[0]?.passport_seria) {
                    userData.passport = documents[0].passport_seria;
                }

                if (userData && Array.isArray(documents)) {
                    setData(userData);
                    setFormData(userData);
                    setDocumentsFile(documents);
                    setFatherData(fatherDatas);
                    setMotherData(motherDatas);
                } else {
                    throw new Error("Unexpected response structure");
                }
            } catch (error) {
                console.error(error);
                toast.error(contents.toast1);
            } finally {
                setLoading(false);
            }
        })();
        // Load groups for move action
        (async () => {
            try {
                const list = await client.get(`education/group/list/?needed_role=${role}`);
                if (Array.isArray(list.data)) {
                    setGroups(list.data.filter((g: TGroup) => g.status));
                }
            } catch (e) {
                // ignore quietly; group move UI will just be empty
            }
        })();
    }, [id, isEditing]);

    // Close move menu on outside click
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            const target = e.target as Node;
            const clickedInsideMenu = moveMenuRef.current?.contains(target);
            const clickedToggle = moveToggleRef.current?.contains(target);
            if (isMoveOpen && !clickedInsideMenu && !clickedToggle) {
                setIsMoveOpen(false);
            }
        };
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, [isMoveOpen]);
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(data);
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;

        if (name.includes("father.") || name.includes("mother.")) {
            const [parent, field] = name.split(".");
            setFormData((prevData) => ({
                ...prevData,
                [parent]: {
                    ...(prevData as unknown as { [key: string]: object })[parent],
                    [field]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSave = async () => {
        const form = new FormData(formRef.current as unknown as HTMLFormElement);
        const formvalues = Object.fromEntries(form);
        if (!formData) return;
        const studentData: { [key: string]: string } = {}
        for (const key of Object.keys(formData)) {
            const value = formData[key as keyof StudentData];
            if (value) studentData[`${key}`] = `${value}`;
        }
        const fatherData: { [key: string]: string } = {}
        for (const key of Object.keys(formData)) {
            const value = formvalues[`father.${key}`];
            if (value) fatherData[`${key}`] = `${value}`;
        }
        const motherData: { [key: string]: string } = {}
        for (const key of Object.keys(formData)) {
            const value = formvalues[`mother.${key}`];
            if (value) motherData[`${key}`] = `${value}`;
        }

        const parentsData = {
            father: fatherData,
            mother: motherData,
        };

        try {
            await client.patch(`students/update/${id}/`, studentData);
            setIsEditing(false);
            setError(null);
            toast.success(contents.toast3);
        } catch (error) {
            console.error("Error while saving:", error);
            toast.error(contents.toast1);
        }
        try {
            await client.patch(`students/fill/${id}/`, parentsData);
            toast.success(contents.toast4)
        } catch (error) {
            console.error("Error while saving parents data:", error);
            toast.error(contents.toast2);
        }
        window.location.reload();
    };

    const handleDelete = async () => {
        try {
            await client.delete(`students/delete/${id}/`);
            window.history.back();
        } catch {
            toast.error(contents.toast1);
        }
    };

    const handleAddNewRole = async (roleId: string, salary: number) => {
        try {
            const managerId = localStorage.getItem('id'); // Get manager ID from localStorage

            const data = {
                role: Number(roleId),
                salary: salary,
                user: userId, // from URL params
                manager: Number(managerId)
            };

            await client.post('employees/attach/', data);
            toast.success('Role added successfully');
            setIsModalAddRoleOpen(false);
            navigate(-1); //orqaga yurish
        } catch (error) {
            toast.error('An error occurred while adding the role');
        }
    };

    const openDeleteModal = () => {
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
    };

    const openAddNewRoleModal = () => {
        setIsModalAddRoleOpen(true)
    }

    const closeAddNewRoleModal = () => {
        setIsModalAddRoleOpen(false)
    }


    return (
        <div className="w-full overflow-y-hidden mt-12 md:mt-0">
            <div className="header">
                <div className="flex justify-between mx-5 my-5">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-200 py-3 px-4 hover:bg-gray-300 rounded"
                    >
                        <i className="fa-solid fa-arrow-left text-black"></i>
                    </button>
                    <h1 className="text-2xl md:text-4xl font-bold font-Sora dark:text-customText leading-[40px]">
                        {data?.gender === "M"
                                                    ? contents.student
                                                    : data?.gender === "F"
                                                        ? contents.studentka
                                                        : ""} {data.sure_name} {data.first_name} {data.last_name}
                    </h1>
                    
                    {!isEditing ? (
                        <div className=" hidden md:flex">
                            {(role !== "teacher") && (
                                <button
                                    onClick={handleEdit}
                                    className="px-4 py-3 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                                >
                                    <i className="fa fa-pen"></i>
                                </button>
                            )}
                            {/* Move to another group (desktop) */}
                            {groups.length > 0 && (
                                <div className="relative ml-2">
                                    <button
                                        ref={moveToggleRef}
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setIsMoveOpen((v) => !v); setSelectedMoveGroup(null); }}
                                        className="px-4 py-3 text-white bg-blue-500 rounded hover:bg-blue-600"
                                        title="Move to group"
                                    >
                                        <i className="fa-solid fa-right-left"></i>
                                    </button>
                                    {isMoveOpen && (
                                        <div ref={moveMenuRef} onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded shadow-lg z-10">
                                            <ul className="max-h-64 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                                {groups.map((g) => (
                                                    <li key={g.id}>
                                                        <button
                                                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white ${selectedMoveGroup === g.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                            onClick={() => setSelectedMoveGroup(g.id)}
                                                        >
                                                            {selectedMoveGroup === g.id && <i className="fa fa-check mr-2"></i>}
                                                            {g.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                                <button
                                                    disabled={!selectedMoveGroup}
                                                    type="button"
                                                    className="w-full px-3 py-2 bg-blue-500 disabled:opacity-50 text-white rounded"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (!selectedMoveGroup) return;
                                                        try {
                                                            await client.patch(`students/update/${id}/`, { groups: selectedMoveGroup });
                                                            toast.success('Student moved');
                                                            setIsMoveOpen(false);
                                                            window.location.reload();
                                                        } catch (err) {
                                                            toast.error('Failed to move student');
                                                        }
                                                    }}
                                                >
                                                    Move
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {(role === "admin" || role === "manager") && (
                                <div>
                                    <button
                                        onClick={openAddNewRoleModal} // Open modal on delete button click
                                        className="px-4 py-3 ml-2 text-white bg-green-500 rounded hover:bg-green-700"
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                    <button
                                        onClick={openDeleteModal} // Open modal on delete button click
                                        className="px-4 py-3 ml-2 text-white bg-red-500 rounded hover:bg-red-700"
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className=" hidden md:flex">
                            <button
                                onClick={handleSave}
                                className="px-4 py-3 text-white bg-green-500 rounded hover:bg-green-700"
                            >
                                <i className="fa fa-check"></i>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-3 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700"
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                    )}
                    <ConfirmDeleteModal
                        isOpen={isModalOpen}
                        onClose={closeDeleteModal}
                        onConfirm={handleDelete} // Call delete on confirm
                    />
                    <AddNewRole
                        isOpen={isModalAddRoleOpen}
                        onClose={closeAddNewRoleModal}
                        onConfirm={handleAddNewRole}
                    />
                </div>


                {!isEditing ? (
                    <div className="md:hidden mr-6 flex justify-end mb-8">
                        <button
                            onClick={handleEdit}
                            className="px-4 py-3 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                        >
                            <i className="fa fa-pen"></i>
                        </button>
                        {/* Move to another group (mobile) */}
                        {groups.length > 0 && (
                            <div className="relative">
                                <button
                                    ref={moveToggleRef}
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setIsMoveOpen((v) => !v); setSelectedMoveGroup(null); }}
                                    className="px-4 py-3 ml-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    title="Move to group"
                                >
                                    <i className="fa-solid fa-right-left"></i>
                                </button>
                                {isMoveOpen && (
                                    <div ref={moveMenuRef} onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg z-10">
                                        <ul className="max-h-64 overflow-y-auto">
                                            {groups.map((g) => (
                                                <li key={g.id}>
                                                    <button
                                                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white ${selectedMoveGroup === g.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                        onClick={() => setSelectedMoveGroup(g.id)}
                                                    >
                                                        {selectedMoveGroup === g.id && <i className="fa fa-check mr-2"></i>}
                                                        {g.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                disabled={!selectedMoveGroup}
                                                type="button"
                                                className="w-full px-3 py-2 bg-blue-500 disabled:opacity-50 text-white rounded"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (!selectedMoveGroup) return;
                                                    try {
                                                        await client.patch(`students/update/${id}/`, { groups: selectedMoveGroup });
                                                        toast.success('Student moved');
                                                        setIsMoveOpen(false);
                                                        window.location.reload();
                                                    } catch (err) {
                                                        toast.error('Failed to move student');
                                                    }
                                                }}
                                            >
                                                Move
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {(role === "admin" || role === "manager") && (
                            <button
                                onClick={openDeleteModal} // Open modal on delete button click
                                className="px-4 py-3 ml-2 text-white bg-red-500 rounded hover:bg-red-700"
                            >
                                <i className="fa fa-trash"></i>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex md:hidden justify-end mr-6  mb-8">
                        <button
                            onClick={handleSave}
                            className="px-4 py-3 text-white bg-green-500 rounded hover:bg-green-700"
                        >
                            <i className="fa fa-check"></i>
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-3 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700"
                        >
                            <i className="fa fa-times"></i>
                        </button>
                    </div>
                )}


            </div>
            {loading ? (
                <Loading/>
            ) : (
                <div className="p-6  w-full mx-auto 2xl:h-[88%] h-[80%] overflow-y-scroll gap-4 ">
                    {error && <p className="text-red-500">{error}</p>}
                    <form ref={formRef} className="md:flex justify-around  2xl:h-[88%] h-[78%] overflow-y-auto">
                        <div className="">
                            <div className="">
                                <h2 className="text-2xl font-bold mb-4  dark:text-customText ">
                                    {contents.title1}
                                </h2>
                                <div className="overflow-y-auto 2xl:max-h-[760px] lg:max-h-[530px] ">
                                    {isEditing ? (
                                        <div
                                            onSubmit={(e: FormEvent) => {
                                                e.preventDefault();
                                                handleSave();
                                            }}
                                            className="flex overflow-y-auto flex-col gap-4"
                                        >
                                            <label className="block text-gray-700 dark:text-gray-300">
                                                <strong>{contents.birth_date}</strong>
                                                <input
                                                    type="date"
                                                    name="birthday"
                                                    defaultValue={formData.birthday}
                                                    onChange={handleChange}
                                                    className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                />
                                            </label>
                                            <label className="block text-gray-700 dark:text-gray-300">
                                                <strong>{contents.email}</strong>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    defaultValue={formData.email || ""}
                                                    onChange={handleChange}
                                                    className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                />
                                            </label>
                                            <label className="block text-gray-700 dark:text-gray-300">
                                                <strong>{contents.first_name}</strong>
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    defaultValue={formData.first_name}
                                                    onChange={handleChange}
                                                    className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                />
                                            </label>
                                            <label className="block text-gray-700 dark:text-gray-300">
                                                <strong>{contents.last_name}</strong>
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    defaultValue={formData.sure_name}
                                                    onChange={handleChange}
                                                    className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                />
                                            </label>
                                            <label className="block text-gray-700 dark:text-gray-300">
                                                <strong>{contents.sure_name}</strong>
                                                <input
                                                    type="text"
                                                    name="sure_name"
                                                    defaultValue={formData.last_name}
                                                    onChange={handleChange}
                                                    className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                />
                                            </label>
                                            <label className="block text-gray-700 dark:text-gray-300">
                                                <strong>{contents.gender}</strong>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                >
                                                    <option value="">
                                                        {contents.choose_gender}
                                                    </option>
                                                    <option value="M">
                                                        {contents.male}
                                                    </option>
                                                    <option value="F">
                                                        {contents.female}
                                                    </option>
                                                </select>
                                            </label>
                                            <label className="block text-gray-700 dark:text-gray-300">
                                                <strong>{contents.passport}</strong>
                                                <input
                                                    type="text"
                                                    name="passport"
                                                    maxLength={9}
                                                    minLength={9}
                                                    defaultValue={formData.passport}
                                                    onChange={handleChange}
                                                    className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                />
                                            </label>
                                            <label className="block text-gray-700 dark:text-gray-300">
                                                <strong>{contents.phone_number}</strong>
                                                <input
                                                    type="text"
                                                    name="phone_number"
                                                    defaultValue={formData.phone_number}
                                                    onChange={handleChange}
                                                    className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                />
                                            </label>
                                            <label className="block text-gray-700 dark:text-gray-300">
                                                <strong>{contents.pinfl}</strong>
                                                <input
                                                    type="text"
                                                    name="pinfl"
                                                    maxLength={14}
                                                    minLength={14}
                                                    defaultValue={formData.pinfl}
                                                    onChange={handleChange}
                                                    className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.birth_date}</strong>: {data.birthday}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.email}</strong>: {data.email}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.first_name}</strong>:{" "}
                                                {data.first_name}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.last_name}</strong>: {data.sure_name}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.sure_name}</strong>: {data.last_name}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.gender}</strong>:{" "}
                                                {data?.gender === "M"
                                                    ? contents.male
                                                    : data?.gender === "F"
                                                        ? contents.female
                                                        : ""}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.passport}</strong>: {data.passport}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.phone_number}</strong>:{" "}
                                                {data.phone_number}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.pinfl}</strong>: {data.pinfl}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.document}:</strong>
                                                <br/>
                                                {documentsFile.map((item, index) => (
                                                    <a
                                                        target="_blank"
                                                        key={index}
                                                        href={item.document.file}
                                                    >
                                                        {item.document.file}
                                                    </a>
                                                ))}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="pt-6">
                            <h2 className="text-2xl font-bold mb-4  dark:text-customText">
                                {contents.title2}
                            </h2>
                            <div className="overflow-y-auto  2xl:max-h-[630px] lg:max-h-[530px] ">
                                {isEditing ? (
                                    <div
                                        onSubmit={(e: FormEvent) => {
                                            e.preventDefault();
                                            handleSave();
                                        }}
                                        className="flex overflow-y-auto flex-col gap-4"
                                    >
                                        <div className="md:flex gap-6">
                                            <div>
                                                <h3 className="pt-6 pb-3  dark:text-gray-300">
                                                    <strong>{contents.father_i}</strong>
                                                </h3>

                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.first_name}</strong>
                                                    <input
                                                        type="text"
                                                        name="father.first_name"
                                                        defaultValue={fatherData?.first_name}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.last_name}</strong>
                                                    <input
                                                        type="text"
                                                        name="father.sure_name"
                                                        defaultValue={fatherData?.sure_name}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.sure_name}</strong>
                                                    <input
                                                        type="text"
                                                        name="father.last_name"
                                                        defaultValue={fatherData?.last_name}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.passport}</strong>
                                                    <input
                                                        defaultValue={fatherData?.passport}
                                                        type="text"
                                                        maxLength={9}
                                                        minLength={9}
                                                        name="father.passport"
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.pinfl}</strong>
                                                    <input
                                                        type="text"
                                                        name="father.pinfl"
                                                        maxLength={14}
                                                        minLength={14}
                                                        defaultValue={fatherData?.pinfl}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.phone_number}</strong>
                                                    <input
                                                        type="text"
                                                        name="father.phone_number"
                                                        defaultValue={fatherData?.phone_number}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.email}</strong>
                                                    <input
                                                        type="email"
                                                        name="father.email"
                                                        defaultValue={fatherData?.email}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.birth_date}</strong>
                                                    <input
                                                        type="date"
                                                        name="father.birthday"
                                                        defaultValue={
                                                            fatherData?.birthday ||
                                                            new Date().toISOString().slice(0, 10)
                                                        }
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                            </div>

                                            <div>
                                                <h3 className="pt-6 pb-3  dark:text-gray-300">
                                                    <strong>{contents.mother_i}</strong>
                                                </h3>

                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.first_name}</strong>
                                                    <input
                                                        type="text"
                                                        name="mother.first_name"
                                                        defaultValue={motherData?.first_name}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.last_name}</strong>
                                                    <input
                                                        type="text"
                                                        name="mother.sure_name"
                                                        defaultValue={motherData?.sure_name}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.sure_name}</strong>
                                                    <input
                                                        type="text"
                                                        name="mother.last_name"
                                                        defaultValue={motherData?.last_name}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.passport}</strong>
                                                    <input
                                                        type="text"
                                                        name="mother.passport"
                                                        maxLength={9}
                                                        minLength={9}
                                                        defaultValue={motherData?.passport}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.pinfl}</strong>
                                                    <input
                                                        type="text"
                                                        name="mother.pinfl"
                                                        maxLength={14}
                                                        minLength={14}
                                                        defaultValue={motherData?.pinfl}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.phone_number}</strong>
                                                    <input
                                                        type="text"
                                                        name="mother.phone_number"
                                                        defaultValue={motherData?.phone_number}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.email}</strong>
                                                    <input
                                                        type="email"
                                                        name="mother.email"
                                                        defaultValue={motherData?.email}
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                                <label className="block text-gray-700 dark:text-gray-300">
                                                    <strong>{contents.birth_date}</strong>
                                                    <input
                                                        type="date"
                                                        name="mother.birthday"
                                                        defaultValue={
                                                            motherData?.birthday ||
                                                            new Date().toISOString().slice(0, 10)
                                                        }
                                                        onChange={handleChange}
                                                        className="block h-10 px-4 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="pb-3  dark:text-customText">
                                            <strong>{contents.father_i}</strong>
                                        </h3>
                                        <p className=" dark:text-customText">
                                            <strong>{contents.first_name}</strong>:{" "}
                                            {fatherData?.first_name}
                                        </p>
                                        <p className=" dark:text-customText">
                                            <strong>{contents.last_name}</strong>:{" "}
                                            {fatherData?.last_name}
                                        </p>
                                        <p className=" dark:text-customText">
                                            <strong>{contents.sure_name}</strong>:{" "}
                                            {fatherData?.sure_name}
                                        </p>
                                        <p className=" dark:text-customText">
                                            <strong>{contents.passport}</strong>:{" "}
                                            {fatherData?.passport}
                                        </p>
                                        <p className=" dark:text-customText">
                                            <strong>{contents.pinfl}</strong>: {fatherData?.pinfl}
                                        </p>
                                        <p className=" dark:text-customText">
                                            <strong>{contents.phone_number}</strong>:{" "}
                                            {fatherData?.phone_number}
                                        </p>
                                        <p className=" dark:text-customText">
                                            <strong>{contents.email}</strong>: {fatherData?.email}
                                        </p>
                                        <p className=" dark:text-customText">
                                            <strong>{contents.birth_date}</strong>:
                                            {fatherData?.birthday}
                                        </p>

                                        <div>
                                            <h3 className="pt-6 pb-3  dark:text-customText">
                                                <strong>{contents.mother_i}</strong>
                                            </h3>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.first_name}</strong>:{" "}
                                                {motherData?.first_name}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.last_name}</strong>:{" "}
                                                {motherData?.last_name}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.sure_name}</strong>:{" "}
                                                {motherData?.sure_name}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.passport}</strong>:{" "}
                                                {motherData?.passport}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.pinfl}</strong>: {motherData?.pinfl}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.phone_number}</strong>:{" "}
                                                {motherData?.phone_number}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.email}</strong>: {motherData?.email}
                                            </p>
                                            <p className=" dark:text-customText">
                                                <strong>{contents.birth_date}</strong>:{" "}
                                                {motherData?.birthday}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default DebtorsPageUsers;
