import {useContext, useEffect, useState} from 'react';
import {GlobalContext} from "../../App.tsx";
import {Langs} from "../../enums.ts";
import client from "../../components/services";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";
import EditModuleModal from "./EditModule/EditModuleModal.tsx";
import Modal from "./Modal.tsx";

type TCoursesComponentContent = {
    title: string,
    toast1: string,
    toast2: string,

}

const contentsMap = new Map<Langs, TCoursesComponentContent>(
    [
        [Langs.UZ, {
            title: "Kurslar",
            toast1: "Kurs muvaffaqiyatli ochirildi",
            toast2: "Kurs o'chirishda xato"
        }],
        [Langs.RU, {
            title: "Курсы",
            toast1: "Курс успешно запущен",
            toast2: "Ошибка удаления курса."
        }],
        [Langs.EN, {
            title: "Courses",
            toast1: "The course was successfully launched",
            toast2: "Error deleting course"
        }]
    ]
)

type TCourses = {
    id: number
    name: string
    description: string
}

type TinfoModule = {
    name: string,
    modules: {
        id: number,
        name: string,
        price: number
    }[]
}

function CoursePage() {
    const {lang} = useContext(GlobalContext);
    const [courses, setCourses] = useState<TCourses[]>([])
    const contents = contentsMap.get(lang) as TCoursesComponentContent;
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
    const [infoModule, setInfoModule] = useState<TinfoModule>({name: '', modules: []});

    useEffect(() => {
        const a = async () => {
            const response = await client.get('education/course/list/')
            setCourses(response.data as TCourses[])
        }
        a()
    }, []);

    const handleEdit = async (courseId: number) => {
        try {
            const response = await client.get(`education/course/detail/${courseId}`);
            setInfoModule({
                name: response.data.name,
                modules: response.data.modules.reverse()
            });
            setEditingCourseId(courseId);
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
    };
    return (
        <div className="w-full mt-12 md:mt-0">
            <div className="content-center h-12 m-5 flex justify-between">
                <div/>
                <h1 className="2xl:text-4xl text-3xl font-bold text-center  dark:text-customText">
                    {contents.title}
                </h1>
                <button onClick={() => setShowModal(true)}
                        className="px-4 py-2 text-white bg-blue-400 rounded hover:bg-blue-700">
                    <i className="fa-solid fa-plus"/>
                </button>

            </div>
            <div className="w-full 2xl:h-[88%] h-[87%] overflow-y-auto">
                {courses.map((content, index) => (
                    <div key={index} style={{boxShadow: "1px 5px 6px rgba(0, 0, 0, 0.15"}}
                         className="w-5/6 flex flex-col mx-auto overflow-y-auto rounded-md mb-5 bg-white dark:bg-gray-700">
                        <div className="flex justify-between">
                            <h1 title={content.description}
                                className="block uppercase text-xl cursor-default border-gray-300 p-4 dark:text-white">
                                {content?.name}
                            </h1>

                            <div>
                                {window.localStorage.getItem('role') === 'admin' &&
                                    <button
                                        onClick={() => handleEdit(content.id)}
                                        className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-700"
                                    >
                                        <i className="fa-solid fa-pen-to-square"/>
                                    </button>
                                }
                                <ConfirmDeleteModal content={content.id} onDelete={(id) => {
                                    setCourses(courses.filter(course => course.id !== id));
                                }}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isVisible={showModal} onClose={() => setShowModal(false)}/>
            {editingCourseId && <EditModuleModal modules={infoModule.modules} name={infoModule.name}
                                                 onClose={() => setEditingCourseId(null)}/>}
        </div>
    );
}

export default CoursePage;
