"use client"

/* eslint-disable @typescript-eslint/ban-ts-comment */
import type React from "react"
import { useContext } from "react"
import { Form, Input, InputNumber, DatePicker, Select, Button } from "antd"
import InputMask from "react-input-mask"
import { toast } from "react-toastify"
import client from "../../../components/services"
import type { Moment } from "moment"
import { GlobalContext } from "../../../App.tsx"
import { Langs } from "../../../enums.ts"

type TData = {
  first_name: string
  sure_name: string
  last_name: string
  gender: "M" | "F"
  birthday: Moment
  role: string
  salary: number
  phone_number: string
  email: string
  password: string
}

type TNewsComponentContent = {
  title: string
  label1: string
  label2: string
  label3: string
  label4: string
  label5: string
  label6: string
  label7: string
  option1: string
  option2: string
  option3: string
  option4: string
  option5: string
  option6: string
  option8: string
  option9: string
  option10: string
  label: string
  button: string
  sureName: string
  passport: string
  pinfl: string
  email: string
  gender: string
  erkak: string
  ayol: string
  password: string
  error1: string
  error2: string
  error3: string
  required: string
  ivalid_value: string
  invalid_password: string
  invalid_email: string
  duplicate_phone: string
  duplicate_email: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
  [
    Langs.UZ,
    {
      invalid_email: "Elektron pochta manzili haqiqiy emas",
      invalid_password: "",
      ivalid_value: "Qiymat notog'ri",
      title: "Yangi xodim qo'shish",
      label1: "Foydalanuvchi",
      label2: "Ismi",
      label3: "Otasining ismi",
      label4: "Telefon raqami",
      label5: "Tug'ilgan yili",
      label6: "Maoshi",
      label7: "Lavozimi",
      option1: "Lavozimni tanlang",
      option2: "O'qituvchi",
      option3: "Yordamchi o'qituvchi",
      option4: "Menejer",
      option5: "Hisobchi",
      option6: "Super Admin",
      option8: "Jinsini tanlang",
      option9: "Erkak",
      option10: "Ayol",
      label: "Foydalanuvchini tanlash",
      button: "Tasdiqlash",
      sureName: "Familiyasi",
      passport: "Passport",
      pinfl: "JSHSHR",
      email: "Email",
      gender: "Jinsi",
      erkak: "Erkak",
      ayol: "Ayol",
      password: "Parol",
      error1: "Xodim muvaffaqiyatli qo'shildi",
      error2: "Telefon raqami noto'g'ri formatda",
      error3: "Xodim qo'shishda xato ",
      required: "to'ldirish shart",
      duplicate_phone: "Bu telefon raqami allaqachon ro'yxatdan o'tgan",
      duplicate_email: "Bu email allaqachon ro'yxatdan o'tgan",
    },
  ],
  [
    Langs.RU,
    {
      invalid_email: "Электронная почта недействительна",
      invalid_password: "",
      ivalid_value: "Неверное значение",
      title: "Добавить нового сотрудника",
      label1: "Пользователь",
      label2: "Имя",
      label3: "Очества",
      label4: "Номер телефона",
      label5: "Год рождения",
      label6: "Зарплата",
      label7: "Должность",
      option1: "Выберите должность",
      option2: "Учитель",
      option3: "Помощник преподавателя",
      option4: "Менеджер",
      option5: "Бухгалтер",
      option6: "Суперадминистратор",
      option8: "Выберите пол",
      option9: "Мужчина",
      option10: "Женщина",
      label: "Выберите пользователя",
      button: "Подтверждать",
      sureName: "Фамилия",
      passport: "Пасспорт",
      pinfl: "ПИНФЛ",
      email: "Электронная почта",
      gender: "Пол",
      erkak: "Мужской",
      ayol: "Женский",
      password: "Пароль",
      error1: "Сотрудник успешно добавлен",
      error2: "Номер телефона указан в неправильном формате",
      error3: "Ошибка при добавлении сотрудника ",
      required: "должен быть заполнен",
      duplicate_phone: "Этот номер телефона уже зарегистрирован",
      duplicate_email: "Этот email уже зарегистрирован",
    },
  ],
  [
    Langs.EN,
    {
      invalid_email: "Email is not Valid",
      invalid_password: "",
      ivalid_value: "Invalid value",
      title: "Add a new employee",
      label1: "User",
      label2: "Name",
      label3: "Middle Name",
      label4: "Phone number",
      label5: "Year of birth",
      label6: "Salary",
      label7: "Job title",
      option1: "Select a position",
      option2: "Teacher",
      option3: "Teaching Assistant",
      option4: "Manager",
      option5: "Accountant",
      option6: "Super administrator",
      option8: "Select gender",
      option9: "Male",
      option10: "Female",
      label: "Select user",
      button: "Confirmation",
      sureName: "Lastname",
      passport: "Passport",
      pinfl: "PINFL",
      email: "Email",
      gender: "Gender",
      erkak: "Male",
      ayol: "Female",
      password: "Password",
      error1: "Employee successfully added",
      error2: "The phone number is in the wrong format",
      error3: "Error adding employee ",
      required: "required",
      duplicate_phone: "This phone number is already registered",
      duplicate_email: "This email is already registered",
    },
  ],
])

