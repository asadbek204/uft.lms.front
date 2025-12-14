import React, { useState, useContext } from "react";
import { Langs } from "../../../../enums";
import { GlobalContext } from "../../../../App";
import AnswerUploadModal from "./AnswerUploadModal";

type ExamData = {
  id: number;
  exam: { questions: string };
  unit: string;
  date: string;
};

type Props = {
  examData: ExamData | null;
  examId: number; // Haqiqiy exam ID
};

const contentsMap = new Map<Langs, {
  title: string;
  noExam: string;
  download: string;
  unit: string;
  date: string;
  uploadAnswer: string;
}>([
  [Langs.UZ, { title: "Imtihon savollari", noExam: "Imtihon fayli yuklanmagan.", download: "Savollarni ko'rish", unit: "Mavzu", date: "Sana", uploadAnswer: "Javobimni yuklash" }],
  [Langs.RU, { title: "Вопросы экзамена", noExam: "Файл экзамена не загружен.", download: "Просмотреть вопросы", unit: "Тема", date: "Дата", uploadAnswer: "Загрузить ответ" }],
  [Langs.EN, { title: "Exam Questions", noExam: "Exam file not uploaded.", download: "View Questions", unit: "Topic", date: "Date", uploadAnswer: "Upload My Answer" }],
]);

export default function ExamTabContent({ examData, examId }: Props) {
  const { lang, role } = useContext(GlobalContext);
  const t = contentsMap.get(lang)!;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (!examData) return null;

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        {t.title}
      </h2>

      <div className="max-w-2xl mx-auto space-y-8 text-center">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
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

        {/* Talaba uchun yuklash tugmasi */}
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

      <AnswerUploadModal
        isVisible={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        examId={examId} 
      />
    </div>
  );
}