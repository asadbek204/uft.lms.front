import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from "../../App.tsx";
import { Langs } from "../../enums.ts";
import client from "../../components/services";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";
import EditModuleModal from "./EditModule/EditModuleModal.tsx";
import Modal from "./Modal.tsx";
import { toast } from "react-toastify";

type TCoursesComponentContent = {
    title: string,
    toastSuccessDelete: string,
    toastErrorDelete: string,
    toastSuccessUpdate: string,
    toastErrorUpdate: string,
    edit: string,
    save: string,
    cancel: string,
    name: string,
    description: string,
    syllabus: string,
    noFile: string,
    fileUploaded: string,
    uploadFile: string,
    changeFile: string,
    view: string,
}

const contentsMap = new Map<Langs, TCoursesComponentContent>([
    [Langs.UZ, {
        title: "Kurslar",
        toastSuccessDelete: "Kurs muvaffaqiyatli o‘chirildi",
        toastErrorDelete: "Kurs o‘chirishda xato yuz berdi",
        toastSuccessUpdate: "Kurs muvaffaqiyatli yangilandi",
        toastErrorUpdate: "Kursni yangilashda xato",
        edit: "Tahrirlash",
        save: "Saqlash",
        cancel: "Bekor qilish",
        name: "Nomi",
        description: "Tavsif",
        syllabus: "O‘quv dasturi",
        noFile: "Fayl yuklanmagan",
        fileUploaded: "Fayl yuklangan",
        uploadFile: "Fayl yuklash",
        changeFile: "Faylni o‘zgartirish",
        view: "Ko‘rish",
    }],
    [Langs.RU, {
        title: "Курсы",
        toastSuccessDelete: "Курс успешно удалён",
        toastErrorDelete: "Ошибка при удалении курса",
        toastSuccessUpdate: "Курс успешно обновлён",
        toastErrorUpdate: "Ошибка при обновлении курса",
        edit: "Редактировать",
        save: "Сохранить",
        cancel: "Отмена",
        name: "Название",
        description: "Описание",
        syllabus: "Учебный план",
        noFile: "Файл не загружен",
        fileUploaded: "Файл загружен",
        uploadFile: "Загрузить файл",
        changeFile: "Изменить файл",
        view: "Просмотреть",
    }],
    [Langs.EN, {
        title: "Courses",
        toastSuccessDelete: "Course successfully deleted",
        toastErrorDelete: "Error deleting course",
        toastSuccessUpdate: "Course successfully updated",
        toastErrorUpdate: "Error updating course",
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        name: "Name",
        description: "Description",
        syllabus: "Syllabus",
        noFile: "No file uploaded",
        fileUploaded: "File uploaded",
        uploadFile: "Upload file",
        changeFile: "Change file",
        view: "View",
    }]
]);

