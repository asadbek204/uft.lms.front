import React, { useEffect, useState, useContext } from 'react';
import {  useParams } from 'react-router-dom';
import client from "../../../../components/services";
import { Langs } from '../../../../enums';
import { GlobalContext } from '../../../../App';
import Loading from '../../../../components/LoadingComponent/Loading';
import Modal from "./Modal.tsx";
import dayjs from 'dayjs';

// Uyga vazifa uchun tip
type THomework = {
    id: number;
    file: string;
    description: string | null;
    path: string | null;
    main: string | null;
}

// Kurs tafsilotlari uchun tip
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
    };
};

// Har bir til uchun kontentni belgilash
type TTopicsComponentContent = {
    title: string;
    loading: string;
    noHomework: string;
    downloadHomework: string;
    additionalInfo: string;
    fetchError: string;
    fetchErrorMessage: string;
}

const contentsMap = new Map<Langs, TTopicsComponentContent>([
    [Langs.UZ, {
        title: "Mavzu",
        loading: "Yuklanmoqda...",
        noHomework: "Uyga vazifa berilmagan.",
        downloadHomework: "Uyga vazifani yuklab olish",
        additionalInfo: "O'rganish uchun qo'shimcha ma'lumotlar",
        fetchError: "Kurs tafsilotlarini olishda xatolik yuz berdi",
        fetchErrorMessage: "Kurs tafsilotlarini olishda xatolik yuz berdi",
    }],
    [Langs.RU, {
        title: "Тема",
        loading: "Загрузка...",
        noHomework: "Домашнее задание не задано.",
        downloadHomework: "Скачать домашнее задание",
        additionalInfo: "Дополнительная информация для изучения",
        fetchError: "Ошибка при получении деталей курса",
        fetchErrorMessage: "Произошла ошибка при получении деталей курса",
    }],
    [Langs.EN, {
        title: "Topic",
        loading: "Loading...",
        noHomework: "No homework assigned.",
        downloadHomework: "Download homework",
        additionalInfo: "Additional information for learning",
        fetchError: "Failed to fetch course details",
        fetchErrorMessage: "An error occurred while fetching course details",
    }]
]);

const TopicDetailPage: React.FC = () => {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TTopicsComponentContent;
    const { id, moduleId } = useParams<{ id: string, moduleId: string }>();
    const [courseDetail, setCourseDetail] = useState<TCourseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await client.get(`education/lessons/${id}/`);
                setCourseDetail(response.data as TCourseDetail);
            } catch (error) {
                console.error(contents.fetchErrorMessage, error);
            } finally {
                setLoading(false);
            }
        })();
    }, [moduleId, isModalVisible]);

    if (loading) {
        return <Loading />;
    }

    if (!courseDetail) {
        return <p>{contents.fetchError}</p>;
    }

    

    return (
        <div className="w-full mt-12 md:mt-0">
            <div className="mx-5 my-5 mb-5 justify-between items-center text-center flex gap-2">
                <button onClick={() => window.history.back()}
                        className='w-12 h-12 my-3 ms-5 bg-gray-200 hover:bg-gray-300 rounded'>
                    <i className='fa-solid fa-arrow-left text-black'></i>
                </button>
                <div className="flex gap-4 2xl:text-4xl text-3xl font-bold dark:text-customText">
                    <h1 className="text-3xl">{contents.title}: <>{courseDetail.unit}</></h1>
                </div>
               <div>
               
               
               <button
                    onClick={openModal}
                    className='w-12  h-12 my-3 ms-5 bg-yellow-500 hover:bg-gray-300 rounded'>
                    <i className='fa-solid fa-pen text-black'></i>
                </button>
               </div>
            </div>

           <div className=" 2xl:h-[88%] h-[75%]  px-4 md:px-10 py-4 overflow-hidden">
  <div className="h-full overflow-y-auto space-y-6 pb-10">

    {/* Homework description */}
    {courseDetail.homework?.description && (
      <p className="text-base md:text-lg dark:text-customText leading-relaxed">
        {courseDetail.homework.description}
      </p>
    )}

    {/* Video section */}
    {courseDetail.homework ? (
      <div className="flex justify-center">
        <div className="w-full md:w-9/12 lg:w-7/12">
          <video
            className="rounded-xl w-full max-h-[420px] md:max-h-[500px] object-contain"
            controls
            preload="auto"
            src={courseDetail.video.file}
          ></video>
        </div>
      </div>
    ) : (
      <p className="text-2xl dark:text-customText">{contents.noHomework}</p>
    )}

    {/* Additional information */}
    <div className="mt-4">
      <h1 className="text-2xl font-semibold dark:text-customText mb-3">
        {contents.additionalInfo}
      </h1>

      <div className="space-y-3">
        {courseDetail.source?.map((item) => (
          <div key={item.id} className="border-b pb-2">
            <p className="dark:text-customText">{item.description}</p>
            <a
              href={item.file}
              target="_blank"
              className="text-blue-500 break-all hover:underline"
            >
              {item.file}
            </a>
          </div>
        ))}
      </div>
    </div>

    <Modal isVisible={isModalVisible} onClose={closeModal} />

  </div>
</div>

        </div>
    );
}

export default TopicDetailPage;
