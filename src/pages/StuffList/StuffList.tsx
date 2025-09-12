import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import client from "../../components/services";
import {toast} from "react-toastify";
import EditStaffModal from "./EditStaffModal/EditStaffModal.tsx";
import DeleteStaffModal from "./DeleteStaffModal/DeleteStaffModal.tsx";

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

const StaffList = () => {
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await client.get(`employees/list/`);
                setStaffMembers(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Error fetching staff members.");
            }
        })();
    }, []);

    const handleEditClick = (staff: StaffMember) => {
        setSelectedStaff(staff); // Set selected staff
        setEditModalOpen(true); // Open edit modal
    };

    const handleDeleteClick = (staff: StaffMember) => {
        setSelectedStaff(staff); // Set selected staff
        setDeleteModalOpen(true); // Open delete modal
    };

    const handleSave = (updatedStaff: StaffMember) => {
        setStaffMembers((prev) =>
            prev.map((staff) => (staff.id === updatedStaff.id ? updatedStaff : staff))
        );
        setEditModalOpen(false);
    };

    const handleDelete = () => {
        if (selectedStaff) {
            (async() => await client.delete(`employees/delete/${selectedStaff.id}/`))().then(() => {
                // TODO: configure text translation
                toast.success('Muvaffaqiyatli ochirildi')
            }).catch(() => {
                toast.error('O\'chirishda xatolik')
            })
            setStaffMembers((prev) => prev.filter((staff) => staff.id !== selectedStaff.id));
            setSelectedStaff(null); // Reset selected staff
        }
        setDeleteModalOpen(false);
    };


    return (
        <div className="w-full p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Staff Members</h2>
                <Link to={`addstaff`}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <i className="fa fa-plus mr-2"></i>
                    Add New Staff
                </Link>
            </div>

            <div
                className="overflow-x-auto shadow-xl max-h-[690px] md:max-h-[620px] xl:max-h-[600px] 2xl:max-h-[690px]">
                <table className="min-w-full relative">
                    <thead className="sticky top-0">
                    <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {staffMembers.map((staff) => (
                        <tr key={staff.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="ml-4">
                                        <div
                                            className="text-sm font-medium text-gray-900">{staff.user.first_name} {staff.user.last_name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fa fa-envelope mr-2"></i>
                                        {staff.user.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fa fa-phone mr-2"></i>
                                        {staff.user.phone_number}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {staff.role.name}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${staff.salary.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-3">
                                    <button onClick={() => handleEditClick(staff)}
                                            className="text-blue-600 hover:text-blue-900">
                                        <i className="fa fa-edit text-lg"></i>
                                    </button>
                                    <button onClick={() => handleDeleteClick(staff)}
                                            className="text-red-600 hover:text-red-900">
                                        <i className="fa fa-trash text-lg"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {selectedStaff && (
                <EditStaffModal
                    isOpen={isEditModalOpen}
                    onClose={() => {setEditModalOpen(false); setSelectedStaff(null)} }
                    staffMember={selectedStaff}
                    onSave={handleSave}
                />
            )}
            <DeleteStaffModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleDelete}
            />
        </div>

    );
};

export default StaffList;