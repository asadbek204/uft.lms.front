import React, {useEffect, useState, useRef} from 'react';
import {Link, useParams} from 'react-router-dom';
import * as XLSX from 'xlsx';
import {useContext} from "react";
import {Langs} from "../../../enums.ts";
import {GlobalContext} from "../../../App.tsx";
import client from "../../../components/services";
import Loading from "../../../components/LoadingComponent/Loading.tsx";

interface Student {
    id: number;
    user: {
        first_name: string;
        last_name: string;
        sure_name: string;
    };
    status: string;
}

interface DebtInfo {
    student: number;
    debt: number;
    payment: number;
}

type TNewsComponentContent = {
    title1: string;
    title3: string;
    title4: string;
    title5: string;
    title6: string;
    group: string;
    addBtn: string;
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        title1: "F.I.O",
        title3: "Qarzdorlik",
        title4: "To'langan",
        title5: "Umumiy summa",
        title6: "T/r",
        group: "guruh ma'lumotlari",
        addBtn: "O'quvchi qo'shish"
    }],
    [Langs.RU, {
        title1: "Ф.И.О",
        title3: "Задолженность",
        title4: "Оплаченный",
        title5: "Общая сумма",
        title6: "Т/р",
        group: "Информация о группе",
        addBtn: "Добавить студента"
    }],
    [Langs.EN, {
        title1: "Full name",
        title3: "Debt",
        title4: "Paid",
        title5: "Total amount",
        title6: "T/r",
        group: "group information",
        addBtn: "Add student"
    }],
]);

const formatNumber = (number: number): string => {
    return new Intl.NumberFormat('de-DE').format(number);
};

const topShadow = 'inset 0 10px 10px -10px black'
const bottomShadow = 'inset 0 -10px 10px -10px black'

