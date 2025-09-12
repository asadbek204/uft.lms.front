import {useContext, useState, useMemo} from "react";
import {GlobalContext} from "../../../App.tsx";
import client from "../../../components/services";
import {Langs} from "../../../enums.ts";
import {toast} from "react-toastify";

type TModuleModalContent = {
    title: string,
    saveButton: string,
    priceLabel: string,
    success: string,
    error: string,
    totalBefore: string,
    totalAfter: string,
    totalDifference: string
};

const modalContentsMap = new Map<Langs, TModuleModalContent>([
    [Langs.UZ, {
        title: "Modulni tahrirlash",
        saveButton: "Saqlash",
        priceLabel: "Narx",
        success: "Muvaffaqiyatli saqlandi",
        error: "Xatolik yuz berdi",
        totalBefore: "Dastlabki summa",
        totalAfter: "Oxirgi summa",
        totalDifference: "Farq"
    }],
    [Langs.RU, {
        title: "Редактировать модуль",
        saveButton: "Сохранить",
        priceLabel: "Цена",
        success: "Успешно сохранено",
        error: "Произошла ошибка",
        totalBefore: "Общая сумма до",
        totalAfter: "Общая сумма после",
        totalDifference: "Разница"
    }],
    [Langs.EN, {
        title: "Edit Module",
        saveButton: "Save",
        priceLabel: "Price",
        success: "Successfully saved",
        error: "An error occurred",
        totalBefore: "Total Before",
        totalAfter: "Total After",
        totalDifference: "Difference"
    }]
]);

type TModule = {
    id: number;
    name: string;
    price: number;
};

function EditModuleModal({modules, name, onClose}: { modules: TModule[], name: string, onClose: () => void }) {
    const {lang} = useContext(GlobalContext);
    const contents = modalContentsMap.get(lang) as TModuleModalContent;

    // Initialize prices with proper type checking
    const initialPrices = useMemo(() => {
        return modules.reduce((acc, module) => ({
            ...acc,
            [module.id]: Number(module.price) || 0
        }), {} as Record<number, number>);
    }, [modules]);

    const [editingPrices, setEditingPrices] = useState<Record<number, number>>(initialPrices);

    const handlePriceChange = (moduleId: number, newPrice: string) => {
        const parsedPrice = parseFloat(newPrice);
        setEditingPrices(prev => ({
            ...prev,
            [moduleId]: isNaN(parsedPrice) ? 0 : parsedPrice
        }));
    };

    const handleSavePrice = async (moduleId: number) => {
        try {
            await client.patch(`education/module/${moduleId}/`, {
                price: editingPrices[moduleId]
            });
            toast.success(contents.success);
        } catch (error) {
            console.error('Error updating module price:', error);
            toast.error(contents.error);
        }
    };

    // Fixed total calculations with proper type checking
    const totalBefore = useMemo(() => {
        if (!modules?.length) return 0;
        return modules.reduce((sum, module) => {
            const price = Number(module.price) || 0;
            return sum + price;
        }, 0);
    }, [modules]);

    const totalAfter = useMemo(() => {
        if (!editingPrices) return 0;
        return Object.values(editingPrices).reduce((sum, price) => {
            const numPrice = Number(price) || 0;
            return sum + numPrice;
        }, 0);
    }, [editingPrices]);

    const totalDifference = totalAfter - totalBefore;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">
                    <span className="text-blue-600">{name}</span> - {contents.title}
                </h2>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {modules.map((module) => (
                        <div key={module.id}
                             className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                            <div>
                                <h3 className="text-lg font-semibold dark:text-white">
                                    {module.name}
                                </h3>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <label className="dark:text-white">
                                        {contents.priceLabel}:
                                    </label>
                                    <input
                                        type="number"
                                        value={editingPrices[module.id]}
                                        onChange={(e) => handlePriceChange(module.id, e.target.value)}
                                        className="w-44 px-2 py-1 border rounded dark:bg-gray-600 dark:text-white"
                                    />
                                </div>

                                <button
                                    onClick={() => handleSavePrice(module.id)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    {contents.saveButton}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                    <p className="dark:text-white">
                        {contents.totalBefore}: {totalBefore.toFixed(2)}
                    </p>
                    <p className="dark:text-white">
                        {contents.totalAfter}: {totalAfter.toFixed(2)}
                    </p>
                    <p className={`dark:text-white ${totalDifference >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {contents.totalDifference}: {totalDifference.toFixed(2)}
                    </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        x
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditModuleModal;