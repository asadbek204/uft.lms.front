import  { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../../App.tsx";
import { Langs } from "../../../../enums.ts";
import { Link } from "react-router-dom";
import client from "../../../../components/services"; // client import
import Loading from "../../../../components/LoadingComponent/Loading.tsx";

type TGroupsComponentContent = {
    title: string;
};

const contentsMap = new Map<Langs, TGroupsComponentContent>([
    [Langs.UZ, { title: "Sizning guruhlaringiz" }],
    [Langs.RU, { title: "Ваши группы" }],
    [Langs.EN, { title: "Your groups" }],
]);

type TGroups = {
    name: string;
    id: number;
};

function TCHVideos() {
    const { lang, userId } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TGroupsComponentContent;

    const [filteredGroups, setFilteredGroups] = useState<TGroups[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // Dinamik ma'lumotlarni olish
                const response = await client.get<TGroups[]>(`education/group/list/?needed_role=teacher&teacher=${userId}`);
                // Ma'lumotlarni yangilash
                setFilteredGroups(response.data);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
                setError('Error fetching groups');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [userId]);

    return (
        <div className="w-full">
            <div className="header w-full flex justify-center">
                <div className="my-5">
                    <h1 className="2xl:text-4xl text-3xl font-bold dark:text-customText">
                        {contents.title}
                    </h1>
                </div>
            </div>

            <div className="w-full 2xl:h-[88%] h-[87%]  overflow-y-auto">
                <div className="courses pt-6 pb-12 flex flex-col gap-5 justify-center content-center">
                    {loading ? (
                        <Loading />
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        filteredGroups.map((item, index) => (
                            <Link to={`${item.id}`} key={index} className="w-5/6 flex justify-between mx-auto rounded-md drop-shadow-xl bg-white dark:bg-gray-700">
                                <button className="block uppercase text-xl border-gray-300 p-4 duration-300 ease-in-out hover:text-blue-400 dark:text-white">
                                    {item.name}
                                </button>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default TCHVideos;
