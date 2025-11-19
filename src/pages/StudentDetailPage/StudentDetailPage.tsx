import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, message, Button } from "antd";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import client from "../../components/services";
import Loading from "../../components/LoadingComponent/Loading.tsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";
import PersonalInfoSection from "./PersonalInfoSection";
import FamilyInfoSection from "./FamilyInfoSection";
import dayjs from "dayjs";
import AttachContractHeader from "./StudentProfileHeader.tsx";

const contentsMap = new Map<Langs, any>([
  [
    Langs.UZ,
    {
      title: "Talaba ma'lumotlarini tahrirlash",
      subtitle: "Kerakli maydonlarni o‘zgartiring va saqlang",
      save: "Saqlash",
      cancel: "Bekor qilish",
      new_contract: "Yangi shartnoma",
      delete: "O‘chirish",
      required: "Bu maydon to‘ldirilishi shart",
      save_success: "Ma'lumotlar muvaffaqiyatli saqlandi!",
      save_error: "Saqlashda xatolik",
      first_name: "Ism",
      last_name: "Familiya",
      sure_name: "Otasining ismi",
      phone_number: "Telefon raqami",
      passport: "Pasport seriyasi",
      pinfl: "JSHSHIR",
      address: "Yashash manzili",
      email: "Email",
      birthday: "Tug‘ilgan sana",
      personal_info: "Shaxsiy ma'lumotlar",
      family_info: "Oilaviy ma'lumotlar",
      father_info: "Ota ma'lumotlari",
      mother_info: "Ona ma'lumotlari",
    },
  ],
  [
    Langs.RU,
    {
      title: "Редактирование студента",
      subtitle: "Измените нужные поля и сохраните",
      save: "Сохранить",
      cancel: "Отмена",
      new_contract: "Новый договор",
      delete: "Удалить",
      required: "Это поле обязательно",
      save_success: "Данные успешно сохранены!",
      save_error: "Ошибка сохранения",
      first_name: "Имя",
      last_name: "Фамилия",
      sure_name: "Отчество",
      phone_number: "Телефон",
      passport: "Паспорт",
      pinfl: "ПИНФЛ",
      address: "Адрес",
      email: "Email",
      birthday: "Дата рождения",
      personal_info: "Личные данные",
      family_info: "Семейные данные",
      father_info: "Данные отца",
      mother_info: "Данные матери",
    },
  ],
  [
    Langs.EN,
    {
      title: "Edit Student",
      subtitle: "Update fields and save changes",
      save: "Save",
      cancel: "Cancel",
      new_contract: "New Agreement",
      delete: "Delete",
      required: "This field is required",
      save_success: "Data saved successfully!",
      save_error: "Error saving data",
      first_name: "First Name",
      last_name: "Last Name",
      sure_name: "Middle Name",
      phone_number: "Phone Number",
      passport: "Passport",
      pinfl: "PINFL",
      address: "Address",
      email: "Email",
      birthday: "Birth Date",
      personal_info: "Personal Information",
      family_info: "Family Information",
      father_info: "Father's Information",
      mother_info: "Mother's Information",
    },
  ],
]);

