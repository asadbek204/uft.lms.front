// import React from 'react';

// type ConfirmDeleteModalProps = {
//       isVisible: boolean;
//     content: number;
//     onClose: () => void;
//     onConfirm: () => Promise<void>;
// };

// const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isVisible, onClose, onConfirm }) => {
//     if (!isVisible) return null;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded shadow-md">
//                 <h2 className="text-lg font-bold">Confirm Deletion</h2>
//                 <p>Are you sure you want to delete this group? This action cannot be undone.</p>
//                 <div className="mt-4 flex justify-end">
//                     <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
//                     <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ConfirmDeleteModal;


import React, { useContext } from "react";
import { GlobalContext } from "../../../App";
import { Langs } from "../../../enums";

type TConfirmDeleteModalContent = {
    toast1: string;
    toast2: string;
    toast3: string;
    title: string;
    description: string; 
    button1: string;
    button2: string;
};

const contentsMap = new Map<Langs, TConfirmDeleteModalContent>([
    [Langs.UZ, {
        toast1: "Guruh muvaffaqiyatli oʻchirildi",
        toast2: "Guruhni o‘chirib bo‘lmadi",
        toast3: "Guruh bo'sh emas!",
        title: "Guruhni o'chirishni tasdiqlang",
        description: "O'chirish uchun 2 martta bosing",
        button1: "Bekor qilish",
        button2: "Tasdiqlash"
    }],
    [Langs.RU, {
        toast1: "Группа успешно удалена",
        toast2: "Не удалось удалить группу",
        toast3: "Группа не пуста!",
        title: "Подтвердите удаление группы",
        description: "Дважды щелкните, чтобы удалить",
        button1: "Отмена",
        button2: "Подтверждать"
    }],
    [Langs.EN, {
        toast1: "Group deleted successfully",
        toast2: "Failed to delete group",
        toast3: "The group is not empty!",
        title: "Confirm Delete Group",
        description: "Double click to delete",
        button1: "Cancel",
        button2: "Confirm"
    }],
]);

interface ConfirmDeleteModalProps {
    isVisible: boolean;
   
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({isVisible,  onClose, onConfirm }) => {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang)!;

  
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white border-2 border-slate-300 p-5 rounded-lg z-50 shadow-lg max-w-md w-full">
                <h1 className="text-xl font-bold mb-4">{contents.title}</h1>
                <p className="mb-4">{contents.description}</p>
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

