import { useContext } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import InputMask from 'react-input-mask';
import type { InputProps } from 'antd';
import { toast } from "react-toastify";
import client from "./components/services";
import { GlobalContext } from './App';
import { Langs } from "./enums";
import { useParams } from 'react-router-dom';

const PhoneInput = (props: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 9) value = value.slice(0, 9)
    const formattedValue = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "($1) $2-$3-$4")

    props.onChange?.({
      ...e,
      target: { ...e.target, value: formattedValue },
    } as any)
  }

  return (
    <InputMask mask="(99) 999-99-99" maskChar={null} value={props.value as string} onChange={handleChange}>
      {((inputProps: any) => <Input {...inputProps} addonBefore="+998" />) as any}
    </InputMask>
  )
}

const DateInput = (props: InputProps) => {
  const { lang } = useContext(GlobalContext)

  const placeholders = {
    [Langs.UZ]: "KK.OO.YYYY",
    [Langs.RU]: "ДД.ММ.ГГГГ",
    [Langs.EN]: "DD.MM.YYYY",
  }

  return (
    <InputMask
      mask="99.99.9999"
      placeholder={placeholders[lang] || "DD.MM.YYYY"}
      maskChar={null}
      value={props.value as string}
      onChange={props.onChange as any}
    >
      {((inputProps: any) => <Input {...inputProps} />) as any}
    </InputMask>
  )
}

type TNewsComponentContent = {
  title: string
  first_name: string
  last_name: string
  sure_name: string
  groups: string
  price: string
  refereed_by: string
  phone_number: string
  gender: string
  birthday: string
  passport: string
  pinfl: string
  email: string
  password: string
  status: string
  submit: string
  choose1: string
  choose2: string
  choose3: string
  choose4: string
  man: string
  woman: string
  amount: string
  discount: string
  total: string
  course: string
  address: string
  passport_address: string
  education_language: string
  uzbek: string
  russian: string
  required: string
  cfirst_name: string
  clast_name: string
  csure_name: string
  error1: string
  error2: string
  pasportdate: string
  student: string
  contract_maker: string
  ivalid_value: string
  invalid_passport: string
  invalid_pinfl: string
  phone_exists: string
  email_exists: string
  birthday_format_error: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
  [
    Langs.UZ,
    {
      invalid_passport: "Pasport raqami noto'g'ri! U 2 ta harfdan keyin 7 ta raqamdan iborat bo'lishi kerak",
      invalid_pinfl: "JSHSHIR 14 sondan iborat bo'lishi kerak",
      ivalid_value: "Qiymat notog'ri",
      phone_exists: "Bu telefon raqam allaqachon ishlatilgan!",
      email_exists: "Bu email allaqachon ro'yxatdan o'tgan!",
      birthday_format_error: "Tug'ilgan sana formati noto'g'ri! To'g'ri format: KK.OO.YYYY",
      title: "Yangi o'quvchi qo'shish",
      first_name: "Ism",
      last_name: "Familiya",
      sure_name: "Otasining ismi",
      groups: "Guruh",
      price: "To'lov summmasi",
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
      required: "Ushbu maydon to'ldirilishi shart",
      cfirst_name: "Shartnoma tuzuvchining ismi",
      clast_name: "Shartnoma tuzuvchining familiyasi",
      csure_name: "Shartnoma tuzuvchining otasining ismi",
      error1: "Muvaffaqiyatli qo'shildi",
      error2: "Qo'shib bo'lmadi barcha maydonlarni to'g'riligini tekshiring",
      pasportdate: "Pasport berilgan sana",
      student: "Talaba",
      contract_maker: "Shartnoma tuzuvchi",
    },
  ],
  [
    Langs.RU,
    {
      invalid_passport: "Неверный номер паспорта! Это должно быть 2 буквы, за которыми следуют 7 цифр",
      invalid_pinfl: "PINFL должен состоять из 14 цифр",
      ivalid_value: "Неверное значение",
      phone_exists: "Этот номер телефона уже используется!",
      email_exists: "Этот email уже зарегистрирован!",
      birthday_format_error: "Неверный формат даты рождения! Правильный: ДД.ММ.ГГГГ",
      title: "Добавить нового студента",
      first_name: "Имя",
      last_name: "Фамилия",
      sure_name: "Отчество",
      groups: "Группа",
      price: "Сумма платежа",
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
      required: "Это поле обязательно для заполнения",
      cfirst_name: "Имя подрядчика",
      clast_name: "Фамилия подрядчика",
      csure_name: "Имя отца договаривающейся стороны",
      error1: "Успешно добавлено",
      error2: "Не удалось добавить. Пожалуйста, проверьте правильность всех полей",
      pasportdate: "Дата выдачи паспорта",
      student: "Студент",
      contract_maker: "Контрактник",
    },
  ],
  [
    Langs.EN,
    {
      invalid_passport: "Invalid passport number! It should be 2 letters followed by 7 digits",
      invalid_pinfl: "PINFL must be 14 digits long",
      ivalid_value: "Invalid value",
      phone_exists: "This phone number is already in use!",
      email_exists: "This email is already registered!",
      birthday_format_error: "Invalid date format! Use DD.MM.YYYY",
      title: "Add new student",
      first_name: "First Name",
      last_name: "Last Name",
      sure_name: "Middle Name",
      groups: "Groups",
      price: "Payment",
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
      required: "This field is required",
      cfirst_name: "Name of the contractor",
      clast_name: "Surname of the contractor",
      csure_name: "Father's name of the contracting party",
      error1: "Successfully added",
      error2: "Failed to add. Please check that all fields are correct",
      pasportdate: "Passport issue date",
      student: "Student",
      contract_maker: "Contract maker",
    },
  ],
])

