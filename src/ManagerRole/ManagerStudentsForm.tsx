import { useState, useEffect, useContext } from 'react';
import { Form, Input, InputNumber, Select, Button } from 'antd';
import InputMask from 'react-input-mask';
import { toast } from "react-toastify";
import { GlobalContext } from "../App.tsx";
import client from "../components/services";
import { Langs } from "../enums.ts";
import { useParams } from "react-router-dom";

const DateInput = ({ value, onChange }: any) => {
  const { lang } = useContext(GlobalContext);

  const placeholders = {
    [Langs.UZ]: "KK.OO.YYYY",
    [Langs.RU]: "ДД.ММ.ГГГГ",
    [Langs.EN]: "DD.MM.YYYY",
  };

  return (
    <InputMask
      mask="99.99.9999"
      maskChar={null}
      value={value}
      onChange={onChange}
      placeholder={placeholders[lang] || "DD.MM.YYYY"}
    >
         {/* @ts-ignore */}
      {(inputProps: any) => <Input {...inputProps} style={{ width: "100%" }} />}
    </InputMask>
  );
};

type TGroup = {
  id: number;
  name: string;
  status: boolean;
  amount: string;
};

type TNewsComponentContent = {
  title: string;
  first_name: string;
  last_name: string;
  sure_name: string;
  groups: string;
  refereed_by: string;
  phone_number: string;
  gender: string;
  birthday: string;
  passport: string;
  pinfl: string;
  email: string;
  password: string;
  status: string;
  submit: string;
  choose1: string;
  choose2: string;
  choose3: string;
  choose4: string;
  man: string;
  woman: string;
  amount: string;
  discount: string;
  total: string;
  course: string;
  address: string;
  passport_address: string;
  education_language: string;
  uzbek: string;
  russian: string;
  required: string;
  cfirst_name: string;
  clast_name: string;
  csure_name: string;
  error1: string;
  error2: string;
  pasportdate: string;
  student: string;
  contract_maker: string;
  ivalid_value: string;
  invalid_passport: string;
  invalid_pinfl: string;
  phone_exists: string;
  invalid_birthday: string;
  summa: string;
};

const contentsMap = new Map<Langs, TNewsComponentContent>([
  [Langs.UZ, {
    invalid_passport: "Pasport raqami noto'g'ri! U 2 ta harfdan keyin 7 ta raqamdan iborat bo'lishi kerak",
    invalid_pinfl: "JSHSHIR 14 sondan iborat bo'lishi kerak",
    ivalid_value: "Qiymat notog'ri",
    phone_exists: "Bu telefon raqami allaqachon ishlatilgan!",
    invalid_birthday: "Tug'ilgan sana formati noto'g'ri! To'g'ri format: KK.OO.YYYY",
    title: "Yangi o'quvchi qo'shish",
    first_name: "Ism",
    last_name: "Familiya",
    sure_name: "Otasining ismi",
    groups: "Guruh",
    refereed_by: "Yuborgan shaxs",
    phone_number: "Telefon raqami",
    gender: "Jinsi",
    birthday: "Tug'ilgan sana",
    passport: "Pasport",
    pinfl: "JSHSHIR",
    email: "Email",
    password: "Parol",
    status: "Holati",
    submit: "Yuborish",
    choose1: "Guruhni tanlang",
    choose2: "Jinsini tanlang",
    choose3: "Ta'lim tilini tanlang",
    choose4: "Kursni tanlang",
    man: "Erkak",
    woman: "Ayol",
    amount: "Summa",
    discount: "Chegirma",
    total: "Umumiy hisob",
    course: "Kurs nomi",
    address: "Manzil",
    passport_address: "Pasport kim tomonidan berilgan",
    education_language: "Ta'lim tili",
    uzbek: "O'zbek tili",
    russian: "Rus tili",
    required: "to'ldirish shart",
    cfirst_name: "Shartnoma tuzuvchining ismi",
    clast_name: "Shartnoma tuzuvchining familiyasi",
    csure_name: "Shartnoma tuzuvchining otasining ismi",
    error1: "Muvaffaqiyatli qo'shildi",
    error2: "Qo‘shib bo‘lmadi",
    pasportdate: "Pasport berilgan sana",
    student: "Talaba",
    contract_maker: "Shartnoma tuzuvchi",
    summa: "Modul narxi"
  }],
  [Langs.RU, {
    invalid_passport: "Неверный номер паспорта! Это должно быть 2 буквы, за которыми следуют 7 цифр",
    invalid_pinfl: "PINFL должен состоять из 14 цифр",
    ivalid_value: "Неверное значение",
    phone_exists: "Этот номер телефона уже используется!",
    invalid_birthday: "Неверный формат даты рождения! Правильный: ДД.ММ.ГГГГ",
    title: "Добавить нового студента",
    first_name: "Имя",
    last_name: "Фамилия",
    sure_name: "Отчество",
    groups: "Группа",
    refereed_by: "Рекомендатель",
    phone_number: "Телефон",
    gender: "Пол",
    birthday: "Дата рождения",
    passport: "Паспорт",
    pinfl: "ПИНФЛ",
    email: "Эл. адрес",
    password: "Пароль",
    status: "Статус",
    submit: "Отправить",
    choose1: "Выберите группу",
    choose2: "Выберите пол",
    choose3: "Выберите язык обучения",
    choose4: "Выбрать курс",
    man: "Мужчина",
    woman: "Женщина",
    amount: "Сумма",
    discount: "Скидка",
    total: "Итог",
    course: "Название курса",
    address: "Адрес",
    passport_address: "Кем выдан паспорт",
    education_language: "Язык обучения",
    uzbek: "Узбекский",
    russian: "Русский",
    required: "должен быть заполнен",
    cfirst_name: "Имя подрядчика",
    clast_name: "Фамилия подрядчика",
    csure_name: "Имя отца договаривающейся стороны",
    error1: "Успешно добавлено",
    error2: "Не удалось добавить",
    pasportdate: "Дата выдачи паспорта",
    student: "Студент",
    contract_maker: "Контрактник",
    summa: "Цена модуля"
  }],
  [Langs.EN, {
    invalid_passport: "Invalid passport number! It should be 2 letters followed by 7 digits",
    invalid_pinfl: "PINFL must be 14 digits long",
    ivalid_value: "Invalid value",
    phone_exists: "This phone number is already in use!",
    invalid_birthday: "Invalid date format! Use DD.MM.YYYY",
    title: "Add new student",
    first_name: "First Name",
    last_name: "Last Name",
    sure_name: "Middle Name",
    groups: "Groups",
    refereed_by: "Referred by",
    phone_number: "Phone Number",
    gender: "Gender",
    birthday: "Birthday",
    passport: "Passport",
    pinfl: "PINFL",
    email: "Email",
    password: "Password",
    status: "Status",
    submit: "Submit",
    choose1: "Select group",
    choose2: "Select gender",
    choose3: "Select the language of instruction",
    choose4: "Choose a course",
    man: "Male",
    woman: "Female",
    amount: "Amount",
    discount: "Discount",
    total: "Total",
    course: "Course name",
    address: "Address",
    passport_address: "Passport issued by",
    education_language: "Education language",
    uzbek: "Uzbek",
    russian: "Russian",
    required: "required",
    cfirst_name: "Name of the contractor",
    clast_name: "Surname of the contractor",
    csure_name: "Father's name of the contracting party",
    error1: "Successfully added",
    error2: "Failed to add",
    pasportdate: "Passport issue date",
    student: "Student",
    contract_maker: "Contract maker",
    summa: "Module price"
  }],
]);

function StudentsForm() {
  const { id } = useParams();
  const { lang, role } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TNewsComponentContent;
  const [groups, setGroups] = useState<TGroup[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await client.get(`education/group/list/?needed_role=${role}`);
        if (response.data) {
          setGroups(response.data.filter((el: any) => el.status));
        }
      } catch (error) {
        console.error('Error fetching groups: ', error);
      }
    }
    fetchData();
  }, [role]);

  // Telefon raqamni xavfsiz formatlash
  const formatPhone = (phone: string | undefined): string => {
    if (!phone) return "";
    return `+998${phone.replace(/[^0-9]/g, "")}`;
  };

  // Sana formatini tekshirish va YYYY-MM-DD ga o'tkazish
  const formatDateToBackend = (dateStr: string | undefined): string | null => {
    if (!dateStr) return null;
    const parts = dateStr.split(".");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) return null;
    return `${year}-${month}-${day}`;
  };

async function onFinish(data: any) {
  try {
    // Telefon raqamlarni formatlash
    if (data.phone_number) {
      data.phone_number = formatPhone(data.phone_number);
    }
    if (data.student?.phone_number) {
      data.student.phone_number = formatPhone(data.student.phone_number);
    }

    // Tug'ilgan kunni formatlash (oldindan tekshirish)
    if (data.student?.birthday) {
      const formattedBirthday = formatDateToBackend(data.student.birthday);
      if (!formattedBirthday) {
        toast.error(contents.invalid_birthday);
        return;
      }
      data.student.birthday = formattedBirthday;
    }

    // Pasport sanasi
    if (data.passport_date) {
      const formattedPassport = formatDateToBackend(data.passport_date);
      if (formattedPassport) {
        data.passport_date = formattedPassport;
      }
    }

    // Manager ma'lumoti
    const myAccountResponse = await client.get('accounts/me/');
    data.manager = myAccountResponse.data.roles[role];

    // Talaba paroli
    data.student = data.student || {};
    data.student.password = "1234";

    // So'rov yuborish
    await client.post('students/agreement/create/', { old_student: id, ...data }, {
      headers: { 'Content-Type': 'application/json' },
    });

    toast.success(contents.error1);
    form.resetFields();
  } catch (error: any) {
    console.error("Qo‘shishda xatolik:", error);

    if (error.response?.data) {
      const errData = error.response.data;

      // 1. Telefon raqami allaqachon mavjud (turli formatlarda kelishi mumkin)
      if (
        errData.detail?.phone || 
        errData.phone || 
        errData.phone_number || 
        errData.student?.phone_number
      ) {
        toast.error(contents.phone_exists);
        return;
      }

      // 2. Tug'ilgan sana formati noto'g'ri (backenddan qaytganda)
      if (errData.student?.birthday) {
        toast.error(contents.invalid_birthday);
        return;
      }

      // 3. Passport seria noto'g'ri
      if (errData.passport_seria || errData.student?.passport_seria) {
        toast.error(contents.invalid_passport);
        return;
      }

      // 4. PINFL noto'g'ri
      if (errData.pinfl || errData.student?.pinfl) {
        toast.error(contents.invalid_pinfl);
        return;
      }

      // 5. Boshqa detail xabarlari (string yoki object)
      if (errData.detail) {
        if (typeof errData.detail === 'string') {
          toast.error(errData.detail);
          return;
        }
        toast.error(contents.error2);
        return;
      }

      toast.error(contents.error2);
    } else {
      toast.error(contents.error2);
    }
  }
}

  return (
    <div className="px-10 w-full mt-12 md:mt-0">
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-[50px] h-[50px] rounded-xl bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
        >
          <i className="fa-solid fa-arrow-left dark:text-white"></i>
        </button>
        <h1 className="text-center text-3xl dark:text-white font-semibold font-sans mx-auto">
          {contents.title}
        </h1>
      </div>

      <Form
        className='w-full 2xl:h-[87%] h-[65%] overflow-y-auto'
        layout="vertical"
        size="large"
        form={form}
        onFinish={onFinish}
      >
        {/* Shartnoma tuzuvchi */}
        <h3 className="text-2xl font-medium mb-4 dark:text-white">{contents.contract_maker}</h3>
        <div className="md:grid grid-cols-4 gap-x-[30px] gap-y-[10px] mb-6 dark-form">
          <Form.Item label={contents.last_name} name="last_name">
            <Input />
          </Form.Item>
          <Form.Item label={contents.first_name} name="first_name">
            <Input />
          </Form.Item>
          <Form.Item label={contents.sure_name} name="surname">
            <Input />
          </Form.Item>
          <Form.Item label={contents.phone_number} name="phone_number">
            <InputMask mask="(99) 999-99-99">
             {/* @ts-ignore */}
              {(inputProps) => <Input {...inputProps} addonBefore="+998" />}
            </InputMask>
          </Form.Item>
          <Form.Item
            label={contents.passport}
            name="passport_seria"
            rules={[
              { pattern: /^[A-Z]{2}\d{7}$/, message: contents.invalid_passport },
            ]}
          >
            <Input placeholder="AA1234567" maxLength={9} />
          </Form.Item>
          <Form.Item label={contents.pinfl} name="pinfl" rules={[
            { len: 14, message: contents.invalid_pinfl },
            { pattern: /^[0-9]+$/, message: contents.ivalid_value },
          ]}>
            <Input maxLength={14} />
          </Form.Item>
          <Form.Item label={contents.pasportdate} name="passport_date">
            <DateInput />
          </Form.Item>
          <Form.Item label={contents.passport_address} name="passport_address">
            <Input />
          </Form.Item>
          <Form.Item className="col-span-2" label={contents.address} name="address">
            <Input />
          </Form.Item>
          <Form.Item label={contents.summa}  rules={[{ required: true, message: contents.required }]} name="price">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={contents.discount} name="discount">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        {/* Talaba ma'lumotlari */}
        <h3 className="text-2xl font-medium mb-4 dark:text-white">{contents.student}</h3>
        <div className="md:grid grid-cols-3 gap-x-[30px] gap-y-[10px] mb-4 dark-form">
          <Form.Item
            label={contents.last_name}
            name={["student", "last_name"]}
            rules={[{ required: true, message: contents.required }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={contents.first_name}
            name={["student", "first_name"]}
            rules={[{ required: true, message: contents.required }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={contents.sure_name}
            name={["student", "sure_name"]}
            rules={[{ required: true, message: contents.required }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={contents.phone_number}
            name={["student", "phone_number"]}
            rules={[{ required: true, message: contents.required }]}
          >
            <InputMask mask="(99) 999-99-99">
             {/* @ts-ignore */}
              {(inputProps) => <Input {...inputProps} addonBefore="+998" />}
            </InputMask>
          </Form.Item>
          <Form.Item
            label={contents.birthday}
            name={["student", "birthday"]}
            rules={[{ required: true, message: contents.required }]}
          >
            <DateInput />
          </Form.Item>
          <Form.Item
            label={contents.groups}
            name={["student", "groups"]}
            rules={[{ required: true, message: contents.required }]}
          >
            <Select placeholder={contents.choose1}>
              {groups.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item className="[&_button]:w-[200px]">
          <Button type="primary" htmlType="submit">
            {contents.submit}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default StudentsForm;