const GroupSingle: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [groupData, setGroupData] = useState<string>('');
    const [students, setStudents] = useState<Student[]>([]);
    const [debtData, setDebtData] = useState<DebtInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const scrollRef = useRef(null);
    const [scrollShadow, setScrollShadow] = useState<string>('')


    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await client.get(`students/by_group/list/${id}/`);
                console.log(response)
                const activeStudents = response.data.filter((student: Student) => student.status !== "inactive");
                setStudents(activeStudents);
                setGroupData(response.data[0].groups.name);
            } finally {
                setLoading(false);
            }
        };

        const fetchDebtData = async () => {
            const response = await client.get('students/payment/list/');
            if (response.data instanceof Array) {
                const data: DebtInfo[] = response.data.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (value: any) => ({
                        debt: value.total_debt,
                        payment: value.total_payment,
                        student: value.student.id
                    })
                );
                setDebtData(data);
            }
        };

        fetchGroupData();
        fetchDebtData();
    }, [id]);

    const getDebtInfo = (studentId: number): DebtInfo => {
        return debtData.find(total_debt => total_debt.student === studentId) || {
            student: studentId,
            debt: 0,
            payment: 0
        };
    };

    const downloadXLS = () => {
        const data = students.map((student, index) => {
            const debtInfo = getDebtInfo(student.id);
            const total_debt = debtInfo.debt - debtInfo.payment;
            const payment = debtInfo.payment;
            const totalSum = debtInfo.debt;
            return [
                index + 1,
                `${student.user.sure_name} ${student.user.first_name} ${student.user.last_name}`,
                total_debt,
                payment,
                totalSum
            ];
        });

        const worksheet = XLSX.utils.aoa_to_sheet([
            [contents.title6, contents.title1, contents.title3, contents.title4, contents.title5],
            ...data
        ]);

        worksheet['!cols'] = [
            {wch: 5},
            {wch: 40},
            {wch: 15},
            {wch: 15},
            {wch: 15}
        ];

        worksheet['!rows'] = [];
        worksheet['!rows'][0] = {hpx: 30};
        data.forEach((_, index) => {
            worksheet['!rows']![index + 1] = {hpx: 25};
        });

        const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = {r: R, c: C};
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                if (!worksheet[cellRef]) continue;
                worksheet[cellRef].s = {
                    border: {
                        bottom: {style: 'thin'},
                        top: {style: 'thin'},
                        left: {style: 'thin'},
                        right: {style: 'thin'}
                    }
                };
            }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
        XLSX.writeFile(workbook, `${groupData}_students.xlsx`);
    };
    const handleScroll = (event: Event) => {
        const styleArray: string[] = []
        const element = event.target as HTMLElement;
        const atTop = element.scrollTop === 0;
        const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
        console.log(element.scrollHeight - element.scrollTop, element.clientHeight, atTop, atBottom)
        if (!atTop) {
            styleArray.push(topShadow)
        }
        if (!atBottom) {
            styleArray.push(bottomShadow)
        }
        setScrollShadow(styleArray.join(','));
    };

    useEffect(() => {
        if (!scrollRef.current) return;
        const element = scrollRef.current as HTMLElement;
        element.addEventListener("scroll", handleScroll);

        return () => {
            element.removeEventListener("scroll", handleScroll);
        };
    }, []);



    return (
            <div className="w-full mt-12 md:mt-0">
                <div className="header">
                    <div className="flex justify-between m-5">
                        <button onClick={() => window.history.back()}
                                className='w-12 h-12 my-3 bg-gray-200 hover:bg-gray-300 rounded'>
                            <i className='fa-solid fa-arrow-left text-black'></i>
                        </button>
                        <h1 className={`2xl:text-4xl text-3xl font-bold dark:text-customText ${lang === Langs.RU ? "flex flex-row-reverse gap-2" : ""}`}>
                            {groupData} {contents.group}
                        </h1>
                        <div className='hidden md:block'>
                            <Link to={`students-form`}>
                                <button
                                    className='py-3 px-8 m-2 text-white bg-blue-400 rounded hover:bg-blue-700'>
                                    {contents.addBtn}
                                </button>
                            </Link>
                            <button
                                className='py-3 px-4 m-2 text-white bg-green-400 rounded hover:bg-green-700'
                                onClick={downloadXLS}>
                                <i className="fa-solid fa-download"></i>
                            </button>
                        </div>
                    </div>
                    <div className='flex justify-center md:hidden'>
                            <Link to={`/students-form`}>
                                <button
                                    className='py-3 px-8 m-2 text-white bg-blue-400 rounded hover:bg-blue-700'>
                                    {contents.addBtn}
                                </button>
                            </Link>
                            <button
                                className='py-3 px-4 m-2 text-white bg-green-400 rounded hover:bg-green-700'
                                onClick={downloadXLS}>
                                <i className="fa-solid fa-download"></i>
                            </button>
                        </div>
                </div>

                <div ref={scrollRef}
                 style={{
                     boxShadow: scrollShadow
                 }}
                 className="mx-auto border-x-slate-600 border-collapse 2xl:h-[88%] h-[75%]  overflow-y-auto w-11/12">
                    <div className="courses flex flex-col gap-7 justify-center content-center">
                        {loading ? <Loading/> :
                            <table
                                className="text-center font-normal text-xl 2xl:text-2xl sm:text-md table-fixed border-collapse border border-slate-500 dark:text-white">
                                <thead>
                                <tr>
                                    <th className="border border-slate-600 w-12 text-base py-2">{contents.title6}</th>
                                    <th className="border border-slate-600 py-2 text-base 2xl:w-2/4">{contents.title1}</th>
                                    <th className="border border-slate-600 w-44 py-2 text-base">{contents.title3}</th>
                                    <th className="border border-slate-600 w-44 py-2 text-base">{contents.title4}</th>
                                    <th className="border border-slate-600 w-44 py-2 text-base">{contents.title5}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {students.map((student: Student, index: number) => {
                                    const debtInfo = getDebtInfo(student.id);
                                    const debt = debtInfo.debt - debtInfo.payment;
                                    const payment = debtInfo.payment;
                                    const totalSum = debtInfo.debt;
                                    return (
                                        <tr key={student.id}>
                                            <td className="border border-slate-600 sm:font-sm sm:text-base py-1">{index + 1}</td>
                                            <td className="border border-slate-600 font-sm text-base 2xl:text-xl py-1 duration-300 ease-in-out hover:text-blue-400">
                                                <Link to={`${student.id}`}>
                                                    {` ${student.user.sure_name}  ${student.user.first_name} ${student.user.last_name}`}
                                                </Link>
                                            </td>
                                            <td className="border border-slate-600 sm:font-sm  text-red-700 sm:text-base py-1">{formatNumber(debt)}</td>
                                            <td className="border border-slate-600 sm:font-sm  text-green-700 sm:text-base py-1">{formatNumber(payment)}</td>
                                            <td className="border border-slate-600 sm:font-sm sm:text-base py-1">{formatNumber(totalSum)}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
    );
};

export default GroupSingle;
