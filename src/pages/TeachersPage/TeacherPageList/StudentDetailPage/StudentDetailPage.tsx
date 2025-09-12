// import Loading from "../../../../components/LoadingComponent/Loading.tsx";
// import { useEffect, useState, useContext, ChangeEvent, FormEvent, useRef } from "react";
// import { GlobalContext } from "../../../../App";
// import { Langs } from "../../../../enums";
// import client from "../../../../components/services";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// type Document = {
//   created_at: string;
//   document: {
//       file: string;
//   };
// };

// type Father = {
//   first_name?: string;
//   last_name?: string;
//   sure_name?: string;
//   passport: string;
//   pinfl: string;
//   email?: string;
//   birthday: string;
//   phone_number: string;
// }

// type Mother = {
//   first_name?: string;
//   last_name?: string;
//   sure_name?: string;
//   passport: string;
//   pinfl: string;
//   email?: string;
//   birthday: string;
//   phone_number: string;
// }

// type TUser = {
//   phone_number: string;
//   password: string;
//   email?: string;
//   first_name?: string;
//   last_name?: string;
//   sure_name?: string;
//   passport: string;
//   pinfl: string;
//   gender?: string;
//   birthday: string;
// };

// interface StudentData {
//   birthday: string;
//   email: string;
//   first_name: string;
//   gender?: string;
//   last_name: string;
//   passport: string;
//   phone_number: string;
//   pinfl: string;
//   sure_name: string;
//   document: Document[];
//   father?: Father;
//   // father?: TUser;
//   mother?: TUser;
//   university?: string;
// }



// const defaultStudent = {
//   birthday: "",
//   email: "",
//   first_name: "",
//   gender: "M",
//   last_name: "",
//   passport: "",
//   phone_number: "",
//   pinfl: "",
//   sure_name: "",
//   document: [],
// };

// interface TNewsComponentContent {
//   title1: string;
//   title2: string;
//   title3: string;
//   birth_date: string;
//   email: string;
//   first_name: string;
//   gender: string;
//   last_name: string;
//   passport: string;
//   phone_number: string;
//   pinfl: string;
//   sure_name: string;
//   student: string;
//   male: string;
//   female: string;
//   father_i: string;
//   mother_i: string;
//   password: string;
//   toast: string
// }

// const contentsMap = new Map<Langs, TNewsComponentContent>([
//   [
//     Langs.UZ,
//     {
//       title1: "Sxsiy ma'lumotlar",
//       title2: "Oilaviy ma'lumotlar",
//       title3: "Qo'shimcha ma'lumotlar",
//       birth_date: "Tug'ilgan sana",
//       email: "Elektron pochta",
//       first_name: "Ism",
//       gender: "Jins",
//       last_name: "Familiya",
//       passport: "Pasport",
//       phone_number: "Telefon raqami",
//       pinfl: "PINFL",
//       sure_name: "Otasining ismi",
//       student: "O'quvchi",
//       male: "Erkak",
//       female: "Ayol",
//       father_i: "Otasining ma'lumotlari",
//       mother_i: "Onasining ma'lumotlari",
//       password: "Parol",
//       toast: "Talaba maʼlumotlarini saqlab boʻlmadi"
//     },
//   ],

//   [
//     Langs.RU,
//     {
//       title1: "Личные данные",
//       title2: "Семейные данные",
//       title3: "Дополнительная информация",
//       birth_date: "Дата рождения",
//       email: "Электронная почта",
//       first_name: "Имя",
//       gender: "Пол",
//       last_name: "Фамилия",
//       passport: "Паспорт",
//       phone_number: "Номер телефона",
//       pinfl: "ПИНФЛ",
//       sure_name: "Отчество",
//       student: "Ученик(ца)",
//       male: "Мужской",
//       female: "Женский",
//       father_i: "Информация об отце",
//       mother_i: "Информация о матери",
//       password: "Пароль",
//       toast: "Не удалось сохранить данные учащихся."
//     },
//   ],
//   [
//     Langs.EN,
//     {
//       title1: "Personal Information",
//       title2: "Family Information",
//       title3: "Additional Information",
//       birth_date: "Birth Date",
//       email: "Email",
//       first_name: "First Name",
//       gender: "Gender",
//       last_name: "Last Name",
//       passport: "Passport",
//       phone_number: "Phone Number",
//       pinfl: "PINFL",
//       sure_name: "Sure Name",
//       student: "Student",
//       male: "Male",
//       female: "Female",
//       father_i: "Father's information",
//       mother_i: "Mother's information",
//       password: "Password",
//       toast: "Failed to save student data"
//     },
//   ],
// ]);

// function StudentDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const { lang } = useContext(GlobalContext);
//   const contents = contentsMap.get(lang) as TNewsComponentContent;
//   const [loading, setLoading] = useState<boolean>(false);
//   const [data, setData] = useState<StudentData>(defaultStudent);
//   const [documentsFile, setDocumentsFile] = useState<Document[]>([])
//   const [fatherData, setFatherData] = useState<Father>()
//   const [motherData, setMotherData] = useState<Mother>()
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [formData, setFormData] = useState<StudentData>(defaultStudent);
//   const [error, setError] = useState<string | null>(null);
//   const formRef = useRef(null)
  

//   useEffect(() => {
//     setLoading(true);
//     (async () => {
//       try {
//         const response = await client.get(`students/retrive/${id}/`);
//         console.log("Response:", response);
  
//         const userData = response.data.user;
//         const documents: Document[] = response.data.document;
//         const fatherDatas: Father = response.data.father;
//         const motherDatas: Mother = response.data.mother
//         if (userData && Array.isArray(documents)) {
//           setData(userData);
//           setFormData(userData);
//           setDocumentsFile(documents)
//           setFatherData(fatherDatas)
//           setMotherData(motherDatas)
//         } else {
//           throw new Error("Unexpected response structure");
//         }

  
//       } catch (error) {
//         console.error(error);
//         toast.error(contents.toast);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id, isEditing, contents.toast]); 
//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setFormData(data);
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
   
//     if (name.includes('father.') || name.includes('mother.')) {
//       const [parent, field] = name.split('.');
//       setFormData((prevData) => ({
//         ...prevData,
//         [parent]: {
//           ...(prevData as unknown as {[key: string]:object})[parent],
//           [field]: value,
//         }
//       }));
//     } else {
    
//       setFormData(prevData => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSave = async () => {
//     const form = new FormData(formRef.current as unknown as HTMLFormElement)
//     const formvalues = Object.fromEntries(form)
//     console.log("pppppp",formvalues)
//     if (!formData) return;
//     const studentData = {
//       phone_number: formData.phone_number,
//       email: formData.email,
//       first_name: formData.first_name,
//       last_name: formData.last_name,
//       sure_name: formData.sure_name,
//       passport: formData.passport,
//       pinfl: formData.pinfl,
//       gender: formData.gender,
//       birthday: formData.birthday,
//       graduated_at: new Date().toISOString(),
//       university: formData.university,
//     };
    

//     const fatherData = {
//       phone_number: formvalues["father.phone_number"],
//       email: formvalues["father.email"],
//       first_name: formvalues["father.first_name"],
//       last_name: formvalues["father.last_name"],
//       sure_name: formvalues["father.sure_name"],
//       passport: formvalues["father.passport"],
//       pinfl: formvalues["father.pinfl"],
//       birthday: formvalues["father.birthday"],
//     }

//     const motherData = {
//       phone_number: formvalues["mother.phone_number"],
//       email: formvalues["mother.email"],
//       first_name: formvalues["mother.first_name"],
//       last_name: formvalues["mother.last_name"],
//       sure_name: formvalues["mother.sure_name"],
//       passport: formvalues["mother.passport"],
//       pinfl: formvalues["mother.pinfl"],
//       birthday: formvalues["mother.birthday"],
//     }

//     const parentsData = {
//       father: fatherData,
//       mother: motherData,
//     };
  
//     try {
//       await client.patch(`students/update/${id}/`, studentData);
//       console.log("Student Data:", studentData);
//       setIsEditing(false);
//       setError(null);
//     } catch (error) {
//       console.error('Error while saving:', error);
//       toast.error(contents.toast);
//     }
    
//     try {
//       await client.patch(`students/fill/${id}/`, parentsData);
//       console.log("Parents Data:", parentsData);
//     } catch (error) {
//       console.error('Error while saving parents data:', error);
//       toast.error(contents.toast);
//     }
//   };


//   const handleDelete = async () => {
//     try {
//       await client.delete(`students/delete/${id}/`);
//       window.history.back();
//     } catch {
//       toast.error(contents.toast);
//     }
//   };

//   return (
//     <div className="w-full">
//       <div className="header">
//         <div className="flex justify-between mx-5 my-5">
//           <button
//             onClick={() => window.history.back()}
//             className="bg-gray-200 py-3 px-4 hover:bg-gray-300 rounded"
//           >
//             <i className="fa-solid fa-arrow-left text-black"></i>
//           </button>
//           <h1 className="text-4xl font-bold font-Sora dark:text-customText leading-[40px]">
//             {contents.student} {data.first_name} {data.last_name}
//           </h1>
//           {!isEditing ? (
//             <div className="flex">
//               <button
//                 onClick={handleEdit}
//                 className="px-4 py-3 text-white bg-blue-400 rounded hover:bg-blue-700"
//               >
//                 <i className="fa fa-pen"></i>
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-3 ml-2 text-white bg-red-500 rounded hover:bg-red-700"
//               >
//                 <i className="fa fa-trash"></i>
//               </button>
//             </div>
//           ) : (
//             <div className="flex">
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-3 text-white bg-green-500 rounded hover:bg-green-700"
//               >
//                 <i className="fa fa-check"></i>
//               </button>
//               <button
//                 onClick={handleCancel}
//                 className="px-4 py-3 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700"
//               >
//                 <i className="fa fa-times"></i>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       {loading ? (
//         <Loading />
//       ) : (
//         <div className="p-6  w-full mx-auto h-[650px] gap-4  overflow-auto">
//           {error && <p className="text-red-500">{error}</p>}
//           <form ref={formRef} className="flex justify-around">
//           <div className="">
//             <div className="">
//               <h2 className="text-2xl font-bold mb-4">{contents.title1}</h2>
//               <div className="overflow-y-auto 2xl:max-h-[630px] lg:max-h-[530px] ">
//                 {isEditing ? (
//                   <div
//                     onSubmit={(e: FormEvent) => {
//                       e.preventDefault();
//                       handleSave();
//                     }}
//                     className="flex overflow-y-auto flex-col gap-4"
//                   >
//                     <label>
//                       <strong>{contents.birth_date}</strong>
//                       <input
//                         type="date"
//                         name="birthday"
//                         defaultValue={formData.birthday}
//                         onChange={handleChange}
//                         className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                       />
//                     </label>
//                     <label>
//                       <strong>{contents.email}</strong>
//                       <input
//                         type="email"
//                         name="email"
//                         defaultValue={formData.email || ""}
//                         onChange={handleChange}
//                         className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                       />
//                     </label>
//                     <label>
//                       <strong>{contents.first_name}</strong>
//                       <input
//                         type="text"
//                         name="first_name"
//                         defaultValue={formData.first_name}
//                         onChange={handleChange}
//                         className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                       />
//                     </label>
//                     <label>
//                       <strong>{contents.last_name}</strong>
//                       <input
//                         type="text"
//                         name="last_name"
//                         defaultValue={formData.last_name}
//                         onChange={handleChange}
//                         className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                       />
//                     </label>
//                     <label>
//                       <strong>{contents.sure_name}</strong>
//                       <input
//                         type="text"
//                         name="sure_name"
//                         defaultValue={formData.sure_name}
//                         onChange={handleChange}
//                         className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                       />
//                     </label>
//                     <label>
//                       <strong>{contents.gender}</strong>
//                       <select
//                         name="gender"
//                         defaultValue={formData.gender}
//                         onChange={handleChange}
//                         className="block h-10 px-4 bg-white w-full mt-1 border border-gray-300 rounded"
//                       >
//                         <option selected={formData.gender === "M"} value="M">
//                           {contents.male}
//                         </option>
//                         <option selected={formData.gender === "F"} value="F">
//                           {contents.female}
//                         </option>
//                       </select>
//                     </label>
//                     <label>
//                       <strong>{contents.passport}</strong>
//                       <input
//                         type="text"
//                         name="passport"
//                         defaultValue={formData.passport}
//                         onChange={handleChange}
//                         className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                       />
//                     </label>
//                     <label>
//                       <strong>{contents.phone_number}</strong>
//                       <input
//                         type="text"
//                         name="phone_number"
//                         defaultValue={formData.phone_number}
//                         onChange={handleChange}
//                         className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                       />
//                     </label>
//                     <label>
//                       <strong>{contents.pinfl}</strong>
//                       <input
//                         type="text"
//                         name="pinfl"
//                         defaultValue={formData.pinfl}
//                         onChange={handleChange}
//                         className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                       />
//                     </label>
//                   </div>
//                 ) : (
//                   <div>
//                     <p>
//                       <strong>{contents.birth_date}</strong>: {data.birthday}
//                     </p>
//                     <p>
//                       <strong>{contents.email}</strong>: {data.email}
//                     </p>
//                     <p>
//                       <strong>{contents.first_name}</strong>: {data.first_name}
//                     </p>
//                     <p>
//                       <strong>{contents.last_name}</strong>: {data.last_name}
//                     </p>
//                     <p>
//                       <strong>{contents.sure_name}</strong>: {data.sure_name}
//                     </p>
//                     <p>
//                       <strong>{contents.gender}</strong>:{" "}
//                       {data.gender === "M" ? contents.male : contents.female}
//                     </p>
//                     <p>
//                       <strong>{contents.passport}</strong>: {data.passport}
//                     </p>
//                     <p>
//                       <strong>{contents.phone_number}</strong>:{" "}
//                       {data.phone_number}
//                     </p>
//                     <p>
//                       <strong>{contents.pinfl}</strong>: {data.pinfl}
//                     </p>
//                     <strong>Document:</strong><br /> 
//                               {documentsFile.map((item,index)=> (
//                                 <a target="_blank" key={index} href={item.document.file}>{item.document.file}</a>
//                               ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="">
//             <h2 className="text-2xl font-bold mb-4">{contents.title2}</h2>
//             <div className="overflow-y-auto  2xl:max-h-[630px] lg:max-h-[530px] ">
//               {isEditing && Boolean(fatherData) ? (
//                 <div
//                   onSubmit={(e: FormEvent) => {
//                     e.preventDefault();
//                     handleSave();
//                   }}
//                   className="flex overflow-y-auto flex-col gap-4"
//                 >
//                   <div className="flex gap-6">
//                    {fatherData ?  <div>
//                       <h3 className="pt-6 pb-3">
//                         <strong>{contents.father_i}</strong>
//                       </h3>

//                       <label>
//                         <strong>{contents.first_name}</strong>
//                         <input
//                           type="text"
//                           name="father.first_name"
//                           defaultValue={fatherData?.first_name}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.last_name}</strong>
//                         <input
//                           type="text"
//                           name="father.sure_name"
//                           defaultValue={fatherData?.sure_name}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.sure_name}</strong>
//                         <input
//                           type="text"
//                           name="father.last_name"
//                           defaultValue={fatherData?.last_name}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.passport}</strong>
//                         <input
//                           defaultValue={fatherData?.passport}
//                           type="text"
//                           name="father.passport"
//                           // defaultValue={fatherData?.passport}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.pinfl}</strong>
//                         <input
//                           type="text"
//                           name="father.pinfl"
//                           defaultValue={fatherData?.pinfl}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.phone_number}</strong>
//                         <input
//                           type="text"
//                           name="father.phone_number"
//                           defaultValue={fatherData?.phone_number}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.email}</strong>
//                         <input
//                           type="text"
//                           name="father.email"
//                           defaultValue={fatherData?.email}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.birth_date}</strong>
//                         <input
//                           type="date"
//                           name="father.birthday"
//                           defaultValue={fatherData?.birthday}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                     </div>:null}

//                    {motherData &&  <div>
//                       <h3 className="pt-6 pb-3">
//                         <strong>{contents.mother_i}</strong>
//                       </h3>

