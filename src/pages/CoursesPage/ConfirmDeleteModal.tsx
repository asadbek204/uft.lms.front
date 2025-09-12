import { useState } from "react";
import client from "../../components/services";
import { toast } from "react-toastify";
import { useContext } from "react";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";


type TNewsComponentContent = {
    toast1: string;
    toast2: string;
    title: string;
    description: string; 
    button1: string;
    button2: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        toast1: "Kurs muvaffaqiyatli oʻchirildi",
        toast2: "Kursni o‘chirib bo‘lmadi",
        title: "Oʻchirishni tasdiqlang",
        description: " O'chirish uchun 2 martta bosing",
        button1: "Bekor qilish",
        button2: "Tasdiqlash"
    }],
    [Langs.RU, {
        toast1: "Курс успешно удален",
        toast2: "Не удалось удалить курс.",
        title: "Подтвердить удаление",
        description: "Дважды щелкните, чтобы удалить",
        button1: "Отмена",
        button2: "Подтверждать"
    }],
    [Langs.EN, {
        toast1: "Course deleted successfully",
        toast2: "Failed to delete course",
        title: "Confirm Delete",
        description: "Double click to delete",
        button1: "Cancel",
        button2: "Confirm"
    }],
])



function ConfirmDeleteModal({ content, onDelete }: {content: number, onDelete: (content: number) => void}) {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [open, setOpen] = useState(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);

    const handleOpen = () => setOpen(!open);

    const deleteCourses = async (id: number) => {
        if (canDelete) {
            await client.delete(`education/course/delete/${id}/`)
                .then(() => {
                    toast.success(contents.toast1);
                    onDelete(id); // Remove the course from the list
                })
                .catch(() => {
                    toast.error(contents.toast2);
                });
            setOpen(false); // Close modal after deletion
        }
    };

    const handleConfirm = () => {
        setCanDelete(true);
        deleteCourses(content);
    };

    return (
        <>
            <button
  onClick={handleOpen}
  className="m-4 bg-red-600 w-[30px] h-[30px] dark:text-gray-200 text-white rounded-md"
>
  <i className="fa-solid fa-trash-can" />
</button>

{open && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div
      className="absolute inset-0 bg-black bg-opacity-50"
      onClick={handleOpen}
    ></div>
    <div className="bg-white border-2 border-slate-300 p-5 rounded-lg shadow-lg z-50 max-w-md w-full">
      <h1 className="text-xl font-bold mb-4 ">{contents.title}</h1>
      <p className="mb-4 ">{contents.description}</p>
      <div className="flex justify-between space-x-2">
        <button
          onClick={handleOpen}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          {contents.button1}
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          {contents.button2}
        </button>
      </div>
    </div>
  </div>
)}

        </>
    );
}

export default ConfirmDeleteModal;
