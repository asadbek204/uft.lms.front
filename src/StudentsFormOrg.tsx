// import React, {useState, ChangeEvent, FormEvent, useContext} from 'react';
// import {GlobalContext} from "./App";
// import {Langs} from "./enums";
// import client from "./components/services";
// import {toast} from "react-toastify";
// import {useNavigate, useParams} from "react-router-dom";


// interface StudentData {
//     groups: number;
//     phone_number: string;
//     first_name: string;
//     last_name: string;
//     sure_name: string;
//     password: string;
//     birthday: string;
//     passport?: string;
//     pinfl?: string;
// }


// interface FormData {
//     student: StudentData;
//     discount: string;
//     first_name: string;
//     last_name: string;
//     surname: string;
//     passport_seria: string;
//     address: string;
//     passport_address: string;
//     passport_date: string;
//     phone_number: string;
//     pinfl: string;
//     manager: number;

// }

// type TNewsComponentContent = {
//     title: string;
//     first_name: string;
//     last_name: string;
//     sure_name: string;
//     groups: string;
//     refereed_by: string;
//     phone_number: string;
//     gender: string;
//     birthday: string;
//     passport: string;
//     pinfl: string;
//     email: string;
//     password: string;
//     status: string;
//     submit: string;
//     choose1: string;
//     choose2: string;
//     choose3: string;
//     choose4: string;
//     man: string;
//     woman: string;
//     amount: string;
//     discount: string;
//     total: string;
//     course: string;
//     address: string;
//     passport_address: string;
//     education_language: string;
//     uzbek: string;
//     russian: string;
//     younger_than_18: string;
//     cfirst_name: string,
//     clast_name: string,
//     csure_name: string,
//     error1: string,
//     error2: string,
//     pasportdate: string,
//     student: string,
//     contract_maker: string
// };

// const contentsMap = new Map<Langs, TNewsComponentContent>([
//     [Langs.UZ, {
//         title: "Yangi o'quvchi qo'shish",
//         first_name: "Ism",
//         last_name: "Familiya",
//         sure_name: "Otasining ismi",
//         groups: "Guruh",
//         refereed_by: "Yuborgan shaxs",
//         phone_number: "Telefon raqami",
//         gender: "Jinsi",
//         birthday: "Tug'ilgan sana",
//         passport: "Pasport",
//         pinfl: "JSHSHIR",
//         email: "Email",
//         password: "Parol",
//         status: "Holati",
//         submit: "Yuborish",
//         choose1: "Guruhni tanlang",
//         choose2: "Jinsini tanlang",
//         choose3: "Ta'lim tilini tanlang",
//         choose4: "Kursni tanlang",
//         man: "Erkak",
//         woman: "Ayol",
//         amount: "Summa",
//         discount: "Chegirma",
//         total: "Umumiy hisob",
//         course: "Kurs nomi",
//         address: "Manzil",
//         passport_address: "Pasport kim tomonidan berilgan",
//         education_language: "Ta'lim tili",
//         uzbek: "O'zbek tili",
//         russian: "Rus tili",
//         younger_than_18: "Shartnoma tuzuvchi",
//         cfirst_name: 'Shartnoma tuzuvchining ismi',
//         clast_name: 'Shartnoma tuzuvchining familiyasi',
//         csure_name: 'Shartnoma tuzuvchining otasining ismi',
//         error1: "muvaffaqiyatli qo'shildi",
//         error2: "qo'shib bo'lmadi",
//         pasportdate: "Pasport berilgan sana",
//         student: "Talaba",
//         contract_maker: "Shartnoma tuzuvchi"
//     }],
//     [Langs.RU, {
//         title: "Добавить нового студента",
//         first_name: "Имя",
//         last_name: "Фамилия",
//         sure_name: "Отчество",
//         groups: "Группа",
//         refereed_by: "Рекомендатель",
//         phone_number: "Телефон",
//         gender: "Пол",
//         birthday: "Дата рождения",
//         passport: "Паспорт",
//         pinfl: "ПИНФЛ",
//         email: "Эл. адрес",
//         password: "Пароль",
//         status: "Статус",
//         submit: "Отправить",
//         choose1: "Выберите группу",
//         choose2: "Выберите пол",
//         choose3: "Выберите язык обучения",
//         choose4: "Выбрать курс",
//         man: "Мужчина",
//         woman: "Женщина",
//         amount: "Сумма",
//         discount: "Скидка",
//         total: "Итог",
//         course: "Название курса",
//         address: "Адрес",
//         passport_address: "Кем выдан паспорт",
//         education_language: "Язык обучения",
//         uzbek: "Узбекский",
//         russian: "Русский",
//         younger_than_18: "Контрактник",
//         cfirst_name: 'Имя подрядчика',
//         clast_name: 'Фамилия подрядчика',
//         csure_name: 'Имя отца договаривающейся стороны',
//         error1: "успешно добавлено",
//         error2: "не удалось добавить",
//         pasportdate: "Дата выдачи паспорта",
//         student: "Студент",
//         contract_maker: "Контрактник"
//     }],
//     [Langs.EN, {
//         title: "Add new student",
//         first_name: "First Name",
//         last_name: "Last Name",
//         sure_name: "Middle Name",
//         groups: "Groups",
//         refereed_by: "Referred by",
//         phone_number: "Phone Number",
//         gender: "Gender",
//         birthday: "Birthday",
//         passport: "Passport",
//         pinfl: "PINFL",
//         email: "Email",
//         password: "Password",
//         status: "Status",
//         submit: "Submit",
//         choose1: "Select group",
//         choose2: "Select gender",
//         choose3: "Select the language of instruction",
//         choose4: "Choose a course",
//         man: "Male",
//         woman: "Female",
//         amount: "Amount",
//         discount: "Discount",
//         total: "Total",
//         course: "Course name",
//         address: "Address",
//         passport_address: "Passport issued by",
//         education_language: "Education language",
//         uzbek: "Uzbek",
//         russian: "Russian",
//         younger_than_18: "Contract maker",
//         cfirst_name: 'Name of the contractor',
//         clast_name: 'Surname of the contractor',
//         csure_name: "Father's name of the contracting party",
//         error1: "successfully added",
//         error2: "failed to add",
//         pasportdate: "Passport issue date",
//         student: "Student",
//         contract_maker: "Contract maker"
//     }],
// ]);