//                       <label>
//                         <strong>{contents.first_name}</strong>
//                         <input
//                           type="text"
//                           name="mother.first_name"
//                           defaultValue={motherData?.first_name}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.last_name}</strong>
//                         <input
//                           type="text"
//                           name="mother.sure_name"
//                           defaultValue={motherData?.sure_name}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.sure_name}</strong>
//                         <input
//                           type="text"
//                           name="mother.last_name"
//                           defaultValue={motherData?.last_name}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.passport}</strong>
//                         <input
//                           type="text"
//                           name="mother.passport"
//                           defaultValue={motherData?.passport}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.pinfl}</strong>
//                         <input
//                           type="text"
//                           name="mother.pinfl"
//                           defaultValue={motherData?.pinfl}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.phone_number}</strong>
//                         <input
//                           type="text"
//                           name="mother.phone_number"
//                           defaultValue={motherData?.phone_number}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.email}</strong>
//                         <input
//                           type="text"
//                           name="mother.email"
//                           defaultValue={motherData?.email}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                       <label>
//                         <strong>{contents.birth_date}</strong>
//                         <input
//                           type="date"
//                           name="mother.birthday"
//                           defaultValue={motherData?.birthday}
//                           onChange={handleChange}
//                           className="block h-10 px-4 w-full mt-1 border border-gray-300 rounded"
//                         />
//                       </label>
//                     </div>}
//                   </div>

//                 </div>
//               ) : (
//                 <div>
//                   <h3 className="pb-3">
//                     <strong>{contents.father_i}</strong>
//                   </h3>
//                   <p>
//                     <strong>{contents.first_name}</strong>:{" "}
//                     {fatherData?.first_name}
//                   </p>
//                   <p>
//                     <strong>{contents.last_name}</strong>:{" "}
//                     {fatherData?.last_name}
//                   </p>
//                   <p>
//                     <strong>{contents.sure_name}</strong>:{" "}
//                     {data.father?.sure_name}
//                   </p>
//                   <p>
//                     <strong>{contents.passport}</strong>:{" "}
//                     {fatherData?.passport}
//                   </p>
//                   <p>
//                     <strong>{contents.pinfl}</strong>: {fatherData?.pinfl}
//                   </p>
//                   <p>
//                     <strong>{contents.phone_number}</strong>:{" "}
//                     {fatherData?.phone_number}
//                   </p>
//                   <p>
//                     <strong>{contents.email}</strong>: {fatherData?.email}
//                   </p>
//                   <p>
//                     <strong>{contents.birth_date}</strong>:
//                     {fatherData?.birthday}
//                   </p>
                 
//                   <div>
//                     <h3 className="pt-6 pb-3">
//                       <strong>{contents.mother_i}</strong>
//                     </h3>
//                     <p>
//                       <strong>{contents.first_name}</strong>:{" "}
//                       {motherData?.first_name}
//                     </p>
//                     <p>
//                       <strong>{contents.last_name}</strong>:{" "}
//                       {motherData?.last_name}
//                     </p>
//                     <p>
//                       <strong>{contents.sure_name}</strong>:{" "}
//                       {motherData?.sure_name}
//                     </p>
//                     <p>
//                       <strong>{contents.passport}</strong>:{" "}
//                       {motherData?.passport}
//                     </p>
//                     <p>
//                       <strong>{contents.pinfl}</strong>: {motherData?.pinfl}
//                     </p>
//                     <p>
//                       <strong>{contents.phone_number}</strong>:{" "}
//                       {motherData?.phone_number}
//                     </p>
//                     <p>
//                       <strong>{contents.email}</strong>: {motherData?.email}
//                     </p>
//                     <p>
//                       <strong>{contents.birth_date}</strong>:{" "}
//                       {motherData?.birthday}
//                     </p>
                  
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StudentDetailPage;

