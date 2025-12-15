import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import client from "../../../../components/services";
import { Langs } from '../../../../enums';
import { GlobalContext } from '../../../../App';
import Loading from '../../../../components/LoadingComponent/Loading';
import Modal from "./Modal.tsx";
import ExamCreateModal from "./ExamCreateModal.tsx";
import ExamTabContent from "./ExamTabContent.tsx"; // Yangi import

type THomework = {
  id: number;
  file: string;
  description?: string;
  path?: string;
  main?: string;
};
type TSource = {
  id: number;
  file: string;
  description: string;
  path?: string;
  main?: string;
};

type TCourseDetail = {
  id: number;
  group: { id: number; name: string; schedule: any[]; status: boolean };
  date: string;
  unit: string;
  homework: THomework | null;
  exam: string | null;
  source: TSource[];
  video: {
    id: number;
    file: string;
    description: string | null;
    path: string | null;
    main: string | null;
  };
};

type TExamDetail = {
  id: number;
  exam: { questions: string };
  unit: string;
  date: string;
};

const contentsMap = new Map<Langs, any>([
  [
    Langs.UZ,
    {
      title: "Mavzu",
      noHomework: "Uyga vazifa berilmagan.",
      additionalInfo: "Qo‘shimcha materiallar",
      lessonTab: "Dars materiallari",
      examTab: "Imtihon",
    },
  ],
  [
    Langs.RU,
    {
      title: "Тема",
      noHomework: "Домашнее задание не задано.",
      additionalInfo: "Дополнительные материалы",
      lessonTab: "Материалы урока",
      examTab: "Экзамен",
    },
  ],
  [
    Langs.EN,
    {
      title: "Topic",
      noHomework: "No homework assigned.",
      additionalInfo: "Additional materials",
      lessonTab: "Lesson Materials",
      examTab: "Exam",
    },
  ],
]);

const TopicDetailPage: React.FC = () => {
  const { lang } = useContext(GlobalContext);
  const t = contentsMap.get(lang)!;

  const { id } = useParams<{ id: string }>();
  const lessonId = Number(id);

  const [courseDetail, setCourseDetail] = useState<TCourseDetail | null>(null);
  const [examDetail, setExamDetail] = useState<TExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lesson" | "exam">("lesson");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonRes, examRes] = await Promise.all([
        client.get(`/education/lessons/${lessonId}/`),
        client
          .get(`/education/exam/detail/${lessonId}/`)
          .catch(() => null),
      ]);

      setCourseDetail(lessonRes.data);

      if (examRes) {
        setExamDetail(examRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [lessonId]);

useEffect(() => {
  if (!courseDetail) return;

  const hasExam = !!examDetail;
  const hasLessonContent =
    !!courseDetail.homework || courseDetail.source.length > 0;

  if (!hasLessonContent && hasExam) {
    setActiveTab("exam");
  }

  if (!hasExam && hasLessonContent) {
    setActiveTab("lesson");
  }
}, [courseDetail, examDetail]);


  if (loading) return <Loading />;
  if (!courseDetail)
    return <div className="text-center py-10 text-red-500">Dars topilmadi</div>;

  const hasExam = !!examDetail;
  const hasLessonContent =
    !!courseDetail.homework || courseDetail.source.length > 0;



  return (
    <div className="w-full overflow-y-scroll  ">
      <div className="flex items-center justify-between px-6 py-5 ">
        <button
          onClick={() => window.history.back()}
          className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>

        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          {t.title}: {courseDetail.unit}
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white"
          >
            <i className="fa-solid fa-pen"></i>
          </button>

          {!hasExam && (
            <button
              onClick={() => setIsExamModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"
            >
              <i className="fa-solid fa-graduation-cap"></i>
              {lang === Langs.UZ
                ? "Imtihon yaratish"
                : lang === Langs.RU
                ? "Создать экзамен"
                : "Create Exam"}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto ">
        <div className="flex border-b border-gray-300 dark:border-gray-600">
          {hasLessonContent && (
            <button
              onClick={() => setActiveTab("lesson")}
              className={`px-8 py-4 font-semibold text-lg transition ${
                activeTab === "lesson"
                  ? "border-b-4 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              {t.lessonTab}
            </button>
          )}

          {hasExam && (
            <button
              onClick={() => setActiveTab("exam")}
              className={`px-8 py-4 font-semibold text-lg transition ${
                activeTab === "exam"
                  ? "border-b-4 border-green-600 text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              {t.examTab}
            </button>
          )}
        </div>

        <div className="p-6">
          {activeTab === "lesson" && hasLessonContent && (
            <div className="space-y-10">
              {courseDetail.video && (
                <div className="flex justify-center">
                  <video
                    controls
                    className="rounded-xl max-h-[450px] max-w-4xl w-full shadow-2xl"
                    src={courseDetail.video.file}
                  />
                </div>
              )}

              <div className="space-y-8">
                {!courseDetail.homework && courseDetail.source.length === 0 && (
                  <p className="text-center text-2xl text-gray-500">
                    {t.noHomework}
                  </p>
                )}

                {(courseDetail.homework || courseDetail.source.length > 0) && (
                  <div>
                    <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-6 font-bold">
                      {t.additionalInfo}
                    </h2>

                    {courseDetail.homework && (
                      <div className="bg-gray-50 dark:bg-gray-700  rounded-xl">
                        {courseDetail.homework.description && (
                          <p className="text-lg leading-relaxed">
                            {courseDetail.homework.description}
                          </p>
                        )}
                        {courseDetail.homework.file && (
                          <a
                            href={courseDetail.homework.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {courseDetail.homework.file}
                          </a>
                        )}
                      </div>
                    )}

                    {courseDetail.source.length > 0 && (
                      <div className="">
                        <div className="grid gap-6">
                          {courseDetail.source.map((s) => (
                            <div
                              key={s.id}
                              className="bg-gray-50 dark:bg-gray-700 rounded-xl"
                            >
                              {s.description && (
                                <p className="mb-3 text-gray-800 dark:text-gray-200">
                                  {s.description}
                                </p>
                              )}
                              <a
                                href={s.file}
                                target="_blank"
                                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                              >
                                {s.file}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "exam" && hasExam && (
            <ExamTabContent examData={examDetail} examId={0} groupId={courseDetail?.group?.id || 0} />
          )}
        </div>
      </div>

      <Modal
        isVisible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lessonData={courseDetail}
      />

      <ExamCreateModal
        isVisible={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        lessonId={lessonId}
        groupId={courseDetail.group.id}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export default TopicDetailPage;