// const StudentsFormOrg: React.FC = () => {
//     const {id} = useParams();
//     const {lang} = useContext(GlobalContext);
//     const contents = contentsMap.get(lang) as TNewsComponentContent;
//     const [formData, setFormData] = useState<FormData>({
//         student: {
//             groups: Number(id),
//             phone_number: '',
//             first_name: '',
//             last_name: '',
//             sure_name: '',
//             password: '1234',
//             birthday: `2000-01-30`,
//         },
//         discount: '0',
//         first_name: '',
//         last_name: '',
//         surname: '',
//         passport_seria: '',
//         address: '',
//         passport_address: '',
//         passport_date: '2000-01-30',
//         phone_number: '',
//         pinfl: '',
//         manager: 1,


//     });


//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const {name, value, type} = e.target;

//         if (name.startsWith('student.')) {
//             // Handle nested fields within student object
//             const studentKey = name.split('.')[1];
//             setFormData(prev => ({
//                 ...prev,
//                 student: {
//                     ...prev.student,
//                     [studentKey]: type === 'checkbox' ? e.target?.checked : value
//                 }
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: type === 'checkbox' ? e.target?.checked : value
//             }));
//         }
//     };
//     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         try {
//             const requestData = formData
//             if (requestData.first_name === requestData.student.first_name) {
//                 requestData.student.passport = requestData.passport_seria
//                 requestData.student.pinfl = requestData.pinfl
//             }
//             requestData.student.phone_number = `+998${requestData.student.phone_number}`
//             requestData.phone_number = `+998${requestData.phone_number}`
//             requestData.student.password = formData.student.first_name.trim()
//             await client.post('students/agreement/create/', requestData, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//             toast.success(contents.title + contents.error1);
//             window.location.reload()

//         } catch (error) {
//             toast.error(contents.title + contents.error2);
//         }
//     };

//     const navigate = useNavigate()

//     const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
//         const {name, value} = e.target;
//         const keys = name.split('.');

//         setFormData((prevState) => {
//             const updatedState = {...prevState};

//             keys.reduce((acc: any, key: string, index: number) => {
//                 if (index === keys.length - 1) {
//                     acc[key] = value.toUpperCase(); // Convert the value to uppercase
//                 } else {
//                     acc[key] = {...acc[key]}; // Clone the nested object
//                 }
//                 return acc[key];
//             }, updatedState);

//             return updatedState;
//         });
//     };

