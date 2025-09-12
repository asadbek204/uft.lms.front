import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import client from "../../../../../components/services";
import { Langs } from '../../../../../enums';
import { GlobalContext } from '../../../../../App';
import Loading from '../../../../../components/LoadingComponent/Loading';
import VideoComponent from "../../../../../components/VideoComponent/VideoComponent.tsx";
import { toast } from "react-toastify";


type TTopicsComponentContent = {
    text: string;
    topics: string;
    download: string;
    nohomework: string;
    request: string;
    requestToTeacher:string;
};

const contentsMap = new Map<Langs, TTopicsComponentContent>([
    [Langs.UZ, {
        text: "O'rganish uchun qoshimcha malumotlar:",
        topics: "Mavzu",
        download: "Yuklab olish",
        nohomework: "Uyga vazifa berilmagan.",
        request: "Davomat uchun so'rov",
        requestToTeacher: "O'qituvchiga davomat uchun so'rov yuborildi!"
    }],
    [Langs.RU, {
        text: "Дополнительная информация для изучения:",
        topics: "Тема",
        download: "Скачать",
        nohomework: "Домашнее задание не задано.",
        request: "Запрос на участие",
        requestToTeacher: "Запрос на посещение отправлен преподавателю!"
    }],
    [Langs.EN, {
        text: "Additional information to study:",
        topics: "Topic",
        download: "Download",
        nohomework: "No homework assigned.",
        request: "Request for attendance",
        requestToTeacher: "Attendance request sent to teacher!"
    }]
]);

type THomework = {
    id: number;
    file: string;
    description: string | null;
    path: string | null;
    main: string | null;
};

type TCourseDetail = {
    id: number;
    group: {
        id: number;
        name: string;
        schedule: {
            id: number;
            day: string;
            starts_at: string;
            ends_at: string;
        }[];
        status: boolean;
    };
    date: string;
    unit: string;
    homework: THomework | null;
    exam: string | null;
    source: {
        id: number;
        file: string;
        description: string;
        path: string | null;
        main: string | null;
    }[];
    video: {
        id: number;
        file: string;
        description: string | null;
        path: string | null;
        main: string | null;
    } | null;
};

const defaultData: TCourseDetail = {
    id: 0,
    group: {
        id: 0,
        name: "",
        schedule: [],
        status: false,
    },
    date: "",
    unit: "",
    homework: null,
    exam: null,
    source: [],
    video: null,
};

const TopicDetailPage: React.FC = () => {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TTopicsComponentContent;
    const { courseId } = useParams<{ courseId: string }>();
    const [courseDetail, setCourseDetail] = useState<TCourseDetail>(defaultData);

    useEffect(() => {
        (async () => {
            try {
                const response = await client.get(`education/lessons/${courseId}/`);
                setCourseDetail(response.data as TCourseDetail);
            } catch (error) {
                console.error("Failed to fetch course details", error);
            }
        })();
    }, [courseId]);

    if (!courseDetail) {
        return <div><Loading /></div>;
    }


    const handleAttendanceRequest = () => {
        toast.success(contents.requestToTeacher);
      };

    return (
        <div className="w-full">
            <div className="mx-5 my-5 mb-5 justify-between items-center text-center flex gap-2">
                <button onClick={() => window.history.back()}
                    className='w-12 h-12 my-3 ms-5 bg-gray-200 hover:bg-gray-300 rounded'>
                    <i className='fa-solid fa-arrow-left text-black'></i>
                </button>
                <div className="flex gap-4 2xl:text-4xl text-3xl font-bold dark:text-customText">
                    <h1 className="text-4xl">{contents.topics}: <b>{courseDetail.unit}</b></h1>
                </div>
                <button onClick={handleAttendanceRequest} className='bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600 transition duration-200'>
                      {contents.request}
                </button>
            </div>

            <div className="2xl:h-[88%] h-[87%] h-[460px] mx-10 overflow-y-auto">
                {courseDetail.video?.file ? (
                    <div className="w-7/12 h-[485px] mx-auto">
                        <VideoComponent videoData={courseDetail.video.file} videoClass="rounded-xl"/>
                    </div>
                ) : (
                    <p className="text-2xl text-center">{contents.nohomework}</p>
                )}

                {courseDetail.homework && (
                    <div className="text-center">
                        <a href={courseDetail.homework.file} target="_blank" download rel="noopener noreferrer">
                            <button className="bg-blue-400 mt-4 py-4 px-3 rounded">
                                {contents.download}
                            </button>
                        </a>
                    </div>
                )}

                <div className="mt-10 mb-3">
                    <h1 className="text-2xl">{contents.text}</h1>
                    {courseDetail.source.map((item) => (
                        <div key={item.id}>
                            <h1>{item.description}</h1>
                            <a className="text-blue-500" href={item.file} target="_blank" rel="noopener noreferrer">{item.file}</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TopicDetailPage;
