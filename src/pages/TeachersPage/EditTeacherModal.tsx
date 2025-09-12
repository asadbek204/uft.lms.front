import React, {useState} from 'react';
import {TTeachers as Teacher} from "./TeachersPage.tsx";

interface EditTeacherModalProps {
    teacher: Teacher;
    onClose: () => void;
    onSave: (updatedTeacher: Teacher) => void;
}

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({teacher, onClose, onSave}) => {
    const [firstName, setFirstName] = useState(teacher.first_name);
    const [lastName, setLastName] = useState(teacher.last_name);
    const [sureName, setSureName] = useState(teacher.sure_name);

    const handleSave = () => {
        if (teacher) {
            onSave({
                ...teacher,
                first_name: firstName,
                last_name: lastName,
                sure_name: sureName,
            });
        }
    };

    return (
        <div className="modal w-full h-full sm:flex  justify-between items-center">
            <div className="modal-content md:flex flex-row items-center">
                <input
                    className="flex uppercase 2xl:text-xl text-lg border-gray-300 p-4 duration-300 ease-in-out hover:text-blue-400 dark:bg-gray-700 dark:text-white"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                />
                <input
                    className="flex uppercase 2xl:text-xl text-lg border-gray-300 p-4 duration-300 ease-in-out hover:text-blue-400 dark:bg-gray-700 dark:text-white"

                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                />
                <input
                    className="block uppercase 2xl:text-xl text-lg border-gray-300 p-4 duration-300 ease-in-out hover:text-blue-400 dark:bg-gray-700 dark:text-white"
                    type="text"
                    value={sureName}
                    onChange={(e) => setSureName(e.target.value)}
                    placeholder="Sure Name"
                />

            </div>
            <div className='flex justify-center '>
                <button
                    onClick={handleSave}
                    className='m-4 bg-green-600 w-[30px] h-[30px] dark:text-gray-200 text-white rounded-md'>
                    <i className='fa-solid fa-check'/>
                </button>
                <button
                    onClick={onClose}
                    className='m-4 bg-red-600 w-[30px] h-[30px] dark:text-gray-200 text-white rounded-md'>
                    <i className='fa-solid fa-close'/>
                </button>
            </div>
        </div>
    );
};

export default EditTeacherModal;
