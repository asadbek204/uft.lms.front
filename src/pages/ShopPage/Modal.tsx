import { FC, useState, useContext, ChangeEvent } from 'react';
import client from '../../components/services';
import { AxiosError } from 'axios';
import { Langs } from '../../enums';
import { GlobalContext } from '../../App';

interface CategoryData {
  id: number;
  title: string;
  image: {
      file: string;
      description: string;
  };
}

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (data: CategoryData) => void;
}

type TTopicsComponentContent = {
  chooseImage: string;
  noImage: string;
  alertMessage: string;
  uploadError: string;
  requiredField: string;
  addBook: string;
  title: string;
  placeholder2: string;
  error: string
};

const translations: Record<Langs, TTopicsComponentContent> = {
  [Langs.UZ]: {
    chooseImage: "Rasm tanlash",
    noImage: "Rasm tanlanmagan",
    alertMessage: "Iltimos, barcha maydonlarni to'ldiring.",
    uploadError: "Kitobni yuklashda xatolik:",
    requiredField: "Categoriya nomini kiriting",
    addBook: "Qo'shish",
    title: "Categoriya qo'shish",
    placeholder2: "Tavsif qo'shish",
    error: "Kutilmagan xatolik yuz berdi."
  },
  [Langs.RU]: {
    chooseImage: "Выбрать изображение",
    noImage: "Изображение не выбрано",
    alertMessage: "Пожалуйста, заполните все поля.",
    uploadError: "Ошибка при загрузке книги:",
    requiredField: "Введите название категории",
    addBook: "Добавить",
    title: "Добавить категорию",
    placeholder2: "Добавить описание",
    error: "Произошла непредвиденная ошибка."
  },
  [Langs.EN]: {
    chooseImage: "Choose image",
    noImage: "No image selected",
    alertMessage: "Please fill in all fields.",
    uploadError: "Error uploading book:",
    requiredField: "Enter a category name",
    addBook: "Add",
    title: "Add category",
    placeholder2: "Add description",
    error: "An unexpected error occurred."
  },
};

const Modal: FC<ModalProps> = ({ isVisible, onClose, onUpdate }) => {
  const { lang } = useContext(GlobalContext);
  const contents = translations[lang];
  const [formData, setFormData] = useState<{ description: string; image: File | null; title: string }>({
    description: '',
    image: null,
    title: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (name === 'image' && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addBook = async () => {
    if (!formData.description || !formData.image) {
      alert(contents.alertMessage);
      return;
    }

    const data = new FormData();
    data.append('description', formData.description);
    data.append('file', formData.image);
    data.append('title', formData.title);

    try {
      const response = await client.post('shop/category/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError) {
      console.error(contents.uploadError, error.message);
      alert(`${error.response?.data?.detail || error.message}`);
    } else {
      console.error('Kutilmagan xatolik:', error);
      alert(contents.error);
    }
  };

  if (!isVisible) return null;

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70">
        <div className="relative w-full max-w-3xl p-4 mx-auto bg-white rounded-lg shadow-lg">
          <div className="flex justify-end">
            <button onClick={onClose} className="text-gray-600 text-3xl hover:text-gray-900">
              &times;
            </button>
          </div>
          <div className="px-6 pb-6">
            <div className="card bg-gray-200">
              <div className="card-header py-5">
                <h1 className="text-2xl text-center font-semibold text-gray-800">{contents.title}</h1>
                <div className="flex justify-center flex-col items-center form-group text-center">
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-4/5 py-3 mt-7 px-3 border-slate-400 rounded border"
                    placeholder={contents.requiredField}
                  />
                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-4/5 py-3 mt-7 px-3 border-slate-400 rounded border"
                    placeholder={contents.placeholder2}
                  />

                  <div className="w-4/5 py-3 mt-4 px-3 bg-white border-slate-400 rounded border flex justify-between items-center">
                    <label className="py-1 px-2 bg-gray-200 rounded cursor-pointer text-gray-800 hover:bg-gray-300 border border-slate-400">
                      {contents.chooseImage}
                      <input name="image" type="file" onChange={handleChange} className="hidden" />
                    </label>
                    <span className="ml-3 text-gray-600">
                      {formData.image ? formData.image.name : contents.noImage}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={addBook}
                    className="px-4 py-2 text-center mt-3 text-white bg-blue-400 rounded hover:bg-blue-700"
                  >
                    {contents.addBook}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
