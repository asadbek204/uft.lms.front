import React, { useState,useContext } from "react";
import client from "../../../../components/services";
import { useParams } from "react-router-dom";
import { Langs } from '../../../../enums';
import { GlobalContext } from '../../../../App';

type TModalProps = {
    isVisible: boolean;
    onClose: () => void;
};

type TTopicsComponentContent = {
    title: string;
    unit: string;
    upload1: string;
    upload2: string;
    upload3: string;
    button: string

}

const contentsMap = new Map<Langs, TTopicsComponentContent>([
    [Langs.UZ, {
        title: "Darsni o'zgartirish",
        unit: "Mavzu",
        upload1: "Uy vazifasini yuklash",
        upload2: "Video yuklash",
        upload3: "Faylni yuklash",
        button: "Tasdiqlash"
    }],
    [Langs.RU, {
        title: "Изменить урок",
        unit: "Teмa",
        upload1: "Загрузить домашнее задание",
        upload2: "Загрузить видео",
        upload3: "Загрузить файл",
        button: "Подтверждать"

    }],
    [Langs.EN, {
        title: "Change Lesson",
        unit: "Unit",
        upload1: "Upload Homework",
        upload2: "Upload Video",
        upload3: "Upload File",
        button: "Confirm"

    }]
]);

function Modal({ isVisible, onClose }: TModalProps) {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TTopicsComponentContent;
    const { id } = useParams();
    const [unit, setUnit] = useState<string>("");
    const [homework, setHomework] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [files, setFiles] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("unit", unit);
        if (homework) formData.append("homework", homework);
        if (video) formData.append("video", video);
        if (files) formData.append("files", files);

        try {
            const response = await client.patch(`education/lessons/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Lesson updated:", response.data);
            onClose();
        } catch (error) {
            console.error("Error updating lesson:", error);
        }
    };

    if (!isVisible) {
        return null;
    }

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-3xl p-4 mx-auto bg-white rounded-lg shadow-lg"
                onClick={handleModalClick}
            >
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-gray-600 text-3xl hover:text-gray-900"
                    >
                        &times;
                    </button>
                </div>
                <div className="px-6 pb-6">
                    <div className="card bg-gray-200">
                        <div className="card-header py-5">
                            <h2 className="text-2xl text-center font-semibold text-gray-800">
                            {contents.title}
                            </h2>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group flex flex-col items-center text-center">
                                    <input
                                        className="w-4/5 py-3 mt-7 px-3 border-slate-400 rounded border"
                                        placeholder={contents.unit}
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                    />

                                    <div className="w-4/5 py-3 mt-7 px-3 border-slate-400 rounded border bg-white relative cursor-pointer hover:bg-gray-200">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleFileChange(e, setHomework)}
                                        />
                                        <div className="flex items-center justify-center h-full">
                                            {homework ? (
                                                <span className="text-gray-700">{homework.name}</span>
                                            ) : (
                                                <span className="text-gray-500">{contents.upload1}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-4/5 py-3 mt-7 px-3 border-slate-400 rounded border bg-gray-100 relative cursor-pointer hover:bg-gray-200">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleFileChange(e, setVideo)}
                                        />
                                        <div className="flex items-center justify-center h-full">
                                            {video ? (
                                                <span className="text-gray-700">{video.name}</span>
                                            ) : (
                                                <span className="text-gray-500">{contents.upload2}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-4/5 py-3 mt-7 px-3 border-slate-400 rounded border bg-gray-100 relative cursor-pointer hover:bg-gray-200">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleFileChange(e, setFiles)}
                                        />
                                        <div className="flex items-center justify-center h-full">
                                            {files ? (
                                                <span className="text-gray-700">{files.name}</span>
                                            ) : (
                                                <span className="text-gray-500">{contents.upload3}</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 mt-7 text-white bg-blue-400 rounded hover:bg-blue-700"
                                    >
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
}

export default Modal;
