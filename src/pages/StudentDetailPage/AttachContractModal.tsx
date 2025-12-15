// src/pages/student/AttachContractPage.tsx

import React, { useContext, useEffect } from "react";
import { Form, Input, InputNumber, DatePicker, Button, message } from "antd";
import InputMask from "react-input-mask";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../components/services";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import dayjs from "dayjs";

const PhoneInput = (props: any) => (
  <InputMask mask="(99) 999-99-99" maskChar={null} {...props}>
    {(inputProps: any) => (
      <Input
        {...inputProps}
        addonBefore="+998"
        className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
    )}
  </InputMask>
);

const contentsMap = new Map<Langs, any>([
  [
    Langs.UZ,
    {
      back: "Orqaga",
      title: "Yangi shartnoma tuzish",
      subtitle: "Talaba bilan yangi shartnoma tuzish",
      first_name: "Ism",
      last_name: "Familiya",
      surname: "Otasining ismi",
      phone: "Telefon raqami",
      passport_seria: "Pasport seriyasi",
      pinfl: "JSHSHIR (PINFL)",
      passport_date: "Pasport berilgan sana",
      passport_address: "Pasport kim tomonidan berilgan",
      address: "Yashash manzili",
      price: "Yangi to‘lov summasi",
      discount: "Chegirma (so‘mda)",
      submit: "Shartnomani tuzish",
      success: "Yangi shartnoma muvaffaqiyatli tuzildi!",
      error: "Xatolik: maydonlarni tekshiring",
    },
  ],
  [
    Langs.RU,
    {
      back: "Назад",
      title: "Заключение нового договора",
      subtitle: "Заключить новый договор со студентом",
      first_name: "Имя",
      last_name: "Фамилия",
      surname: "Отчество",
      phone: "Номер телефона",
      passport_seria: "Серия паспорта",
      pinfl: "ПИНФЛ",
      passport_date: "Дата выдачи паспорта",
      passport_address: "Кем выдан паспорт",
      address: "Адрес проживания",
      price: "Новая сумма оплаты",
      discount: "Скидка (в сумме)",
      submit: "Создать договор",
      success: "Новый договор успешно создан!",
      error: "Ошибка: проверьте поля",
    },
  ],
  [
    Langs.EN,
    {
      back: "Back",
      title: "Create a New Agreement",
      subtitle: "Create a new agreement for the student",
      first_name: "First Name",
      last_name: "Last Name",
      surname: "Middle Name",
      phone: "Phone Number",
      passport_seria: "Passport Series",
      pinfl: "PINFL",
      passport_date: "Passport Issue Date",
      passport_address: "Passport Issued By",
      address: "Home Address",
      price: "New Payment Amount",
      discount: "Discount (in SUM)",
      submit: "Create Agreement",
      success: "The new agreement has been successfully created!",
      error: "Error: please check the fields",
    },
  ],
]);

function AttachContractPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useContext(GlobalContext);
  const t = contentsMap.get(lang) || contentsMap.get(Langs.UZ);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const res = await client.get(`students/retrive/${id}/`);
        const student = res.data.user;
        const document = res.data.document?.[0] || {};

        form.setFieldsValue({
          first_name: student.first_name || "",
          last_name: student.last_name || "",
          surname: student.sure_name || "",
          phone_number: student.phone_number?.replace("+998", "") || "",
          passport_seria: document.passport_seria || student.passport || "",
          pinfl: document.pinfl || student.pinfl || "",
          address: document.address || "",
          passport_address: document.passport_address || "",
          passport_date: document.passport_date
            ? dayjs(document.passport_date)
            : null,
          price: "",
          discount: "",
        });
      } catch (err: any) {
        message.error({
          content: "Talaba ma'lumotlari yuklanmadi",
          duration: 3,
          style: { position: "fixed", top: 10, right: 10, zIndex: 9999 },
        });
        navigate(-1);
      }
    };

    loadStudentData();
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const managerRes = await client.get("accounts/me/");

      const payload = {
        manager: managerRes.data.id,
        student: Number(id),
        price: values.price.toString(),
        discount: values.discount || "0",
        first_name: values.first_name,
        last_name: values.last_name,
        surname: values.surname,
        passport_seria: values.passport_seria?.toUpperCase(),
        passport_address: values.passport_address || "",
        address: values.address || "",
        passport_date: values.passport_date
          ? values.passport_date.format("YYYY-MM-DD")
          : null,
        phone_number:
          "+998" + values.phone_number?.replace(/\D/g, "") || "",
        pinfl: values.pinfl,
      };

      await client.post("students/attach/", payload);

      message.success({
        content: t.success,
        duration: 3,
        style: { position: "fixed", top: 10, right: 10, zIndex: 9999 },
      });
      navigate(-1);
    } catch (err: any) {
      message.error({
        content: t.error,
        duration: 3,
        style: { position: "fixed", top: 10, right: 10, zIndex: 9999 },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-10 mt-12 md:mt-0">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-3 rounded-xl bg-white dark:bg-gray-800 shadow"
        >
          <i className="fa-solid fa-arrow-left text-xl dark:text-white"></i>
        </button>
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{t.title}</h1>
        </div>
      </div>

      <div className="max-h-[78vh] overflow-y-auto pb-10">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 dark-form">
            <Form.Item
              label={t.first_name}
              name="first_name"
              rules={[{ required: true }]}
            >
              <Input className="dark:bg-gray-800 dark:text-white dark:border-gray-600" size="large" />
            </Form.Item>

            <Form.Item
              label={t.last_name}
              name="last_name"
              rules={[{ required: true }]}
            >
              <Input className="dark:bg-gray-800 dark:text-white dark:border-gray-600" size="large" />
            </Form.Item>

            <Form.Item
              label={t.surname}
              name="surname"
              rules={[{ required: true }]}
            >
              <Input className="dark:bg-gray-800 dark:text-white dark:border-gray-600" size="large" />
            </Form.Item>

            <Form.Item label={t.phone} name="phone_number">
              <PhoneInput  />
            </Form.Item>

            <Form.Item
              label={t.passport_seria}
              name="passport_seria"
              rules={[
                { required: false },
                { pattern: /^[A-Z]{2}\d{7}$/, message: "AA1234567 bo‘lishi kerak" },
              ]}
            >
              <Input className="dark:bg-gray-800 dark:text-white dark:border-gray-600" size="large" maxLength={9} style={{ textTransform: "uppercase" }} />
            </Form.Item>

            <Form.Item
              label={t.pinfl}
              name="pinfl"
              rules={[{ required: false }, { len: 14, message: "14 ta raqam kiritilishi kerak" }]}
            >
              <Input className="dark:bg-gray-800 dark:text-white dark:border-gray-600" size="large" maxLength={14} />
            </Form.Item>

            <Form.Item label={t.passport_date} name="passport_date">
              <DatePicker
                className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
                size="large"
                format="DD.MM.YYYY"
              />
            </Form.Item>

            <Form.Item label={t.passport_address} name="passport_address">
              <Input className="dark:bg-gray-800 dark:text-white dark:border-gray-600" size="large" />
            </Form.Item>

            <Form.Item
              label={t.address}
              name="address"
              className="sm:col-span-2 lg:col-span-4"
            >
              <Input.TextArea
                className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
                rows={2}
              />
            </Form.Item>

            <Form.Item
              label={t.price}
              name="price"
              rules={[{ required: true }]}
            >
              <InputNumber<number>
                size="large"
                min={0}
                style={{ width: "100%" }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                parser={(v) => Number(v?.replace(/\s/g, "") || 0)}
                
              />
            </Form.Item>

            <Form.Item label={t.discount}  name="discount">
              <InputNumber<number>
                size="large"
                min={0}
                style={{ width: "100%" }}
                placeholder="0"
                
              />
            </Form.Item>
          </div>

          <div className="flex justify-end mt-8">
            <Button type="primary" size="large" htmlType="submit" loading={loading}>
              {t.submit}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AttachContractPage;
