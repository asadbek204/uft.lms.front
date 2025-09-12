// import Loading from "../../components/LoadingComponent/Loading.tsx";
// import { useContext, useEffect, useState } from "react";
// import { GlobalContext } from "../../App.tsx";
// import { Langs } from "../../enums.ts";
// import { Link } from "react-router-dom";
// import client from "../../components/services/index.tsx";
// // import { UserContext } from "../../components/context/Context.tsx";

// type TGroupsComponentContent = {
//     title: string;
// };

// const contentsMap = new Map<Langs, TGroupsComponentContent>([
//     [Langs.UZ, { title: "Sizning guruhlaringiz" }],
//     [Langs.RU, { title: "Ваши группы" }],
//     [Langs.EN, { title: "Your groups" }],
// ]);

// type TGroups = {
//     name: string;
//     id: number;
// };

// function STVideosPage() {
//     const { lang } = useContext(GlobalContext);
//     const contents = contentsMap.get(lang) as TGroupsComponentContent;
//     // const { userId } = useContext(UserContext);

//     // const [groups, setGroups] = useState<TGroups[]>([]);
//     const [filteredGroups, setFilteredGroups] = useState<TGroups[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);

//     useEffect(() => {
//         // if (!id) {
//         //     setLoading(false);
//         //     return;
//         // }

//         const fetchGroups = async () => {
//             try {
//                 const response = await client.get(`education/group/me/list/`);
//                 const data: TGroups[] = response.data;
//                 // setGroups(data);
//                 setFilteredGroups(data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Failed to fetch groups:', error);
//                 setLoading(false);
//             }
//         };

//         fetchGroups();
//     }, []);

//     return (
//         <div className="w-full">
//             <div className="header w-full flex justify-end">
//                 <div className="my-5 flex justify-between w-3/5">
//                     <h1 className="2xl:text-4xl text-3xl font-bold dark:text-customText">
//                         {contents.title}
//                     </h1>
//                 </div>
//             </div>

//             <div className="w-full 2xl:h-[88%] h-[87%]  overflow-y-auto">
//                 <div className="courses pt-6 pb-12 flex flex-col gap-5 justify-center content-center">
//                     {loading ? (
//                         <Loading />
//                     ) : (
//                         filteredGroups.map((item) => (
//                             <Link to={`${item.id}`} // Modify the path as needed
//                                   key={item.id} // Using item.id as the key for better uniqueness
//                                   className="w-5/6 flex justify-between mx-auto rounded-md drop-shadow-xl bg-white dark:bg-gray-700"
//                             >
//                                 <button
//                                     className="block uppercase text-xl border-gray-300 p-4 duration-300 ease-in-out hover:text-blue-400 dark:text-white"
//                                 >
//                                     {item.name}
//                                 </button>
//                             </Link>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default STVideosPage;
