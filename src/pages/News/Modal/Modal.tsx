import React, { useState, useEffect } from "react";
import { Langs } from "../../../enums";
import { useContext } from "react";
import { GlobalContext } from "../../../App";
import client from "../../../components/services";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any; 
}

type TConfPassComponentContent = {
  title: string;
  placeholder1: string;
  placeholder2: string;
  button: string;
  chooseFile: string;
  noFileChosen: string;
  placeholderLink: string;
  close: string
}

const contentsMap = new Map<Langs, TConfPassComponentContent>([
  [Langs.UZ, {
    title: "Yangilik qo'shish",
    placeholder1: "Sarlavha qo'shish",
    placeholder2: "Tavsif qo'shish",
    button: "Saqlash",
    chooseFile: "Rasm tanlash",
    noFileChosen: "Rasm tanlanmagan",
    placeholderLink: "Link qo'shing" ,
    close: "Yopish"
  }],
  [Langs.RU, {
    title: "Добавить новость",
    placeholder1: 'Добавить заголовок',
    placeholder2: 'Добавить описание',
    button: "Сохранять",
    chooseFile: "Выбрать файл",
    noFileChosen: "Файл не выбран",
    placeholderLink: "Добавить ссылку",
    close: "Закрывать"
  }],
  [Langs.EN, {
    title: "Add news",
    placeholder1: 'Add title',
    placeholder2: 'Add description',
    button: "Save",
    chooseFile: "Choose file",
    noFileChosen: "No file chosen",
    placeholderLink: "Add link",
    close: "Close"
  }],
]);

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, onUpdate, initialData }) => {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TConfPassComponentContent;

  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [image, setImage] = useState<File | null>(null);
  const [link, setLink] = useState<string>(initialData?.link || "");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLink(initialData.link);
    }
  }, [initialData]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("link", link);
  
    if (image) {
      // Agar yangi rasm tanlangan bo'lsa
      formData.append("image", image);
    } else if (initialData?.image) {
      // Agar yangi rasm tanlanmagan bo'lsa, avvalgi rasm URL'ini alohida maydon orqali yuboramiz
      formData.append("image_url", initialData.image);
    }
  
    try {
      if (initialData) {
        // Yangilash so'rovi
        await client.patch(`news/${initialData.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Qo'shish so'rovi
        await client.post("news/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      onUpdate({ title, description, link, image: image || initialData?.image });
      onClose();
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files) setImage(target.files[0]);
  };

  return isVisible ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70">
      <div className="relative w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 text-3xl hover:text-gray-900">
          &times;
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">{contents.title}</h1>
        <div className="space-y-4">
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full py-3 px-4 border border-gray-300 rounded-md"
            placeholder={contents.placeholder1}
          />
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full py-3 px-4 border border-gray-300 rounded-md"
            placeholder={contents.placeholder2}
          />
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full py-3 px-4 border border-gray-300 rounded-md"
            placeholder={contents.placeholderLink}
          />
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <label className="flex items-center cursor-pointer text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md">
              {contents.chooseFile}
              <input name="image" type="file" onChange={handleFileChange} className="hidden" />
            </label>
            <span className="ml-3 text-gray-600">
              {image ? image.name : contents.noFileChosen}
            </span>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            {contents.button}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
            {contents.close}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
