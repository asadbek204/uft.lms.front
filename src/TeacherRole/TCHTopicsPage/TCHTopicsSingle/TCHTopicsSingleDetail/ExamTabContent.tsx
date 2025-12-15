import { useState, useContext, useEffect } from "react";
import { Langs } from "../../../../enums";
import { GlobalContext } from "../../../../App";
import AnswerUploadModal from "./AnswerUploadModal";
import client from "../../../../components/services"; // axios instance

type ExamData = {
  id: number;
  exam: { questions: string };
  unit: string;
  date: string;
};

type Answer = {
  id: number;
  answer_sheet: {
    id: number;
    file: string;
    description: string | null;
    path: string | null;
    main: string | null;
  };
  student: {
    id: number;
    first_name: string;
    last_name: string;
    sure_name: string;
  };
  exam: number;
};

type Props = {
  examData: ExamData | null;
  examId: number;
  groupId: number; // YANGI PROP: lesson detaildan keladigan group.id
};

const contentsMap = new Map<Langs, {
  title: string;
  noExam: string;
  download: string;
  unit: string;
  date: string;
  uploadAnswer: string;
  submittedAnswers: string;
  studentName: string;
  answerFile: string;
  noAnswers: string;
}>([
  [Langs.UZ, {
    title: "Imtihon savollari",
    noExam: "Imtihon fayli yuklanmagan.",
    download: "Savollarni ko'rish",
    unit: "Mavzu",
    date: "Sana",
    uploadAnswer: "Javobimni yuklash",
    submittedAnswers: "Talabalar tomonidan yuborilgan javoblar",
    studentName: "Talaba",
    answerFile: "Javob fayli",
    noAnswers: "Hozircha hech kim javob yubormagan."
  }],
  [Langs.RU, {
    title: "Вопросы экзамена",
    noExam: "Файл экзамена не загружен.",
    download: "Просмотреть вопросы",
    unit: "Тема",
    date: "Дата",
    uploadAnswer: "Загрузить ответ",
    submittedAnswers: "Ответы, отправленные студентами",
    studentName: "Студент",
    answerFile: "Файл ответа",
    noAnswers: "Пока никто не отправил ответ."
  }],
  [Langs.EN, {
    title: "Exam Questions",
    noExam: "Exam file not uploaded.",
    download: "View Questions",
    unit: "Topic",
    date: "Date",
    uploadAnswer: "Upload My Answer",
    submittedAnswers: "Submitted Answers by Students",
    studentName: "Student",
    answerFile: "Answer File",
    noAnswers: "No answers submitted yet."
  }],
]);

export default function ExamTabContent({ examData, examId, groupId }: Props) {
  const { lang, role } = useContext(GlobalContext);
  const t = contentsMap.get(lang)!;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(true);

  useEffect(() => {
    if (role !== "teacher" || !groupId) {
      setLoadingAnswers(false);
      return;
    }

    const fetchAnswers = async () => {
      try {
        setLoadingAnswers(true);
        const res = await client.get(`/education/exam/answers/?group=${groupId}`);
        console.log(res.data);
        setAnswers(res.data); 
      } catch (err) {
        console.error("Javoblarni yuklashda xato:", err);
        setAnswers([]);
      } finally {
        setLoadingAnswers(false);
      }
    };

    fetchAnswers();
  }, [role, groupId]);

  if (!examData) return null;

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        {t.title}
      </h2>

      <div className="max-w-4xl mx-auto space-y-10">

        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl p-6">
            <p className="text-xl mb-2">
              <strong>{t.unit}:</strong> {examData.unit}
            </p>
            <p className="text-xl">
              <strong>{t.date}:</strong> {new Date(examData.date).toLocaleDateString()}
            </p>
          </div>

          {examData.exam?.questions ? (
            <a
              href={examData.exam.questions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition text-lg"
            >
              {t.download}
              <i className="fa-solid fa-file-lines text-2xl"></i>
            </a>
          ) : (
            <p className="text-red-500 text-xl font-medium">{t.noExam}</p>
          )}

          {role === "student" && (
            <div className="mt-10">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-xl transition text-xl"
              >
                {t.uploadAnswer}
                <i className="fa-solid fa-upload text-2xl"></i>
              </button>
            </div>
          )}
        </div>

        {role === "teacher" && (
          <div className="mt-12">
            <h3 className="text-2xl text-gray-700 dark:text-gray-300 font-bold mb-6 text-center">{t.submittedAnswers}</h3>

            {loadingAnswers ? (
              <p className="text-center text-gray-500">Yuklanmoqda...</p>
            ) : answers.length === 0 ? (
              <p className="text-center  dark:text-gray-300 text-gray-500">{t.noAnswers}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        №
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.studentName}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.answerFile}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {answers.map((answer, index) => (
                      <tr key={answer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 ">{index + 1}</td>
                        <td className="px-6 text-gray-700 dark:text-gray-300 py-4 text-sm">
                          {answer.student.first_name} {answer.student.last_name}{" "}
                          {answer.student.sure_name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <a
                            href={answer.answer_sheet.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 line-clamp-1 dark:text-blue-400 hover:underline break-all"
                          >
                            {answer.answer_sheet.file.split("/").pop()}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <AnswerUploadModal
        isVisible={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        examId={examId}
      />
    </div>
  );
}