function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, role } = useContext(GlobalContext);
  const t = contentsMap.get(lang) || contentsMap.get(Langs.UZ);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await client.get(`students/retrive/${id}/`);
        const doc = res.data.document?.[0] || {};

        const initialValues = {
          first_name: res.data.user.first_name || "",
          last_name: res.data.user.last_name || "",
          sure_name: res.data.user.sure_name || "",
          phone_number: res.data.user.phone_number?.replace("+998", "") || "",
          passport: doc.passport_seria || res.data.user.passport || "",
          pinfl: doc.pinfl || res.data.user.pinfl || "",
          address: doc.address || "",
          email: res.data.user.email || "",
          birthday: res.data.user.birthday
            ? dayjs(res.data.user.birthday)
            : null,

          father: {
            first_name: res.data.father?.first_name || "",
            last_name: res.data.father?.sure_name || "",
            sure_name: res.data.father?.last_name || "",
            passport: res.data.father?.passport || "",
            pinfl: res.data.father?.pinfl || "",
            phone_number:
              res.data.father?.phone_number?.replace("+998", "") || "",
            email: res.data.father?.email || "",
            birthday: res.data.father?.birthday
              ? dayjs(res.data.father.birthday)
              : null,
          },
          mother: {
            first_name: res.data.mother?.first_name || "",
            last_name: res.data.mother?.sure_name || "",
            sure_name: res.data.mother?.last_name || "",
            passport: res.data.mother?.passport || "",
            pinfl: res.data.mother?.pinfl || "",
            phone_number:
              res.data.mother?.phone_number?.replace("+998", "") || "",
            email: res.data.mother?.email || "",
            birthday: res.data.mother?.birthday
              ? dayjs(res.data.mother.birthday)
              : null,
          },
        };

        form.setFieldsValue(initialValues);
      } catch {
        message.error("Ma'lumotlar yuklanmadi");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, form, navigate]);

  const onFinish = async (values: any) => {
    try {
      const cleanedStudent = {
        first_name: values.first_name?.trim(),
        last_name: values.last_name?.trim(),
        sure_name: values.sure_name?.trim(),
        phone_number: values.phone_number
          ? "+998" + values.phone_number.replace(/\D/g, "")
          : "",
        passport: values.passport?.toUpperCase(),
        pinfl: values.pinfl,
        email: values.email,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
      };

      const parents = {
        father: values.father
          ? {
              first_name: values.father.first_name?.trim() || "",
              last_name: values.father.sure_name?.trim() || "",
              sure_name: values.father.last_name?.trim() || "",
              passport: values.father.passport || "",
              pinfl: values.father.pinfl || "",
              phone_number: values.father.phone_number
                ? "+998" + values.father.phone_number.replace(/\D/g, "")
                : "",
              email: values.father.email || "",
              birthday: values.father.birthday
                ? values.father.birthday.format("YYYY-MM-DD")
                : null,
            }
          : {},
        mother: values.mother
          ? {
              first_name: values.mother.first_name?.trim() || "",
              last_name: values.mother.sure_name?.trim() || "",
              sure_name: values.mother.last_name?.trim() || "",
              passport: values.mother.passport || "",
              pinfl: values.mother.pinfl || "",
              phone_number: values.mother.phone_number
                ? "+998" + values.mother.phone_number.replace(/\D/g, "")
                : "",
              email: values.mother.email || "",
              birthday: values.mother.birthday
                ? values.mother.birthday.format("YYYY-MM-DD")
                : null,
            }
          : {},
      };

      await client.patch(`students/update/${id}/`, cleanedStudent);
      await client.patch(`students/fill/${id}/`, parents);

      message.success(t.save_success);
      window.location.reload();
    } catch (err: any) {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(", ")
        : t.save_error;
      message.error(msg);
    }
  };

  if (loading) return <Loading />;

  const fullName = `${form.getFieldValue("last_name") || ""} ${
    form.getFieldValue("first_name") || ""
  } ${form.getFieldValue("sure_name") || ""}`.trim();

  return (
    <div className="w-full overflow-y-auto ">
      <div className="">
        <AttachContractHeader
          fullName={fullName}
          subtitle={t.subtitle}
          role={role}
          id={id!}
          t={t}
          onSave={() => form.submit()}
          onCancel={() => window.location.reload()}
          onDelete={() => setIsDeleteOpen(true)}
        />

        <Form form={form} onFinish={onFinish} layout="vertical">
          <PersonalInfoSection contents={t} />
          <FamilyInfoSection contents={t} />
        </Form>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          try {
            await client.delete(`students/delete/${id}/`);
            message.success("Talaba o‘chirildi");
            navigate(-1);
          } catch {
            message.error("O‘chirishda xatolik");
          }
        }}
      />
    </div>
  );
}

export default StudentDetailPage;