const AddEmployee: React.FC = () => {
  const { lang } = useContext(GlobalContext)
  const contents = contentsMap.get(lang) as TNewsComponentContent
  const [form] = Form.useForm<TData>()

  function validatePhoneNumber(_: unknown, value: string) {
    const unmaskedValue = value?.replace(/\D/g, "")
    if (unmaskedValue && unmaskedValue.length === 9) return Promise.resolve()
    return Promise.reject(new Error(contents.ivalid_value))
  }

  async function onFinish(data: TData) {
    data.phone_number = `+998${data.phone_number.replace(/[^0-9]/g, "")}`

    const birthday = data.birthday
    const birthdayString = `${birthday.year()}-${(birthday.month() + 1).toString().padStart(2, "0")}-${birthday.date().toString().padStart(2, "0")}`

    const postData = { ...data, birthday: birthdayString }

    try {
      await client.post("employees/create/", postData)
      toast.success(contents.error1)
      form.resetFields()
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = error.response as { data?: { [key: string]: string[] } }
        const errorData = errorResponse?.data

        if (errorData) {
          const errorMessage = JSON.stringify(errorData)

          if (errorMessage.includes("phone_number") && errorMessage.includes("already exists")) {
            toast.error(contents.duplicate_phone)
            return
          }

          if (errorMessage.includes("email") && errorMessage.includes("already exists")) {
            toast.error(contents.duplicate_email)
            return
          }
        }
      }

      toast.error(contents.error3)
      console.error(error)
    }
  }

  return (
    <div className="px-10 w-full mt-12 md:mt-0">
      <div className="flex items-center mb-12">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-[50px] h-[50px] rounded-xl bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
        >
          <i className="fa-solid fa-arrow-left dark:text-white"></i>
        </button>
        <h1 className="text-center text-3xl dark:text-white font-semibold font-sans mx-auto">{contents.title}</h1>
      </div>
      <Form
        className="w-full 2xl:h-[87%] h-[70%] overflow-y-auto"
        layout="vertical"
        size="large"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        preserve={false}
      >
        <div className="md:grid grid-cols-2 gap-x-[30px] gap-y-[10px] mb-8">
          <Form.Item label={contents.label2} name="first_name" rules={[{ required: true, message: contents.required }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item label={contents.label3} name="sure_name" rules={[{ required: true, message: contents.required }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label={contents.sureName}
            name="last_name"
            rules={[{ required: true, message: contents.required }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item label={contents.gender} name="gender" rules={[{ required: true, message: contents.required }]}>
            <Select>
              <Select.Option value="M">{contents.option9}</Select.Option>
              <Select.Option value="F">{contents.option10}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={contents.label5} name="birthday" rules={[{ required: true, message: contents.required }]}>
            <DatePicker placeholder="DD.MM.YYYY" format="DD.MM.YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label={contents.label7} name="role" rules={[{ required: true, message: contents.required }]}>
            <Select>
              <Select.Option value="1">{contents.option2}</Select.Option>
              {/* <Select.Option value="2">{contents.option3}</Select.Option> */}
              <Select.Option value="3">{contents.option4}</Select.Option>
              <Select.Option value="4">{contents.option5}</Select.Option>
              <Select.Option value="5">{contents.option6}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={contents.label6} name="salary" rules={[{ required: true, message: contents.required }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label={contents.label4}
            name="phone_number"
            rules={[{ required: true, message: contents.required }, { validator: validatePhoneNumber }]}
          >
            <InputMask mask="(99) 999-99-99">
              {/* @ts-expect-error */}
              {(inputProps) => <Input {...inputProps} addonBefore="+998" autoComplete="off" />}
            </InputMask>
          </Form.Item>
          <Form.Item
            label={contents.email}
            name="email"
            rules={[
              { required: true, message: contents.required },
              { type: "email", message: contents.invalid_email },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item label={contents.password} name="password" rules={[{ required: true, message: contents.required }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </div>

        <Form.Item className="[&_button]:w-[200px]">
          <Button type="primary" htmlType="submit">
            {contents.button}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddEmployee
