// import { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as XLSX from "xlsx";
// import dayjs from "dayjs";
// import uzLocale from "dayjs/locale/uz-latn";
// import ruLocale from "dayjs/locale/ru";
// import enLocale from "dayjs/locale/en";
// import { Langs } from "../../../enums";
// import { GlobalContext } from "../../../App";
// import Loading from "../../../components/LoadingComponent/Loading";
// import client from "../../../components/services";

// const localeMap = {
//     [Langs.UZ]: uzLocale,
//     [Langs.RU]: ruLocale,
//     [Langs.EN]: enLocale,
// };

// // Function to get month name based on language
// const getMonthName = (monthNumber: number, lang: Langs) => {
//     switch (lang) {
//         case Langs.UZ:
//             return [
//                 "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
//                 "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
//             ][monthNumber];
//         case Langs.RU:
//             return [
//                 "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
//                 "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
//             ][monthNumber];
//         case Langs.EN:
//             return [
//                 "January", "February", "March", "April", "May", "June",
//                 "July", "August", "September", "October", "November", "December"
//             ][monthNumber];
//         default:
//             return "";
//     }
// };

// type TAttendanceTablePage = {
//     title: string;
//     tableHeading: string;
//     noStudents: string;
//     noStudentsMatch: string;
//     searchPlaceholder: string;
//     backButton: string;
//     downloadButton: string;
//     prevMonthButton: string;
//     nextMonthButton: string;
//     currentMonthButton: string;
//     errorFetchingData: string;
//     errorUpdatingData: string;
//     toast: string
// };

// const contentsMap = new Map<Langs, TAttendanceTablePage>([
//     [Langs.UZ, {
//         title: "Davomati",
//         tableHeading: "O'quvchilar",
//         noStudents: "O'quvchilar mavjud emas",
//         noStudentsMatch: "Qidiruv shartlariga mos keladigan o'quvchilar mavjud emas",
//         searchPlaceholder: "Ism bo'yicha qidiruv",
//         backButton: "Ortga",
//         downloadButton: "Yuklab olish",
//         prevMonthButton: "Oldingi oy",
//         nextMonthButton: "Keyingi oy",
//         currentMonthButton: "Joriy oy",
//         errorFetchingData: "Ma'lumotlarni olishda xatolik yuz berdi",
//         errorUpdatingData: "Davomatni yangilashda xatolik yuz berdi",
//         toast: "Davomat muvaffaqiyatli yangilandi"
//     }],
//     [Langs.RU, {
//         title: "Посещаемость",
//         tableHeading: "Студенты",
//         noStudents: "Студенты отсутствуют",
//         noStudentsMatch: "Нет студентов, соответствующих критериям поиска",
//         searchPlaceholder: "Поиск по имени",
//         backButton: "Назад",
//         downloadButton: "Скачать",
//         prevMonthButton: "Предыдущий месяц",
//         nextMonthButton: "Следующий месяц",
//         currentMonthButton: "Текущий месяц",
//         errorFetchingData: "Ошибка при получении данных",
//         errorUpdatingData: "Ошибка при обновлении посещаемости",
//         toast: "Посещаемость успешно обновлена"
//     }],
//     [Langs.EN, {
//         title: "Attendance",
//         tableHeading: "Students",
//         noStudents: "No students available",
//         noStudentsMatch: "No students match the search term",
//         searchPlaceholder: "Search by name",
//         backButton: "Back",
//         downloadButton: "Download",
//         prevMonthButton: "Previous month",
//         nextMonthButton: "Next month",
//         currentMonthButton: "Current month",
//         errorFetchingData: "Failed to fetch attendance data",
//         errorUpdatingData: "Failed to update attendance",
//         toast: "Attendance updated successfully"
//     }],
// ]);

// type AttendanceRecord = {
//     id: number;
//     student: number;
//     created_at: string;
//     status: string;
// };

// type Student = {
//     id: number;
//     first_name: string;
// };

// function AttendanceTablePage() {
//     const {lang} = useContext(GlobalContext);
//     const contents = contentsMap.get(lang) as TAttendanceTablePage;

//     useEffect(() => {
//         dayjs.locale(localeMap[lang]);
//     }, [lang]);

//     const {id} = useParams<{ id: string }>();
//     const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
//     const [students, setStudents] = useState<Student[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [currentMonth, setCurrentMonth] = useState(dayjs());
//     const [groupName, setGroupName] = useState("");
//     const [searchTerm, setSearchTerm] = useState("");
//     const [showSearch, setShowSearch] = useState(false);

//     useEffect(() => {
//         (async () => {
//             if (!id) {
//                 toast.error(contents.errorFetchingData);
//                 return;
//             }
//             setLoading(true);
//             try {
//                 const response = await client.get(`education/attendance/?group=${id}`);
//                 if (!(response.data instanceof Array)) return;
//                 setAttendanceData(response.data.map(el => ({
//                     id: el.id,
//                     student: el.student.id,
//                     created_at: el.date,
//                     status: el.status ? "+" : '-',
//                 })));
//                 const studentsResponse = await client.get(`students/list/?group=${id}`);
//                 if (!(studentsResponse.data instanceof Array)) return;
//                 setStudents(studentsResponse.data.map(el => ({
//                     id: el.id,
//                     first_name: el.user.first_name,
//                 })));
//                 const groupName = (await client.get(`education/group/detail/${id}`)).data.name as string;
//                 setGroupName(groupName);
//             } catch (error) {
//                 toast.error(contents.errorFetchingData);
//                 console.error("Error fetching attendance data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         })()
//     }, [id, currentMonth]);
//     const handlePreviousMonth = () => {
//         setCurrentMonth(currentMonth.subtract(1, "month"));
//     };

//     const handleNextMonth = () => {
//         setCurrentMonth(currentMonth.add(1, "month"));
//     };

//     const handleCurrentMonth = () => {
//         setCurrentMonth(dayjs());
//     };

//     const toggleAttendanceStatus = async (
//         studentId: number,
//         date: dayjs.Dayjs
//     ) => {
//         try {
//             const record = attendanceData.find(
//                 (record) =>
//                     dayjs(record.created_at).isSame(date, "day") &&
//                     record.student === studentId
//             );

//             if (record) {
//                 const newStatus = record.status !== "+";
//                 await client.patch(`education/attendance/${record.id}/`, {
//                     status: newStatus,
//                 });
//                 setAttendanceData((prevData) =>
//                     prevData.map((r) =>
//                         r.id === record.id ? {...r, status: newStatus ? "+" : '-'} : r
//                     )
//                 );
//                 toast.success(contents.toast);

//             } else {
//                 // const newRecord = {
//                 //   student: studentId,
//                 //   created_at: date.format(),
//                 //   status: "+",
//                 // };
//                 // const response = await client.post("education/attendance/", newRecord);
//                 // setAttendanceData((prevData) => [
//                 //   ...prevData,
//                 //   { ...newRecord, id: response.data.id },
//                 // ]);
//             }
//         } catch (error) {
//             toast.error(contents.errorUpdatingData);
//             console.error("Error updating attendance:", error);
//         }
//     };

//     const downloadXLS = () => {
//         const wsData = [];
//         const daysInMonth = currentMonth.daysInMonth();
//         const dates = Array.from({length: daysInMonth}, (_, i) =>
//             currentMonth.date(i + 1).format("DD")
//         );

//         const header = ["Students", ...dates];
//         wsData.push(header);

//         const filteredStudents = students.filter((student) =>
//             student.first_name.toLowerCase().includes(searchTerm.toLowerCase())
//         );

//         filteredStudents.forEach((student) => {
//             const row = [student.first_name];
//             dates.forEach((date) => {
//                 const record = attendanceData.find(
//                     (record) =>
//                         dayjs(record.created_at).format("DD") === date &&
//                         record.student === student.id
//                 );
//                 const status = record ? record.status : "N/A";
//                 row.push(status);
//             });
//             wsData.push(row);
//         });

//         const ws = XLSX.utils.aoa_to_sheet(wsData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, `${getMonthName(currentMonth.month(), lang)} ${currentMonth.year()}`);

//         const wscols = [{wch: 20}, ...Array(daysInMonth).fill({wch: 5})];
//         ws["!cols"] = wscols;

//         const wsrows = wsData.map(() => ({hpx: 25}));
//         ws["!rows"] = wsrows;

//         XLSX.writeFile(wb, `${groupName}_${currentMonth.format("MMMM_YYYY")}.xlsx`);
//     };

//     const renderAttendanceTable = () => {
//         if (!students.length) {
//             return <div className="text-center mt-6 text-xl">{contents.noStudents}</div>;
//         }

//         const daysInMonth = currentMonth.daysInMonth();
//         const dates = Array.from({length: daysInMonth}, (_, i) =>
//             currentMonth.date(i + 1)
//         );
//         const filteredStudents = students.filter((student) =>
//             student.first_name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         if (filteredStudents.length === 0) {
//             return <div>{contents.noStudentsMatch}</div>;
//         }

//         return (
//             <div className=" overflow-x-auto mt-5 max-w-screen-2xl bg-white">
//                 <table className="dark:bg-gray-800">
//                     <thead>
//                     <tr>
//                         <th className="sticky left-0 z-10 py-2 px-4 border-b border-gray-300 dark:text-white dark:border-gray-700 bg-white dark:bg-gray-800">
//                             {contents.tableHeading}
//                         </th>
//                         {dates.map((date) => (
//                             <th
//                                 key={date.format("YYYY-MM-DD")}
//                                 className="py-2 px-4 border-x border-b border-gray-300 dark:text-white dark:border-gray-700"
//                             >
//                                 {date.format("DD")}
//                             </th>
//                         ))}
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {filteredStudents.map((student) => (
//                         <tr key={student.id}>
//                             <td className="sticky left-0 z-10 py-2 px-4 border-b border-e border-gray-300 dark:text-white dark:border-gray-700 bg-white dark:bg-gray-800">
//                                 {student.first_name}
//                             </td>
//                             {dates.map((date) => {
//                                 const record = attendanceData.find(
//                                     (record) => dayjs(record.created_at).isSame(date, "day") &&
//                                         record.student === student.id
//                                 );
//                                 const status = record?.status;
//                                 return (
//                                     <td
//                                         key={date.format("YYYY-MM-DD")}
//                                         className={`py-2 px-4 border-b border-x border-gray-300 text-center dark:border-gray-700 cursor-pointer ${
//                                             record ? status === '+' ? "text-green-500 text-2xl" : "text-red-500 text-2xl" : "dark:text-white"
//                                         }`}
//                                         onClick={() => toggleAttendanceStatus(student.id, date)}
//                                     >
//                                         <h1>
//                                             {record ? status : "N/A"}
//                                         </h1>
//                                     </td>
//                                 );
//                             })}
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         );
//     };

//     return loading ? (
//         <Loading/>
//     ) : (
//         <div className="w-full mt-14 md:mt-0">
//             <div className="flex items-center justify-between px-4">
//                 <button
//                     onClick={() => window.history.back()}
//                     className="w-12 h-12 mx-3 my-3 bg-gray-200 hover:bg-gray-300 rounded"
//                 >
//                     <i className="fa-solid fa-arrow-left text-black"></i>
//                 </button>
//                 {groupName && (
//                     <h1 className="2xl:text-4xl text-3xl font-bold dark:text-white">
//                         {groupName} {contents.title}
//                     </h1>
//                 )}
//                 <div className="relative flex items-center">
//                     <input
//                         type="text"
//                         placeholder={contents.searchPlaceholder}
//                         className={`mt-1 p-2 border hidden md:block border-gray-300 rounded transition-all duration-500 ${
//                             showSearch ? "w-48 opacity-100" : "w-0 opacity-0"
//                         }`}
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         style={{visibility: showSearch ? "visible" : "hidden"}}
//                     />
//                     <button
//                         className="bg-gray-200 mx-3 hidden md:block hover:bg-gray-300 rounded py-3 px-4"
//                         onClick={() => setShowSearch(!showSearch)}
//                     >
//                         <i className="fa fa-search"></i>
//                     </button>
//                     <button
//                         className=" text-white bg-green-400 rounded hover:bg-green-700  py-3 px-4"
//                         onClick={downloadXLS}
//                     >
//                         <i className="fa fa-download"></i>
//                     </button>
//                 </div>
//             </div>

//      <div  className="flex justify-end mb-6 mt-5 items-center md:hidden">
//      <input
//                         type="text"
//                         placeholder={contents.searchPlaceholder}
//                         className={`mt-1 p-2 border  border-gray-300 rounded transition-all duration-500 ${
//                             showSearch ? "w-48 opacity-100" : "w-0 opacity-0"
//                         }`}
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         style={{visibility: showSearch ? "visible" : "hidden"}}
//                     />
//                     <button
//                         className="bg-gray-200 mx-3  hover:bg-gray-300 rounded py-3 px-4"
//                         onClick={() => setShowSearch(!showSearch)}
//                     >
//                         <i className="fa fa-search"></i>
//                     </button>
//      </div>


            
//             <div className="flex items-center justify-between max-w-sm mt-8 mx-auto">
//                 <button
//                     onClick={handlePreviousMonth}
//                     className="w-12 h-12 mx-3 hover:bg-gray-300 rounded"
//                 >
//                     <i className="fa-solid fa-arrow-left text-black dark:text-white"></i>
//                 </button>
//                 <div className="flex w-96 justify-center">
//                     <h2 className="text-2xl text-center font-semibold dark:text-white mx-2 p-2">
//                         {getMonthName(currentMonth.month(), lang)} {currentMonth.year()}
//                     </h2>
//                 </div>
//                 <button
//                     onClick={handleNextMonth}
//                     className="w-12 h-12 mx-3 hover:bg-gray-300 rounded"
//                 >
//                     <i className="fa-solid fa-arrow-right text-black dark:text-white"></i>
//                 </button>
//                 <button
//                     onClick={handleCurrentMonth}
//                     className="py-3 px-4 mx-3 text-white bg-blue-400 rounded hover:bg-blue-700"
//                 >
//                     <i className="fa fa-calendar"></i>
//                 </button>

//             </div>
//             <div className="w-11/12 mx-auto">
//                 <div className="attendance-table px-2">{renderAttendanceTable()}</div>
//             </div>

//         </div>
//     );
// }

// export default AttendanceTablePage;