//     return (
//         <div className="container mx-auto p-10 overflow-y-auto flex flex-col gap-8 rounded-lg">
//             <div className='flex items-center flex-row-reverse justify-between mb-4'>
//                 <button onClick={() => navigate('/login')}
//                         className="w-12 h-12 bg-gray-200 hover:bg-gray-300 shadow-md">
//                     <i className="fa-solid fa-arrow-right-to-bracket text-black"></i>
//                 </button>
//                 <h2 className="text-2xl font-semibold dark:text-customText">{contents.title}</h2>
//                 <div/>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-3">
//                 <h1 className="font-bold dark:text-customText">{contents.contract_maker}</h1>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="flex flex-col">
//                         <label
//                             className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.last_name}:</label>
//                         <input
//                             type="text"
//                             name="last_name"
//                             value={formData.last_name}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             className="py-2 px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                             required
//                         />
//                     </div>
//                     <div className="flex flex-col">
//                         <label
//                             className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.first_name}:</label>
//                         <input
//                             type="text"
//                             name="first_name"
//                             value={formData.first_name}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             className="py-2 px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                             required
//                         />
//                     </div>
//                     <div className="flex flex-col">
//                         <label
//                             className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.sure_name}:</label>
//                         <input
//                             type="text"
//                             name="surname"
//                             value={formData.surname}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             className="py-2 px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                             required
//                         />
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className='flex w-full'>
//                         <div className="flex flex-col w-1/2 me-3">
//                             <label
//                                 className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.passport}:</label>
//                             <input
//                                 type="text"
//                                 name="passport_seria"
//                                 maxLength={9}
//                                 minLength={9}
//                                 value={formData.passport_seria}
//                                 onChange={handleChange}
//                                 onBlur={handleBlur}
//                                 className="w-full py-2 px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                                 required
//                             />
//                         </div>
//                         <div className="flex flex-col w-1/2">
//                             <label className="block text-sm font-medium text-gray-700 dark:text-customText">
//                                 {contents.pasportdate}:</label>
//                             <input
//                                 type="date"
//                                 name="passport_date"
//                                 value={formData.passport_date || '2000-01-01'}
//                                 onChange={handleChange}
//                                 className="py-2 px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                                 required
//                             />
//                         </div>
//                     </div>
//                     <div className='flex flex-col w-full'>
//                         <label
//                             className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.pinfl}:</label>
//                         <input
//                             type="text"
//                             name="pinfl"
//                             maxLength={14}
//                             minLength={14}
//                             value={formData.pinfl}
//                             onChange={handleChange}
//                             className="w-full py-2 px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                             required
//                         />
//                     </div>
//                     <div className="flex flex-col w-full">
//                         <label
//                             className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.passport_address}:</label>
//                         <input
//                             type="text"
//                             name="passport_address"
//                             value={formData.passport_address}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             className="py-2 px-3 w-full border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                             required
//                         />
//                     </div>
//                 </div>


//                 <div className='flex flex-col gap-8'>
//                     <div className="flex flex-row gap-6 align-center w-full">
//                         <div className="w-1/3">
//                             <label className="block text-sm font-medium text-gray-700 dark:text-customText mt-4">
//                                 {contents.phone_number}:
//                             </label>
//                             <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
//                                 <span className="py-2 px-3 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-customText">
//                                     +998
//                                 </span>
//                                 <input
//                                     type="text"
//                                     name="phone_number"
//                                     value={formData.phone_number || ''}
//                                     onChange={handleChange}
//                                     className="py-2 w-full px-3 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                                     required
//                                 />
//                             </div>
//                         </div>
//                         <div className="w-1/3">
//                             <label
//                                 className="block text-sm font-medium text-gray-700 dark:text-customText mt-4">{contents.address}:</label>
//                             <input
//                                 type="text"
//                                 name="address"
//                                 value={formData.address}
//                                 onChange={handleChange}
//                                 onBlur={handleBlur}
//                                 className="py-2 w-full px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                                 required
//                             />
//                         </div>
//                         <div className="w-1/3">

//                         </div>
//                     </div>
//                 </div>

//                 <h1 className="font-bold dark:text-customText">{contents.student}</h1>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-5">
//                     <div className="flex flex-col">
//                         <label
//                             className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.first_name}:</label>
//                         <input
//                             type="text"
//                             name="student.first_name"
//                             value={formData.student.first_name}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             className="py-2 px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                         />
//                     </div>
//                     <div className="flex flex-col">
//                         <label
//                             className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.last_name}:</label>
//                         <input
//                             type="text"
//                             name="student.last_name"
//                             value={formData.student.last_name}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             className="py-2 px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                         />
//                     </div>
//                     <div className="flex flex-col">
//                         <label
//                             className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.sure_name}:</label>
//                         <input
//                             type="text"
//                             name="student.sure_name"
//                             value={formData.student.sure_name}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             className="py-2 px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                         />
//                     </div>
//                     {/* 2row */}
//                     <div className="flex flex-col">
//                         <label
//                             className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.birthday}:</label>
//                         <input
//                             type="date"
//                             name="student.birthday"
//                             value={formData.student.birthday}
//                             onChange={handleChange}
//                             className="py-2 px-3 border-gray-300 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                         />
//                     </div>
//                     <div className="flex flex-col">
//                         <label
//                             className="block text-sm font-medium text-gray-700 dark:text-customText">{contents.phone_number}:</label>
//                         <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
//                                 <span
//                                     className="py-2 px-3 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-customText">
//                                     +998
//                                 </span>
//                             <input
//                                 type="text"
//                                 name="student.phone_number"
//                                 value={formData.student.phone_number || ''}
//                                 onChange={handleChange}
//                                 className="py-2 w-full px-3 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
//                                 required
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full py-2 px-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-md hover:bg-gradient-to-l focus:ring-4 focus:ring-blue-300 transition ease-in-out duration-300"
//                 >
//                     {contents.submit}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default StudentsFormOrg;

