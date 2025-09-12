import React, { useState } from "react";

interface StaffMember {
    id: number,
    salary: number,
    role: Role,
    user: User
}

interface Role {
    name: string,
    description: string
}

interface User {
    first_name: string,
    last_name: string,
    phone_number: string,
    birthday: string,
    email: string,
}
interface EditStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    staffMember: StaffMember;
    onSave: (updatedStaff: StaffMember) => void;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({ isOpen, onClose, staffMember, onSave }) => {
    const [editedStaff, setEditedStaff] = useState<StaffMember>(staffMember);
    console.log(editedStaff)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedStaff({ ...editedStaff, [name]: value });
    };

    const handleSave = () => {
        onSave(editedStaff);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Edit Staff Member</h2>
                <div>
                    <label className="block mb-2">First Name</label>
                    <input
                        name="first_name"
                        value={editedStaff.user.first_name}
                        onChange={handleChange}
                        className="border px-3 py-2 rounded w-full"
                    />
                </div>
                {/* Add fields for other editable properties */}
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditStaffModal;
