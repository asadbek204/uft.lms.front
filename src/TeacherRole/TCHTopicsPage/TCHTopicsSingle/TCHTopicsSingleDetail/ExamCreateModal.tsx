import React, { useContext, useState, useEffect } from 'react';
import client from "../../../../components/services";
import { Langs } from '../../../../enums';
import { GlobalContext } from '../../../../App';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  lessonId: number;
  groupId: number;
  onSuccess: () => void;
};

const translations = new Map<Langs, any>([
  [Langs.UZ, {
    title: "Imtihon yaratish",
    unit: "Bo‘lim nomi",
    questions: "Savollar fayli",
    description: "Izoh",
    submit: "Yaratish",
    cancel: "Bekor qilish",
    loading: "Yuborilmoqda...",
    success: "Imtihon muvaffaqiyatli yaratildi!",
    error: "Xatolik: Bu dars sizga tegishli emas yoki allaqachon imtihon qilingan",
  }],
  [Langs.RU, {
    title: "Создать экзамен",
    unit: "Название юнита",
    questions: "Файл с вопросами",
    description: "Описание",
    submit: "Создать",
    cancel: "Отмена",
    loading: "Отправка...",
    success: "Экзамен успешно создан!",
    error: "Ошибка: Урок не принадлежит вам или уже превращён в экзамен",
  }],
  [Langs.EN, {
    title: "Create Exam",
    unit: "Unit Name",
    questions: "Questions File",
    description: "Description",
    submit: "Create",
    cancel: "Cancel",
    loading: "Submitting...",
    success: "Exam created successfully!",
    error: "Error: This lesson does not belong to you or already converted to exam",
  }],
]);

const ExamCreateModal: React.FC<Props> = ({ isVisible, onClose, lessonId, groupId, onSuccess }) => {
  const { lang } = useContext(GlobalContext);
  const t = translations.get(lang)!;

  const [unit, setUnit] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isVisible) {
      setUnit('');
      setFile(null);
      setDescription('');
      setError('');
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !unit.trim()) return setError("Barcha majburiy maydonlarni to‘ldiring");

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('unit', unit.trim());
    formData.append('group', String(groupId));
    formData.append('questions', file);
    if (description.trim()) formData.append('description', description.trim());

    try {
      // Bu yerda lessonId ni aniq yuboramiz
      const url = `/education/exam/make/lesson/${lessonId}/`;
      console.log("Yuborilayotgan URL:", url);
      console.log("lessonId:", lessonId, "groupId:", groupId);

      await client.put(url, formData, {
        timeout: 60000,
      });

      alert(t.success);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("API Xatosi:", err.response || err);

      let msg = t.error;

      if (err.response?.status === 404) {
        msg = "Dars topilmadi. Bu dars sizga tegishli emas bo‘lishi mumkin.";
      } else if (err.response?.status === 400) {
        msg = err.response.data?.detail || "Ma'lumotlar noto‘g‘ri";
      } else if (err.response?.status === 403) {
        msg = "Ruxsat yo‘q. Bu dars sizga tegishli emas.";
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">{t.title}</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">
              {t.unit} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              placeholder={t.unit}
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">
              {t.questions} <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.json"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="mt-1 w-full text-sm"
            />
            {file && <p className="text-xs text-green-600 mt-1">{file.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">{t.description}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            />
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? t.loading : t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamCreateModal;