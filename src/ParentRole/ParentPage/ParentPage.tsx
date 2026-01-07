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
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import moment from 'moment';
import client from '../../components/services';
import { GlobalContext } from '../../App';
import { Langs } from '../../enums';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const translations = {
  [Langs.UZ]: {
    title: "Ota-onalar ro'yxati",
    searchPlaceholder: "Ism, familiya, PINFL, telefon yoki o'quvchi ismi bo'yicha...",
    searchButton: "Qidirish",
    addNew: "Yangi ota-ona qo'shish",
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
    birthday: "Tug'ilgan sana",
    children: "Bog'langan bolalar",
    selectChildren: "Bolalarni tanlang",
    selectPlaceholder: "Tanlang",
    save: "Saqlash",
    add: "Qo'shish",
    cancel: "Bekor qilish",
    gender: "Jins",
    male: "Erkak",
    female: "Ayol",
    phoneRequired: "Telefon raqami majburiy",
    action: "Amallar",
    yes: "Ha",
    no: "Yo'q",
    phoneDuplicate: "Bu telefon raqami allaqachon ro'yxatdan o'tgan!",
    noData: "Ma'lumot topilmadi",
    loading: "Yuklanmoqda...",
  },
  [Langs.RU]: {
    title: "Список родителей",
    searchPlaceholder: "Поиск по имени, фамилии, ПИНФЛ, телефону или имени ученика...",
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
    children: "Привязанные дети",
    selectChildren: "Выберите детей",
    selectPlaceholder: "Выберите",
    save: "Сохранить",
    add: "Добавить",
    cancel: "Отмена",
    gender: "Пол",
    male: "Мужской",
    female: "Женский",
    phoneRequired: "Телефон обязателен",
    action: "Действия",
    yes: "Да",
    no: "Нет",
    phoneDuplicate: "Этот номер телефона уже зарегистрирован!",
    noData: "Данные не найдены",
    loading: "Загрузка...",
  },
  [Langs.EN]: {
    title: "Parents List",
    searchPlaceholder: "Search by name, surname, PINFL, phone or student name...",
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
    children: "Linked Children",
    selectChildren: "Select Children",
    selectPlaceholder: "Select",
    save: "Save",
    add: "Add",
    cancel: "Cancel",
    gender: "Gender",
    male: "Male",
    female: "Female",
    phoneRequired: "Phone number is required",
    action: "Actions",
    yes: "Yes",
    no: "No",
    phoneDuplicate: "This phone number is already registered!",
    noData: "No data found",
    loading: "Loading...",
  },
};

interface ParentAPI {
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
  children: number[];
}

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
  children: Array<{
    id: number;
    first_name: string;
    last_name: string;
    sure_name?: string;
  }>;
}

interface UserShort {
  id: number;
  first_name: string;
  last_name: string;
  sure_name?: string;
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
  children?: number[];
}

