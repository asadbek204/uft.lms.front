import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from "../../App.tsx";
import { Langs } from "../../enums.ts";
import client from "../../components/services";
import { toast } from "react-toastify";
import ConfirmDeleteModal from './ConfirmDeleteModal.tsx';

type TTopicsComponentContent = {
    title: string,
    text: string,
    filePlaceholder: string,
    errorSelectFile: string,
    errorFile: string,
    successMessage: string,
    chooseFile: string,
    noFileChosen: string,
    save: string,
    toast1: string
    toast2: string
};

const contentsMap = new Map<Langs, TTopicsComponentContent>(
    [
        [Langs.UZ, {
            title: "O'quv rejasi",
            text: "Siz tanlagan dars dasturini to'liq yuklab olishingiz mumkin",
            filePlaceholder: "Faylni tanlang",
            errorSelectFile: "Iltimos file tanlang",
            errorFile: "File tanlashda xatolik yuz berdi",
            successMessage: "Ma'lumot muvaffaqqiyatli yuborildi",
            chooseFile: "Faylni tanlang",
            noFileChosen: "Fayl tanlanmagan",
            save: "Saqlash",
            toast1: "Kurs muvaffaqiyatli o'chirildi",
            toast2: "O'chirishda xato yuz berdi"

        }],
        [Langs.RU, {
            title: "Учебный план",
            text: "Вы можете скачать полную программу по вашему выбору",
            filePlaceholder: "Выберите файл",
            errorSelectFile: "Пожалуйста, выберите файл",
            errorFile: "Произошла ошибка при выборе файла",
            successMessage: "Информация успешно отправлена",
            chooseFile: "Выберите файл",
            noFileChosen: "Файл не выбран",
            save: "Сохранять",
            toast1: "Курс успешно удален",
            toast2: "При удалении произошла ошибка"
        }],
        [Langs.EN, {
            title: "Curriculum",
            text: "You can download the complete syllabus of your choice",
            filePlaceholder: "Select file",
            errorSelectFile: "Please select a file",
            errorFile: "An error occurred while selecting the file",
            successMessage: "Information successfully submitted",
            chooseFile: "Choose file",
            noFileChosen: "No file chosen",
            save: "Save",
            toast1: "Course deleted successfully",
            toast2: "An error occurred during deletion"
        }]
    ]
);

type TSyllabus = {
    id: number,
    file: string | null,
    description: string,
    path: string,
    main: unknown // Replace `any` with `unknown` or a more specific type if known
};

type TCourses = {
    id: number,
    name: string,
    syllabus: TSyllabus
};

function TCHTopicsPage() {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TTopicsComponentContent;
    const [courses, setCourses] = useState<TCourses[]>([]);
    const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
    const [newFileInput, setNewFileInput] = useState<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [upToDate, setUpToDate] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await client.get('education/course/list/');
                console.log(response)
                setCourses(response.data as TCourses[]);
            } catch (error) {
                toast.error(contents.errorFile);
            }
        })();
    }, [upToDate]);

    const handlePenClick = (id: number) => {
        // Toggle the editing state
        setEditingCourseId(prevId => (prevId === id ? null : id));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setNewFileInput(event.target);
            setFileName(event.target.files[0].name);
        }
    };





    const deleteCourses = (id: number) => {
        setCourses(courses.filter(course => course.id !== id));
    };


    const handleFileSubmit = (id: number) => {
        (async () => {
            const formData = new FormData();
            if (!newFileInput?.files) {
                toast.error(contents.errorSelectFile);
            } else {
                formData.append("syllabus_file", newFileInput.files[0]);
                try {
                    await client.patch(`education/course/update/${id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                    toast.success(contents.successMessage);
                    setUpToDate(prev => !prev);
                } catch (err) {
                    toast.error(contents.errorFile);
                }
            }
            setEditingCourseId(null);
            setNewFileInput(null);
            setFileName('');
        })();
    };

    return (
        <div className="w-full overflow-hidden mt-12 md:mt-0">
            <div className="mx-5 my-5 w-full text-center flex flex-col gap-2">
                <h1 className="2xl:text-4xl text-3xl font-bold  dark:text-customText">
                    {contents.title}
                </h1>
                <h3 className='text-gray-500 pr-5 text-center pb-8'>
                    {contents.text}
                </h3>
            </div>
            <div className='2xl:h-[88%] h-[70%] overflow-y-scroll'>
            {courses.map((content, index) => (
                <div key={index}
                style={{boxShadow: "1px 5px 6px rgba(0, 0, 0, 0.15"}} className="w-5/6 flex flex-col mx-auto mb-5 rounded-md  bg-white dark:bg-gray-700">
                    <div className="flex justify-between ">
                        <a target="_blank" href={content.syllabus.file || '#'} rel="noopener noreferrer">
                            <h1 className="block uppercase text-xl cursor-pointer border-gray-300 p-4 dark:text-white hover:text-blue-400 dark:hover:text-blue-400">
                                {content.name}
                            </h1>
                        </a>
                        <div className="flex items-center">
                            <button
                                className={`2xl:m-4 m-2 me-0 ${editingCourseId === content.id ? "bg-red-600": "bg-yellow-500"} w-[30px] h-[30px] dark:text-gray-200 text-white rounded-md`}
                                onClick={() => handlePenClick(content.id)}
                            >
                                <i className={`fa-solid ${editingCourseId === content.id ? "fa-close" : 'fa-pen'}`} />
                            </button>
                            <ConfirmDeleteModal
                                content={content.id}
                                onDelete={deleteCourses}
                            />
                        </div>
                    </div>
                    {editingCourseId === content.id && (
                        <div className="py-2 mt-3 px-3 bg-white rounded flex flex-col items-center dark:bg-slate-800">
                            <div className="mt-2 flex items-center gap-3 justify-between">
                                <label className="py-2 px-4 bg-gray-200 rounded cursor-pointer text-gray-800 hover:bg-gray-300 border border-slate-400 flex items-center">
                                    {contents.chooseFile}
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-gray-600 dark:text-white">{fileName || contents.noFileChosen}</span>
                            </div>
                            <button
                                onClick={() => handleFileSubmit(content.id)}
                                className="ml-3 bg-blue-500 text-white mt-3 p-2 rounded-md"
                            >
                                {contents.save}
                            </button>
                        </div>
                    )}
                </div>
            ))}
            </div>
        </div>
    );
}

export default TCHTopicsPage;
