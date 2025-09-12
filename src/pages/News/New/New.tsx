import React, { useContext } from "react";
import "./New.css";
import calendarIcon from "../../../images/Calendar.svg";
import { UserContext } from "../../../components/context/Context";
import { GlobalContext } from "../../../App";
import { Langs } from "../../../enums";

type TNewsComponentContent = {
    button: string;
    error: string;
};

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [
        Langs.UZ,
        {
            button: "Tahrirlash",
            error: "Yangiliklar mavjud emas",
        },
    ],
    [
        Langs.RU,
        {
            button: "Редактировать",
            error: "Нет доступных новостей",
        },
    ],
    [
        Langs.EN,
        {
            button: "Edit",
            error: "No news available",
        },
    ],
]);

interface NewsProps {
    data: {
        id: string;
        image: string;
        title: string;
        description: string;
        created_at: string;
        link: string;
    };
    onEdit: (id: string) => void;
}

const New: React.FC<NewsProps> = ({ data, onEdit }) => {
    const { lang, role } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("UserContext must be used within a UserProvider");
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        }
        return text;
    };

    return (
        <div className="post-slide shadow-md col gap-4 flex mb-5 rounded-xl overflow-hidden dark:bg-gray-700 bg-white dark:text-gray-400">
            {data ? (
                <div className="card w-full " key={data.id}>
                    <div className="w-full 2xl:h-80 h-52 post-img">
                        <a target="_blank" href={data.link}>
                            <img
                                className="w-full h-full z-10 object-cover"
                                src={data.image}
                                alt={data.title}
                            />
                        </a>
                    </div>
                    <div className="post-content p-4">
                        <h3 className="post-title hover:text-blue-500 text-xl font-semibold mb-2">
                            <a target="_blank" href={data.link}>
                                {truncateText(data.title, 90)} 
                            </a>
                        </h3>
                        <p className="post-description mt-5 hover:text-blue-500">
                            <a className="line-clamp-3" target="_blank" href={data.link}>
                                {truncateText(data.description, 100)} 
                            </a>
                        </p>
                        <div className="flex gap-2 items-center">
                            <img className="filter dark:invert" src={calendarIcon} alt="" />
                            <p>{formatDate(data.created_at)}</p>
                        </div>
                        {role === "admin" ? (
                            <div className="description-box w-full">
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => onEdit(data.id)}
                                        className="p-2 rounded-md bg-blue-600 text-white"
                                    >
                                        {contents.button} <i className="ml-1 fa-solid fa-edit" />
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : (
                <p>{contents.error}</p>
            )}
        </div>
    );
};

export default New;
