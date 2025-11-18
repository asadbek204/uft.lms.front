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
                {/* <button onClick={handleAttendanceRequest} className='bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600 transition duration-200'>
                      {contents.request}
                </button> */}
                <span></span>
            </div>

          <div className="2xl:h-[88%] h-[75%] px-4 md:px-10 py-4 overflow-hidden">
  <div className="h-full overflow-y-auto space-y-8 pb-10">

    {/* Video Section */}
    {courseDetail.video?.file ? (
      <div className="flex justify-center">
        <div className="w-full md:w-9/12 lg:w-7/12">
          <VideoComponent
            videoData={courseDetail.video.file}
            videoClass="rounded-xl w-full max-h-[420px] md:max-h-[500px] object-contain"
          />
        </div>
      </div>
    ) : (
      <p className="text-2xl text-center">{contents.nohomework}</p>
    )}

    {/* Additional Info */}
    <div className="mt-4">
      <h1 className="text-2xl mb-4">{contents.text}</h1>

      <div className="space-y-3">
        {courseDetail.source.map((item) => (
          <div key={item.id} className="border-b pb-2">
            <p>{item.description}</p>
            <a
              className="text-blue-500 break-all hover:underline"
              href={item.file}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.file}
            </a>
          </div>
        ))}
      </div>
    </div>

  </div>
</div>

        </div>
    );
}

export default TopicDetailPage;
