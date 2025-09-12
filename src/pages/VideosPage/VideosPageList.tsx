import Loading from "../../components/LoadingComponent/Loading.tsx";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../App.tsx";
import {Langs} from "../../enums.ts";
import {Link} from "react-router-dom";
import client from "../../components/services";

type TGroupsComponentContent = {
    title: string;
    searchPlaceholder: string;
};

const contentsMap = new Map<Langs, TGroupsComponentContent>([
    [Langs.UZ, {title: "Barcha guruhlar", searchPlaceholder: "Guruh nomi bo'yicha qidiring"}],
    [Langs.RU, {title: "Все группы", searchPlaceholder: "Поиск по названию группы"}],
    [Langs.EN, {title: "All Groups", searchPlaceholder: "Search by group name"}],
]);

type TGroups = {
    name: string;
    id: number
};

function VideosPageList() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TGroupsComponentContent;

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [groups, setGroups] = useState<TGroups[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<TGroups[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const a = async () => {
            const response = await client.get('/education/group/list/?needed_role=admin')
            if (!(response.data instanceof Array)) return
            setGroups(response.data.filter(el => el.status) as TGroups[])
            setFilteredGroups(response.data);
        }
        a()
        setLoading(false);
    }, []);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredGroups(groups);
        } else {
            setFilteredGroups(
                groups.filter(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, groups]);

    return (
        <div className="w-full mt-12 md:mt-0 ">
            <div className="header w-full flex justify-end">
                <div className="my-5 flex justify-between w-3/5">
                    <h1 className="2xl:text-4xl text-3xl font-bold dark:text-customText">
                        {contents.title}
                    </h1>
                    <div className="hidden md:flex items-center ">

                        <div
                            className={`transition-all duration-300 ${isSearchVisible ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'} mx-2`}>
                            <input
                                type="text"
                                placeholder={contents.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="p-2 border rounded w-full"
                            />
                        </div>
                        <button
                            onClick={() => setIsSearchVisible(!isSearchVisible)}
                            className="bg-gray-200 me-5 hover:bg-gray-300 rounded py-3 px-4"
                        >
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
                
            </div>
            <div className="flex md:hidden justify-end mb-6 pt-5 md:pt-0 md:items-center ">
<div
              className={`transition-all duration-300 ${
                isSearchVisible
                  ? "w-64 opacity-100"
                  : "w-0 opacity-0 overflow-hidden"
              } mx-2`}
            >
              <input
                type="text"
                placeholder={contents.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>

      <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="bg-gray-200 me-5  hover:bg-gray-300 rounded py-3 px-4"
            >
              <i className="fa fa-search"></i>
            </button>
</div>

            <div className="w-full 2xl:h-[88%] h-[65%]  overflow-y-auto">
                <div className="courses pt-6 pb-12 flex flex-col gap-5 justify-center content-center">
                    {loading ? (
                        <Loading/>
                    ) : (
                        filteredGroups.map((item, index) => (
                            <Link to={`${item.id}`}
                                  key={index}
                                  className="w-5/6 flex justify-between rounded-md mx-auto drop-shadow-lg bg-white dark:bg-gray-700"
                            >
                                <button
                                    className="block uppercase text-xl border-gray-300 p-4 duration-300 ease-in-out hover:text-blue-400 dark:hover:text-blue-400 dark:text-white"
                                >
                                    {item.name}
                                </button>
                            </Link>
                        ))
                    )}
                </div>
                {/*<Modal isVisible={isModalVisible} onClose={closeModal} />*/}
            </div>
        </div>
    );
}

export default VideosPageList;
