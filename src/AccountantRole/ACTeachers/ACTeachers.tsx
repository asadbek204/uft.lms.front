import React, {useEffect, useState, ChangeEvent} from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import {GlobalContext} from "../../App";
import {Langs} from "../../enums";
import {useContext} from "react";
import client from "../../components/services";

type TResponseData = {
    teacher: {
        id: number,
        first_name: string,
        last_name: string,
        salary: number
    },
    groups: {
        group: {
            id: number,
            name: string,
            course: {
                name: string
            }
        },
        lessons_count: number,
        lessons: {
            name: string
        }[],
    }[],

}

type Group = {
    id: number;
    name: string;
    lessons_count: number;
    lessons: string[];
    courseName: string
};

type TACTeacher = {
    id: number;
    first_name: string;
    last_name: string;
    salary: number;
    groups: Group[];
};

type TACTeacherComponentPage = {
    title1: string;
    title2: string;
    title3: string;
    title4: string;
    title5: string;
    title6: string;
    title7: string;
};

const contentsMap = new Map<Langs, TACTeacherComponentPage>([
    [
        Langs.UZ,
        {
            title1: "O'qituvchilar ro'yxati",
            title2: "O'qituvchi",
            title3: "Darslar soni",
            title4: "Kurs nomi",
            title5: "Maoshi",
            title6: "Ismini kiriting..",
            title7: "Hisoblandi",
        },
    ],
    [
        Langs.RU,
        {
            title1: "Список учителей",
            title2: "Учитель",
            title3: "Количество уроков",
            title4: "Название урока",
            title5: "Зарплата",
            title6: "Введите имя..",
            title7: "Рассчитано",
        },
    ],
    [
        Langs.EN,
        {
            title1: "List of teachers",
            title2: "Teacher",
            title3: "Number of lessons",
            title4: "Lesson name",
            title5: "Salary",
            title6: "Enter name..",
            title7: "Calculated",
        },
    ],
]);

const TeachersForAccountant: React.FC = () => {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TACTeacherComponentPage;
    const [teacherData, setTeacherData] = useState<TACTeacher[]>([]);
    const [filteredData, setFilteredData] = useState<TACTeacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await client.get('/employees/teachers/attendance/');
                const data = response.data as TResponseData[]
                const formattedData = data.map((teacher) => ({
                    id: teacher.teacher.id,
                    first_name: teacher.teacher.first_name,
                    last_name: teacher.teacher.last_name,
                    salary: teacher.teacher.salary,
                    groups: teacher.groups.map((group) => ({
                        id: group.group.id,
                        name: group.group.name,
                        courseName: group.group.course.name, // Ensure courseName is captured
                        lessons_count: group.lessons_count,
                        lessons: group.lessons.map((lesson) => lesson.name),
                    }))
                }));
                setTeacherData(formattedData);
                setFilteredData(formattedData);
            } catch (err) {
                // setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = teacherData.filter(teacher =>
            teacher.first_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, teacherData]);

    const handleSearchButtonClick = () => {
        setShowSearchInput(!showSearchInput);
        if (showSearchInput) {
            setSearchQuery('');
            setFilteredData(teacherData);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    console.log(filteredData,'2222222')


    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;
        setIsScrolled(target.scrollTop > 0);
      };

    return (
        <>
            {loading ? (
                <Loading/>
            ) : (
                <div className="header w-full relative mt-14 md:mt-0">
                    <div className="my-5 mx-5 text-center flex justify-between">
                        <h1 className="2xl:text-4xl xl:text-3xl font-bold  m-auto dark:text-customText">{contents.title1}</h1>
                        <div className='hidden md:block'>
                            {showSearchInput && (
                                <input
                                    type="text"
                                    placeholder={contents.title6}
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    className="mb-2 p-2 rounded border border-gray-300 dark:bg-gray-900 dark:text-white"
                                />
                            )}
                            <button
                                onClick={handleSearchButtonClick}
                                className="bg-gray-200 me-5 hover:bg-gray-300 rounded py-3 px-4"
                            >
                                <i className='fa-solid fa-search'></i>
                            </button>
                        </div>
                    </div>

                    <div className='flex justify-end md:hidden mb-5'>
                            {showSearchInput && (
                                <input
                                    type="text"
                                    placeholder={contents.title6}
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    className="mb-2 p-2 rounded border border-gray-300 dark:bg-gray-900 dark:text-white"
                                />
                            )}
                            <button
                                onClick={handleSearchButtonClick}
                                className="bg-gray-200 me-5 hover:bg-gray-300 rounded py-3 px-4"
                            >
                                <i className='fa-solid fa-search'></i>
                            </button>
                        </div>


                    <div className="mx-auto border-collapse 2xl:h-[87%] h-[65%] overflow-y-auto w-11/12"
                  onScroll={handleScroll}
                  style={{
                    boxShadow: isScrolled ? "black 0px 10px 10px -10px inset, black 0px -10px 10px -10px inset" : "none"
                  }}
                  >
                     <table className="w-full text-center border-collapse border dark:text-white text-lg">
                            <thead>
                                <tr>
                                    <th className="border border-slate-600 py-3">{contents.title2}</th>
                                    <th className="border border-slate-600 py-3">{contents.title3}</th>
                                    <th className="border border-slate-600 py-3">{contents.title4}</th>
                                    <th className="border border-slate-600 py-3">{contents.title7}</th>
                                    <th className="border border-slate-600 py-3">{contents.title5}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(teacher => (
                                    <tr key={teacher.id}>
                                        <td className="border border-slate-600 text-lg py-2">
                                            {teacher.first_name.toUpperCase()} {teacher.last_name.toUpperCase()}
                                        </td>
                                        <td className="border border-slate-600 py-2">
                                            {teacher.groups.reduce((total, group) => total + group.lessons_count, 0)}
                                        </td>
                                        <td className="border border-slate-600 py-2">
                                            {teacher.groups[0]?.courseName || 'N/A'}
                                        </td>
                                        <td className="border border-slate-600 py-2">
                                            {teacher.salary *
                                                teacher.groups.reduce(
                                                    (total, group) => total + group.lessons_count,
                                                    0
                                                )}
                                        </td>
                                        <td className="border border-slate-600 py-2">{teacher.salary}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeachersForAccountant;
