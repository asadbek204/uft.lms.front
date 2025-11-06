import {useContext } from "react";
import client from "../../components/services";
import { toast } from "react-toastify";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
type TNewsComponentContent = {
    toast1: string;
    toast2: string;
    title: string;
    description: string;
    button1: string;
    button2: string;
};
const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        toast1: "Kitob muvaffaqiyatli oʻchirildi",
        toast2: "Kitobni o‘chirib bo‘lmadi",
        title: "Oʻchirishni tasdiqlang",
        description: "O'chirish uchun 2 martta bosing",
        button1: "Bekor qilish",
        button2: "Tasdiqlash"
    }],
    [Langs.RU, {
        toast1: "Книга успешно удалена",
        toast2: "Не удалось удалить книгу",
        title: "Подтвердить удаление",
        description: "Дважды щелкните, чтобы удалить",
        button1: "Отмена",
        button2: "Подтверждать"
    }],
    [Langs.EN, {
        toast1: "Book deleted successfully",
        toast2: "Failed to delete book",
        title: "Confirm Delete",
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
const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isVisible, content, onDelete, onClose }) => {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const deleteBook = async (id: number) => {
        await client.delete(`books/${id}/`)
            .then(() => {
                toast.success(contents.toast1);
                onDelete(id);
            })
            .catch(() => {
                toast.error(contents.toast2);
            });
    };
    const handleConfirm = () => {
        if (content !== null) {
            deleteBook(content);
            onClose();
        }
    };
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white border-2 border-slate-300 p-5 rounded-lg shadow-lg z-50 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <h1 className="text-xl font-bold mb-4">{contents.title}</h1>
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