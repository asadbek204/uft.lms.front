import Loading from "../../components/LoadingComponent/Loading.tsx";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Langs} from "../../enums.ts";
import {GlobalContext} from "../../App.tsx";
import {Link} from "react-router-dom";
import client from "../../components/services";
import {toast} from "react-toastify";
import EditTeacherModal from './EditTeacherModal';
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";

type TTeachersComponentContent = {
    title: string,
    toast1: string,
    toast2: string
    toast3: string
    toast4: string
}

const contentsMap = new Map<Langs, TTeachersComponentContent>(
    [
        [Langs.UZ, {
            title: "O'qituvchilar",
            toast1: "O'qituvchi muvaffaqiyatli o'chirildi",
            toast2: "O'qituvchini o'chirishda xato",
            toast3: "O'qituvchini muvaffaqiyatli ozgartirildi",
            toast4: "O'qituvchini o'zgartirishda xato"
        }],
        [Langs.RU, {
            title: "Учителя",
            toast1: "Учитель успешно удален",
            toast2: "Ошибка удаления преподавателя.",
            toast3: "Успешно сменился учитель!",
            toast4: "Ошибка при смене учителя"
        }],
        [Langs.EN, {
            title: "Teachers",
            toast1: "The teacher was successfully deleted",
            toast2: "Error deleting teacher",
            toast3: "Successfully changed teacher",
            toast4: "Error changing teacher"
        }]
    ]
)

export interface TTeachers {
    id: number;
    first_name: string;
    last_name: string;
    sure_name: string;

}

enum TeachersComponentParts {
    MainPart,
    DetailPart
}

type TTeacherContext = {
    loading: boolean
    teachers: TTeachers[]
    contents: TTeachersComponentContent
    setTeachers: React.Dispatch<React.SetStateAction<TTeachers[]>>
}

const TeacherContext = createContext<TTeacherContext>(
    {
        loading: false,
        teachers: [],
        contents: contentsMap.get(Langs.EN) as TTeachersComponentContent,
        setTeachers: () => {
        }
    }
)

function TeachersMainPart() {
    const {loading, teachers, contents, setTeachers} = useContext(TeacherContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedTeacher, setSelectedTeacher] = useState<TTeachers>(defaultData);
    const editTeacher = () => {
        // setSelectedTeacher(teacher);
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
        // setSelectedTeacher(defaultData);
    };

    const saveTeacher = async (updatedTeacher: TTeachers) => {
        try {
            const data = {
                ...updatedTeacher,
            };
            console.log(data)
            await client.patch(`employees/update/${updatedTeacher.id}/`, data);

            setTeachers((prevTeachers) =>
                prevTeachers.map((teacher) =>
                    teacher.id === updatedTeacher.id ? updatedTeacher : teacher
                )
            );

            toast.success(contents.toast3);
            closeModal();
        } catch (error) {
            toast.error(contents.toast4);
        }
    };


    return (

        <div className="w-full mt-12 md:mt-0">
        <div className="content-center h-12 m-5 flex justify-center">
            <h1 className="2xl:text-4xl text-3xl font-bold  dark:text-customText">{contents.title}</h1>
        </div>
        <div className="w-full 2xl:h-[88%] h-[87%] overflow-y-auto">
            <div className="courses pt-6 flex flex-col gap-5 justify-center content-center">
                {loading ? <Loading/> :
                    teachers.map(item => (
                        <div key={item.id} style={{boxShadow: "1px 5px 6px rgba(0, 0, 0, 0.15"}}
                             className="w-5/6 flex justify-between items-center rounded-md mx-auto bg-white dark:bg-gray-700">
                            {isModalOpen && (
                                <EditTeacherModal
                                    teacher={item}
                                    onClose={closeModal}
                                    onSave={saveTeacher}
                                />
                            )}
                            {!isModalOpen &&
                                <>
                                    <Link to={`${item.id}`} key={item.id}>
                                        <button
                                            className="block text-start uppercase 2xl:text-xl text-lg border-gray-300 p-4 duration-300 ease-in-out hover:text-blue-400 dark:hover:text-blue-400 dark:text-white">
                                            {item.first_name} {item.last_name} {item.sure_name}
                                        </button>
                                    </Link>
                                    <div className="flex">
                                        <button
                                            onClick={editTeacher}
                                            className='m-4 bg-yellow-500 w-[30px] h-[30px] dark:text-gray-200 text-white rounded-md'>
                                            <i className='fa-solid fa-pen'/>
                                        </button>
                                        <ConfirmDeleteModal content={item.id} onDelete={(id) => {
                                            // Update your state here to remove the course
                                            setTeachers(teachers.filter(teachers => teachers.id !== id));
                                        }}/>
                                    </div>
                                </>
                            }

                        </div>
                    ))}
            </div>
        </div>

    </div>
    )
}

const TeachersPartsMap = new Map<TeachersComponentParts, ReactNode>([
    [TeachersComponentParts.MainPart, <TeachersMainPart/>],
])

function TeachersPage() {
    const {lang} = useContext(GlobalContext);

    const [contents, setContents] = useState<TTeachersComponentContent>(contentsMap.get(lang) as TTeachersComponentContent)
    const [loading, setLoading] = useState<boolean>(false)
    const [teachers, setTeachers] = useState<TTeachers[]>([])
    const [part,] = useState<TeachersComponentParts>(TeachersComponentParts.MainPart)
    const [page, setPage] = useState<ReactNode>(TeachersPartsMap.get(part) as ReactNode)

    useEffect(() => {
        setContents(contentsMap.get(lang) as TTeachersComponentContent)
        setPage(TeachersPartsMap.get(part) as ReactNode)
        setLoading(false)
    }, [part, lang]);

    useEffect(() => {
        const a = async () => {
            const response = await client.get('employees/list/by/role/1/')
             console.log(response)
            if (!(response.data instanceof Array)) return
            setTeachers(response.data.map((data) => (
                {
                    id: data.id,
                    first_name: data.user.first_name,
                    last_name: data.user.last_name,
                    sure_name: data.user.sure_name,

                }
            )) as TTeachers[])
        }
        a()
    }, []);

    return (
        <TeacherContext.Provider
            value={{loading: loading, teachers: teachers, contents: contents, setTeachers: setTeachers}}>
            {page}
        </TeacherContext.Provider>
    );
}

export default TeachersPage;
