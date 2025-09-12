import { useContext, useState, FormEvent } from 'react';
import { Langs } from "../../enums.ts";
import { GlobalContext } from "../../App.tsx";
import client from "../../components/services";

type TModalProps = {
    isVisible: boolean;
    onClose: () => void;
};

type TModalComponentContent = {
    title: string;
    button: string;
    placeholder: string;
    placeholderDescription: string;
    noFileChosen: string;
    chooseFile: string;
    errorFields: string;
    errorAddCourse: string;
};

const contentsMap = new Map<Langs, TModalComponentContent>(
    [
        [Langs.UZ, {
            title: "Yangi kurs yaratish",
            button: "Kursni qo'shish",
            placeholder: "Kurs nomi",
            placeholderDescription: "Qo'shimcha ma'lumot",
            noFileChosen: "O'quv dasturi fayli tanlanmagan",
            chooseFile: "O'quv dasturi faylini tanlang",
            errorFields: "Iltimos, barcha maydonlarni to'ldiring va fayl tanlang.",
            errorAddCourse: "Kurs qo'shishda xatolik yuz berdi."
        }],
        [Langs.RU, {
            title: "Создать новый курс",
            button: "Добавить курс",
            placeholder: "Название курса",
            placeholderDescription: "Описание",
            noFileChosen: "Файл программы не выбран",
            chooseFile: "Выберите файл программы",
            errorFields: "Пожалуйста, заполните все поля и выберите файл.",
            errorAddCourse: "Ошибка при добавлении курса."
        }],
        [Langs.EN, {
            title: "Create a new course",
            button: "Add a course",
            placeholder: "Course name",
            placeholderDescription: "Course description",
            noFileChosen: "No syllabus file chosen",
            chooseFile: "Choose syllabus file",
            errorFields: "Please fill in all fields and select a file.",
            errorAddCourse: "Error adding course."
        }]
    ]
);

const Modal = ({ isVisible, onClose }: TModalProps) => {
    const { lang } = useContext(GlobalContext);
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const contents = contentsMap.get(lang) as TModalComponentContent;

    if (!isVisible) return null;

    const endpoint = `/education/course/create/`;

    const addCourse = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (courseName && description && uploadFile) {
            const formData = new FormData();
            formData.append('name', courseName);
            formData.append('description', description);
            formData.append('syllabus_file', uploadFile);
            formData.append('is_active', 'true');
            formData.append('modules', JSON.stringify([{"name": "first module","price":"8000000"},{"name":"second module","price":"7500000"},{"name":"third module","price":"6000000"}]));

            try {
                await client.post(endpoint, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                window.location.reload();
                onClose();
            } catch (error) {
                setErrorMessage(contents.errorAddCourse);
            }
        } else {
            setErrorMessage(contents.errorFields);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setUploadFile(file);
        setFileName(file ? file.name : contents.noFileChosen);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70">
  <div className="relative w-full max-w-lg sm:max-w-2xl lg:max-w-3xl p-2 sm:p-4 mx-auto bg-white rounded-lg shadow-lg">
    <div className="flex justify-end">
      <button onClick={onClose} className="text-gray-600 text-2xl sm:text-3xl hover:text-gray-900">
        &times;
      </button>
    </div>
    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
      <div className="card bg-gray-200">
        <div className="card-header py-3 sm:py-5">
          <h2 className="text-xl sm:text-2xl text-center font-semibold text-gray-800">
            {contents.title}
          </h2>
        </div>
        <div className="card-body p-3 sm:p-4">
          {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}
          <form onSubmit={addCourse}>
            <div className="flex flex-col justify-center items-center form-group text-center">
              <input
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full sm:w-4/5 py-2 sm:py-3 mt-4 sm:mt-7 px-2 sm:px-3 border-slate-400 rounded border"
                placeholder={contents.placeholder}
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full sm:w-4/5 py-2 sm:py-3 mt-4 sm:mt-7 px-2 sm:px-3 border-slate-400 rounded border"
                placeholder={contents.placeholderDescription}
              />
              <div className="w-full sm:w-4/5 py-2 sm:py-3 mt-4 sm:mt-7 px-2 sm:px-3 bg-white border-slate-400 rounded border flex justify-between items-center">
                <label className="py-1 sm:py-2 px-3 sm:px-4 bg-gray-200 rounded cursor-pointer text-gray-800 hover:bg-gray-300 border border-slate-400">
                  {contents.chooseFile}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="ml-2 sm:ml-3 text-gray-600">
                  {fileName || contents.noFileChosen}
                </span>
              </div>
              <br />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 mt-5 sm:mt-7 text-white bg-blue-400 rounded hover:bg-blue-700">
                {contents.button}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

    );
};

export default Modal;
