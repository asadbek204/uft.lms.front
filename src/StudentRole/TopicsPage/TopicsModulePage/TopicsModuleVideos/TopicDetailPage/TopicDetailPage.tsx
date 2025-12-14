import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import client from "../../../../../components/services";
import { Langs } from '../../../../../enums';
import { GlobalContext } from '../../../../../App';
import Loading from '../../../../../components/LoadingComponent/Loading.tsx';
import VideoComponent from "../../../../../components/VideoComponent/VideoComponent.tsx";
import ExamTabContent from '../../../../../TeacherRole/TCHTopicsPage/TCHTopicsSingle/TCHTopicsSingleDetail/ExamTabContent';

type THomework = {
  id: number;
  file: string;
  description?: string | null;
  path?: string | null;
  main?: string | null;
};

type TSource = {
  id: number;
  file: string;
  description: string;
  path?: string | null;
  main?: string | null;
};

type TCourseDetail = {
  id: number;
  group: { id: number; name: string; schedule: any[]; status: boolean };
  date: string;
  unit: string;
  homework: THomework | null;
  exam: number | string | null; 
  source: TSource[];
  video: {
    id: number;
    file: string;
    description?: string | null;
    path?: string | null;
    main?: string | null;
  } | null;
};

type TExamDetail = {
  id: number;
  exam: { questions: string };
  unit: string;
  date: string;
};

const contentsMap = new Map<Langs, any>([
  [Langs.UZ, { title: "Mavzu", noContent: "Bu dars uchun hech qanday material yuklanmagan.", additionalInfo: "Qo‘shimcha materiallar", lessonTab: "Dars materiallari", examTab: "Imtihon" }],
  [Langs.RU, { title: "Тема", noContent: "Для этого урока не загружено никаких материалов.", additionalInfo: "Дополнительные материалы", lessonTab: "Материалы урока", examTab: "Экзамен" }],
  [Langs.EN, { title: "Topic", noContent: "No materials have been uploaded for this lesson.", additionalInfo: "Additional materials", lessonTab: "Lesson Materials", examTab: "Exam" }],
]);

const TopicDetailPage: React.FC = () => {
  const { lang } = useContext(GlobalContext);
  const t = contentsMap.get(lang)!;

  const { courseId } = useParams<{ courseId: string }>();

  if (!courseId) {
    return <div className="text-center py-20 text-3xl text-red-600">Dars ID topilmadi!</div>;
  }

  const lessonId = Number(courseId);

  if (isNaN(lessonId)) {
    return <div className="text-center py-20 text-3xl text-red-600">Noto'g'ri ID: {courseId}</div>;
  }

  const [courseDetail, setCourseDetail] = useState<TCourseDetail | null>(null);
  const [examDetail, setExamDetail] = useState<TExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lesson" | "exam">("lesson");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const lessonRes = await client.get(`/education/lessons/${lessonId}/`);
        setCourseDetail(lessonRes.data);

        if (lessonRes.data.exam !== null && lessonRes.data.exam !== undefined) {
          try {
            const examRes = await client.get(`/education/exam/detail/${lessonId}/`);
            setExamDetail(examRes.data);
          } catch (examErr) {
            console.error("Imtihon ma'lumotlari yuklanmadi:", examErr);
          }
        }
      } catch (err) {
        console.error("Dars ma'lumotlari yuklanmadi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId]);

  useEffect(() => {
    if (!courseDetail) return;

    const hasVideo = !!courseDetail.video;
    const hasHomework = !!courseDetail.homework;
    const hasSource = courseDetail.source.length > 0;
    const hasLessonContent = hasVideo || hasHomework || hasSource;
    const hasExam = !!courseDetail.exam && !!examDetail;

    if (!hasLessonContent && hasExam) {
      setActiveTab("exam");
    } else if (hasLessonContent) {
      setActiveTab("lesson");
    }
  }, [courseDetail, examDetail]);

  if (loading) return <Loading />;

  if (!courseDetail) {
    return <div className="text-center py-20 text-red-500">Dars topilmadi</div>;
  }

  const hasVideo = !!courseDetail.video;
  const hasHomework = !!courseDetail.homework;
  const hasSource = courseDetail.source.length > 0;
  const hasLessonContent = hasVideo || hasHomework || hasSource;
  const hasExam = !!courseDetail.exam && !!examDetail;

  const examIdForUpload = lessonId;



  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-5 bg-white dark:bg-gray-800 shadow-md">
        <button onClick={() => window.history.back()} className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>

        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          {t.title}: <span className="text-blue-600 dark:text-blue-400">{courseDetail.unit}</span>
        </h1>

        <div className="w-12" />
      </div>

      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex border-b border-gray-300 dark:border-gray-600">
          {hasLessonContent && (
            <button onClick={() => setActiveTab("lesson")} className={`px-8 py-4 font-semibold text-lg transition ${activeTab === "lesson" ? "border-b-4 border-blue-600 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900"}`}>
              {t.lessonTab}
            </button>
          )}
          {hasExam && (
            <button onClick={() => setActiveTab("exam")} className={`px-8 py-4 font-semibold text-lg transition ${activeTab === "exam" ? "border-b-4 border-green-600 text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900"}`}>
              {t.examTab}
            </button>
          )}
        </div>

        <div className="p-6 min-h-[60vh]">
          {activeTab === "lesson" && hasLessonContent && (
            <div className="space-y-10">
              {hasVideo && (
                <div className="flex justify-center">
                  <div className="w-full md:w-10/12 lg:w-8/12">
                    <VideoComponent videoData={courseDetail.video!.file} videoClass="rounded-xl w-full max-h-[500px] object-contain shadow-2xl" />
                  </div>
                </div>
              )}

              {(hasHomework || hasSource) && (
                <div>
                  <h2 className="text-2xl mb-6 font-bold">{t.additionalInfo}</h2>

                  {hasHomework && courseDetail.homework && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl space-y-4 mb-8">
                      {courseDetail.homework.description && (
                        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                          {courseDetail.homework.description}
                        </p>
                      )}
                      {courseDetail.homework.file && (
                        <a href={courseDetail.homework.file} target="_blank" rel="noopener noreferrer" className="block text-blue-600 dark:text-blue-400 hover:underline break-all text-lg">
                          {courseDetail.homework.file}
                        </a>
                      )}
                    </div>
                  )}

                  {hasSource && (
                    <div className="grid gap-6">
                      {courseDetail.source.map((s) => (
                        <div key={s.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                          {s.description && <p className="mb-3 text-gray-800 dark:text-gray-200">{s.description}</p>}
                          <a href={s.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all text-lg">
                            {s.file}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "exam" && hasExam && examDetail && (
            <ExamTabContent
              examData={examDetail}
              examId={examIdForUpload}  // lessonId = 10 → backend shuni kutmoqda!
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;