import React, { useState, useContext, useEffect } from "react";
import client from "../../../../components/services";
import { useParams } from "react-router-dom";
import { Langs } from '../../../../enums';
import { GlobalContext } from '../../../../App';

type TModalProps = {
    isVisible: boolean;
    onClose: () => void;
    lessonData?: {
        unit: string;
        homework: { file?: string; description?: string } | null;
        video: { file?: string } | null;
        source: { file: string }[];
    } | null;
};

type TTopicsComponentContent = {
    title: string;
    unit: string;
    upload1: string;
    upload2: string;
    upload3: string;
    button: string;
    uploading: string;
    errorLessonNotStarted: string;
    errorGeneral: string;
    success: string;
};

const contentsMap = new Map<Langs, TTopicsComponentContent>([
    [
        Langs.UZ,
        {
            title: "Darsni o'zgartirish",
            unit: "Mavzu",
            upload1: "Uy vazifasini yuklash",
            upload2: "Video yuklash",
            upload3: "Faylni yuklash",
            button: "Tasdiqlash",
            uploading: "Yuklanmoqda...",
            errorLessonNotStarted: "Dars hali boshlanmagan. Avval darsni boshlang!",
            errorGeneral: "Xatolik yuz berdi. Iltimos qayta urinib ko'ring.",
            success: "Muvaffaqiyatli saqlandi!",
        }
    ],
    [
        Langs.RU,
        {
            title: "Изменить урок",
            unit: "Тема",
            upload1: "Загрузить ДЗ",
            upload2: "Загрузить видео",
            upload3: "Загрузить файл",
            button: "Подтвердить",
            uploading: "Загрузка...",
            errorLessonNotStarted: "Урок еще не начат. Сначала начните урок!",
            errorGeneral: "Произошла ошибка. Пожалуйста, попробуйте снова.",
            success: "Успешно сохранено!",
        }
    ],
    [
        Langs.EN,
        {
            title: "Edit Lesson",
            unit: "Unit",
            upload1: "Upload Homework",
            upload2: "Upload Video",
            upload3: "Upload File",
            button: "Save",
            uploading: "Uploading...",
            errorLessonNotStarted: "Lesson has not started yet. Please start the lesson first!",
            errorGeneral: "An error occurred. Please try again.",
            success: "Successfully saved!",
        }
    ],
]);

