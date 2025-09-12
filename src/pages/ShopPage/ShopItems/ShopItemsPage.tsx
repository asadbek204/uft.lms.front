import { useContext, useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import { UserContext } from '../../../components/context/Context';
import Modal from './Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { toast } from "react-toastify";
import client from "../../../components/services";
import { Langs } from "../../../enums";
import { GlobalContext } from "../../../App";
import { useNavigate } from "react-router-dom";


interface Product {
    id: number;
    name: string;
    image: string;
    tags: string[];
    price: number;
    category: string;
}

interface RawProduct {
    id: number;
    name: string;
    image: string;
    tags: string;
    price: number;
    category: string;
}

type TTopicsComponentContent = {
    title: string,
    delete: string,
    cost: string,
    size: string,
    colors: string,
    successDelete: string,
    errorDelete: string,
    buy: string
};

const contentsMap = new Map<Langs, TTopicsComponentContent>([
    [Langs.UZ, {
        title: "Sizning tangalaringiz",
        delete: "O'chirish",
        cost: "narxi",
        size: "hajmi",
        colors: "ranglari",
        successDelete: "Muvaffaqiyatli o'chirildi!",
        errorDelete: "Elementni o'chirishda xatolik.",
        buy: "sotib olish"
    }],
    [Langs.RU, {
        title: "Ваши монеты",
        delete: "Удалить",
        cost: "стоимость",
        size: "размер",
        colors: "цвета",
        successDelete: "Успешно удалено!",
        errorDelete: "Ошибка при удалении элемента.",
        buy: "купить"
    }],
    [Langs.EN, {
        title: "Your coins",
        delete: "Delete",
        cost: "cost",
        size: "size",
        colors: "colors",
        successDelete: "Successfully deleted!",
        errorDelete: "Error deleting item.",
        buy: "buy"
    }]
]);

function ShopItemsPage() {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TTopicsComponentContent;
    const navigate = useNavigate();
    const { id } = useParams();
    const { role } = useContext(UserContext);
    const [coinBalance, setCoinBalance] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await client.get(`shop/products/?category=${id}`);
                const data: Product[] = response.data.map((item: RawProduct) => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    tags: Array.isArray(item.tags) ? item.tags : [],
                    price: item.price,
                    category: item.category
                }));
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };

        fetchProducts();
    }, [id,deleteProductId, isModalOpen]);


    useEffect(() => {
        const fetchCoinBalance = async () => {
          try {
            const response = await client.get("/shop/wallet/");
            setCoinBalance(response.data.balance);
          } catch (error) {
            console.error("Failed to fetch coin balance:", error);
          }
        };
        fetchCoinBalance();
      }, []);

    const handleDelete = async (productId: number) => {
        setDeleteProductId(productId);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteProductId !== null) {
            try {
                await client.delete(`shop/products/${deleteProductId}/`);
                toast.success(contents.successDelete);
                setProducts((prevProducts) => prevProducts.filter(item => item.id !== deleteProductId));
            } catch (error) {
                // toast.error(contents.errorDelete);
            } finally {
                setIsConfirmDeleteOpen(false);
                setDeleteProductId(null);
            }
        }
    };

    const closeConfirmDelete = () => {
        setIsConfirmDeleteOpen(false);
        setDeleteProductId(null);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="w-full mt-12 md:mt-0 overflow-y-auto">
            <div className="header">
                <div className="flex justify-between items-center m-5">
                    <button onClick={() => window.history.back()} className='w-12 h-12 my-3 bg-gray-200 hover:bg-gray-300 rounded'>
                        <i className='fa-solid fa-arrow-left text-black'></i>
                    </button>
                    <div className="flex gap-5">
                        <h1 className={`2xl:text-4xl text-3xl font-bold dark:text-customText`}>
                            {contents.title}
                        </h1>
                        <span className="text-green-700 hidden md:block 2xl:text-4xl text-3xl font-bold">
                            {coinBalance} <i className="fa-solid fa-coins"></i>
                        </span>
                    </div>
                    <div>
                        {role === "admin" && (
                            <button onClick={openModal} className='py-3 px-4 text-white bg-blue-400 rounded hover:bg-blue-700'>
                                <i className='fa-solid fa-plus'/>
                            </button>
                        )}
                        {role === "student" && (
                            <Link to="/shop/orders/list/" className='py-3 px-4 text-white bg-blue-400 rounded hover:bg-blue-700'>
                                <i className='fa-solid fa-history'/>
                            </Link>
                        )}
                    </div>
                </div>
                <span className="text-green-700 flex justify-center md:hidden 2xl:text-4xl text-3xl font-bold">
                            {coinBalance} <i className="fa-solid fa-coins"></i>
                        </span>
            </div>

            <div className="2xl:h-[680px] h-[480px] overflow-y-auto">
                <div className="items flex py-5 flex-col gap-7 justify-center content-center p-3">
                    <div className="p-2 lg:p-7 lg:pt-0 grid 2xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-4">
                        {products.map((item) => (
                            <div key={item.id} className="card bg-white border-slate-600 shadow-md rounded-md dark:text-white dark:bg-gray-700">
                                <div className="w-full 2xl:h-80 h-52 post-img">
                                    <img className="w-full rounded-md h-full z-10 object-cover" src={item.image} alt={item.name}/>
                                </div>
                                <div className="post-content p-4">
                                    <h3 className="post-title hover:text-blue-500 text-xl font-semibold mb-2">
                                        {item.name}
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xl">
                                            {contents.cost}: <span className="text-green-700 font-bold">{item.price}<i className="fa-solid fa-coins"></i></span>
                                        </p>
                                        <div className="container flex items-center">
                                            <p className="text-xl flex gap-2">
                                                {contents.size}: <span className="text-green-700 font-bold"></span>
                                            </p>
                                            <div className="flex gap-3">
                                                <span>SM</span>
                                                <span>MD</span>
                                                <span>XL</span>
                                                <span>2XL</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <p className="text-xl">{contents.colors}: </p>
                                            <div className="shop__sidebar__color">
                                                <label className="c-1" htmlFor={`sp-1-${item.id}`}>
                                                    <input type="radio" id={`sp-1-${item.id}`} />

                                                </label>
                                                <label className="c-2" htmlFor={`sp-2-${item.id}`}>
                                                    <input type="radio" id={`sp-1-${item.id}`} />
                                                </label>
                                                <label className="c-3" htmlFor={`sp-3-${item.id}`}>
                                                    <input type="radio" id={`sp-1-${item.id}`} />
                                                </label>
                                                <label className="c-5" htmlFor={`sp-5-${item.id}`}>
                                                    <input type="radio" id={`sp-1-${item.id}`} />
                                                </label>
                                                <label className="c-8" htmlFor={`sp-8-${item.id}`}>
                                                    <input type="radio" id={`sp-1-${item.id}`} />
                                                </label>


                                            </div>
                                        </div>
                                        <div className="description-box w-full">
                                            <div className="flex justify-center">
                                                {role === "admin" ? (
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 w-full rounded-md bg-red-600 text-white">
                                                        {contents.delete} <i className="ml-1 fa-solid fa-trash-can" />
                                                    </button>
                                                ) : (
                                                    <button className="p-2 w-full rounded-md bg-green-600 hover:bg-green-700 hover:shadow text-white"
                                                    onClick={() => navigate(`/shop/buy/${item.id}`)}>
                                                        {contents.buy}<i className="ml-1 fa-solid fa-shopping-cart"/>
                                                    </button>
                                                )}
                                                <div className="tags flex flex-wrap gap-1 mt-2">
                                                    {item.tags.map((tag, index) => (
                                                        <span key={index}
                                                              className="bg-gray-200 rounded p-1 px-2 dark:bg-gray-400">#{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} />
            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={closeConfirmDelete}
                onConfirm={confirmDelete}
            />
        </div>
    );
}

export default ShopItemsPage;

