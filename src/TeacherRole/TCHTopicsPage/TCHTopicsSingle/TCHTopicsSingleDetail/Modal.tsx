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
};

const contentsMap = new Map<Langs, TTopicsComponentContent>([
    [Langs.UZ, { title: "Darsni o'zgartirish", unit: "Mavzu", upload1: "Uy vazifasini yuklash", upload2: "Video yuklash", upload3: "Faylni yuklash", button: "Tasdiqlash" }],
    [Langs.RU, { title: "Изменить урок", unit: "Тема", upload1: "Загрузить ДЗ", upload2: "Загрузить видео", upload3: "Загрузить файл", button: "Подтвердить" }],
    [Langs.EN, { title: "Edit Lesson", unit: "Unit", upload1: "Upload Homework", upload2: "Upload Video", upload3: "Upload File", button: "Save" }]
]);

function Modal({ isVisible, onClose, lessonData }: TModalProps) {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TTopicsComponentContent;
    const { id } = useParams();

    const [unit, setUnit] = useState<string>("");
    const [homework, setHomework] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [files, setFiles] = useState<File | null>(null);

    const [currentHomeworkName, setCurrentHomeworkName] = useState<string>("");
    const [currentVideoName, setCurrentVideoName] = useState<string>("");
    const [currentFileName, setCurrentFileName] = useState<string>("");

    useEffect(() => {
        if (lessonData) {
            setUnit(lessonData.unit || "");
            setCurrentHomeworkName(lessonData.homework?.file ? lessonData.homework.file.split('/').pop() || "Fayl" : "");
            setCurrentVideoName(lessonData.video?.file ? lessonData.video.file.split('/').pop() || "Video" : "");
            setCurrentFileName(lessonData.source.length > 0 ? lessonData.source[0].file.split('/').pop() || "Fayl" : "");
        }
    }, [lessonData, isVisible]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>, setName: React.Dispatch<React.SetStateAction<string>>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setName(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        if (unit) formData.append("unit", unit);
        if (homework) formData.append("homework", homework);
        if (video) formData.append("video", video);
        if (files) formData.append("files", files);

        try {
            await client.patch(`education/lessons/${id}/`, formData);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Xatolik:", error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
            <div className="relative w-full max-w-3xl p-4 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-6 text-3xl text-gray-600 hover:text-gray-900">&times;</button>

                <div className="px-6 pb-6">
                    <h2 className="text-2xl text-center font-semibold py-5">{contents.title}</h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <input
                            className="w-full py-3 px-4 border rounded-lg text-lg"
                            placeholder={contents.unit}
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        />

                        <div className="w-full py-3 px-4 border rounded-lg bg-gray-100 relative cursor-pointer hover:bg-gray-200">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e, setHomework, setCurrentHomeworkName)} />
                            <div className="text-center line-clamp-1">
                                {homework ? homework.name : currentHomeworkName || contents.upload1}
                            </div>
                        </div>

                        <div className="w-full py-3 px-4 border rounded-lg bg-gray-100 relative cursor-pointer hover:bg-gray-200">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e, setVideo, setCurrentVideoName)} />
                            <div className="text-center line-clamp-1">
                                {video ? video.name : currentVideoName || contents.upload2}
                            </div>
                        </div>

                        <div className="w-full py-3 px-4 border rounded-lg bg-gray-100 relative cursor-pointer hover:bg-gray-200">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e, setFiles, setCurrentFileName)} />
                            <div className="text-center line-clamp-1">
                                {files ? files.name : currentFileName || contents.upload3}
                            </div>
                        </div>

                        <div className="text-center">
                            <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                                {contents.button}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Modal;