import React, {useEffect, useState, useContext} from 'react';
import calendarIcon from '../../../../images/Calendar.svg';
import Loading from '../../../../components/LoadingComponent/Loading';
import {GlobalContext} from "../../../../App";
import {Langs} from "../../../../enums";
import client from "../../../../components/services";
import {useParams} from "react-router-dom";

interface STVideo {
    date: string;
    id: number;
    file: string;
    unit: string;
    module: {
        name: string;
    };
    video: {
        description: string;
    };
}

type TNewsComponentContent = {
    title: string;
    modul: string;
    description: string;
    novedeos: string;
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        title: "Guruh videolari",
        modul: "Modul",
        description: "Tavsif",
        novedeos: "Videolar topilmadi"
    }],
    [Langs.RU, {
        title: "Групповые видео",
        modul: "Модуль",
        description: "Описание",
        novedeos: "Видео не найдено"
    }],
    [Langs.EN, {
        title: "Group videos",
        modul: "Module",
        description: "Description",
        novedeos: "No videos found"
    }],
]);

interface VideoApiResponse {
    id: number;
    date: string;
    unit: string;
    video: {
        file: string;
        description: string;
    };
    module: {
        name: string;
    };
}

const STVideoListItems: React.FC = () => {
    const { courseId, id } = useParams();
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;

    const [videos, setVideos] = useState<STVideo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await client.get<VideoApiResponse[]>(`education/video/${id}/${courseId}/`);
                const fetchedVideos = response.data;

                const mappedVideos = fetchedVideos.map((video) => ({
                    id: video.id,
                    date: video.date,

                    file: video.video?.file ||
                        "https://www.shutterstock.com/shutterstock/videos/3573578167/preview/stock-footage-no-video-camera-recording-icon-sign-animated-on-a-black-background.mp4",

                    unit: video.unit || "",

                    module: {
                        name: video.module?.name || "",
                    },
                    video: {
                        description: video.video?.description || "",
                    },
                }));

                setVideos(mappedVideos as STVideo[]);
            } catch (error) {
                console.error("Failed to fetch course details", error);
                setVideos([]);
            }
            setLoading(false);
        })();
    }, [courseId, id]);

    return (
        <div className="w-full mt-12 md:mt-0">
            <div className="header">
                <div className="m-5 flex justify-between items-center">
                    <button onClick={() => window.history.back()}
                            className="w-12 h-12 my-3 bg-gray-200 hover:bg-gray-300 rounded">
                        <i className="fa-solid fa-arrow-left text-black"></i>
                    </button>

                    <h1 className="2xl:text-4xl text-xl font-bold dark:text-customText">{contents.title}</h1>
                    <div></div>
                </div>
            </div>

            <div className="w-full 2xl:h-[88%] h-[75%] overflow-y-auto">

                {loading ? (
                    <Loading />
                ) : (
                    <div className="courses pb-12 pt-6 flex flex-col gap-5 justify-center items-center">
                        {videos.length === 0 ? (
                            <p className="text-center text-xl text-gray-600 dark:text-gray-400">
                                {contents.novedeos}
                            </p>
                        ) : (
                            videos.map((video) => (
                                <div
                                    key={video.id}
                                    className="flex p-8 md:p-0 flex-col md:flex-row w-full md:w-11/12 2xl:w-4/6 mx-auto drop-shadow-xl"
                                >
                                    <div className="w-full md:w-80 flex-shrink-0">
                                        <video className="w-full h-full xl:rounded-s-2xl object-cover" controls>
                                            <source src={video.file} type="video/mp4" />
                                        </video>
                                    </div>

                                    <div
                                        className="flex flex-col justify-between w-full px-5 py-5 md:py-0 bg-white dark:bg-gray-700 hover:bg-gray-200 transition ease duration-700 xl:rounded-r-2xl"
                                    >
                                        <div>
                                            <h1 className="main-text text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl dark:text-white">
                                                {video.unit}
                                            </h1>

                                            <div className="flex items-center gap-2 mt-2">
                                                <img className="w-4 h-4 filter dark:invert"
                                                     src={calendarIcon} alt="Calendar Icon" />

                                                <h1 className="text-sm sm:text-base lg:text-lg dark:text-white">
                                                    {new Date(video.date).toLocaleDateString()}
                                                </h1>
                                            </div>

                                            <p className="text-sm sm:text-lg md:mt-4 mt-2 dark:text-white">
                                                {contents.modul}: {video.module.name}
                                            </p>

                                            <p className="text-sm sm:text-lg dark:text-white">
                                                {contents.description}: {video.video.description || video.unit}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default STVideoListItems;
