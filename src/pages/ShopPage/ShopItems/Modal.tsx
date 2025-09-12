import React, { useState, ChangeEvent, FormEvent } from 'react';
import client from '../../../components/services';
import { Langs } from '../../../enums';
import { useContext } from 'react';
import { GlobalContext } from '../../../App';
import { useParams } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TTopicsComponentContent = {
  chooseImage: string;
  noImage: string;
  alertMessage: string;
  uploadError: string;
  requiredField: string;
  addBook: string;
  title: string;
  enterCategoryId: string;
  enterTags: string;
  enterPrice: string;
};

const contentsMap = new Map<Langs, TTopicsComponentContent>(
  [
    [Langs.UZ, {
      chooseImage: "Rasm tanlash",
      noImage: "Rasm tanlanmagan",
      alertMessage: "Iltimos, barcha maydonlarni to'ldiring.",
      uploadError: "Kitobni yuklashda xatolik:",
      requiredField: "Mahsulot nomini kiriting",
      addBook: "Qo'shish",
      title: "Mahsulot qo'shish",
      enterCategoryId: "Kategoriya ID kiriting",
      enterTags: "Teglarni kiriting",
      enterPrice: "Narxni kiriting"
    }],
    [Langs.RU, {
      chooseImage: "Выбрать изображение",
      noImage: "Изображение не выбрано",
      alertMessage: "Пожалуйста, заполните все поля.",
      uploadError: "Ошибка при загрузке книги:",
      requiredField: "Введите название продукта",
      addBook: "Добавить",
      title: "Добавить продукт",
      enterCategoryId: "Введите ID категории",
      enterTags: "Введите теги",
      enterPrice: "Введите цену"
    }],
    [Langs.EN, {
      chooseImage: "Choose image",
      noImage: "No image selected",
      alertMessage: "Please fill in all fields.",
      uploadError: "Error uploading book:",
      requiredField: "Enter the product name",
      addBook: "Add product",
      title: "Add Product",
      enterCategoryId: "Enter category ID",
      enterTags: "Enter tags",
      enterPrice: "Enter price"
    }]
  ]
);

interface FormData {
  title: string;
  image: File | null;
  tags: string;
  price: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useContext(GlobalContext);
  const { id } = useParams(); 
  const contents = contentsMap.get(lang) as TTopicsComponentContent;
  const [formData, setFormData] = useState<FormData>({
    title: '',
    image: null,
    tags: '',
    price: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.title);
    data.append('category', `${id}`);
    data.append('image', formData.image as Blob);
    data.append('tags', formData.tags);
    data.append('price', formData.price);

    try {
      await client.post(`shop/products/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onClose();
    } catch (error) {
      console.error(contents.uploadError, error);
    }
  };


  if (!isOpen) return null;

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70">
        <div className="relative w-full max-w-3xl p-4 mx-auto bg-white rounded-lg shadow-lg">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-600 text-3xl hover:text-gray-900"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="px-6 pb-6">
            <div className="card bg-gray-200">
              <div className="card-header py-5">
                <h1 className="text-2xl text-center font-semibold text-gray-800">
                  {contents.title}
                </h1>
                <div className="flex justify-center flex-col items-center form-group text-center">
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-4/5 py-3 mt-7 px-3 border-slate-400 rounded border"
                    placeholder={contents.requiredField}
                  />
                  <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-4/5 py-3 mt-4 px-3 border-slate-400 rounded border"
                    placeholder={contents.enterTags}
                  />
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-4/5 py-3 mt-4 px-3 border-slate-400 rounded border"
                    placeholder={contents.enterPrice}
                  />
                  <div className="w-4/5 py-3 mt-4 px-3 bg-white border-slate-400 rounded border flex justify-between items-center">
                    <label className="py-1 px-2 bg-gray-200 rounded cursor-pointer text-gray-800 hover:bg-gray-300 border border-slate-400">
                      {contents.chooseImage}
                      <input 
                        name="image"
                        type="file"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                    <span className="ml-3 text-gray-600">
                      {formData.image ? formData.image.name : contents.noImage}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-4 py-2 text-center mt-3 text-white bg-blue-400 rounded hover:bg-blue-700"
                  >
                    {contents.addBook}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
