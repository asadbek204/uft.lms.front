import React, { useContext } from "react";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";

type TProductComponentContent = {
    toast1: string;
    toast2: string;
    toast3: string;
    title: string;
    description: string; 
    button1: string;
    button2: string;
};

const contentsMap = new Map<Langs, TProductComponentContent>([
    [Langs.UZ, {
        toast1: "O'quvchi muvaffaqiyatli oʻchirildi",
        toast2: "O'quvchini o‘chirib bo‘lmadi",
        toast3: "O'quvchi bo'sh emas!",
        title: "O'quvchini o'chirishni tasdiqlang", // Updated to reflect "O'quvchini o'chirish"
        description: "O'chirish uchun 2 martta bosing",
        button1: "Bekor qilish",
        button2: "Tasdiqlash"
    }],
    [Langs.RU, {
        toast1: "Студент успешно удален",
        toast2: "Не удалось удалить студента",
        toast3: "Студент не пустой!",
        title: "Подтвердить удаление студента",
        description: "Дважды щелкните, чтобы удалить",
        button1: "Отмена",
        button2: "Подтверждать"
    }],
    [Langs.EN, {
        toast1: "Student deleted successfully",
        toast2: "Failed to delete student",
        toast3: "The student is not empty!",
        title: "Confirm Delete Student",
        description: "Double click to delete",
        button1: "Cancel",
        button2: "Confirm"
    }],
]);

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang)!; 

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white border-2 border-slate-300 p-5 rounded-lg z-50 shadow-lg max-w-md w-full">
                <h1 className="text-xl font-bold mb-4 ">{contents.title}</h1>
                <p className="mb-4 ">{contents.description}</p>
                <div className="flex justify-between space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        {contents.button1}
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        {contents.button2}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
