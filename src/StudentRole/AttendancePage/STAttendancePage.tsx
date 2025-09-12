import Loading from "../../components/LoadingComponent/Loading.tsx";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../App.tsx";
import { Langs } from "../../enums.ts";
import { Link } from "react-router-dom";
import client from "../../components/services/index.tsx";

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
    status: boolean; // Add status property
};

function STAttendancePage() {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TGroupsComponentContent;

    const [filteredGroups, setFilteredGroups] = useState<TGroups[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await client.get(`education/group/me/list/`);
                const data: TGroups[] = response.data;
                setFilteredGroups(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    // Sort groups by status, active ones first
    const sortedGroups = filteredGroups.sort((a, b) => Number(b.status) - Number(a.status));

    return (
        <div className="w-full mt-12 md:mt-0">
            <div className="header w-full ">
                <div className="my-5 text-center ">
                    <h1 className="2xl:text-4xl text-xl font-bold dark:text-customText">
                        {contents.title}
                    </h1>
                </div>
            </div>

            <div className="w-full 2xl:h-[88%] h-[87%]  overflow-y-auto">
                <div className="courses pt-6 pb-12 flex flex-col gap-5 justify-center content-center">
                    {loading ? (
                        <Loading />
                    ) : (
                        sortedGroups.map((item) => (
                            <Link
                                to={`${item.id}`} 
                                key={item.id} 
                                className={`w-5/6 flex justify-between mx-auto rounded-md drop-shadow-xl bg-white dark:bg-gray-700 ${!item.status ? 'text-red-500' : 'dark:text-white'}`}
                            >
                                <button
                                    className="block uppercase text-xl border-gray-300 p-4 duration-300 ease-in-out hover:text-blue-400"
                                >
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

export default STAttendancePage;
