"use client";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import client from "../../components/services";
import { toast } from "react-toastify";
import EditStaffModal from "./EditStaffModal/EditStaffModal";
import DeleteStaffModal from "./DeleteStaffModal/DeleteStaffModal";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";

interface Role {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  sure_name: string;
  phone_number: string;
  email: string;
  birthday: string;
  passport: string | null;
  pinfl: string | null;
  gender: string;
}

interface StaffMember {
  id: number;
  salary: number;
  role: Role;
  manager: number | null;
  user: User;
}

const contentsMap = new Map([
  [
    Langs.UZ,
    {
      title: "👥 Xodimlar ro‘yxati",
      add: "Yangi xodim qo‘shish",
      staff: "Xodim",
      contact: "Aloqa",
      role: "Lavozim",
      salary: "Maosh",
      actions: "Harakatlar",
      male: "Erkak",
      female: "Ayol",
      success_delete: " Xodim muvaffaqiyatli o‘chirildi",
      error_delete: "❌ O‘chirishda xatolik yuz berdi",
      error_fetch: "❌ Ma’lumotlarni olishda xatolik",
    },
  ],
  [
    Langs.RU,
    {
      title: "👥 Список сотрудников",
      add: "Добавить нового сотрудника",
      staff: "Сотрудник",
      contact: "Контакты",
      role: "Должность",
      salary: "Зарплата",
      actions: "Действия",
      male: "Мужской",
      female: "Женский",
      success_delete: "Сотрудник успешно удалён",
      error_delete: "❌ Ошибка при удалении",
      error_fetch: "❌ Ошибка при получении данных",
    },
  ],
  [
    Langs.EN,
    {
      title: "👥 Staff List",
      add: "Add New Staff",
      staff: "Staff",
      contact: "Contact",
      role: "Role",
      salary: "Salary",
      actions: "Actions",
      male: "Male",
      female: "Female",
      success_delete: " Staff deleted successfully",
      error_delete: "❌ Error deleting staff",
      error_fetch: "❌ Error fetching staff data",
    },
  ],
]);

const StaffList = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const { lang } = useContext(GlobalContext);
  const t = contentsMap.get(lang) || contentsMap.get(Langs.UZ)!;

  const fetchStaff = async () => {
    try {
      const response = await client.get(`/employees/list/`);
      setStaffMembers(response.data);
    } catch (error) {
      console.error("❌ Error fetching staff:", error);
      toast.error(t.error_fetch);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleEditClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setDeleteModalOpen(true);
  };

  const handleSave = () => {
    fetchStaff();
    setEditModalOpen(false);
    setSelectedStaff(null);
  };

  const handleDelete = async () => {
    if (selectedStaff) {
      try {
        await client.delete(`/employees/delete/${selectedStaff.id}/`);
        toast.success(t.success_delete);
        setStaffMembers((prev) =>
          prev.filter((staff) => staff.id !== selectedStaff.id)
        );
      } catch (err) {
        toast.error(t.error_delete);
      } finally {
        setSelectedStaff(null);
        setDeleteModalOpen(false);
      }
    }
  };

  return (
    <div className="w-full p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          {t.title}
        </h2>
        <Link
          to={`addstaff`}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <i className="fa fa-plus mr-2"></i>
          {t.add}
        </Link>
      </div>

      <div
        className="overflow-x-auto shadow-xl max-h-[690px] md:max-h-[620px] xl:max-h-[600px] 2xl:max-h-[690px]
                bg-white dark:bg-gray-900"
      >
        <table className="min-w-full relative">
          <thead
            className="sticky top-0 
                      bg-gray-50 dark:bg-gray-800
                      border-b border-gray-200 dark:border-gray-700"
          >
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                       text-gray-500 dark:text-gray-300"
              >
                {t.staff}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                       text-gray-500 dark:text-gray-300"
              >
                {t.contact}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                       text-gray-500 dark:text-gray-300"
              >
                {t.role}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                       text-gray-500 dark:text-gray-300"
              >
                {t.salary}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                       text-gray-500 dark:text-gray-300"
              >
                {t.actions}
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {staffMembers.map((staff) => (
              <tr
                key={staff.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {/* STAFF */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="ml-4">
                    <div
                      className="text-sm font-medium
                              text-gray-900 dark:text-gray-100"
                    >
                      {staff.user.first_name} {staff.user.last_name}{" "}
                      {staff.user.sure_name}
                    </div>
                    <div
                      className="text-xs
                              text-gray-500 dark:text-gray-400"
                    >
                      {staff.user.gender === "M" ? t.male : t.female}
                    </div>
                  </div>
                </td>

                {/* CONTACT */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="flex flex-col space-y-1 text-sm
                            text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center">
                      <i className="fa fa-envelope mr-2"></i>
                      {staff.user.email}
                    </div>
                    <div className="flex items-center">
                      <i className="fa fa-phone mr-2"></i>
                      {staff.user.phone_number}
                    </div>
                  </div>
                </td>

                {/* ROLE */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                             bg-green-100 text-green-800
                             dark:bg-green-900/30 dark:text-green-300"
                  >
                    {staff.role.name}
                  </span>
                </td>

                {/* SALARY */}
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm
                         text-gray-600 dark:text-gray-300"
                >
                  {staff.salary.toLocaleString("uz-UZ")} so‘m
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditClick(staff)}
                      className="text-blue-600 hover:text-blue-900
                           dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <i className="fa fa-edit text-lg"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(staff)}
                      className="text-red-600 hover:text-red-900
                           dark:text-red-400 dark:hover:text-red-300"
                    >
                      <i className="fa fa-trash text-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedStaff(null);
        }}
        staffMember={selectedStaff}
        onSave={handleSave}
      />

      <DeleteStaffModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        lang={"uz"}
      />
    </div>
  );
};

export default StaffList;
