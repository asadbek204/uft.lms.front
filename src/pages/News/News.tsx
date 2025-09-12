import React, { useState, useContext, useEffect } from 'react';
import New from './New/New';
import Loading from '../../components/LoadingComponent/Loading';
import Modal from '../../pages/News/Modal/Modal';
import { UserContext } from '../../components/context/Context';
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import client from "../../components/services";
import {toast} from "react-toastify";

interface NewsItem {
    id: string;
    image: string;
    title: string;
    description: string;
    created_at: string;
    link: string;
}

type TNewsComponentContent = {
    title: string;
    error: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, { title: "Yangiliklar", error: "Yangiliklarni olishda xatolik:" }],
    [Langs.RU, { title: "Новости", error: "Ошибка при получении новостей:" }],
    [Langs.EN, { title: "News", error: "Error fetching news:" }],
]);

const News: React.FC = () => {
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error('UserContext must be used within a UserProvider');
    }

    const { lang, role } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;

    const [data, setData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<NewsItem | null>(null);

    const fetchNews = async () => {
        try {
            const response = await client.get('news/');
            setData(response.data);
        } catch (error) {
            toast.error(contents.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleEdit = (id: string) => {
        const item = data.find(item => item.id === id);
        if (item) {
            setEditItem(item);
            setShowModal(true);
        }
    };

    const handleCreate = () => {
        setEditItem(null);
        setShowModal(true);
    };

    const handleUpdate = async (newItem: NewsItem) => {
        try {
            if (newItem.id) {
                await client.patch(`news/${newItem.id}/`, newItem, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            fetchNews();
        } catch (error) {
            console.error('Error updating news:', error);
        }
        setShowModal(false);
    };

    return (
        <div className="w-full  mt-12 md:mt-0">
            <div className="header w-full flex justify-end">
                <div className="m-5 flex w-full lg:w-3/5 justify-center md:justify-between items-center">
                    <h1 className="text-2xl lg:text-4xl  font-bold font-Sora dark:text-customText">{contents.title}</h1>
                    {role === "admin" && data.length < 3 ? (
                        <button
                            onClick={handleCreate}
                            className="px-3 py-2 text-sm lg:text-base text-white bg-blue-400 rounded hover:bg-blue-700"
                        >
                            <i className="fa-solid fa-plus" />
                        </button>
                    ) : null}
                </div>
            </div>
            <div className="pt-3 flex flex-col 2xl:h-[88%] h-[85%] overflow-y-auto">
                {loading ? <Loading /> : (
                    <div className="p-2 lg:p-7 lg:pt-0 grid 2xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 ">
                        {data.map(item => (
                            <New key={item.id} data={item} onEdit={handleEdit} />
                        ))}
                    </div>
                )}
            </div>
            {showModal && (
                <Modal
                    isVisible={showModal}
                    onClose={() => setShowModal(false)}
                    onUpdate={handleUpdate}
                    initialData={editItem}
                />
            )}
        </div>
    );
}

export default News;
