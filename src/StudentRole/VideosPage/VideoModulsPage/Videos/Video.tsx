import React, {useEffect, useState} from 'react';
import calendarIcon from '../../images/Calendar.svg';
import Loading from '../../../../components/LoadingComponent/Loading';
import {GlobalContext} from "../../../../App";
import {Langs} from "../../../../enums";
import {useContext} from "react";

interface Video {
    id: number;
    video_url: string;
    lesson_name: string;
    created_at: string;
    module: string;
    group: number;
}


type TNewsComponentContent = {
    title: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([

    [Langs.UZ, {
        title: "Guruh videolari"
    }],

    [Langs.RU, {
        title: "Групповые видео"
    }],

    [Langs.EN, {
        title: "Group videos"
    }],

]);

const fakeVideos: Video[] = [
    {
        id: 1,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        lesson_name: 'Lesson 1',
        created_at: '2023-07-20T12:00:00Z',
        module: 'Module 1',
        group: 1,
    },
    {
        id: 2,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        lesson_name: 'Lesson 2',
        created_at: '2023-07-21T12:00:00Z',
        module: 'Module 2',
        group: 1,
    },
    {
        id: 3,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        lesson_name: 'Lesson 3',
        created_at: '2023-07-22T12:00:00Z',
        module: 'Module 3',
        group: 1,
    },
];

const STVideoListItems: React.FC = () => {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [videos, setVideos] = useState<Video[]>(fakeVideos);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    useEffect(() => {
        setVideos([{
            id: 1,
            video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            lesson_name: 'Lesson 1',
            created_at: '2023-07-20T12:00:00Z',
            module: 'Module 1',
            group: 1,
        }])
        setLoading(false)
    }, []);

    return (
        <div className="w-full mt-12 md:mt-0">
            <div className="header">
                <div className="m-5 flex justify-between">
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

            {loading ? (
                <Loading/>
            ) : (
                <div className="courses py-12 flex flex-col gap-5 justify-center items-center content-center">
                    {videos.length === 0 ? (
                        <p className="text-center text-xl text-gray-600 dark:text-gray-400">Videolar topilmadi</p>
                    ) : (
                        videos.map((video) => (
                            <div key={video.id}
                                 className="flex flex-col md:flex-row 2xl:w-4/6 w-11/12 mx-10 drop-shadow-xl">
                                <video className="w-80 h-full xl:rounded-s-2xl" controls>
                                    <source src={video.video_url} type="video/mp4"/>
                                </video>
                                <div
                                    className="flex justify-between w-full ps-5 py-5 xl:rounded-r-2xl bg-white dark:bg-gray-700 hover:bg-gray-200 transition ease duration-700">
                                    <div>
                                        <h1 className="main-text 2xl:text-4xl text-3xl dark:text-white">{video.lesson_name}</h1>
                                        <div className="flex align-center gap-2">
                                            <img className="filter dark:invert" src={calendarIcon} alt=""/>
                                            <h1 className="text-lg my-2 dark:text-white">{new Date(video.created_at).toLocaleDateString()}</h1>
                                        </div>
                                        <p className="text-xl md:mt-4 mt-2 dark:text-white">Modul: {video.module}</p>
                                    </div>
                                    {/* <div className="flex align-center me-5">
                    <button className="top-2 right-2 px-4 py-3 my-auto bg-red-500 text-white rounded hover:bg-red-700">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div> */}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default STVideoListItems;
