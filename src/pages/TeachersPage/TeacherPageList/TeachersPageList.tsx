import Loading from "../../../components/LoadingComponent/Loading.tsx";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../../App.tsx";
import {Langs} from "../../../enums.ts";
import Modal from "./Modal.tsx";
import {Link, useParams} from "react-router-dom";
import client from "../../../components/services";
import {toast} from "react-toastify";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";

type TGroupsComponentContent = {
    title: string;
    searchPlaceholder: string;
    success: string,
    error: string,
    copy: string;
    save: string,
    select: string,
    error1: string,
    error2: string,
    toast: string
};

const contentsMap = new Map<Langs, TGroupsComponentContent>([
    [Langs.UZ, {
        title: "Barcha guruhlar",
        searchPlaceholder: "Guruh nomi bo'yicha qidiring",
        success: "Guruh muvofaqiyatli o'chirildi",
        error: "Guruhni o‘chirib bo‘lmadi",
        copy: "Nusxalandi",
        save: "Saqlash",
        select: "O'qituvchini tanlang",
        error1: "O'zgarishlar muvaffaqiyatli saqlandi",
        error2: "O'zgarishlarni saqlashda xatolik yuz berdi",
        toast: "Matnni nusxalash ushbu brauzerda qo'llab-quvvatlanmaydi!"
    }],
    [Langs.RU, {
        title: "Все группы",
        searchPlaceholder: "Поиск по названию группы",
        success: "Группа успешно удалена",
        error: "Не удалось удалить группу",
        copy: "Скопировано",
        save: "Сохранять",
        select: "Выберите учителя",
        error1: "Изменения успешно сохранены",
        error2: "Произошла ошибка при сохранении изменений",
        toast: "Копирование текста не поддерживается в этом браузере!"
    }],
    [Langs.EN, {
        title: "All Groups",
        searchPlaceholder: "Search by group name",
        success: "Group deleted successfully",
        error: "Failed to delete group",
        copy: "Copied",
        save: "Save",
        select: "Select Teacher",
        error1: "Changes saved successfully",
        error2: "An error occurred while saving changes",
        toast: "Copy text not supported on this browser!"
    }],
]);

type TGroups = {
    name: string;
    id: number;
    teacher: string;
};

type TTeacher = {
    id: number;
    user: {
        first_name: string;
        last_name: string;
        sure_name: string;
    }
};

