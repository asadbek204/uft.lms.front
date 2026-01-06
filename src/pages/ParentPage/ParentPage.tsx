import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  Grid,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import moment from 'moment';
import client from '../../components/services';
import { GlobalContext } from '../../App';
import { Langs } from '../../enums';

const { useBreakpoint } = Grid;

const translations = {
  [Langs.UZ]: {
    title: "Ota-onalar ro'yxati",
    searchPlaceholder: "Ism, familiya, PINFL, guruh yoki o‘quvchi ismi bo‘yicha qidirish...",
    searchButton: "Qidirish",
    addNew: "Yangi ota-ona qo‘shish",
    edit: "Tahrirlash",
    delete: "O'chirish",
    deleteConfirm: "Haqiqatan ham o'chirmoqchimisiz?",
    deleteSuccess: "Ota-ona o'chirildi",
    deleteCancel: "Bekor qilish",
    name: "Ism",
    lastName: "Familiya",
    sureName: "Sharifi",
    phone: "Telefon",
    pinfl: "PINFL",
    passport: "Pasport",
    email: "Email",
    birthday: "Tug‘ilgan sana",
    child: "Bog'lanadigan o'quvchi (bola)",
    selectChild: "O'quvchini tanlang",
    selectPlaceholder: "Tanlang",
    save: "Saqlash",
    add: "Qo‘shish va bog‘lash",
    cancel: "Bekor qilish",
    gender: "Jins",
    male: "Erkak",
    female: "Ayol",
    phoneRequired: "Telefon raqami majburiy",
    action: "Amallar",
    yes: "Ha",
    phoneDuplicate: "Bu telefon raqami allaqachon ro'yxatdan o'tgan!",
  },
  [Langs.RU]: {
    title: "Список родителей",
    searchPlaceholder: "Поиск по имени, фамилии, ПИНФЛ, группе или имени ученика...",
    searchButton: "Поиск",
    addNew: "Добавить нового родителя",
    edit: "Редактировать",
    delete: "Удалить",
    deleteConfirm: "Вы действительно хотите удалить?",
    deleteSuccess: "Родитель удалён",
    deleteCancel: "Отмена",
    name: "Имя",
    lastName: "Фамилия",
    sureName: "Отчество",
    phone: "Телефон",
    pinfl: "ПИНФЛ",
    passport: "Паспорт",
    email: "Эл. почта",
    birthday: "Дата рождения",
    child: "Связанный ученик (ребёнок)",
    selectChild: "Выберите ученика",
    selectPlaceholder: "Выберите",
    save: "Сохранить",
    add: "Добавить и привязать",
    cancel: "Отмена",
    gender: "Пол",
    male: "Мужской",
    female: "Женский",
    phoneRequired: "Телефон обязателен",
    action: "Действия",
    yes: "Да",
    phoneDuplicate: "Этот номер телефона уже зарегистрирован!",
  },
  [Langs.EN]: {
    title: "Parents List",
    searchPlaceholder: "Search by name, surname, PINFL, group or student name...",
    searchButton: "Search",
    addNew: "Add New Parent",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete?",
    deleteSuccess: "Parent deleted",
    deleteCancel: "Cancel",
    name: "First Name",
    lastName: "Last Name",
    sureName: "Middle Name",
    phone: "Phone",
    pinfl: "PINFL",
    passport: "Passport",
    email: "Email",
    birthday: "Date of Birth",
    child: "Linked Student (Child)",
    selectChild: "Select Student",
    selectPlaceholder: "Select",
    save: "Save",
    add: "Add & Link",
    cancel: "Cancel",
    gender: "Gender",
    male: "Male",
    female: "Female",
    phoneRequired: "Phone number is required",
    action: "Actions",
    yes: "Yes",
    phoneDuplicate: "This phone number is already registered!",
  },
};

interface Parent {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  sure_name: string;
  passport: string;
  pinfl: string;
  email: string;
  birthday: string | null;
  gender?: 'M' | 'F';
}

interface UserShort {
  id: number;
  first_name: string;
  last_name: string;
  sure_name?: string;
  phone_number: string;
  gender?: 'M' | 'F';
  birthday?: string;
}

interface Student {
  id: number;
  user: UserShort;
  status: string;
}

interface ParentFormValues {
  first_name: string;
  last_name: string;
  sure_name?: string;
  phone_number: string;
  passport?: string;
  pinfl?: string;
  email?: string;
  birthday?: moment.Moment | null;
  gender?: 'M' | 'F';
  child_id?: number;
}

