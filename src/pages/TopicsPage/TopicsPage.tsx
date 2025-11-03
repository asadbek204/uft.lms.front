import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../App.tsx";
import { Langs } from "../../enums.ts";
import client from "../../components/services";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";

type TTopicsComponentContent = {
  title: string;
  text: string;
  filePlaceholder: string;
  errorSelectFile: string;
  errorFile: string;
  successMessage: string;
  chooseFile: string;
  noFileChosen: string;
  save: string;
  toast1: string;
  toast2: string;
};

const contentsMap = new Map<Langs, TTopicsComponentContent>([
  [
    Langs.UZ,
    {
      title: "O'quv rejasi",
      text: "Tanlangan kurs uchun yuklangan fayllar ro‘yxati",
      filePlaceholder: "Faylni tanlang",
      errorSelectFile: "Iltimos, fayl tanlang",
      errorFile: "Fayl tanlashda xatolik yuz berdi",
      successMessage: "Fayl muvaffaqiyatli yuklandi",
      chooseFile: "Faylni tanlang",
      noFileChosen: "Fayl tanlanmagan",
      save: "Saqlash",
      toast1: "Kurs o‘chirildi",
      toast2: "O‘chirishda xatolik",
    },
  ],
]);

type TSyllabus = {
  id: number;
  file: string | null;
  description: string;
  path: string;
};

type TCourses = {
  id: number;
  name: string;
  syllabus: TSyllabus[];
};

function TCHTopicsPage() {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang)!;

  const [courses, setCourses] = useState<TCourses[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const fetchCourses = async () => {
    try {
      const response = await client.get("education/course/list/");
      setCourses(response.data as TCourses[]);
    } catch (error) {
      toast.error(contents.errorFile);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAccordionToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleFileUpload = async (id: number) => {
    if (!selectedFile) {
      toast.error(contents.errorSelectFile);
      return;
    }

    const formData = new FormData();
    formData.append("syllabus_file", selectedFile);

    try {
      await client.patch(`education/course/update/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(contents.successMessage);
      fetchCourses();
      setSelectedFile(null);
      setFileName("");
    } catch {
      toast.error(contents.errorFile);
    }
  };

  const handleDeleteCourse = (id: number) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  return (
    <div className="w-full mt-12 overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">{contents.title}</h1>
        <p className="text-gray-500">{contents.text}</p>
      </div>

      <div className="w-5/6 mx-auto overflow-y-scroll 2xl:h-[88%] h-[75%] pb-8">
        {courses.map((course) => {
          const isOpen = openId === course.id;
          return (
            <div
              key={course.id}
              className="mb-5 rounded-md bg-white dark:bg-gray-800 shadow-md overflow-hidden"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleAccordionToggle(course.id)}
              >
                <h2 className="font-semibold text-lg dark:text-white">
                  {course.name}
                </h2>
                <div className="flex items-center gap-3">
                  <i
                    className={`fa-solid fa-chevron-${
                      isOpen ? "up" : "down"
                    } text-gray-600 dark:text-gray-300`}
                  />
                  <ConfirmDeleteModal
                    content={course.id}
                    onDelete={handleDeleteCourse}
                  />
                </div>
              </div>

              {/* Accordion body */}
              {isOpen && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-600 animate-fadeIn">
                  {/* Upload */}
                  <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                    <label className="py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
                      {contents.chooseFile}
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-gray-600 dark:text-gray-300">
                      {fileName || contents.noFileChosen}
                    </span>
                    <button
                      onClick={() => handleFileUpload(course.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      {contents.save}
                    </button>
                  </div>

                  {/* Files table */}
                  <table className="w-full border border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        {/* <th className="py-2 px-3 border-b">#</th> */}
                        <th className="py-2 px-3 border-b">Fayl nomi</th>
                        <th className="py-2 px-3 border-b">Tavsif</th>
                        <th className="py-2 px-3 border-b">Yuklab olish</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        <tr
                          key={course?.syllabus?.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          {/* <td className="py-2 px-3 border-b">{i + 1}</td> */}
                          <td className="py-2 px-3 border-b">
                            {"Noma'lum fayl"}
                          </td>
                          <td className="py-2 px-3 border-b">
                            {course?.syllabus?.description || "-"}
                          </td>
                          <td className="py-2 px-3 border-b">
                            <a
                              href={course?.syllabus?.file}
                              target="_blank"
                              className="text-blue-500 hover:underline"
                            >
                              Yuklab olish
                            </a>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TCHTopicsPage;