function Modal({ isVisible, onClose, lessonData }: TModalProps) {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TTopicsComponentContent;
    const { id } = useParams<{ id: string }>();

    const [unit, setUnit] = useState<string>("");
    const [homework, setHomework] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [files, setFiles] = useState<File | null>(null);

    const [currentHomeworkName, setCurrentHomeworkName] = useState<string>("");
    const [currentVideoName, setCurrentVideoName] = useState<string>("");
    const [currentFileName, setCurrentFileName] = useState<string>("");

    const [uploading, setUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [estimatedTimeLeft, setEstimatedTimeLeft] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (lessonData) {
            setUnit(lessonData.unit || "");
            setCurrentHomeworkName(lessonData.homework?.file ? lessonData.homework.file.split('/').pop() || "Fayl" : "");
            setCurrentVideoName(lessonData.video?.file ? lessonData.video.file.split('/').pop() || "Video" : "");
            setCurrentFileName(lessonData.source.length > 0 ? lessonData.source[0].file.split('/').pop() || "Fayl" : "");
        }
    }, [lessonData, isVisible]);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFile: React.Dispatch<React.SetStateAction<File | null>>,
        setName: React.Dispatch<React.SetStateAction<string>>
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setName(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setUploading(true);
        setProgress(0);
        setEstimatedTimeLeft("");

        const formData = new FormData();
        if (unit) formData.append("unit", unit);
        if (homework) formData.append("homework", homework);
        if (video) formData.append("video", video);
        if (files) formData.append("files", files);   // backend "source" deb kutayotgan bo'lsa → "source" deb o'zgartiring

        // Yuklash boshlanishi uchun taxminiy vaqt (masalan video katta bo'lsa)
        const startTime = Date.now();

        try {
            await client.patch(`education/lessons/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);

                        const elapsed = (Date.now() - startTime) / 1000; // sekundda
                        const estimatedTotal = elapsed / (percent / 100);
                        const remaining = estimatedTotal - elapsed;

                        if (remaining > 0) {
                            const min = Math.floor(remaining / 60);
                            const sec = Math.round(remaining % 60);
                            setEstimatedTimeLeft(
                                min > 0 ? `${min} daqiqa ${sec} soniya` : `${sec} soniya`
                            );
                        }
                    }
                },
            });

            alert(contents.success);
            onClose();
            window.location.reload();
        } catch (error: any) {
            console.error("Xatolik:", error);

            if (error.response?.status === 400) {
                const detail = error.response?.data?.detail || "";
                if (detail.toLowerCase().includes("not started") || detail.includes("lesson not started")) {
                    setErrorMessage(contents.errorLessonNotStarted);
                } else {
                    setErrorMessage(contents.errorGeneral + (detail ? ` (${detail})` : ""));
                }
            } else {
                setErrorMessage(contents.errorGeneral);
            }
        } finally {
            setUploading(false);
            setProgress(0);
            setEstimatedTimeLeft("");
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-3xl p-4 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-6 text-3xl text-gray-600 hover:text-gray-900"
                >
                    &times;
                </button>

                <div className="px-6 pb-6">
                    <h2 className="text-2xl text-center font-semibold py-5">{contents.title}</h2>

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            className="w-full py-3 px-4 border rounded-lg text-lg dark:bg-gray-700 dark:text-white"
                            placeholder={contents.unit}
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            disabled={uploading}
                        />

                        {/* Uy vazifasi */}
                        <div className="w-full py-3 px-4 border rounded-lg bg-gray-100 dark:bg-gray-700 relative cursor-pointer hover:bg-gray-200">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e, setHomework, setCurrentHomeworkName)}
                                disabled={uploading}
                            />
                            <div className="text-center line-clamp-1 dark:text-white">
                                {homework ? homework.name : currentHomeworkName || contents.upload1}
                            </div>
                        </div>

                        {/* Video */}
                        <div className="w-full py-3 px-4 border rounded-lg bg-gray-100 dark:bg-gray-700 relative cursor-pointer hover:bg-gray-200">
                            <input
                                type="file"
                                accept="video/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e, setVideo, setCurrentVideoName)}
                                disabled={uploading}
                            />
                            <div className="text-center line-clamp-1 dark:text-white">
                                {video ? video.name : currentVideoName || contents.upload2}
                            </div>
                        </div>

                        {/* Qo'shimcha fayl */}
                        <div className="w-full py-3 px-4 border rounded-lg bg-gray-100 dark:bg-gray-700 relative cursor-pointer hover:bg-gray-200">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e, setFiles, setCurrentFileName)}
                                disabled={uploading}
                            />
                            <div className="text-center line-clamp-1 dark:text-white">
                                {files ? files.name : currentFileName || contents.upload3}
                            </div>
                        </div>

                        {/* Progress bar va qolgan vaqt */}
                        {uploading && (
                            <div className="space-y-2">
                                <div className="w-full bg-gray-200 rounded-full h-3.5 dark:bg-gray-600">
                                    <div
                                        className="bg-blue-600 h-3.5 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="text-center text-sm text-gray-700 dark:text-gray-300">
                                    {contents.uploading} {progress}% 
                                    {estimatedTimeLeft && ` • Qolgan vaqt: ~${estimatedTimeLeft}`}
                                </div>
                            </div>
                        )}

                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`px-10 py-3 text-white rounded-xl font-bold transition-colors ${
                                    uploading
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {uploading ? contents.uploading : contents.button}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Modal;