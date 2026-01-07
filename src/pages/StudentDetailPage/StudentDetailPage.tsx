import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Tabs } from "antd";
import { toast } from "react-toastify";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import client from "../../components/services";
import Loading from "../../components/LoadingComponent/Loading.tsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";
import PersonalInfoSection from "./PersonalInfoSection";
import FamilyInfoSection from "./FamilyInfoSection";
import dayjs from "dayjs";
import AttachContractHeader from "./StudentProfileHeader.tsx";
import AttachParentToStudent from "./AttachParentToStudent.tsx";

const contentsMap = new Map<Langs, any>([
  [
    Langs.UZ,
    {
      title: "Talaba ma'lumotlarini tahrirlash",
      subtitle: "Kerakli maydonlarni o'zgartiring va saqlang",
      save: "Saqlash",
      cancel: "Bekor qilish",
      new_contract: "Yangi shartnoma",
      delete: "O'chirish",
      required: "Bu maydon to'ldirilishi shart",
      save_success: "Ma'lumotlar muvaffaqiyatli saqlandi!",
      save_error: "Saqlashda xatolik yuz berdi",
      delete_success: "Talaba muvaffaqiyatli o'chirildi",
      delete_error: "O'chirishda xatolik yuz berdi",
      no_changes: "Hech qanday ma'lumot o'zgartirilmadi",
      load_error: "Ma'lumotlar yuklanmadi",
      first_name: "Ism",
      last_name: "Familiya",
      sure_name: "Otasining ismi",
      phone_number: "Telefon raqami",
      passport: "Pasport seriyasi",
      pinfl: "JSHSHIR",
      address: "Yashash manzili",
      email: "Email",
      birthday: "Tug'ilgan sana",
      personal_info: "Shaxsiy ma'lumotlar",
      family_info: "Oilaviy ma'lumotlar",
      father_info: "Ota ma'lumotlari",
      mother_info: "Ona ma'lumotlari",
    },
  ],
  [
    Langs.RU,
    {
      title: "Редактирование данных студента",
      subtitle: "Измените необходимые поля и сохраните",
      save: "Сохранить",
      cancel: "Отмена",
      new_contract: "Новый договор",
      delete: "Удалить",
      required: "Это поле обязательно",
      save_success: "Данные успешно сохранены!",
      save_error: "Ошибка при сохранении",
      delete_success: "Студент успешно удален",
      delete_error: "Ошибка при удалении",
      no_changes: "Никакие данные не были изменены",
      load_error: "Не удалось загрузить данные",
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
      title: "Edit Student Profile",
      subtitle: "Update the required fields and save",
      save: "Save",
      cancel: "Cancel",
      new_contract: "New Agreement",
      delete: "Delete",
      required: "This field is required",
      save_success: "Data saved successfully!",
      save_error: "Error saving data",
      delete_success: "Student deleted successfully",
      delete_error: "Error deleting student",
      no_changes: "No changes were made",
      load_error: "Failed to load data",
      first_name: "First Name",
      last_name: "Last Name",
      sure_name: "Middle Name",
      phone_number: "Phone Number",
      passport: "Passport Series",
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
  const t = contentsMap.get(lang) || contentsMap.get(Langs.UZ)!;
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [personalForm] = Form.useForm();
  const [familyForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const studentId = Number(id);
  const [student, setStudent] = useState<any>(null);

  if (isNaN(studentId)) {
    return <div className="text-red-500">Talaba ID noto'g'ri!</div>;
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await client.get(`students/retrive/${id}/`);
        setStudent(res.data);
        const doc = res.data.document?.[0] || {};

        const userPinfl = res.data.user.pinfl;
        const docPinfl = doc.pinfl;
        const finalPinfl = userPinfl
          ? String(userPinfl)
          : docPinfl
          ? String(docPinfl).padStart(14, "0").slice(0, 14)
          : "";

        const personalValues = {
          first_name: res.data.user.first_name || "",
          last_name: res.data.user.last_name || "",
          sure_name: res.data.user.sure_name || "",
          phone_number: res.data.user.phone_number?.replace("+998", "") || "",
          passport: doc.passport_seria || res.data.user.passport || "",
          pinfl: finalPinfl,
          address: doc.address || "",
          email: res.data.user.email || "",
          birthday: res.data.user.birthday
            ? dayjs(res.data.user.birthday)
            : null,
        };

        const familyValues = {
          father: {
            first_name: res.data.father?.first_name || "",
            last_name: res.data.father?.last_name || "",
            sure_name: res.data.father?.sure_name || "",
            passport: res.data.father?.passport || "",
            pinfl: res.data.father?.pinfl ? String(res.data.father.pinfl) : "",
            phone_number:
              res.data.father?.phone_number?.replace("+998", "") || "",
            email: res.data.father?.email || "",
            birthday: res.data.father?.birthday
              ? dayjs(res.data.father.birthday)
              : null,
          },
          mother: {
            first_name: res.data.mother?.first_name || "",
            last_name: res.data.mother?.last_name || "",
            sure_name: res.data.mother?.sure_name || "",
            passport: res.data.mother?.passport || "",
            pinfl: res.data.mother?.pinfl ? String(res.data.mother.pinfl) : "",
            phone_number:
              res.data.mother?.phone_number?.replace("+998", "") || "",
            email: res.data.mother?.email || "",
            birthday: res.data.mother?.birthday
              ? dayjs(res.data.mother.birthday)
              : null,
          },
        };

        personalForm.setFieldsValue(personalValues);
        familyForm.setFieldsValue(familyValues);
      } catch (error) {
        console.error(error);
        toast.error(t.load_error);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, t.load_error]);

  const onPersonalFinish = async (values: any) => {
    try {
      const cleanedStudent = {
        first_name: values.first_name?.trim() || null,
        last_name: values.last_name?.trim() || null,
        sure_name: values.sure_name?.trim() || null,
        phone_number: values.phone_number
          ? "+998" + values.phone_number.replace(/\D/g, "")
          : null,
        passport: values.passport?.toUpperCase().trim() || null,
        pinfl: values.pinfl?.trim() || null,
        email: values.email?.trim() || null,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
      };

      await client.patch(`students/update/${id}/`, cleanedStudent);
      toast.success(t.save_success);
    } catch (err: any) {
      const msg =
        err.response?.data
          ? Object.values(err.response.data).flat().join(", ")
          : t.save_error;
      toast.error(msg);
    }
  };

  const onFamilyFinish = async (values: any) => {
    try {
      const cleanParentData = (parent: any) => {
        if (!parent) return null;
        const cleaned: any = {};
        if (parent.first_name?.trim()) cleaned.first_name = parent.first_name.trim();
        if (parent.last_name?.trim()) cleaned.last_name = parent.last_name.trim();
        if (parent.sure_name?.trim()) cleaned.sure_name = parent.sure_name.trim();
        if (parent.passport?.trim()) cleaned.passport = parent.passport.trim();
        if (parent.pinfl?.trim()) cleaned.pinfl = parent.pinfl.trim();
        if (parent.phone_number?.trim())
          cleaned.phone_number = "+998" + parent.phone_number.replace(/\D/g, "");
        if (parent.email?.trim()) cleaned.email = parent.email.trim();
        if (parent.birthday) cleaned.birthday = parent.birthday.format("YYYY-MM-DD");
        return Object.keys(cleaned).length > 0 ? cleaned : null;
      };

      const parents: any = {};
      const fatherData = cleanParentData(values.father);
      if (fatherData) parents.father = fatherData;
      const motherData = cleanParentData(values.mother);
      if (motherData) parents.mother = motherData;

      if (Object.keys(parents).length > 0) {
        await client.patch(`students/fill/${id}/`, parents);
        toast.success(t.save_success);
      } else {
        toast.info(t.no_changes);
      }
    } catch (err: any) {
      const msg =
        err.response?.data
          ? Object.values(err.response.data).flat().join(", ")
          : t.save_error;
      toast.error(msg);
    }
  };

  const handleSave = () => {
    if (activeTab === "personal") {
      personalForm.submit();
    } else {
      familyForm.submit();
    }
  };

  if (loading) return <Loading />;

  const fullName = [
    personalForm.getFieldValue("last_name"),
    personalForm.getFieldValue("first_name"),
    personalForm.getFieldValue("sure_name"),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

 const tabItems = [
  {
    key: "personal",
    label: (
      <span className="text-base font-medium flex items-center gap-2">
        <i className="fa-solid fa-user" />
        {t.personal_info}
      </span>
    ),
    children: (
      <Form form={personalForm} onFinish={onPersonalFinish} layout="vertical">
        <PersonalInfoSection contents={t} />
      </Form>
    ),
  },

  ...(role === "admin"
    ? [
        {
          key: "family",
          label: (
            <span className="text-base font-medium flex items-center gap-2">
              <i className="fa-solid fa-users" />
              {t.family_info}
            </span>
          ),
          children: (
            <Form form={familyForm} onFinish={onFamilyFinish} layout="vertical">
              <FamilyInfoSection contents={t} />
            </Form>
          ),
        },
      ]
    : []),
];


  return (
    <div className="w-full  overflow-y-auto">
      <div className="">
        <AttachContractHeader
          fullName={fullName}
          subtitle={t.subtitle}
          role={role}
          id={id!}
          t={t}
          onSave={handleSave}
          onCancel={() => navigate(-1)}
          onDelete={() => setIsDeleteOpen(true)}
        />
        {role === "admin" && (
          <div className="flex justify-start">
            <Button
              className="ml-9"
              type="primary"
              onClick={() => setAttachModalOpen(true)}
            >
              Ota-ona qo'shish
            </Button>
          </div>
        )}
        <AttachParentToStudent
          studentId={studentId}
          student={student}
          open={attachModalOpen}
          onClose={() => setAttachModalOpen(false)}
          onSuccess={() => {
            setAttachModalOpen(false);
            toast.success(t.attach_success);
          }}
        />

        <div className="mt-6 px-4 md:px-6">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
            tabBarGutter={30}
            className="custom-tabs"
            tabBarStyle={{
              borderBottom: "1px solid #e5e7eb dark:border-gray-700",
              marginBottom: "24px",
            }}
          />
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          try {
            await client.delete(`students/delete/${id}/`);
            toast.success(t.delete_success);
            navigate(-1);
          } catch {
            toast.error(t.delete_error);
          }
        }}
      />
    </div>
  );
}

export default StudentDetailPage;