type TCourses = {
    id: number
    name: string
    description: string
    syllabus: {
        id: number,
        file: string | null,
        description: string | null,
        path: string | null,
        main: any
    }
    is_active: boolean
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
    const { lang } = useContext(GlobalContext);
    const [courses, setCourses] = useState<TCourses[]>([]);
    const contents = contentsMap.get(lang) as TCoursesComponentContent;

    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
    const [infoModule, setInfoModule] = useState<TinfoModule>({ name: '', modules: [] });

    const [showEditCourseModal, setShowEditCourseModal] = useState<boolean>(false);
    const [editCourseData, setEditCourseData] = useState({
        id: 0,
        name: '',
        description: '',
        file: null as File | null,
        currentFile: null as string | null,
        syllabusDescription: ''
    });

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await client.get('education/course/list/');
            setCourses(response.data as TCourses[]);
        };
        fetchCourses();
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
            toast.error(contents.toastErrorUpdate);
        }
    };

    const handleEditCourse = (course: TCourses) => {
        setEditCourseData({
            id: course.id,
            name: course.name,
            description: course.description,
            file: null,
            currentFile: course.syllabus?.file || null,
            syllabusDescription: course.syllabus?.description || ''
        });
        setShowEditCourseModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEditCourseData({ ...editCourseData, file: e.target.files[0] });
        }
    };

    const handleSaveEdit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', editCourseData.name);
            formData.append('description', editCourseData.description);
            if (editCourseData.file) {
                formData.append('file', editCourseData.file);
            }
            if (editCourseData.syllabusDescription) {
                formData.append('syllabus_description', editCourseData.syllabusDescription);
            }

            await client.patch(`education/course/update/${editCourseData.id}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const response = await client.get('education/course/list/');
            setCourses(response.data as TCourses[]);

            toast.success(contents.toastSuccessUpdate);
            setShowEditCourseModal(false);
        } catch (error) {
            toast.error(contents.toastErrorUpdate);
        }
    };

    const handleDeleteSuccess = (id: number) => {
        setCourses(prev => prev.filter(course => course.id !== id));
        toast.success(contents.toastSuccessDelete);
    };



    return (
        <div className="w-full mt-12 md:mt-0">
            <div className="content-center h-12 m-5 flex justify-between">
                <div />
                <h1 className="2xl:text-4xl text-3xl font-bold text-center dark:text-customText">
                    {contents.title}
                </h1>
                <button onClick={() => setShowModal(true)}
                        className="px-4 py-2 text-white bg-blue-400 rounded hover:bg-blue-700">
                    <i className="fa-solid fa-plus" />
                </button>
            </div>

            <div className="w-full 2xl:h-[88%] h-[87%] overflow-y-auto">
                {courses.map((course) => (
                    <div key={course.id} style={{ boxShadow: "1px 5px 6px rgba(0, 0, 0, 0.15)" }}
                         className="w-5/6 flex flex-col mx-auto overflow-y-auto rounded-md mb-5 bg-white dark:bg-gray-700">
                        <div className="flex justify-between items-start p-4">
                            <div className="flex-1">
                                <h1 title={course.description}
                                    className="block uppercase text-xl cursor-default dark:text-white mb-2">
                                    {course.name}
                                </h1>
                                <p className="text-sm !line-clamp-2 text-gray-600 dark:text-gray-300 mb-3">
                                    {course.description}
                                </p>

                                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        {course.syllabus?.file ? (
                                            <>
                                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                                                    <i className="fa-solid fa-file-pdf text-green-600 dark:text-green-400 text-sm" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
                                                        {contents.fileUploaded}
                                                    </p>
                                                    {course.syllabus.description && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {course.syllabus.description}
                                                        </p>
                                                    )}
                                                    <a
                                                        href={course.syllabus.file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        {contents.view}
                                                    </a>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-500 rounded flex items-center justify-center">
                                                    <i className="fa-solid fa-file-circle-xmark text-gray-400 text-sm" />
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {contents.noFile}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => handleEditCourse(course)}
                                    className="w-[30px] h-[30px] text-white bg-blue-500 rounded hover:bg-blue-700"
                                    title={contents.edit}
                                >
                                    <i className="fa-solid fa-pen-to-square" />
                                </button>

                                {window.localStorage.getItem('role') === 'admin' && (
                                    <button
                                        onClick={() => handleEdit(course.id)}
                                        className="w-[30px] h-[30px] text-white bg-green-500 rounded hover:bg-green-700"
                                    >
                                        <i className="fa-solid fa-list" />
                                    </button>
                                )}

                                <ConfirmDeleteModal
                                    content={course.id}
                                    onDelete={handleDeleteSuccess}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isVisible={showModal} onClose={() => setShowModal(false)} />

            {editingCourseId && (
                <EditModuleModal
                    modules={infoModule.modules}
                    name={infoModule.name}
                    onClose={() => setEditingCourseId(null)}
                />
            )}

            {showEditCourseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-blue-500 p-4 text-white rounded-t-lg">
                            <h2 className="text-xl font-bold">{contents.edit}</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {contents.name}
                                </label>
                                <input
                                    type="text"
                                    value={editCourseData.name}
                                    onChange={(e) => setEditCourseData({ ...editCourseData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {contents.description}
                                </label>
                                <textarea
                                    value={editCourseData.description}
                                    onChange={(e) => setEditCourseData({ ...editCourseData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {contents.syllabus}
                                </label>

                                {editCourseData.currentFile && !editCourseData.file && (
                                    <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <i className="fa-solid fa-file-pdf text-green-600 dark:text-green-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {contents.fileUploaded}
                                            </span>
                                            <a
                                                href={editCourseData.currentFile}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-auto"
                                            >
                                                {contents.view}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <label className="block">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                    />
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer text-center">
                                        {editCourseData.file ? (
                                            <div>
                                                <i className="fa-solid fa-file text-blue-500 text-2xl mb-2" />
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {editCourseData.file.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {contents.changeFile}
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <i className="fa-solid fa-cloud-arrow-up text-gray-400 text-2xl mb-2" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {editCourseData.currentFile ? contents.changeFile : contents.uploadFile}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PDF, DOC, DOCX, PNG, JPG
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                >
                                    <i className="fa-solid fa-check mr-2" />
                                    {contents.save}
                                </button>
                                <button
                                    onClick={() => setShowEditCourseModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
                                >
                                    <i className="fa-solid fa-xmark mr-2" />
                                    {contents.cancel}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CoursePage;