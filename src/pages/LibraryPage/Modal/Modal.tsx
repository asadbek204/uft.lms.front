import React, { useRef, useEffect, useContext, useState } from "react";
import { Langs } from "../../../enums";
import { GlobalContext } from "../../../App";
import client from "../../../components/services";

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

  const bookTitle = useRef<HTMLInputElement>(null);
  const bookAuthor = useRef<HTMLInputElement>(null);
  const bookDescription = useRef<HTMLInputElement>(null);
  const bookPhoto = useRef<HTMLInputElement>(null);
  const bookLanguage = useRef<HTMLInputElement>(null);
  const bookCategory = useRef<HTMLInputElement>(null);
  const bookYear = useRef<HTMLInputElement>(null);
  const bookFile = useRef<HTMLInputElement>(null);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    bookTitle.current!.value = "";
    bookAuthor.current!.value = "";
    bookDescription.current!.value = "";
    bookLanguage.current!.value = "";
    bookCategory.current!.value = "";
    bookYear.current!.value = "";
    bookPhoto.current!.value = "";
    bookFile.current!.value = "";
    setSelectedPhoto(null);
    setSelectedFile(null);
  }, [isVisible]);

  const addBook = async () => {
    if (
      !bookTitle.current?.value ||
      !bookAuthor.current?.value ||
      !bookDescription.current?.value ||
      !bookPhoto.current?.files?.[0] ||
      !bookLanguage.current?.value ||
      !bookCategory.current?.value ||
      !bookYear.current?.value ||
      !bookFile.current?.files?.[0]
    ) {
      alert(contents.alertFillFields);
      return;
    }

    const formData = new FormData();
    formData.append("name", bookTitle.current.value);
    formData.append("author", bookAuthor.current.value);
    formData.append("description", bookDescription.current.value);
    formData.append("image", bookPhoto.current.files[0]);
    formData.append("language", bookLanguage.current.value);
    formData.append("category", bookCategory.current.value);
    formData.append("year", bookYear.current.value);
    formData.append("file", bookFile.current.files[0]);

    try {
      const response = await client.post("books/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(contents.alertSuccessAddingBook);
      onUpdate(response.data);
      onClose();
    } catch (error) {
      alert(contents.alertErrorAddingBook);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedPhoto(e.target.files[0].name);
    } else {
      setSelectedPhoto(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0].name);
    } else {
      setSelectedFile(null);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70">
  <div className="relative w-full max-w-3xl mt-28 md:mt-0 p-4 mx-auto bg-white rounded-lg shadow-lg">
    <div className="flex justify-end ">
      <button
        onClick={onClose}
        className="text-gray-600  text-3xl hover:text-gray-900"
      >
        &times;
      </button>
    </div>
    <div className="px-6 pb-6">
      <div className="card bg-gray-200">
        <div className="card-header py-5">
          <h1 className="text-2xl text-center font-semibold text-gray-800">
            {contents.title}
          </h1>
          <div className="flex justify-center flex-col items-center form-group text-center p-5">
            <input
              ref={bookTitle}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.placeholder1}
            />
            <input
              ref={bookAuthor}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.authorPlaceholder}
            />
            <input
              ref={bookDescription}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.placeholder2}
            />
            <input
              ref={bookLanguage}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.languagePlaceholder}
            />
            <input
              ref={bookCategory}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.categoryPlaceholder}
            />
            <input
              ref={bookYear}
              className="w-full sm:w-4/5 py-2 mt-4 px-3 border-slate-400 rounded border"
              placeholder={contents.yearPlaceholder}
            />

            <div className="w-full sm:w-4/5 py-2 mt-4 px-3 bg-white border-slate-400 rounded border flex justify-between items-center">
              <label className="py-1 px-2 bg-gray-200 rounded cursor-pointer text-gray-800 hover:bg-gray-300 border border-slate-400">
                {contents.choosePhoto}
                <input
                  ref={bookPhoto}
                  type="file"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
              <span className="ml-3 text-gray-600">
                {selectedPhoto || contents.noPhotoChosen}
              </span>
            </div>

            <div className="w-full sm:w-4/5 py-2 mt-4 px-3 bg-white border-slate-400 rounded border flex justify-between items-center">
              <label className="py-1 px-2 bg-gray-200 rounded cursor-pointer text-gray-800 hover:bg-gray-300 border border-slate-400">
                {contents.chooseFile}
                <input
                  ref={bookFile}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <span className="ml-3 text-gray-600">
                {selectedFile || contents.noFileChosen}
              </span>
            </div>

            <button
              onClick={addBook}
              className="w-full sm:w-4/5 py-2 mt-4 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-300"
            >
              {contents.button}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Modal;
