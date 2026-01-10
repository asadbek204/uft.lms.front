import React, { useState, useEffect, useContext } from "react";
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
} from "antd";
import { Trash2, Pencil } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import moment from "moment";
import client from "../../components/services";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import Loading from "../../components/LoadingComponent/Loading";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const translations = {
  [Langs.UZ]: {
    title: "Ota-onalar ro'yxati",
    searchPlaceholder:
      "Ism, familiya, PINFL, telefon yoki o'quvchi ismi bo'yicha...",
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
    password: "Parol",
  },
  [Langs.RU]: {
    title: "Список родителей",
    searchPlaceholder:
      "Поиск по имени, фамилии, ПИНФЛ, телефону или имени ученика...",
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
    password: "Пароль",
  },
  [Langs.EN]: {
    title: "Parents List",
    searchPlaceholder:
      "Search by name, surname, PINFL, phone or student name...",
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
    password: "Password",
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
  gender?: "M" | "F";
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
  gender?: "M" | "F";
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
  birthday?: string | null;
  gender?: "M" | "F";
  children?: number[];
  password?: string;
}

const ParentPage: React.FC = () => {
  const { lang } = useContext(GlobalContext) || { lang: Langs.UZ };
  const t =
    translations[lang as keyof typeof translations] || translations[Langs.UZ];
  const screens = useBreakpoint();

  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [form] = Form.useForm<ParentFormValues>();

  const getStudentByUserId = (userId: number): Student | undefined => {
    return students.find((s) => s.user.id === userId);
  };

const transformParentsData = (parentsData: ParentAPI[]): Parent[] => {
  return parentsData.map(parent => ({
    ...parent,
    children: parent.children
      .map(childUserId => {
        const student = getStudentByUserId(childUserId);
        if (!student) return null;

        return {
          id: student.user.id,
          first_name: student.user.first_name,
          last_name: student.user.last_name,
          sure_name: student.user.sure_name ?? undefined,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null)
  }));
};


  const fetchParents = async (search = "") => {
    try {
      setLoading(true);
      const params = search.trim() ? { search: search.trim() } : {};
      const { data } = await client.get<ParentAPI[]>("/parents/list/", {
        params,
      });

      const processedParents = transformParentsData(data);
      setParents(processedParents);
    } catch (error: any) {
      console.error("Ota-onalarni yuklashda xato:", error);
      toast.error(error.response?.data?.detail || t.noData);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await client.get<Student[]>("/students/list/");
      setStudents(data);
    } catch (error) {
      console.error("O'quvchilarni yuklashda xato:", error);
      toast.error("O'quvchilar ro'yxatini yuklab bo'lmadi");
    }
  };

  const MaskedInput = InputMask as any;


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
        sure_name: parent.sure_name || "",
        phone_number: parent.phone_number?.replace("+998", "") || "",
        passport: parent.passport || "",
        pinfl: parent.pinfl || "",
        email: parent.email || "",
        birthday: parent.birthday
  ? moment(parent.birthday).format("DD.MM.YYYY")
  : "",
        gender: parent.gender || undefined,
        password: "",
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

  const handleDelete = async (parent: Parent) => {
    try {
      for (const child of parent.children) {
        await client.delete(`/parents/delete/${child.id}/${parent.id}/`);
      }
      toast.success(t.deleteSuccess);
      fetchParents(searchText);
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "O'chirishda xatolik yuz berdi"
      );
    }
  };

  const normalizePhone = (phone: string): string => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.startsWith("998") ? `+${cleaned}` : `+998${cleaned}`;
  };

  const handleSubmit = async (values: ParentFormValues) => {
  try {
    const payload: any = {
      phone_number: normalizePhone(values.phone_number || ""),
      password: values.password || null,
      email: values.email || null,
      first_name: values.first_name,
      last_name: values.last_name,
      sure_name: values.sure_name || null,
      pinfl: values.pinfl || null,
      gender: values.gender || null,
      birthday: values.birthday
  ? moment(values.birthday, "DD.MM.YYYY").format("YYYY-MM-DD")
  : null,

    };

    // ✨ passport bo‘lsa — qo‘shamiz
    if (values.passport?.trim()) {
      payload.passport = values.passport.trim().toUpperCase();
    }

    if (editingParent?.id) {
      await client.patch(`/accounts/update/${editingParent.id}/`, payload);
      toast.success("O'zgartirishlar muvaffaqiyatli saqlandi");
    } else {
      await client.post("/parents/create/", {
        ...payload,
        children: values.children || [],
      });
      toast.success("Yangi ota-ona muvaffaqiyatli qo'shildi");
    }

    setModalVisible(false);
    setEditingParent(null);
    form.resetFields();
    fetchParents(searchText);
  }
  catch (error: any) {
    const res = error?.response?.data;
    let msg = "";

    const duplicateChecks = [
      res?.detail,
      res?.father?.detail,
      res?.mother?.detail,
      res?.user?.detail
    ];

    if (duplicateChecks.some(x => x?.includes("phone_number"))) {
      msg = t.phoneDuplicate;
    }
    else if (typeof res === "object") {
      msg = Object.values(res).flat().join(", ");
    }
    else {
      msg = "Saqlash jarayonida xatolik yuz berdi";
    }

    toast.error(msg);
    console.error("Save error:", res);
  }
};


  const columns: ColumnsType<Parent> = [
    {
      title: t.name,
      dataIndex: "first_name",
      key: "first_name",
      width: 140,
    },
    {
      title: t.lastName,
      dataIndex: "last_name",
      key: "last_name",
      width: 160,
    },
    {
      title: t.sureName,
      dataIndex: "sure_name",
      key: "sure_name",
      width: 140,
    },
    {
      title: t.phone,
      dataIndex: "phone_number",
      key: "phone_number",
      width: 160,
    },
    {
      title: t.pinfl,
      dataIndex: "pinfl",
      key: "pinfl",
      width: 140,
    },
    {
      title: t.birthday,
      dataIndex: "birthday",
      key: "birthday",
      width: 140,
      render: (text?: string) =>
        text ? moment(text).format("DD.MM.YYYY") : "—",
    },
    {
      title: t.children,
      key: "children",
      width: 220,
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.children?.length > 0 ? (
            record.children.map((child) => (
              <Tag key={child.id} color="blue">
                {child.first_name}{" "}
                {child.last_name ? `${child.last_name.charAt(0)}.` : ""}
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
      key: "action",
      width: 140,
      fixed: screens.lg ? "right" : false,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => showModal(record)}>
            <Pencil size={18} />
          </Button>
          <Popconfirm
            title={t.deleteConfirm}
            onConfirm={() => handleDelete(record)}
            okText={t.yes}
            cancelText={t.no}
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger>
              <Trash2 size={18} />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto px-5 py-6 ">
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
        {loading ? (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        ) : (
          <Table<Parent>
            columns={columns}
            dataSource={parents}
            rowKey="id"
            expandable={{ showExpandColumn: false }}
            pagination={{ pageSize: 15 }}
            scroll={{ x: 1100 }}
            locale={{ emptyText: t.noData }}
          />
        )}
      </div>

      <Modal
        title={
          editingParent
            ? `${t.edit}: ${editingParent.first_name} ${editingParent.last_name}`
            : t.addNew
        }
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
              <InputMask
                mask="(99) 999-99-99"
                value={form.getFieldValue("phone_number") || ""}
                onChange={(e) => {
                  form.setFieldsValue({ phone_number: e.target.value });
                }}
              >
                {
                  // @ts-ignore — react-input-mask children render function typing fix
                  (inputProps) => (
                    <Input
                      {...inputProps}
                      addonBefore="+998"
                      placeholder="(99) 123 45 67"
                    />
                  )
                }
              </InputMask>
            </Form.Item>

            <Form.Item
              name="password"
              label={t.password}
              rules={editingParent ? [] : [{ required: true, message: `${t.password} majburiy` }]}
            >
              <Input.Password placeholder={editingParent ? "O'zgartirish uchun yangisini kiriting" : "Parolni kiriting"} />
            </Form.Item>

            {!editingParent && (
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
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ width: "100%" }}
                >
                  {students.map((student) => (
                    <Select.Option
                      key={student.user.id}
                      value={student.user.id}
                      label={`${student.user.first_name} ${
                        student.user.last_name
                      } ${student.user.sure_name || ""}`}
                    >
                      {student.user.first_name} {student.user.last_name}
                      {student.user.sure_name && ` (${student.user.sure_name})`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item name="pinfl" label={t.pinfl}>
              <Input maxLength={14} placeholder="33332221110000" />
            </Form.Item>

            <Form.Item name="passport" label={t.passport}>
              <Input placeholder="AA 1234567" />
            </Form.Item>

            <Form.Item name="email" label={t.email}>
              <Input type="email" placeholder="example@gmail.com" />
            </Form.Item>
<Form.Item name="birthday" label={t.birthday}>
  <MaskedInput
    mask="99.99.9999"
    value={form.getFieldValue("birthday") || ""}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
      form.setFieldsValue({ birthday: e.target.value });
    }}
  >
    {(inputProps: any) => (
      <Input
        {...inputProps}
        placeholder="DD.MM.YYYY"
      />
    )}
  </MaskedInput>
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