function StudentsForm() {
  const { id } = useParams<{ id: string }>()
  const { lang, role } = useContext(GlobalContext)
  const contents = contentsMap.get(lang) as TNewsComponentContent
  const [form] = Form.useForm()

  const formatPhoneNumber = (phone: string): string => {
    return `+998${phone?.replace(/[^0-9]/g, "") || ""}`
  }

  async function onFinish(data: any) {
    try {
      if (data.phone_number) {
        data.phone_number = formatPhoneNumber(data.phone_number)
      }
      if (data.student?.phone_number) {
        data.student.phone_number = formatPhoneNumber(data.student.phone_number)
      }

      if (data.student?.birthday) {
        const parts = data.student.birthday.split(".")
        if (parts.length === 3 && parts.every((p: string) => p.length === 2 || p.length === 4)) {
          const [day, month, year] = parts
          data.student.birthday = `${year}-${month}-${day}`
        }
      }

      if (data.passport_date) {
        const parts = data.passport_date.split(".")
        if (parts.length === 3) {
          const [day, month, year] = parts
          data.passport_date = `${year}-${month}-${day}`
        }
      }

      const myAccountResponse = await client.get("accounts/me/")
      data.manager = myAccountResponse.data.roles[role]

      if (!data.student) data.student = {}
      data.student.password = "1234"
      data.student.groups = id

      await client.post("students/agreement/create/", data, {
        headers: { "Content-Type": "application/json" },
      })

      toast.success(contents.error1)
      form.resetFields()
    } catch (error: any) {
      console.error("[v0] Error submitting form:", error.response?.data)
      const err = error.response?.data || {}

      // 1. Birthday format error
      if (err.student?.birthday) {
        toast.error(contents.birthday_format_error)
        return
      }

      // 2. Phone number already exists (check both contractor and student)
      if (err.phone_number || err.student?.phone_number) {
        const phoneErrors = err.phone_number || err.student?.phone_number
        if (
          Array.isArray(phoneErrors) &&
          phoneErrors.some(
            (msg: string) => msg.includes("already exists") || msg.includes("unique") || msg.includes("mavjud"),
          )
        ) {
          toast.error(contents.phone_exists)
        } else {
          toast.error(contents.phone_exists)
        }
        return
      }

      // 3. Email already exists
      if (err.email || err.student?.email) {
        const emailErrors = err.email || err.student?.email
        if (
          Array.isArray(emailErrors) &&
          emailErrors.some(
            (msg: string) => msg.includes("already exists") || msg.includes("unique") || msg.includes("mavjud"),
          )
        ) {
          toast.error(contents.email_exists)
        } else {
          toast.error(contents.email_exists)
        }
        return
      }

      // 4. Passport serial error
      if (err.passport_seria || err.student?.passport_seria) {
        toast.error(contents.invalid_passport)
        return
      }

      // 5. PINFL error
      if (err.pinfl || err.student?.pinfl) {
        toast.error(contents.invalid_pinfl)
        return
      }

      // 6. General error
      toast.error(contents.error2)
    }
  }

  return (
    <div className="px-10 w-full mt-12 md:mt-0">
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-[50px] h-[50px] rounded-xl bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
          aria-label="Go back"
        >
          <i className="fa-solid fa-arrow-left dark:text-white"></i>
        </button>
        <h1 className="text-center text-3xl dark:text-white font-semibold font-sans mx-auto">{contents.title}</h1>
      </div>

      <Form
        className="w-full 2xl:h-[87%] h-[65%] overflow-y-auto"
        layout="vertical"
        size="large"
        form={form}
        onFinish={onFinish}
      >
        <h3 className="text-2xl font-medium mb-4 dark:text-white">{contents.contract_maker}</h3>
        <div className="md:grid grid-cols-4 gap-x-[30px] gap-y-[10px] mb-6 dark-form">
          <Form.Item
            label={contents.last_name}
            name="last_name"
            rules={[{ required: false, message: contents.required }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={contents.first_name}
            name="first_name"
            rules={[{ required: false, message: contents.required }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={contents.sure_name}
            name="surname"
            rules={[{ required: false, message: contents.required }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={contents.phone_number}
            name="phone_number"
            rules={[{ required: false, message: contents.required }]}
          >
            <PhoneInput />
          </Form.Item>
          <Form.Item
            label={contents.passport}
            name="passport_seria"
            rules={[
              { required: false, message: contents.required },
              { pattern: /^[A-Z]{2}\d{7}$/, message: contents.invalid_passport },
            ]}
          >
            <Input
              placeholder="AA1234567"
              maxLength={9}
              onChange={(e) => form.setFieldValue("passport_seria", e.target.value.toUpperCase())}
            />
          </Form.Item>
          <Form.Item
            label={contents.pinfl}
            name="pinfl"
            rules={[
              { required: false, message: contents.required },
              { len: 14, message: contents.invalid_pinfl },
              { pattern: /^[0-9]+$/, message: contents.ivalid_value },
            ]}
          >
            <Input maxLength={14} />
          </Form.Item>
          <Form.Item
            label={contents.pasportdate}
            name="passport_date"
            rules={[{ required: false, message: contents.required }]}
          >
            <DateInput />
          </Form.Item>
          <Form.Item
            label={contents.passport_address}
            name="passport_address"
            rules={[{ required: false, message: contents.required }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="col-span-2"
            label={contents.address}
            name="address"
            rules={[{ required: false, message: contents.required }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={contents.price} name="price" rules={[{ required: true, message: contents.required }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label={contents.discount}
            name="discount"
            rules={[{ required: false, message: contents.required }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </div>

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
            <PhoneInput />
          </Form.Item>
          <Form.Item
            label={contents.birthday}
            name={["student", "birthday"]}
            rules={[{ required: false, message: contents.required }]}
          >
            <DateInput />
          </Form.Item>
        </div>

        <Form.Item className="[&_button]:w-[200px]">
          <Button type="primary" htmlType="submit">
            {contents.submit}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default StudentsForm
