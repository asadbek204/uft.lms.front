import React, {useEffect, useState} from 'react';
import calendarIcon from '../../../../images/Calendar.svg';
import Loading from '../../../../components/LoadingComponent/Loading';
import {GlobalContext} from "../../../../App";
import {Langs} from "../../../../enums";
import {useContext} from "react";
import {useParams} from "react-router-dom";
import client from "../../../../components/services";
import {toast} from "react-toastify";
import VideoComponent from "../../../../components/VideoComponent/VideoComponent.tsx";

interface Video {
    id: number;
    video_url: string;
    lesson_name: string;
    created_at: string;
    module: string;
    group: number;
}

type TNewsComponentContent = {
    title: string;
    noVideos: string;
    errorFetching: string;
    moduleLabel: string;
    novedeos: string
};

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        title: "Guruh videolari",
        noVideos: "Videolar topilmadi",
        errorFetching: "Videolarni olishda xatolik",
        moduleLabel: "Modul",
        novedeos: "Videolar topilmadi"

    }],
    [Langs.RU, {
        title: "Групповые видео",
        noVideos: "Видео не найдены",
        errorFetching: "Ошибка при получении видео",
        moduleLabel: "Модуль",
        novedeos: "Видео не найдено"

    }],
    [Langs.EN, {
        title: "Group videos",
        noVideos: "No videos found",
        errorFetching: "Error fetching videos",
        moduleLabel: "Module",
        novedeos: "No videos found"

    }],
]);

const VideoListItems: React.FC = () => {
    const {groupId, id} = useParams();
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await client.get(`education/video/${groupId}/${id}/`);
                if (!(response.data instanceof Array)) return;
                const data: Video[] = response.data.map((lesson) => ({
                    id: lesson.id,
                    video_url: lesson.video?.file || "https://www.shutterstock.com/shutterstock/videos/3573578167/preview/stock-footage-no-video-camera-recording-icon-sign-animated-on-a-black-background.mp4",
                    lesson_name: lesson.unit,
                    created_at: lesson.date,
                    module: lesson.module.name,
                    group: lesson.group.id,
                }));
                setVideos(data);
                console.log(data)
            } catch (error) {
                toast.error(contents.errorFetching);
            } finally {
                setLoading(false);
            }
        })();
    }, [groupId, id, contents.errorFetching]);

    return (
        <div className="w-full  mt-12 md:mt-0">
            <div className="header">
                <div className="m-5 mb-2 flex justify-between items-center">
                    <button onClick={() => window.history.back()}
                            className="w-12 h-12 my-3 bg-gray-200 hover:bg-gray-300 rounded">
                        <i className="fa-solid fa-arrow-left text-black"></i>
                    </button>
                    <h1 className="2xl:text-4xl text-3xl font-bold  dark:text-customText">{contents.title}</h1>
                    <div>
                        {/* <button className="px-4 py-3 text-white bg-blue-400 rounded hover:bg-blue-700" onClick={() => setIsModalVisible(true)}>
              <i className="fa-solid fa-plus" />
            </button> */}
                    </div>
                </div>
            </div>

            <div className={`modal-background ${isModalVisible ? 'active' : ''}`}
                 onClick={() => setIsModalVisible(false)}></div>


            <div className="w-full 2xl:h-[88%] h-[87%] overflow-y-auto">
  {loading ? (
    <Loading />
  ) : (
    <div className="courses pb-12 pt-6 flex flex-col gap-5 justify-center items-center content-center">
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
            <VideoComponent
              videoData={video.video_url}
              videoClass="w-full md:w-80 h-full xl:rounded-s-2xl"
            />
            <div className="flex p-5 md:p-0 flex-col md:flex-row justify-between w-full md:ps-5 py-5 xl:rounded-r-2xl bg-white dark:bg-gray-700 hover:bg-gray-200 transition ease duration-700">
              <div>
                <h1 className="main-text text-2xl md:text-3xl 2xl:text-4xl dark:text-white">
                  {video.lesson_name}
                </h1>
                <div className="flex align-center gap-2">
                  <img className="filter dark:invert" src={calendarIcon} alt="" />
                  <h1 className="text-base md:text-lg my-2 dark:text-white">
                    {new Date(video.created_at).toLocaleDateString()}
                  </h1>
                </div>
                <p className="text-lg md:text-xl md:mt-4 mt-2 dark:text-white">
                  {contents.moduleLabel}: {video.module}
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

export default VideoListItems;

