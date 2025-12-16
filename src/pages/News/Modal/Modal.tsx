import React, { useEffect, useState, useContext } from "react";
import { Langs } from "../../../enums";
import { GlobalContext } from "../../../App";
import client from "../../../components/services";
import { toast } from "react-toastify";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  initialData?: any;
}

type TModalContent = {
  title: string;
  placeholder1: string;
  placeholder2: string;
  placeholderLink: string;
  chooseFile: string;
  noFileChosen: string;
  button: string;
  close: string;
  requiredField: string;
  invalidUrl: string;
  httpsRequired: string;
};

const contentsMap = new Map<Langs, TModalContent>([
  [
    Langs.UZ,
    {
      title: "Yangilik qo'shish",
      placeholder1: "Sarlavha qo'shish",
      placeholder2: "Tavsif qo'shish",
      placeholderLink: "Link qo'shing (masalan: https://example.com)",
      chooseFile: "Rasm tanlash",
      noFileChosen: "Rasm tanlanmagan",
      button: "Saqlash",
      close: "Yopish",
      requiredField: "Bu maydon to'ldirilishi shart",
      invalidUrl: "Iltimos, to'g'ri URL kiriting",
      httpsRequired: "Link https:// bilan boshlanishi kerak",
    },
  ],
  [
    Langs.RU,
    {
      title: "Добавить новость",
      placeholder1: "Добавить заголовок",
      placeholder2: "Добавить описание",
      placeholderLink: "Добавьте ссылку (например: https://example.com)",
      chooseFile: "Выбрать изображение",
      noFileChosen: "Изображение не выбрано",
      button: "Сохранить",
      close: "Закрыть",
      requiredField: "Это поле обязательно",
      invalidUrl: "Пожалуйста, введите корректный URL",
      httpsRequired: "Ссылка должна начинаться с https://",
    },
  ],
  [
    Langs.EN,
    {
      title: "Add news",
      placeholder1: "Add title",
      placeholder2: "Add description",
      placeholderLink: "Add link (e.g. https://example.com)",
      chooseFile: "Choose image",
      noFileChosen: "No image selected",
      button: "Save",
      close: "Close",
      requiredField: "This field is required",
      invalidUrl: "Please enter a valid URL",
      httpsRequired: "Link must start with https://",
    },
  ],
]);

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, onUpdate, initialData }) => {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TModalContent;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial data bilan to'ldirish
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLink(initialData.link || "");
      setImage(null); // Yangi rasm tanlanishi mumkin
    } else {
      setTitle("");
      setDescription("");
      setLink("");
      setImage(null);
    }
    setErrors({});
  }, [initialData, isVisible]);

  // URL validatsiyasi
  const validateUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Formani tekshirish
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = contents.requiredField;
    if (!description.trim()) newErrors.description = contents.requiredField;
    if (!link.trim()) {
      newErrors.link = contents.requiredField;
    } else if (!validateUrl(link)) {
      newErrors.link = contents.httpsRequired;
    }

    // Yangi yangilik qo'shishda rasm majburiy
    if (!initialData && !image) {
      newErrors.image = contents.requiredField;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("link", link.trim());

    if (image) {
      formData.append("image", image);
    } else if (initialData?.image) {
      // Tahrirlashda eski rasm saqlansin
      formData.append("image_url", initialData.image);
    }

    try {
      if (initialData?.id) {
        // Tahrirlash
        await client.patch(`news/${initialData.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Yangilik muvaffaqiyatli yangilandi");
      } else {
        // Qo'shish
        await client.post("news/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Yangilik muvaffaqiyatli qo'shildi");
      }

      onUpdate({ id: initialData?.id, title, description, link, image });
      onClose();
    } catch (error: any) {
      console.error("Error saving news:", error);

      if (error.response?.data) {
        const serverErrors = error.response.data;

        if (serverErrors.link) {
          setErrors((prev) => ({ ...prev, link: contents.invalidUrl }));
          toast.error(contents.invalidUrl);
        } else if (serverErrors.image) {
          toast.error("Rasm yuklashda xato");
        } else {
          toast.error("Saqlashda xatolik yuz berdi");
        }
      } else {
        toast.error("Internet aloqasini tekshiring");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70">
      <div className="relative w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 text-3xl hover:text-gray-900 z-10"
        >
          &times;
        </button>

        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          {initialData ? "Yangilikni tahrirlash" : contents.title}
        </h1>

        <div className="space-y-5">
          {/* Sarlavha */}
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full py-3 px-4 border rounded-md ${errors.title ? "border-red-500" : "border-gray-300"}`}
              placeholder={contents.placeholder1}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Tavsif */}
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={`w-full py-3 px-4 border rounded-md ${errors.description ? "border-red-500" : "border-gray-300"}`}
              placeholder={contents.placeholder2}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Link */}
          <div>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={`w-full py-3 px-4 border rounded-md ${errors.link ? "border-red-500" : "border-gray-300"}`}
              placeholder={contents.placeholderLink}
            />
            {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
          </div>

          {/* Rasm */}
          <div>
            <div className="flex items-center border rounded-md p-3 ${errors.image ? 'border-red-500' : 'border-gray-300'}">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {contents.chooseFile}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <span className="ml-4 text-gray-600">
                {image ? image.name : initialData?.image ? "Joriy rasm saqlanadi" : contents.noFileChosen}
              </span>
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            {initialData?.image && !image && (
              <p className="text-sm text-gray-500 mt-2">Eski rasm: {initialData.image}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            {contents.close}
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saqlanmoqda..." : contents.button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;