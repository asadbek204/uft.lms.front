import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import client from "../../components/services";

type TConfirmDeleteModalContent = {
    toast1: string;
    toast2: string;
    title: string;
    description: string; 
    button1: string;
    button2: string;
}

const contentsMap = new Map<Langs, TConfirmDeleteModalContent>([
    [Langs.UZ, {
        toast1: "Guruh muvaffaqiyatli oʻchirildi",
        toast2: "Guruhni o‘chirib bo‘lmadi",
        title: "Oʻchirishni tasdiqlang",
        description: "O'chirish uchun 2 martta bosing",
        button1: "Bekor qilish",
        button2: "Tasdiqlash"
    }],
    [Langs.RU, {
        toast1: "Группа успешно удалена",
        toast2: "Не удалось удалить группу.",
        title: "Подтвердить удаление",
        description: "Дважды щелкните, чтобы удалить",
        button1: "Отмена",
        button2: "Подтверждать"
    }],
    [Langs.EN, {
        toast1: "Group deleted successfully",
        toast2: "Failed to delete group",
        title: "Confirm Delete",
        description: "Click twice to delete",
        button1: "Cancel",
        button2: "Confirm"
    }],
]);

type ConfirmDeleteModalProps = {
    isVisible: boolean;
    onClose: () => void;
    groupId: number | null;
    fetchGroups: () => Promise<void>;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isVisible, onClose, groupId, fetchGroups }) => {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TConfirmDeleteModalContent;

    const [clickCount, setClickCount] = useState(0);

    const handleDelete = async () => {
        if (clickCount === 1) {
            try {
                const response = await client.delete(`education/group/destroy/${groupId}/`);
                if (response.status === 204) {
                    toast.success(contents.toast1);
                    fetchGroups();
                    onClose();
                } else {
                    toast.error(contents.toast2);
                }
            } catch (error) {
                console.error("Failed to delete group:", error);
                toast.error(contents.toast2);
            }
        }
        setClickCount(clickCount + 1);
    };

    if (!isVisible) return null;

    return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
  <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
    <h2 className="text-xl font-bold mb-4">{contents.title}</h2>
    <p className="mb-6">{contents.description}</p>
    <div className="flex justify-between">
      <button
        onClick={onClose}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
      >
        {contents.button1}
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
      >
        {contents.button2}
      </button>
    </div>
  </div>
</div>
    );
};

export default ConfirmDeleteModal;
