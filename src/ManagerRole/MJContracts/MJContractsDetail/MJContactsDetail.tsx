import Loading from "../../../components/LoadingComponent/Loading.tsx";
import {useEffect, useState, useContext, ChangeEvent, FormEvent} from "react";
import {GlobalContext} from "../../../App";
import {Langs} from "../../../enums";
import client from "../../../components/services";
import {useParams} from "react-router-dom";

// Define types for student data
interface StudentData {
    birthday: string;
    email: string;
    first_name: string;
    gender: string;
    last_name: string;
    passport: string;
    phone_number: string;
    pinfl: string;
    sure_name: string;

}

const defaultStudent = {
    birthday: '',
    email: '',
    first_name: '',
    gender: '',
    last_name: '',
    passport: '',
    phone_number: '',
    pinfl: '',
    sure_name: '',
}

interface TNewsComponentContent {
    title1: string;
    title2: string;
    title3: string;
    birth_date: string;
    email: string
    first_name: string;
    gender: string;
    last_name: string,
    passport: string,
    phone_number: string,
    pinfl: string,
    sure_name: string,
    student: string,
    male: string,
    female: string,
    fetch_error: string,
    save_error: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [
        Langs.UZ,
        {
            title1: "Shaxsiy ma'lumotlar",
            title2: "Saqlash",
            title3: "Qaytarish",
            birth_date: "Tug'ilgan sana",
            email: "Elektron pochta",
            first_name: "Ism",
            gender: "Jins",
            last_name: "Familiya",
            passport: "Pasport",
            phone_number: "Telefon raqami",
            pinfl: "PINFL",
            sure_name: "Otasining ismi",
            student: "O'quvchi",
            male: "Erkak",
            female: "Ayol",
            fetch_error: "Talaba ma'lumotlarini olishda xato",
            save_error: "Talaba ma'lumotlarini saqlashda xato",
        },
    ],
    [
        Langs.RU,
        {
            title1: "Личные данные",
            title2: "Сохранить",
            title3: "Отмена",
            birth_date: "Дата рождения",
            email: "Электронная почта",
            first_name: "Имя",
            gender: "Пол",
            last_name: "Фамилия",
            passport: "Паспорт",
            phone_number: "Номер телефона",
            pinfl: "ПИНФЛ",
            sure_name: "Отчество",
            student: "Ученик(ца)",
            male: "Мужской",
            female: "Женский",
            fetch_error: "Ошибка при получении данных студента",
            save_error: "Ошибка при сохранении данных студента",
        },
    ],
    [
        Langs.EN,
        {
            title1: "Personal Information",
            title2: "Save",
            title3: "Cancel",
            birth_date: "Birth Date",
            email: "Email",
            first_name: "First Name",
            gender: "Gender",
            last_name: "Last Name",
            passport: "Passport",
            phone_number: "Phone Number",
            pinfl: "PINFL",
            sure_name: "Sure Name",
            student: "Student",
            male: "Male",
            female: "Female",
            fetch_error: "Failed to fetch student data",
            save_error: "Failed to save student data",
        },
    ],
]);