const ParentPage: React.FC = () => {
  const { lang } = useContext(GlobalContext) || { lang: Langs.UZ };
  const t = translations[lang as keyof typeof translations] || translations[Langs.UZ];
  const screens = useBreakpoint();

  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [form] = Form.useForm<ParentFormValues>();

  // Helper: Student ID dan ma'lumot olish
  const getStudentById = (id: number): UserShort | undefined => {
    return students.find(s => s.user.id === id)?.user;
  };

  // API dan kelgan parentlarni UI uchun moslashtirish
  const transformParentsData = (parentsData: ParentAPI[]): Parent[] => {
    return parentsData.map(parent => ({
      ...parent,
      children: parent.children
        .map(childId => getStudentById(childId))
        .filter((child): child is UserShort => !!child)
        .map(child => ({
          id: child.id,
          first_name: child.first_name,
          last_name: child.last_name,
          sure_name: child.sure_name,
        })),
    }));
  };

  const fetchParents = async (search = '') => {
    try {
      setLoading(true);
      const params = search.trim() ? { search: search.trim() } : {};
      const { data } = await client.get<ParentAPI[]>('/parents/list/', { params });

      const processedParents = transformParentsData(data);
      setParents(processedParents);
    } catch (error: any) {
      console.error('Ota-onalarni yuklashda xato:', error);
      toast.error(error.response?.data?.detail || t.noData);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await client.get<Student[]>('/students/list/');
      setStudents(data);
    } catch (error) {
      console.error("O'quvchilarni yuklashda xato:", error);
      toast.error("O'quvchilar ro'yxatini yuklab bo'lmadi");
    }
  };

  // Birinchi yuklash
  useEffect(() => {
    fetchStudents();
  }, []);

  // O'quvchilar yuklangandan keyin ota-onalarni yuklash
  useEffect(() => {
    if (students.length > 0) {
      fetchParents();
    }
  }, [students]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchParents(value);
  };

  const showModal = (parent: Parent | null = null) => {
    setEditingParent(parent);

    if (parent) {
      form.setFieldsValue({
        first_name: parent.first_name,
        last_name: parent.last_name,
        sure_name: parent.sure_name || '',
        phone_number: parent.phone_number?.replace('+998', '') || '',
        passport: parent.passport || '',
        pinfl: parent.pinfl || '',
        email: parent.email || '',
        birthday: parent.birthday ? moment(parent.birthday) : null,
        gender: parent.gender || undefined,
        children: parent.children?.map(c => c.id) || [],
      });
    } else {
      form.resetFields();
    }

    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingParent(null);
    form.resetFields();
  };

  const handleDelete = async (id: number) => {
    try {
      await client.delete(`/parents/delete/${id}/`);
      toast.success(t.deleteSuccess);
      fetchParents(searchText);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "O'chirishda xatolik yuz berdi");
    }
  };

  const normalizePhone = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('998') ? `+${cleaned}` : `+998${cleaned}`;
  };

  const handleSubmit = async (values: ParentFormValues) => {
    try {
      const payload = {
        ...values,
        phone_number: normalizePhone(values.phone_number || ''),
        birthday: values.birthday?.format('YYYY-MM-DD') ?? null,
        gender: values.gender || null,
        children: values.children || [],
      };

      if (editingParent?.id) {
        await client.patch(`/parents/update/${editingParent.id}/`, payload);
        toast.success("O'zgartirishlar muvaffaqiyatli saqlandi");
      } else {
        await client.post('/parents/create/', payload);
        toast.success("Yangi ota-ona muvaffaqiyatli qo'shildi");
      }

      setModalVisible(false);
      setEditingParent(null);
      form.resetFields();
      fetchParents(searchText);
    } catch (error: any) {
      if (error.response?.data?.detail?.includes('phone_number')) {
        toast.error(t.phoneDuplicate);
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Saqlash jarayonida xatolik yuz berdi");
      }
      console.error('Saqlash xatosi:', error);
    }
  };

  const columns: ColumnsType<Parent> = [
    {
      title: t.name,
      dataIndex: 'first_name',
      key: 'first_name',
      width: 140,
    },
    {
      title: t.lastName,
      dataIndex: 'last_name',
      key: 'last_name',
      width: 160,
    },
    {
      title: t.sureName,
      dataIndex: 'sure_name',
      key: 'sure_name',
      width: 140,
    },
    {
      title: t.phone,
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 160,
    },
    {
      title: t.pinfl,
      dataIndex: 'pinfl',
      key: 'pinfl',
      width: 140,
    },
    {
      title: t.birthday,
      dataIndex: 'birthday',
      key: 'birthday',
      width: 140,
      render: (text?: string) => (text ? moment(text).format('DD.MM.YYYY') : '—'),
    },
    {
      title: t.children,
      key: 'children',
      width: 220,
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.children?.length > 0 ? (
            record.children.map(child => (
              <Tag key={child.id} color="blue">
                {child.first_name} {child.last_name ? `${child.last_name.charAt(0)}.` : ''}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      ),
    },
    {
      title: t.action,
      key: 'action',
      width: 140,
      fixed: screens.lg ? 'right' : false,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => showModal(record)}>
            {t.edit}
          </Button>
          <Popconfirm
            title={t.deleteConfirm}
            onConfirm={() => handleDelete(record.id)}
            okText={t.yes}
            cancelText={t.no}
            okButtonProps={{ danger: true }}
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
    <div className="w-full mx-auto px-4 py-6 max-w-7xl">
      <Title level={2} className="mb-8 dark:text-gray-100 text-gray-800">
        {t.title}
      </Title>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input.Search
          placeholder={t.searchPlaceholder}
          allowClear
          enterButton={t.searchButton}
          onSearch={handleSearch}
          className="w-full max-w-md"
        />
        <Button
          type="primary"
          onClick={() => showModal(null)}
          className="w-full sm:w-auto"
        >
          {t.addNew}
        </Button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <Table<Parent>
          columns={columns}
          dataSource={parents}
          rowKey="id"
          expandable={{ showExpandColumn: false }}
          loading={loading ? { tip: t.loading } : false}
          pagination={{
            pageSize: 15,
          }}
          scroll={{ x: 1100 }}
          locale={{ emptyText: t.noData }}
          className="
            dark:bg-gray-800 
            dark:text-gray-200 
            [&_.ant-table-thead>tr>th]:dark:bg-gray-700
            [&_.ant-table-thead>tr>th]:dark:text-gray-300
            [&_.ant-table-cell]:dark:border-gray-700
          "
        />
      </div>

      <Modal
        title={editingParent ? `${t.edit}: ${editingParent.first_name} ${editingParent.last_name}` : t.addNew}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={screens.md ? 1000 : 720}
        destroyOnClose
        maskClosable={false}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Form.Item
              name="first_name"
              label={t.name}
              rules={[{ required: true, message: `${t.name} majburiy` }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="last_name"
              label={t.lastName}
              rules={[{ required: true, message: `${t.lastName} majburiy` }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="sure_name" label={t.sureName}>
              <Input />
            </Form.Item>

            <Form.Item name="gender" label={t.gender}>
              <Select allowClear placeholder={t.selectPlaceholder}>
                <Select.Option value="M">{t.male}</Select.Option>
                <Select.Option value="F">{t.female}</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="phone_number"
              label={t.phone}
              rules={[{ required: true, message: t.phoneRequired }]}
            >
              <InputMask mask="(99) 999-99-99">
                {inputProps => (
                  <Input
                    {...inputProps}
                    addonBefore="+998"
                    placeholder="(99) 123 45 67"
                  />
                )}
              </InputMask>
            </Form.Item>

            <Form.Item
              name="children"
              label={t.children}
              rules={[{ required: true, message: t.selectChildren }]}
            >
              <Select
                mode="multiple"
                showSearch
                placeholder={t.selectChildren}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                }
                style={{ width: '100%' }}
              >
                {students.map(student => (
                  <Select.Option
                    key={student.user.id}
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
              <Input maxLength={14} placeholder="33332221110000" />
            </Form.Item>

            <Form.Item name="passport" label={t.passport}>
              <Input placeholder="AA 1234567" />
            </Form.Item>

            <Form.Item name="email" label={t.email}>
              <Input type="email" placeholder="example@gmail.com" />
            </Form.Item>

            <Form.Item name="birthday" label={t.birthday} className="md:col-span-2">
              <DatePicker
                format="DD.MM.YYYY"
                style={{ width: '100%' }}
                placeholder="Kun.Oy.Yil"
              />
            </Form.Item>
          </div>

          <Form.Item className="mt-8 text-right">
            <Space size="middle">
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