import React, { useState, useContext } from "react";
import { Langs } from "../../../../enums";
import { GlobalContext } from "../../../../App";
import { toast } from "react-toastify";
import client from "../../../../components/services";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  examId: number;
};

const contentsMap = new Map<Langs, {
  title: string;
  uploadLabel: string;
  submit: string;
  cancel: string;
  success: string;
  error: string;
  noFile: string;
  noExamId: string;
}>([
  [Langs.UZ, { title: "Imtihon javobini yuklash", uploadLabel: "Javob varaqasini yuklang", submit: "Yuborish", cancel: "Bekor qilish", success: "Javobingiz yuborildi!", error: "Xatolik yuz berdi.", noFile: "Fayl tanlang.", noExamId: "Imtihon topilmadi." }],
  [Langs.RU, { title: "Загрузить ответ", uploadLabel: "Загрузите ответ", submit: "Отправить", cancel: "Отмена", success: "Ответ отправлен!", error: "Ошибка.", noFile: "Выберите файл.", noExamId: "Экзамен не найден." }],
  [Langs.EN, { title: "Upload Answer", uploadLabel: "Upload your answer", submit: "Submit", cancel: "Cancel", success: "Answer submitted!", error: "Error occurred.", noFile: "Select a file.", noExamId: "Exam not found." }],
]);

export default function AnswerUploadModal({ isVisible, onClose, examId }: Props) {
  const { lang } = useContext(GlobalContext);
  const t = contentsMap.get(lang)!;

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return toast.warning(t.noFile);
    if (!examId) return toast.error(t.noExamId);

    const formData = new FormData();
    formData.append("answer_sheet", file);
    formData.append("exam", examId.toString());

    setUploading(true);
    try {
      await client.post("education/exam/answers/create/", formData);
      toast.success(t.success);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t.error);
    } finally {
      setUploading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-center mb-6">{t.title}</h3>

        <div className="space-y-6">
          <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-blue-500">
            <input type="file" className="hidden" id="upload" onChange={handleFileChange} />
            <label htmlFor="upload" className="cursor-pointer block">
              <i className="fa-solid fa-cloud-upload-alt text-5xl text-gray-400 mb-4"></i>
              <p>{t.uploadLabel}</p>
              {file && <p className="mt-4 text-green-600 truncate">{file.name}</p>}
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button onClick={onClose} disabled={uploading} className="px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-xl">
              {t.cancel}
            </button>
            <button onClick={handleSubmit} disabled={uploading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              {uploading ? "Yuborilmoqda..." : t.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}