function StudentDetailPage() {
    const {id} = useParams<{ id: string }>();
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<StudentData>(defaultStudent);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<StudentData>(defaultStudent);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            console.error('ID is missing');
            return;
        }

        setLoading(true);
        (async () => {
            try {
                const response = await client.get(`students/retrive/${id}/`);
                setData(response.data.user);
                setFormData(response.data.user);
            } catch (error) {
                setError(contents.fetch_error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id, contents.fetch_error]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(data);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!formData) return;

        try {
            await client.patch(`students/update/${id}/`, formData);
            setData(formData);
            setIsEditing(false);
            setError(null); // Clear any previous error
        } catch {
            setError(contents.save_error); // Use translated error message
        }
    };

    return (
        <div className="w-full">
            <div className="header">
                <div className="flex justify-between mx-5 my-5">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-200 py-3 px-4 hover:bg-gray-300 rounded"
                    >
                        <i className="fa-solid fa-arrow-left text-black"></i>
                    </button>
                    <h1 className="text-4xl font-bold  dark:text-customText leading-[40px]">
                        {contents.student} {data.first_name} {data.last_name}
                    </h1>
                    {!isEditing ? (
                        <div className="flex">
                            <button
                                onClick={handleEdit}
                                className="px-4 py-3 text-white bg-blue-400 rounded hover:bg-blue-700"
                            >
                                <i className="fa fa-pen"></i>
                            </button>
                            <button
                                // onClick={handleDelete}
                                className="px-4 py-3 ml-2 text-white bg-red-500 rounded hover:bg-red-700"
                            >
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>
                    ) : (
                        <div className="flex">
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
            </div>
            {loading ? (
                <Loading/>
            ) : (
                <div className="p-6 flex w-11/12 mx-auto flex-col gap-4">
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-4">{contents.title1}</h2>
                            <div className="2xl:max-h-[630px] lg:max-h-[530px] overflow-y-auto">
                                {isEditing ? (
                                    <form onSubmit={(e: FormEvent) => {
                                        e.preventDefault();
                                        handleSave();
                                    }} className="flex flex-col gap-4">
                                        <label>
                                            <strong>{contents.birth_date}</strong>
                                            <input
                                                type="date"
                                                name="birthday"
                                                value={formData.birthday}
                                                onChange={handleChange}
                                                className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
                                            />
                                        </label>
                                        <label>
                                            <strong>{contents.email}</strong>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email || ''}
                                                onChange={handleChange}
                                                className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
                                            />
                                        </label>
                                        <label>
                                            <strong>{contents.first_name}</strong>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
                                            />
                                        </label>
                                        <label>
                                            <strong>{contents.gender}</strong>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="block h-10 px-4 bg-white w-full mt-1 border border-gray-300 rounded"
                                            >
                                                <option value="M">{contents.male}</option>
                                                <option value="F">{contents.female}</option>
                                            </select>
                                        </label>
                                        <label>
                                            <strong>{contents.passport}</strong>
                                            <input
                                                type="text"
                                                name="passport"
                                                value={formData.passport}
                                                onChange={handleChange}
                                                className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
                                            />
                                        </label>
                                        <label>
                                            <strong>{contents.phone_number}</strong>
                                            <input
                                                type="text"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
                                            />
                                        </label>
                                        <label>
                                            <strong>{contents.pinfl}</strong>
                                            <input
                                                type="text"
                                                name="pinfl"
                                                value={formData.pinfl}
                                                onChange={handleChange}
                                                className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
                                            />
                                        </label>
                                        <label>
                                            <strong>{contents.sure_name}</strong>
                                            <input
                                                type="text"
                                                name="sure_name"
                                                value={formData.sure_name}
                                                onChange={handleChange}
                                                className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
                                            />
                                        </label>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-700"
                                            >
                                                {contents.title3}
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
                                            >
                                                {contents.title2}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div>
                                        <p><strong>{contents.birth_date}</strong>: {data.birthday}</p>
                                        <p><strong>{contents.email}</strong>: {data.email}</p>
                                        <p><strong>{contents.first_name}</strong>: {data.first_name}</p>
                                        <p>
                                            <strong>{contents.gender}</strong>: {data.gender === 'M' ? contents.male : data.gender === 'F' ? contents.female : ''}
                                        </p>
                                        <p><strong>{contents.passport}</strong>: {data.passport}</p>
                                        <p><strong>{contents.phone_number}</strong>: {data.phone_number}</p>
                                        <p><strong>{contents.pinfl}</strong>: {data.pinfl}</p>
                                        <p><strong>{contents.sure_name}</strong>: {data.sure_name}</p>
                                        {/* <p><strong>{contents.sure_name}</strong>: {data.sure_name}</p> */}

                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentDetailPage;

