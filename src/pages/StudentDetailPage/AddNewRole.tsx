import React, {useState} from "react";

interface AddNewRoleProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (roleId: string, salary: number) => void;
}

const AddNewRole: React.FC<AddNewRoleProps> = ({isOpen, onClose, onConfirm}) => {
    const [selectedRole, setSelectedRole] = useState('');
    const [salary, setSalary] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(selectedRole, Number(salary));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white border-2 border-slate-300 p-5 rounded-lg z-50 shadow-lg max-w-md w-full">
                <h1 className="text-xl font-bold mb-4">Yangi vazifa berish</h1>
                <form onSubmit={handleSubmit}>
                    <select
                        className="w-full my-4 p-2 border-0 outline-0"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        required
                    >
                        <option value="">Tanlang</option>
                        <option value={1}>Oqituvchi</option>
                        <option value={2}>Yordamchi oqituvchi</option>
                        <option value={3}>Menejer</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Salary"
                        className="w-full my-4 p-2 border rounded outline-none focus:border-green-500"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        required
                        min="0"
                    />
                    <div className="flex justify-between space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewRole;