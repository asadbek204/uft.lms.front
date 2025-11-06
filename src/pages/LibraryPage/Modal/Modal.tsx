import React, { useState, useContext } from "react";
import { Langs } from "../../../enums";
import { GlobalContext } from "../../../App";
import client from "../../../components/services";
import { toast } from "react-toastify";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
}

type TConfPassComponentContent = {
  title: string;
  placeholder1: string;
  placeholder2: string;
  button: string;
  choosePhoto: string;
  noPhotoChosen: string;
  chooseFile: string;
  noFileChosen: string;
  authorPlaceholder: string;
  yearPlaceholder: string;
  languagePlaceholder: string;
  categoryPlaceholder: string;
  alertFillFields: string;
  alertErrorAddingBook: string;
  alertSuccessAddingBook: string;
};

const contentsMap = new Map<Langs, TConfPassComponentContent>([
  [
    Langs.UZ,
    {
      title: "Kitob qo'shish",
      placeholder1: "Kitob nomini kiriting",
      placeholder2: "Tavsif kiriting",
      button: "Saqlash",
      choosePhoto: "Rasmini tanlang",
      noPhotoChosen: "Rasm tanlanmagan",
      chooseFile: "Faylni tanlang",
      noFileChosen: "Fayl tanlanmagan",
      authorPlaceholder: "Muallif",
      yearPlaceholder: "Yil",
      languagePlaceholder: "Til",
      categoryPlaceholder: "Kategoriya",
      alertFillFields: "Iltimos, barcha maydonlarni to'ldiring va rasm tanlang",
      alertErrorAddingBook: "Kitob qo'shishda xatolik",
      alertSuccessAddingBook: "Kitob muvaffaqiyatli qo'shildi",
    },
  ],
  [
    Langs.RU,
    {
      title: "Добавить книгу",
      placeholder1: "Введите название книги",
      placeholder2: "Введите описание",
      button: "Сохранить",
      choosePhoto: "Загрузите фото",
      noPhotoChosen: "Фото не выбрано",
      chooseFile: "Загрузите файл",
      noFileChosen: "Файл не выбран",
      authorPlaceholder: "Автор",
      yearPlaceholder: "Год",
      languagePlaceholder: "Язык",
      categoryPlaceholder: "Категория",
      alertFillFields: "Пожалуйста, заполните все поля и выберите фото",
      alertErrorAddingBook: "Ошибка при добавлении книги",
      alertSuccessAddingBook: "Книга успешно добавлена",
    },
  ],
  [
    Langs.EN,
    {
      title: "Add book",
      placeholder1: "Enter book title",
      placeholder2: "Enter description",
      button: "Save",
      choosePhoto: "Choose a photo",
      noPhotoChosen: "No photo chosen",
      chooseFile: "Choose a file",
      noFileChosen: "No file chosen",
      authorPlaceholder: "Author",
      yearPlaceholder: "Year",
      languagePlaceholder: "Language",
      categoryPlaceholder: "Category",
      alertFillFields: "Please fill all fields and select a photo",
      alertErrorAddingBook: "Error adding book",
      alertSuccessAddingBook: "Book added successfully",
    },
  ],
]);

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, onUpdate }) => {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TConfPassComponentContent;

  // Inputlar uchun state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [selectedPhotoName, setSelectedPhotoName] = useState(
    contents.noPhotoChosen
  );
  const [selectedFileName, setSelectedFileName] = useState(
    contents.noFileChosen
  );

  if (!isVisible) return null;

  const handleAddBook = async () => {
    if (
      !title ||
      !author ||
      !description ||
      !language ||
      !category ||
      !year ||
      !photo ||
      !file
    ) {
      toast.error(contents.alertFillFields);
      return;
    }

    const formData = new FormData();
    formData.append("name", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("language", language);
    formData.append("category", category);
    formData.append("year", year);
    formData.append("image", photo);
    formData.append("file", file);

    try {
      const response = await client.post("books/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(contents.alertSuccessAddingBook);
      onUpdate(response.data);
      window.location.reload();
      onClose();
    } catch (err: any) {
      console.error("Kitob qo'shishda xato:", err);
      toast.error(contents.alertErrorAddingBook);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setSelectedPhotoName(e.target.files[0].name);
    } else {
      setPhoto(null);
      setSelectedPhotoName(contents.noPhotoChosen);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
    } else {
      setFile(null);
      setSelectedFileName(contents.noFileChosen);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // faqat raqamlar
    if (value.length <= 4) {
      setYear(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70">
      <div className="relative w-full max-w-3xl mt-28 md:mt-0 p-4 mx-auto bg-white rounded-lg shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-600 text-3xl hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="px-6 pb-6">
          <h1 className="text-2xl text-center font-semibold text-gray-800">
            {contents.title}
          </h1>
          <div className="flex justify-center flex-col items-center form-group text-center p-5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.placeholder1}
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.authorPlaceholder}
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.placeholder2}
            />
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.languagePlaceholder}
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.categoryPlaceholder}
            />
            <input
              value={year}
              onChange={handleYearChange}
              type="number"
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.yearPlaceholder}
            />
            <div className="w-full sm:w-4/5 py-2 mt-4 px-3 bg-white border-slate-400 rounded border flex justify-between items-center">
              <label className="py-1 px-2 bg-gray-200 rounded cursor-pointer text-gray-800 hover:bg-gray-300 border border-slate-400">
                {contents.choosePhoto}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
              <span className="ml-3 text-gray-600">{selectedPhotoName}</span>
            </div>
            <div className="w-full sm:w-4/5 py-2 mt-4 px-3 bg-white border-slate-400 rounded border flex justify-between items-center">
              <label className="py-1 px-2 bg-gray-200 rounded cursor-pointer text-gray-800 hover:bg-gray-300 border border-slate-400">
                {contents.chooseFile}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.epub"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <span className="ml-3 text-gray-600">{selectedFileName}</span>
            </div>
            <button
              onClick={handleAddBook}
              className="w-full sm:w-4/5 py-2 mt-4 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-300"
            >
              {contents.button}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
