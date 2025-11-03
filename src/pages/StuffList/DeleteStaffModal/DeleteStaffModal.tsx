import React from "react";

interface DeleteStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    lang: "uz" | "ru" | "en";
}

const translations = {
    uz: {
        title: "O‘chirishni tasdiqlang",
        message: "Ushbu xodimni o‘chirmoqchimisiz?",
        cancel: "Bekor qilish",
        delete: "O‘chirish",
    },
    ru: {
        title: "Подтвердите удаление",
        message: "Вы уверены, что хотите удалить этого сотрудника?",
        cancel: "Отмена",
        delete: "Удалить",
    },
    en: {
        title: "Confirm Deletion",
        message: "Are you sure you want to delete this staff member?",
        cancel: "Cancel",
        delete: "Delete",
    },
};

const DeleteStaffModal: React.FC<DeleteStaffModalProps> = ({ isOpen, onClose, onDelete, lang }) => {
    if (!isOpen) return null;

    const t = translations[lang];

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
                onClick={(e) => e.stopPropagation()} // ichiga bosganda yopilmasin
            >
                <h2 className="text-lg font-semibold mb-4 text-center">{t.title}</h2>
                <p className="text-center">{t.message}</p>

                <div className="flex justify-center mt-6 gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                        {t.cancel}
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        {t.delete}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteStaffModal;