const ParentPage: React.FC = () => {
  const { lang } = useContext(GlobalContext);
  const t = translations[lang];
  const screens = useBreakpoint();

  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [form] = Form.useForm<ParentFormValues>();

  const fetchParents = async (search: string = '') => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const { data } = await client.get<Parent[]>('/parents/parent/list/', { params });
      setParents(data);
    } catch (error) {
      console.error('Ota-onalarni yuklashda xatolik:', error);
      toast.error("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await client.get<Student[]>('/students/list/');
      setStudents(data);
    } catch (error) {
      console.error("O'quvchilarni yuklashda xatolik:", error);
      toast.error("O'quvchilar ro'yxatini yuklab bo'lmadi");
    }
  };

  useEffect(() => {
    fetchParents();
    fetchStudents();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchParents(value);
  };

  const showModal = (parent: Parent | null = null) => {
    setEditingParent(parent);
    if (parent) {
      form.setFieldsValue({
        ...parent,
        birthday: parent.birthday ? moment(parent.birthday) : null,
        gender: parent.gender || undefined,
        child_id: undefined,
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (id: number) => {
    try {
      await client.delete(`/parents/parent/delete/${id}/`);
      toast.success(t.deleteSuccess);
      fetchParents(searchText);
    } catch (error: any) {
      console.error('Ota-onani o‘chirishda xatolik:', error);
      toast.error(error.response?.data?.detail || "O'chirishda xatolik yuz berdi");
    }
  };

  const normalizePhone = (phone: string): string => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    return cleaned.startsWith('998') ? `+${cleaned}` : `+998${cleaned}`;
  };

const handleSubmit = async (values: ParentFormValues) => {
  try {
    const payload = {
      ...values,
      phone_number: normalizePhone(values.phone_number),
      birthday: values.birthday?.format('YYYY-MM-DD') ?? null,
      gender: values.gender || null,
      child_id: values.child_id,
    };

    if (editingParent) {
      await client.patch(`/parents/parent/update/${editingParent.id}/`, payload);
      toast.success(t.save + " muvaffaqiyatli bajarildi");
    } else {
      await client.post('/parents/parent/create/', payload);
      toast.success("Yangi ota-ona qo'shildi va bog'landi");
    }
    
    setModalVisible(false);
    form.resetFields();
    fetchParents(searchText);
  } catch (error: any) {
    console.error('Xatolik:', error);
    
    if (error.response?.data?.father?.detail) {
      const detail = error.response.data.father.detail;
      if (detail.includes('duplicate key') && detail.includes('phone_number')) {
        toast.error(t.phoneDuplicate);
        return; 
      }
    }
    
    if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else if (error.response?.data?.father?.message) {
      toast.error(error.response.data.father.message);
    } else {
      toast.error("Amaliyot bajarishda xatolik yuz berdi");
    }
  }
};

  const columns: ColumnsType<Parent> = [
    { title: t.name, dataIndex: 'first_name', key: 'first_name', width: 140 },
    { title: t.lastName, dataIndex: 'last_name', key: 'last_name', width: 160 },
    { title: t.sureName, dataIndex: 'sure_name', key: 'sure_name', width: 140 },
    { title: t.phone, dataIndex: 'phone_number', key: 'phone_number', width: 160 },
    { title: t.pinfl, dataIndex: 'pinfl', key: 'pinfl', width: 140 },
    {
      title: t.birthday,
      dataIndex: 'birthday',
      key: 'birthday',
      width: 140,
      render: (text?: string) => (text ? moment(text).format('DD.MM.YYYY') : '-'),
    },
    {
      title: t.action || 'Amallar',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => showModal(record)}>
            {t.edit}
          </Button>
          <Popconfirm
            title={t.deleteConfirm}
            onConfirm={() => handleDelete(record.id)}
            okText={t.yes}
            cancelText={t.deleteCancel}
          >
            <Button type="link" danger>
              {t.delete}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto px-4 sm:px-5 container">
      <h2 className="text-xl sm:text-2xl mb-4">{t.title}</h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <Input.Search
          placeholder={t.searchPlaceholder}
          allowClear
          enterButton={t.searchButton}
          onSearch={handleSearch}
          className="w-full sm:w-96"
        />
        <Button type="primary" onClick={() => showModal(null)} className="w-full sm:w-auto">
          {t.addNew}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table<Parent>
          columns={columns}
          dataSource={parents}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 15 }}
          scroll={{ x: 900 }}
          className="min-w-[900px]"
        />
      </div>

      <Modal
        title={editingParent ? t.edit : t.addNew}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={screens.md ? 900 : 700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <Form.Item name="first_name" label={t.name} rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="last_name" label={t.lastName} rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="sure_name" label={t.sureName}>
              <Input />
            </Form.Item>

            <Form.Item name="gender" label={t.gender}>
              <Select placeholder={t.selectPlaceholder}>
                <Select.Option value="M">{t.male}</Select.Option>
                <Select.Option value="F">{t.female}</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="phone_number"
              label={t.phone}
              rules={[{ required: true, message: t.phoneRequired }]}
            >
              
              <InputMask mask="(99) 999-99-99" >
                            {/* @ts-expect-error */}

                {(inputProps) => <Input {...inputProps} addonBefore="+998" minLength={14} placeholder="(99) 123 45 67" />}
              </InputMask>
            </Form.Item>

            <Form.Item
              name="child_id"
              label={t.child}
              rules={[{ required: true, message: t.selectChild }]}
            >
              <Select
                showSearch
                placeholder={t.selectChild}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                }
              >
                {students.map((student) => (
                  <Select.Option
                    key={student.id}
                    value={student.user.id}
                    label={`${student.user.first_name} ${student.user.last_name} ${student.user.sure_name || ''}`}
                  >
                    {student.user.first_name} {student.user.last_name}
                    {student.user.sure_name && ` (${student.user.sure_name})`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="pinfl" label={t.pinfl}>
              <Input maxLength={14} placeholder="14 ta raqam" />
            </Form.Item>

            <Form.Item name="passport" label={t.passport}>
              <Input placeholder="AA 1234567" />
            </Form.Item>

            <Form.Item name="email" label={t.email}>
              <Input type="email" />
            </Form.Item>

            <Form.Item name="birthday" label={t.birthday} className="sm:col-span-2">
              <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={handleCancel}>{t.cancel}</Button>
              <Button type="primary" htmlType="submit">
                {editingParent ? t.save : t.add}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ParentPage;