import { useContext } from "react";
import client from "../../components/services";
import { toast } from "react-toastify";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";

type TCategoryComponentContent = {
    toast1: string;
    toast2: string;
    toast3: string;
    title: string;
    description: string; 
    button1: string;
    button2: string;
};

const contentsMap = new Map<Langs, TCategoryComponentContent>([
    [Langs.UZ, {
        toast1: "Kategoriyal muvaffaqiyatli oʻchirildi",
        toast2: "Kategoriyani o‘chirib bo‘lmadi",
        toast3: "Kategoriya bo'sh emas!",
        title: "Kategoriyani o‘chirishni tasdiqlang",
        description: "O'chirish uchun 2 martta bosing",
        button1: "Bekor qilish",
        button2: "Tasdiqlash"
    }],
    [Langs.RU, {
        toast1: "Категория успешно удалена",
        toast2: "Не удалось удалить категорию",
        toast3: "Категория не пустая!",
        title: "Подтвердить удаление категории",
        description: "Дважды щелкните, чтобы удалить",
        button1: "Отмена",
        button2: "Подтверждать"
    }],
    [Langs.EN, {
        toast1: "Category deleted successfully",
        toast2: "Failed to delete category",
        toast3: "The category is not empty!",
        title: "Confirm Delete Category",
        description: "Double click to delete",
        button1: "Cancel",
        button2: "Confirm"
    }],
]);

interface ConfirmDeleteModalProps {
    isVisible: boolean;
    content: number | null;  
    onDelete: (content: number) => void; 
    onClose: () => void;
}
interface ApiError {
    response?: {
        status: number;
        data?: {
            message?: string;
        };
    };
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isVisible, content, onDelete, onClose }) => {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TCategoryComponentContent;

    const deleteCategory = async (id: number) => {
        try {
            await client.delete(`shop/category/${id}/`);
            toast.success(contents.toast1);
            onDelete(id); // Call the onDelete to refresh categories
        } catch (error) {
            const apiError = error as ApiError;

            if (apiError.response && apiError.response.status === 400) {
                toast.error(contents.toast2);
            } else {
                toast.error(contents.toast3); 
            }
        }
    };

    const handleConfirm = () => {
        if (content !== null) {
            deleteCategory(content);
            onClose(); 
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white border-2 border-slate-300 p-5 rounded-lg shadow-lg z-50 max-w-md w-full">
                <h1 className="text-xl font-bold mb-4 ">{contents.title}</h1>
                <p className="mb-4 ">{contents.description}</p>
                <div className="flex justify-between space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        {contents.button1}
                    </button>
                    <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        {contents.button2}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
