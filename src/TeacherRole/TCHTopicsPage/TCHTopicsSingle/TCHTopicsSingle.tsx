import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../App.tsx";
import { Langs } from "../../../enums.ts";
import client from "../../../components/services";
import { useParams, Link } from "react-router-dom";

type TTopicsComponentContent = {
  title: string;
  text: string;
  tableHeaders: {
    date: string;
    unit: string;
  };
  errorMessage: string;
  error2: string;
};

const contentsMap = new Map<Langs, TTopicsComponentContent>([
  [
    Langs.UZ,
    {
      title: "Darslar",
      text: "Siz tanlagan dars dasturini to'liq yuklab olishingiz mumkin",
      tableHeaders: {
        date: "Sanasi",
        unit: "Mavzu",
      },
      errorMessage: "Darslar olishda xatolik yuz berdi",
      error2: "Darslar mavjud emas",
    },
  ],
  [
    Langs.RU,
    {
      title: "Уроки",
      text: "Вы можете скачать полную программу по вашему выбору",
      tableHeaders: {
        date: "Дата",
        unit: "Тема",
      },
      errorMessage: "Ошибка при получении курсов",
      error2: "Нет доступных курсов",
    },
  ],
  [
    Langs.EN,
    {
      title: "Lessons",
      text: "You can download the complete syllabus of your choice",
      tableHeaders: {
        date: "Date",
        unit: "Topic",
      },
      errorMessage: "Error fetching courses",
      error2: "No courses available",
    },
  ],
]);

type TCourses = {
  id: number;
  date: string;
  unit: string;
};

const STTopicsItem: React.FC = () => {
  const { id, moduleId } = useParams<{ id: string; moduleId: string }>();
  const { lang, userId } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TTopicsComponentContent;
  const [courses, setCourses] = useState<TCourses[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await client.get(`education/lessons/?group=${id}`);
        setCourses(response.data as TCourses[]);
      } catch (error) {
        setError(contents.errorMessage);
        console.error("Failed to fetch courses", error);
      }
    })();
  }, [id, moduleId, userId, contents.errorMessage]);

  return (
    <div className="w-full mt-12 md:mt-0">
      <div className="mx-5 my-5 mb-0 justify-between items-center text-center flex gap-2">
        <button
          onClick={() => window.history.back()}
          className="w-12 h-12 my-3 ms-5 bg-gray-200 hover:bg-gray-300 rounded"
        >
          <i className="fa-solid fa-arrow-left text-black"></i>
        </button>
        <h1 className="2xl:text-4xl text-3xl font-bold  dark:text-customText">
          {contents.title}
        </h1>
        <Link to={`/topics-attandance/${id}`}>
          <button className="w-20 h-12 bg-blue-400 text-slate-200 hover:text-black  hover:bg-gray-300  rounded">
            Yo'qlama
          </button>
        </Link>
      </div>
      <div>
        <h3 className="text-gray-500  text-center pb-8">{contents.text}</h3>
      </div>
      <div className="w-full 2xl:h-[80%] h-[75%]  overflow-y-auto">
        {error ? (
          <div className="text-center p-4 text-red-500">{contents.error2}</div>
        ) : (
          <table className="bg-white w-11/12 mx-auto table-fixed border-collapse border border-slate-500">
            <thead className="border">
              <tr>
                <th className="border border-slate-200 p-2">
                  {contents.tableHeaders.unit}
                </th>
                <th className="border border-slate-200 p-2">
                  {contents.tableHeaders.date}
                </th>
              </tr>
            </thead>
            <tbody className="border">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="w-full drop-shadow-lg bg-white dark:bg-gray-700"
                  >
                    <td className="border text-center border-slate-200 p-2">
                      <Link
                        to={`${course.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {course.unit}
                      </Link>
                    </td>
                    <td className="border text-center border-slate-200 p-2">
                      {course.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center p-4">
                    {contents.error2}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default STTopicsItem;
