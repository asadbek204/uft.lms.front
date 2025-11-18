import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from "../../../../App.tsx";
import { Langs } from "../../../../enums.ts";
import client from "../../../../components/services";
import { useParams, Link } from "react-router-dom";
import dayjs from 'dayjs';
import 'dayjs/locale/uz';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';

type TTopicsComponentContent = {
    title: string;
    text: string;
    topics: string;
    date: string;
    homework: string;
    download: string;
};

const contentsMap = new Map<Langs, TTopicsComponentContent>([
    [Langs.UZ, {
        title: "O'quv rejasi",
        text: "Siz tanlagan dars dasturini to'liq yuklab olishingiz mumkin",
        topics: "Mavzu",
        date: "Sana",
        homework: "Uy ishi",
        download: "Yuklab olish"
    }],
    [Langs.RU, {
        title: "Учебный план",
        text: "Вы можете скачать полную программу по вашему выбору",
        topics: "Тема",
        date: "Дата",
        homework: "Домашнее задание",
        download: "Скачать"
    }],
    [Langs.EN, {
        title: "Curriculum",
        text: "You can download the complete syllabus of your choice",
        topics: "Topic",
        date: "Date",
        homework: "Homework",
        download: "Download"
    }]
]);

type TCourses = {
    id: number;
    date: string;
    name: string;
    unit: string;
    download: string;
};

const STTopicsItem: React.FC = () => {
    const { id, moduleId } = useParams<{ id: string, moduleId: string }>();
    const { lang, userId } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TTopicsComponentContent;
    const [courses, setCourses] = useState<TCourses[]>([]);

    useEffect(() => {
        switch (lang) {
            case Langs.UZ:
                dayjs.locale('uz');
                break;
            case Langs.RU:
                dayjs.locale('ru');
                break;
            default:
                dayjs.locale('en');
                break;
        }
    }, [lang]);

    useEffect(() => {
        (async () => {
            try {
                const response = await client.get(`education/video/${id}/${moduleId}/`);
                console.log(response)
                setCourses(response.data as TCourses[]);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
        })();
    }, [userId]);

    const formatDate = (date: string) => {
        return dayjs(date).format('DD.MM.YYYY');
    };

    return (
        <div className="w-full mt-12 md:mt-0">
            <div className="mx-5 my-5 mb-0 justify-between items-center text-center flex gap-2">
                <button onClick={() => window.history.back()}
                        className='w-12 h-12 my-3 ms-5 bg-gray-200 hover:bg-gray-300 rounded'>
                    <i className='fa-solid fa-arrow-left text-black'></i>
                </button>
                <h1 className="2xl:text-4xl text-xl font-bold  dark:text-customText">
                    {contents.title}
                </h1>
                <button onClick={() => window.history.forward()}
                        className='w-12 invisible h-12 my-3 ms-5 bg-gray-200 hover:bg-gray-300 rounded'>
                    <i className='fa-solid fa-arrow-right text-black'></i>
                </button>
            </div>
            <div>
                <h3 className='text-gray-500 text-sm md:text-xl text-center pb-8'>
                    {contents.text}
                </h3>
            </div>
           <div className="2xl:h-[82%] h-[65%]  overflow-y-auto">
           <table className="bg-white w-11/12 mx-auto table-fixed border-collapse border border-slate-500">
                <thead className="border">
                <tr>
                    <th className="border  border-slate-200 p-2">{contents.topics}</th>
                    <th className="border  border-slate-200 p-2">{contents.date}</th>
                    {/* <th className="border  border-slate-200 p-2">{contents.homework}</th> */}
                </tr>
                </thead>
                <tbody className="border">
                {courses.map((course) => (
                    <tr key={course.id} className="w-full drop-shadow-lg bg-white dark:bg-gray-700">
                        <td className="border text-center border-slate-200 p-2 hover:text-blue-400">
                            <Link to={`/topics/lesson/${course.id}`} className="cursor-pointer p-4">
                                {course.unit}
                            </Link>
                        </td>
                        <td className="border text-center border-slate-200 p-2">
                            {formatDate(course.date)}
                        </td>
                        {/* <td className="border text-center border-slate-200 p-2">
                            {contents.download}:{course.download}
                        </td> */}
                    </tr>
                ))}
                </tbody>
            </table>
           </div>
        </div>
    );
}

export default STTopicsItem;
