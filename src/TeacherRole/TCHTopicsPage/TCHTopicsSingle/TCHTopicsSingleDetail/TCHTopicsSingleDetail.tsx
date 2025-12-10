// TopicDetailPage.tsx – TO‘LIQ, XATOSIZ VERSIYA

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import client from "../../../../components/services";
import { Langs } from '../../../../enums';
import { GlobalContext } from '../../../../App';
import Loading from '../../../../components/LoadingComponent/Loading';
import Modal from "./Modal.tsx";
import ExamCreateModal from "./ExamCreateModal.tsx";

// Types (oldingi kodingizdan nusxa)
type THomework = { id: number; file: string; description: string | null; path: string | null; main: string | null; };
type TCourseDetail = {
  id: number;
  group: { id: number; name: string; schedule: any[]; status: boolean; };
  date: string;
  unit: string;
  homework: THomework | null;
  exam: string | null;
  source: { id: number; file: string; description: string; path: string | null; main: string | null; }[];
  video: { id: number; file: string; description: string | null; path: string | null; main: string | null; };
};

const contentsMap = new Map<Langs, any>([
  [Langs.UZ, { title: "Mavzu", noHomework: "Uyga vazifa berilmagan.", additionalInfo: "Qo‘shimcha materiallar" }],
  [Langs.RU, { title: "Тема", noHomework: "Домашнее задание не задано.", additionalInfo: "Дополнительные материалы" }],
  [Langs.EN, { title: "Topic", noHomework: "No homework assigned.", additionalInfo: "Additional materials" }],
]);

const TopicDetailPage: React.FC = () => {
  const { lang } = useContext(GlobalContext);
  const t = contentsMap.get(lang)!;

  // id – string bo‘lib keladi (masalan "9")
  const { id } = useParams<{ id: string }>();

  // Agar id bo‘lmasa – darrov xato ko‘rsatamiz
  if (!id) {
    return <div className="text-center text-red-600 text-2xl">Dars ID topilmadi!</div>;
  }

  const lessonId = Number(id); // faqat son bo‘lishi kerak
  if (isNaN(lessonId)) {
    return <div className="text-center text-red-600 text-2xl">Noto‘g‘ri ID</div>;
  }

  const [courseDetail, setCourseDetail] = useState<TCourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Ma'lumotlarni yuklash
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await client.get(`/education/lessons/${lessonId}/`);
        setCourseDetail(res.data);
      } catch (err: any) {
        console.error("Dars yuklanmadi:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lessonId]);

  if (loading) return <Loading />;
  if (!courseDetail) return <div className="text-center py-10 text-red-500">Dars topilmadi</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-white dark:bg-gray-800 shadow">
        <button onClick={() => window.history.back()} className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>

        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          {t.title}: {courseDetail.unit}
        </h1>

        <div className="flex items-center gap-4">
          {/* Tahrirlash */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white">
            <i className="fa-solid fa-pen"></i>
          </button>

          {/* Imtihon yaratish – faqat hali imtihon bo‘lmasa ko‘rsatiladi */}
          {!courseDetail.exam && (
            <button
              onClick={() => setIsExamModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg">
              <i className="fa-solid fa-graduation-cap"></i>
              {lang === Langs.UZ ? "Imtihon yaratish" : lang === Langs.RU ? "Создать экзамен" : "Create Exam"}
            </button>
          )}
        </div>
      </div>

      {/* Kontent */}
      <div className="p-6 max-w-5xl mx-auto space-y-10">
        {/* Video */}
        {courseDetail.video && (
          <div className="flex justify-center">
            <video controls className="rounded-xl max-w-4xl w-full shadow-2xl" src={courseDetail.video.file} />
          </div>
        )}

        {/* Homework */}
        {courseDetail.homework?.description && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-lg leading-relaxed">{courseDetail.homework.description}</p>
          </div>
        )}

        {/* Agar homework bo‘lmasa */}
        {!courseDetail.homework && !courseDetail.video && (
          <p className="text-center text-2xl text-gray-500">{t.noHomework}</p>
        )}

        {/* Qo‘shimcha materiallar */}
        {courseDetail.source.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{t.additionalInfo}</h2>
            <div className="grid gap-4">
              {courseDetail.source.map(s => (
                <div key={s.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  {s.description && <p className="mb-2">{s.description}</p>}
                  <a href={s.file} target="_blank" className="text-blue-600 hover:underline break-all">
                    {s.file}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALLAR */}
      <Modal isVisible={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

      <ExamCreateModal
        isVisible={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        lessonId={lessonId}                    // 100% to‘g‘ri son
        groupId={courseDetail.group.id}         // avtomatik yuboriladi
        onSuccess={() => {
          // Muvaffaqiyatdan keyin sahifani yangilaymiz
          window.location.reload(); // yoki useEffect ishlasin desangiz – shunchaki modalni yopamiz
        }}
      />
    </div>
  );
};

export default TopicDetailPage;