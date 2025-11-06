import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import client from "../../components/services";
import { UserContext } from '../../components/context/Context';
import { Link } from "react-router-dom";
import Modal from "./Modal";
import ConfirmDeleteModal from "./ConfirmDeleteModal"; 
import "./shopStyle.css";
import { Langs } from "../../enums";
import { GlobalContext } from "../../App";

interface Category {
    id: number;
    title: string;
    image: {
        file: string,
        description: string,
    }
}

type TTopicsComponentContent = {
    title: string,
    delete: string,
    error1: string,
    error2: string,
    error3: string
};

const contentsMap = new Map<Langs, TTopicsComponentContent>([
    [Langs.UZ, {
        title: "Do'kon",
        delete: "O'chirish",
        error1: "Turkumlarni olib bo‘lmadi",
        error2: "Muvaffaqiyatli oʻchirib tashlandi!",
        error3: "Kategoriya bo'sh emas!"
    }],
    [Langs.RU, {
        title: "Магазин",
        delete: "Удалить",
        error1: "Не удалось получить категории",
        error2: "Успешно удалено!",
        error3: "Категория не пустая!"
    }],
    [Langs.EN, {
        title: "Shop",
        delete: "Delete",
        error1: "Failed to fetch categories",
        error2: "Successfully deleted!",
        error3: "The category is not empty!"
    }]
]);

const ShopPage: React.FC = () => {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TTopicsComponentContent;
    const { role } = useContext(UserContext);
    const [category, setCategory] = useState<Category[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // State for delete modal
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null); // State for selected category to delete

    useEffect(() => {
        (async () => {
            try {
                const response = await client.get('shop/category/');
                const data: Category[] = response.data;
                setCategory(data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                toast.error(contents.error1);
            }
        })();
    }, [showModal]);

    const onDelete = (id: number) => {
        setCategoryToDelete(id); 
        setShowDeleteModal(true); 
    };

    const handleConfirmDelete = async (id: number) => {
        try {
            await client.delete(`shop/category/${id}/`);
            toast.success(contents.error2);
            setCategory(category.filter((item) => item.id !== id));
        } catch (error) {
            // toast.error(contents.error3);
        }
    };

    const handleUpdate = (newCategory: Category) => {
        setCategory([...category, newCategory]);
        setShowModal(false);
    };

    return (
        <div className="w-full mt-12 md:mt-0">
            <div className="header w-full flex justify-end">
                <div className="m-5 flex w-full lg:w-3/6 justify-between items-center">
                     <h1 className="text-2xl lg:text-4xl font-bold  dark:text-customText">
                        {contents.title}
                    </h1>
                    {role === "admin" && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-3 py-2 text-sm lg:text-base text-white bg-blue-400 rounded hover:bg-blue-700"
                        >
                            <i className="fa-solid fa-plus" />
                        </button>
                    )}
                </div>
            </div>

            <div className="2xl:h-[85%]  h-[80%] overflow-y-auto">
                <div className="p-2 lg:p-7 lg:pt-0 grid 2xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
                    {category.map((item) => (
                        <div key={item.id} className="card rounded-xl bg-white dark:text-white dark:bg-gray-700 shadow-md">
                            <div className="w-full 2xl:h-80 border-b-gray-400 h-52 post-img">
                                <img
                                    className="w-full h-full z-10 rounded-t-md object-cover"
                                    src={item.image?.file}
                                    alt={item.title}
                                />
                            </div>
                            <div className="post-content p-4">
                                <h3 className="post-title text-center hover:text-blue-500 text-xl font-semibold mb-2">
                                    <Link to={`/shop/${item.id}`}>{item.title}</Link>
                                </h3>

                                {role === "admin" && (
                                    <div className="description-box w-full">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => onDelete(item.id)} // Trigger delete confirmation
                                                className="p-2 rounded-md bg-red-600 text-white"
                                            >
                                                {contents.delete} <i className="ml-1 fa-solid fa-trash-can" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal
                isVisible={showModal}
                onClose={() => setShowModal(false)}
                onUpdate={handleUpdate}
            />
            <ConfirmDeleteModal
                isVisible={showDeleteModal}
                content={categoryToDelete} 
                onDelete={handleConfirmDelete} 
                onClose={() => setShowDeleteModal(false)}
            />
        </div>
    );
}

export default ShopPage;