function TeachersPageList() {
    const {id} = useParams();
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TGroupsComponentContent;

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [groups, setGroups] = useState<TGroups[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<TGroups[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
    const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
    const [teachers, setTeachers] = useState<TTeacher[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<number | null>(null);

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    const openConfirmDeleteModal = (groupId: number) => {
        setGroupToDelete(groupId);
        setIsConfirmDeleteModalVisible(true);
    };

    const closeConfirmDeleteModal = () => {
        setIsConfirmDeleteModalVisible(false);
        setGroupToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (groupToDelete !== null) {
            await deleteGroup(groupToDelete); // Call the delete function
            closeConfirmDeleteModal();
        }
    };

    useEffect(() => {
        (async () => {
            const response = await client.get(`education/group/list/?needed_role=admin&teacher=${id}`);
            if (!(response.data instanceof Array)) return;
            setGroups(response.data.filter(el => el.status) as TGroups[]);
            setFilteredGroups(response.data);
            setLoading(false);
        })();
    }, [id, isModalVisible, editingGroupId]);

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

    const fetchTeachers = async () => {
        try {
            const response = await client.get('employees/list/by/role/1/');
            if (Array.isArray(response.data)) {
                setTeachers(response.data);
            } else {
                console.error("API response is not in the expected format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, [isModalVisible]);

    const deleteGroup = async (groupId: number) => {
        try {

            await client.delete(`education/group/destroy/${groupId}/`);

            setGroups(groups.filter(group => group.id !== groupId));
            setFilteredGroups(filteredGroups.filter(group => group.id !== groupId));
            toast.success(contents.success);
        } catch (error) {
            console.error("Failed to delete group:", error);
            toast.error(contents.error);
        }
    };

    const handleEditClick = (groupId: number, currentTeacher: string) => {
        if (editingGroupId === groupId) {
            setEditingGroupId(null);
            setEditingGroupName(null);
            setSelectedTeacherId(null);
        } else {
            setEditingGroupId(groupId);
            setEditingGroupName(groups.find(group => group.id === groupId)?.name ?? '');
            setSelectedTeacherId(currentTeacher ? Number(currentTeacher) : null);
        }
    };

    const handleSaveTeacher = async (id: number) => {
        const formData = new FormData();
        formData.append("name", editingGroupName ?? '');
        formData.append("teacher", String(selectedTeacherId ?? ''));

        try {
            await client.patch(`education/group/update/${id}/`, formData);
            toast.success(contents.error1);
            setEditingGroupId(null);
            setEditingGroupName(null);
            setSelectedTeacherId(null);
        } catch (err) {
            toast.error(contents.error2);
        }
    };

    return (
        <div className="w-full mt-12 md:mt-0">
            <div className="header w-full flex justify-end">
                <div className="my-5 flex justify-between w-full mx-5">
                    <button onClick={() => window.history.back()}
                            className='w-12 h-12 my-3 bg-gray-200 hover:bg-gray-300 rounded'>
                        <i className='fa-solid fa-arrow-left text-black'></i>
                    </button>
                    <h1 className="2xl:text-4xl text-3xl font-bold dark:text-customText">
                        {contents.title}
                    </h1>
                    <div className="flex items-center">
                        <button
                            onClick={openModal}
                            className={`py-3 px-4 text-white bg-blue-400 rounded hover:bg-blue-700 `}
                        >
                            <i className="fa-solid fa-plus"/>
                        </button>
                        <div
                            className={`transition-all hidden md:block duration-300 ${isSearchVisible ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'} mx-2`}>
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
                            className="bg-gray-200 hidden md:block hover:bg-gray-300 rounded py-3 px-4"
                        >
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                    <Modal isVisible={isModalVisible} onClose={closeModal}/>
                </div>
            </div>

            <div className="w-full 2xl:h-[88%] h-[87%]  overflow-y-auto">
                <div className="courses pt-6 pb-12 flex flex-col gap-5 justify-center content-center">
                    {loading ? (
                        <Loading/>
                    ) : (
                        filteredGroups.map((item, index) => (
                            <div key={index}
                                 className="relative w-5/6 flex flex-col mx-auto rounded-md drop-shadow-lg bg-white dark:bg-gray-700">
                                <div className="flex justify-between items-center px-4 py-1">
                                    <Link to={`/teachers/groups/${item.id}/`}>
                                        <button
                                            className="block  uppercase text-xl border-gray-300 p-4 duration-300 ease-in-out hover:text-blue-400 dark:hover:text-blue-400 dark:text-white"
                                            aria-label={`View details for ${item.name}`}
                                        >
                                            {item.name}
                                        </button>
                                    </Link>

                                    <div className="flex items-center">
                                        <button
                                            className="2xl:m-4 mx-2 m-2 me-0 w-[30px] h-[30px] dark:text-gray-200 text-white rounded-md"
                                            onClick={() => {
                                                const el = document.getElementById(`link-${item.id}`) as HTMLInputElement;
                                                const linkToCopy = el.value;
                                                navigator.clipboard.writeText(linkToCopy).then(() => {
                                                    toast.success(contents.copy);
                                                }).catch(() => {
                                                    toast.error(contents.toast);
                                                });
                                            }}
                                        >
                                            <img
                                                className="w-7 dark:invert"
                                                src="https://cdn3.iconfinder.com/data/icons/glypho-generic-icons/64/link-chain-512.png"
                                                alt="Copy link"
                                            />
                                            <input
                                                type="text"
                                                hidden
                                                readOnly
                                                name={`link-${item.id}`}
                                                id={`link-${item.id}`}
                                                value={`https://demo.ba.lms.uft.uz/students-form/${item.id}`}
                                            />
                                        </button>
                                        <button
                                            className={`2xl:m-4 m-2 me-0 ${editingGroupId === item.id ? 'bg-red-600' : 'bg-yellow-500'} w-[30px] h-[30px] dark:text-gray-200 text-white rounded-md`}
                                            onClick={() => handleEditClick(item.id, item.teacher)}
                                            aria-label={`Edit group ${item.name}`}
                                        >
                                            <i className={`fa-solid ${editingGroupId === item.id ? 'fa-close' : 'fa-pen'}`}/>
                                        </button>
                                        <button
                    onClick={() => openConfirmDeleteModal(item.id)} // Open confirmation modal
                    className="m-4 bg-red-600 w-[30px] h-[30px] dark:text-gray-200 text-white rounded-md"
                    aria-label={`Delete group ${item.name}`}
                >
                    <i className="fa-solid fa-trash-can" />
                </button>
                                    </div>
                                </div>
                                {editingGroupId === item.id && (
                                    <div className="mt-4 p-4 text-center border-t-2">
                                        <input
                                            type="text"
                                            value={editingGroupName ?? ''}
                                            onChange={(e) => setEditingGroupName(e.target.value)}
                                            className="p-2 border rounded w-full mb-2 dark:bg-slate-700 dark:text-white"
                                            aria-label="Group name"
                                        />
                                        <select
                                            value={selectedTeacherId ?? ''}
                                            onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                                            className="p-2 border rounded w-full uppercase mb-2 dark:bg-slate-700 dark:text-white"
                                            aria-label="Select teacher"
                                        >
                                            <option value="">{contents.select}</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {`${teacher.user.first_name} ${teacher.user.last_name} ${teacher.user.sure_name}`}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleSaveTeacher(item.id)}
                                            className="py-3 px-4 text-white bg-blue-400 rounded hover:bg-blue-700"
                                            aria-label="Save changes"
                                        >
                                            {contents.save}
                                        </button>
                                    </div>
                                )}
                            </div>


                        ))
                    )}
                </div>
                <Modal isVisible={isModalVisible} onClose={closeModal}/>
            </div>

            <ConfirmDeleteModal
                isVisible={isConfirmDeleteModalVisible}
                onClose={closeConfirmDeleteModal}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}

export default TeachersPageList;
