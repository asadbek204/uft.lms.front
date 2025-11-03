"use client";
import React, { useEffect, useState, useContext } from "react";
import { Form, Input, InputNumber, DatePicker, Select, Button, Modal } from "antd";
import dayjs from "dayjs";
import client from "../../../components/services";
import { toast } from "react-toastify";
import { GlobalContext } from "../../../App";
import { Langs } from "../../../enums";

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

interface Staff {
  id: number;
  manager: number | null;
  role: {
    id: number;
    name: string;
  };
  salary: number;
  user: User;
}

interface Props {
  staffMember: Staff | null;
  onClose: () => void;
  onSave: () => void;
  isOpen: boolean;
}

const contentsMap = new Map([
  [
    Langs.UZ,
    {
      title: "✏️ Xodim ma’lumotlarini tahrirlash",
      cancel: "Bekor qilish",
      save: "Saqlash",
      name: "Ism",
      surname: "Familiya",
      sure_name: "Sharif",
      phone: "Telefon raqam",
      email: "Email",
      passport: "Passport seriya",
      pinfl: "PINFL",
      gender: "Jinsi",
      birthday: "Tug‘ilgan sana",
      salary: "Maosh (so‘m)",
      role: "Lavozim",
      select_role: "Lavozimni tanlang",
      teacher: "O‘qituvchi",
      assistant: "Yordamchi o‘qituvchi",
      manager: "Menejer",
      accountant: "Hisobchi",
      admin: "Admin",
      male: "Erkak",
      female: "Ayol",
      success: "Xodim ma’lumotlari yangilandi!",
      error: "Ma’lumotlarni yangilashda xatolik!",
      invalid_phone: "Telefon raqam +998 bilan boshlanishi kerak",
      invalid_passport: "Masalan: AA1234567",
      invalid_pinfl: "14 xonali PINFL kiriting",
    },
  ],
  [
    Langs.RU,
    {
      title: "✏️ Редактировать данные сотрудника",
      cancel: "Отмена",
      save: "Сохранить",
      name: "Имя",
      surname: "Фамилия",
      sure_name: "Отчество",
      phone: "Номер телефона",
      email: "Электронная почта",
      passport: "Паспорт",
      pinfl: "ПИНФЛ",
      gender: "Пол",
      birthday: "Дата рождения",
      salary: "Зарплата (сум)",
      role: "Должность",
      select_role: "Выберите должность",
      teacher: "Учитель",
      assistant: "Ассистент",
      manager: "Менеджер",
      accountant: "Бухгалтер",
      admin: "Админ",
      male: "Мужской",
      female: "Женский",
      success: "Данные сотрудника обновлены!",
      error: "Ошибка при обновлении данных!",
      invalid_phone: "Номер телефона должен начинаться с +998",
      invalid_passport: "Пример: AA1234567",
      invalid_pinfl: "Введите 14-значный ПИНФЛ",
    },
  ],
  [
    Langs.EN,
    {
      title: "✏️ Edit Employee Information",
      cancel: "Cancel",
      save: "Save",
      name: "First Name",
      surname: "Last Name",
      sure_name: "Middle Name",
      phone: "Phone Number",
      email: "Email",
      passport: "Passport",
      pinfl: "PINFL",
      gender: "Gender",
      birthday: "Date of Birth",
      salary: "Salary (UZS)",
      role: "Role",
      select_role: "Select Role",
      teacher: "Teacher",
      assistant: "Assistant Teacher",
      manager: "Manager",
      accountant: "Accountant",
      admin: "Admin",
      male: "Male",
      female: "Female",
      success: "Employee information updated successfully!",
      error: "Error updating information!",
      invalid_phone: "Phone number must start with +998",
      invalid_passport: "Example: AA1234567",
      invalid_pinfl: "Enter 14-digit PINFL",
    },
  ],
]);

const EditStaffModal: React.FC<Props> = ({ staffMember, onClose, onSave, isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { lang } = useContext(GlobalContext);
  const t = contentsMap.get(lang) || contentsMap.get(Langs.UZ)!;

  useEffect(() => {
    if (staffMember && staffMember.user) {
      form.setFieldsValue({
        first_name: staffMember.user.first_name,
        last_name: staffMember.user.last_name,
        sure_name: staffMember.user.sure_name,
        phone_number: staffMember.user.phone_number,
        email: staffMember.user.email,
        passport: staffMember.user.passport,
        pinfl: staffMember.user.pinfl,
        gender: staffMember.user.gender,
        birthday: dayjs(staffMember.user.birthday),
        salary: staffMember.salary,
        role: staffMember.role.id.toString(),
      });
    }
  }, [staffMember]);

  const handleSubmit = async (values: any) => {
    if (!staffMember) return;
    try {
      setLoading(true);
      const payload = {
        ...values,
        birthday: values.birthday.format("YYYY-MM-DD"),
      };
      await client.patch(`/employees/update/${staffMember.id}/`, payload);
      toast.success(t.success);
      onSave();
      onClose();
    } catch (error: any) {
      console.error("❌ Update error:", error.response?.data || error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<h3 className="text-lg font-semibold text-center">{t.title}</h3>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      width={750}
    >
      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-3"
        >
          <Form.Item name="first_name" label={t.name} rules={[{ required: true }]}>
            <Input placeholder={t.name} />
          </Form.Item>

          <Form.Item name="last_name" label={t.surname} rules={[{ required: true }]}>
            <Input placeholder={t.surname} />
          </Form.Item>

          <Form.Item name="sure_name" label={t.sure_name} rules={[{ required: true }]}>
            <Input placeholder={t.sure_name} />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label={t.phone}
            rules={[{ required: true, pattern: /^\+998\d{9}$/, message: t.invalid_phone }]}
          >
            <Input placeholder="+998901234567" maxLength={13} />
          </Form.Item>

          <Form.Item name="email" label={t.email} rules={[{ required: true, type: "email" }]}>
            <Input placeholder={t.email} />
          </Form.Item>

          <Form.Item
            name="passport"
            label={t.passport}
            rules={[{ required: true, pattern: /^[A-Z]{2}\d{7}$/, message: t.invalid_passport }]}
          >
            <Input placeholder="AA1234567" maxLength={9} />
          </Form.Item>

          <Form.Item
            name="pinfl"
            label={t.pinfl}
            rules={[{ required: true, pattern: /^\d{14}$/, message: t.invalid_pinfl }]}
          >
            <Input placeholder="14-digit PINFL" maxLength={14} />
          </Form.Item>

          <Form.Item name="gender" label={t.gender} rules={[{ required: true }]}>
            <Select
              options={[
                { value: "M", label: t.male },
                { value: "F", label: t.female },
              ]}
            />
          </Form.Item>

          <Form.Item name="birthday" label={t.birthday} rules={[{ required: true }]}>
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="salary" label={t.salary} rules={[{ required: true }]}>
            <InputNumber className="w-full" placeholder="0" />
          </Form.Item>

          <Form.Item name="role" label={t.role} rules={[{ required: true }]}>
            <Select placeholder={t.select_role}>
              <Select.Option value="1">{t.teacher}</Select.Option>
              <Select.Option value="2">{t.assistant}</Select.Option>
              <Select.Option value="3">{t.manager}</Select.Option>
              <Select.Option value="4">{t.accountant}</Select.Option>
              <Select.Option value="5">{t.admin}</Select.Option>
            </Select>
          </Form.Item>

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <Button onClick={onClose}>{t.cancel}</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {t.save}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditStaffModal;
