import React, {useEffect, useState, useContext, ChangeEvent} from 'react';
import {UserContext} from "../../../components/context/Context.tsx";
import Loading from "../../../components/LoadingComponent/Loading.tsx";

interface Lesson {
    id: number;
    lesson_title: string;
    date: string;
    description: string;
    group: {
        id: number;
        name: string;
        course: string;
    };
    module: string;
}

interface Group {
    id: number;
    name: string;
    course: string;
}

interface NewLesson {
    lesson_title: string;
    date: string;
    description: string;
    group: string;
}

const TCHSchedule: React.FC = () => {
    const {role} = useContext(UserContext);
    const [lessonsData, setLessonsData] = useState<Lesson[]>([]);
    const [groupsData, setGroupsData] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [validationError, setValidationError] = useState('');
    const [newLesson, setNewLesson] = useState<NewLesson>({
        lesson_title: '',
        date: '',
        description: '',
        group: '',
    });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (role !== 'TEACHER') {
            setLoading(false);
            return;
        }

        // Statik ma'lumotlar
        const staticLessons = [
            {
                id: 1,
                lesson_title: 'Matematika',
                date: '2023-01-01',
                description: 'Matematika darsining ta\'rifi',
                group: {id: 1, name: 'A guruh', course: 'Kurs 1'},
                module: 'Algebra',
            },
            {
                id: 2,
                lesson_title: 'Fizika',
                date: '2023-01-02',
                description: 'Fizika darsining ta\'rifi',
                group: {id: 2, name: 'B guruh', course: 'Kurs 2'},
                module: 'Mexanika',
            },
        ];

        const staticGroups = [
            {id: 1, name: 'A guruh', course: 'Kurs 1'},
            {id: 2, name: 'B guruh', course: 'Kurs 2'},
        ];

        setLessonsData(staticLessons);
        setGroupsData(staticGroups);
        setLoading(false);
    }, [role]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: keyof NewLesson) => {
        const {value} = e.target;
        setNewLesson(prevLesson => ({...prevLesson, [field]: value}));
    };

    const handleAddLesson = () => {
        const {lesson_title, date, description, group} = newLesson;

        if (!lesson_title || !date || !description || !group) {
            setValidationError('Barcha maydonlar to\'ldirilishi kerak.');
            return;
        }

        const selectedGroup = groupsData.find(g => g.id === parseInt(group));

        if (!selectedGroup || !selectedGroup.course || !selectedGroup.name) {
            setValidationError('Guruhning hamma maydonlari to\'ldirilishi kerak.');
            return;
        }

        const newLessonData = {
            id: lessonsData.length + 1,
            lesson_title,
            date,
            description,
            group: selectedGroup,
            module: 'Yangi Modul',
        };

        setLessonsData([...lessonsData, newLessonData]);
        setNewLesson({
            lesson_title: '',
            date: '',
            description: '',
            group: '',
        });
        setShowAddForm(false);
        setValidationError('');
    };

    return (
        <div className=" bg-center-center bg-full w-full max-h-[850px] rounded drop-shadow-xl overflow-y-auto">
            {loading ? <Loading/> : (
                <div className="header w-full">
                    <div className="my-5 mx-5 text-center">
                        <h1 className="2xl:text-4xl xl:text-3xl font-bold  m-auto dark:text-customText">O'qituvchilarning
                            Darslari</h1>
                        <div className="flex justify-center my-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded mx-2 hover:bg-green-600 transition"
                                onClick={() => {
                                    setShowAddForm(!showAddForm);
                                    setValidationError('');
                                }}
                            >
                                {showAddForm ? 'Bekor qilish' : "Dars qo'shish"}
                            </button>
                        </div>
                    </div>
                    {showAddForm && (
                        <div className="add-form my-5 flex flex-col items-center">
                            <input
                                type="text"
                                value={newLesson.lesson_title}
                                onChange={(e) => handleInputChange(e, 'lesson_title')}
                                placeholder="Dars nomi"
                                className="border-2 border-gray-300 p-2 mb-2 rounded w-4/5 md:w-1/2"
                            />
                            <input
                                type="date"
                                value={newLesson.date}
                                onChange={(e) => handleInputChange(e, 'date')}
                                placeholder="Sana"
                                className="border-2 border-gray-300 p-2 mb-2 rounded w-4/5 md:w-1/2"
                            />
                            <textarea
                                value={newLesson.description}
                                onChange={(e) => handleInputChange(e, 'description')}
                                placeholder="Dars ta'rifi"
                                className="border-2 border-gray-300 p-2 mb-2 rounded w-4/5 md:w-1/2 h-24"
                            />
                            <select
                                value={newLesson.group}
                                onChange={(e) => handleInputChange(e, 'group')}
                                className="border-2 border-gray-300 p-2 mb-2 rounded w-4/5 md:w-1/2"
                            >
                                <option value="">Guruh tanlang</option>
                                {groupsData.map(group => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
                            </select>
                            {validationError && <p className="text-red-500">{validationError}</p>}
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded mx-2 mt-4 hover:bg-green-600 transition"
                                onClick={handleAddLesson}
                            >
                                Tasdiqlash
                            </button>
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table
                            className="w-full max-w-5xl text-center mx-auto text-sm md:text-lg table-fixed border-collapse border-4 border-slate-600 dark:text-white">
                            <thead>
                            <tr>
                                <th className="border-4 border-slate-600 py-3">Dars nomi</th>
                                <th className="border-4 border-slate-600 py-3">Sana</th>
                                <th className="border-4 border-slate-600 py-3">Dars ta'rifi</th>
                                <th className="border-4 border-slate-600 py-3">Guruh nomi</th>
                                <th className="border-4 border-slate-600 py-3">Modul</th>
                            </tr>
                            </thead>
                            <tbody>
                            {lessonsData.map((lesson) => (
                                <tr key={lesson.id}>
                                    <td className="border-4 border-slate-600 py-2">{lesson.lesson_title}</td>
                                    <td className="border-4 border-slate-600 py-2">{new Date(lesson.date).toLocaleDateString()}</td>
                                    <td className="border-4 border-slate-600 py-2">{lesson.description}</td>
                                    <td className="border-4 border-slate-600 py-2">{lesson.group.name}</td>
                                    <td className="border-4 border-slate-600 py-2">{lesson.module}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TCHSchedule;
