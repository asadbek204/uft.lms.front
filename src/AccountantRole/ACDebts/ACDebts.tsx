import { useEffect, useState, useContext } from "react";
import Loading from "../../components/LoadingComponent/Loading.tsx";
import saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import client from "../../components/services";
import ACDebtsModal from "./ACDebtsModal/ACDebtsModal.tsx";
import dayjs from 'dayjs';
import { Link } from "react-router-dom";

type TDebtors = {
    id: number;
    fullName: string;
    group: string;
    debt: number;
    payment: number;
    payments: { amount: string; date: string }[];
    student: {
        status: string;
    };
};

type TKeyTDebtors = keyof TDebtors;

type TNewsComponentContent = {
    title: string;
    title1: string;
    title2: string;
    title3: string;
    title4: string;
    title5: string;
    title6: string;
    debt: string;
    paidDate: string;
    payment: string;
};

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        title: "Qarzdorlar ro'yxati",
        title1: "F.I.O",
        title2: "Guruh",
        title3: "Qarzdorlik",
        title4: "To'langan",
        title5: "Umumiy",
        title6: "T/r",
        debt: "Jami qarz:",
        paidDate: "To'langan sana:",
        payment: "To'lash",
    }],
    [Langs.RU, {
        title: "Список должников",
        title1: "Ф.И.О",
        title2: "Группа",
        title3: "Задолженность",
        title4: "Оплаченный",
        title5: "Общий",
        title6: "Т/р",
        debt: "Общая задолженность:",
        paidDate: "Дата оплаты:",
        payment: "Оплатить",
    }],
    [Langs.EN, {
        title: "List of debtors",
        title1: "Full name",
        title2: "Group",
        title3: "Debt",
        title4: "Paid",
        title5: "Total",
        title6: "T/r",
        debt: "Total debt:",
        paidDate: "Paid Date:",
        payment: "Payment",
    }],
]);


function ACDebts() {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [toggleSearchButton, setToggleSearchButton] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({ key: '', direction: '' });
    const [searchId, setSearchId] = useState('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [searchFio, setSearchFio] = useState('');
    const [searchGroup, setSearchGroup] = useState('');
    const [searchBalance, setSearchBalance] = useState('');
    const [debtorsData, setDebtorsData] = useState<TDebtors[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    // const scrollRef = useRef(null);
    // const [scrollShadow, setScrollShadow] = useState<string>('')

    useEffect(() => {
        (async () => {
            try {
                const response = await client.get('students/payment/list/');
                const activeStudents = response.data.filter((item: TDebtors) => item.student.status !== "inactive");

                if (activeStudents instanceof Array) {
                    const data: TDebtors[] = activeStudents.map(
                        value => ({
                            id: value.student.id,
                            fullName: value.student.full_name,
                            group: value.student.group,
                            debt: value.total_debt,
                            payment: value.total_payment,
                            payments: value.payments
                        } as TDebtors)
                    );
                    setDebtorsData(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching debtors data:', error);
                setLoading(false);
            }
        })();
    }, [showModal]);

    const handleSort = (key: string) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const formatDebt = (debt: number) => {
        return new Intl.NumberFormat('de-DE').format(debt);
    };

    const getTotalDebt = (data: TDebtors[]) => {
        const total = data.reduce((acc, item) => acc + (item.debt - item.payment), 0);
        return formatDebt(total);
    };

    const filteredData = debtorsData.filter(item =>
        item.id.toString().includes(searchId) &&
        item.fullName.toLowerCase().includes(searchFio.toLowerCase()) &&
        item.group.toLowerCase().includes(searchGroup.toLowerCase()) &&
        (item.debt - item.payment).toString().toLowerCase().includes(searchBalance.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortConfig.key) {
            const direction = sortConfig.direction === 'ascending' ? 1 : -1;
            if (sortConfig.key === 'debt') {
                return (a.debt - b.debt) * direction;
            } else if (sortConfig.key === 'payment') {
                return (a.payment - b.payment) * direction;
            } else if (sortConfig.key === 'id') {
                return (a.id - b.id) * direction;
            } else {
                const aValue = (a[sortConfig.key as TKeyTDebtors]).toString().toLowerCase();
                const bValue = (b[sortConfig.key as TKeyTDebtors]).toString().toLowerCase();
                if (aValue < bValue) return -direction;
                if (aValue > bValue) return direction;
            }
        }
        return 0;
    });

    const handleDownloadXLSX = () => {
        const dataToExport = sortedData.map((item, index) => ({
            "T/r": index + 1,
            "Full name": item.fullName,
            "Group": item.group,
            "Debt": formatDebt(item.debt - item.payment),
            "Paid": formatDebt(item.payment),
            "Total": formatDebt(item.debt),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Debtors');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const fileName = `debtors_${dayjs().format('YYYY-MM-DD')}.xlsx`;
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
    };

    // const handleScroll = (event: Event) => {
    //     const styleArray: string[] = []
    //     const element = event.target as HTMLElement;
    //     const atTop = element.scrollTop === 0;
    //     const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    //     console.log(element.scrollHeight - element.scrollTop, element.clientHeight, atTop, atBottom)
    //     if (!atTop) {
    //         styleArray.push(topShadow)
    //     }
    //     if (!atBottom) {
    //         styleArray.push(bottomShadow)
    //     }
    //     setScrollShadow(styleArray.join(','));
    // };

    // useEffect(() => {
    //     if (!scrollRef.current) return;
    //     const element = scrollRef.current as HTMLElement;
    //     element.addEventListener("scroll", handleScroll);

    //     return () => {
    //         element.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;
        setIsScrolled(target.scrollTop > 0);
      };


    return (
        <div className="w-full mt-12 md:mt-0">
            <div className="header flex w-full justify-end">
                <div className="my-5 mx-5 flex w-2/3 align-center justify-between">
                    <h1 className="2xl:text-4xl text-3xl font-bold  dark:text-customText">{contents.title}</h1>
                    <div className="flex  gap-3 flex-col-reverse items-center md:flex-row md:align-center ">
                        <button
                            onClick={() => setToggleSearchButton(!toggleSearchButton)}
                            className="bg-gray-200  hover:bg-gray-300 rounded py-3 px-4"
                        >
                            <i className="fa fa-search"></i>
                        </button>
                        <button
                            className='py-3 px-4  text-white bg-green-400 rounded hover:bg-green-700'
                            onClick={handleDownloadXLSX}
                        >
                            <i className="fa fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
            {loading ? (
                <Loading/>
            ) : (
                <div className="mx-auto border-collapse 2xl:h-[88%] h-[70%] overflow-y-auto w-11/12"
                  onScroll={handleScroll}
                  style={{
                    boxShadow: isScrolled ? "black 0px 10px 10px -10px inset, black 0px -10px 10px -10px inset" : "none"
                  }}
                  >
                    <div className="courses shadow flex flex-col gap-7 justify-center content-center">
                    <table
                        className="text-center font-bold text-xl 2xl:text-2xl sm:text-md table-fixed border-collapse border border-slate-500 dark:text-white">
                        <thead>
                        <tr>
                            <th className="border text-base border-slate-600 py-2 w-12"
                                onClick={() => handleSort('id')}>{contents.title6}</th>
                            <th className="border text-base border-slate-600 py-2 2xl:w-48 w-40"
                                onClick={() => handleSort('fullName')}>{contents.title1}</th>
                            <th className="border text-base border-slate-600 py-2 2xl:w-32"
                                onClick={() => handleSort('group')}>{contents.title2}</th>
                            <th className="border text-base border-slate-600 py-2 w-32"
                                onClick={() => handleSort('debt')}>{contents.title3}</th>
                            <th className="border text-base border-slate-600 py-2 2xl:w-32"
                                onClick={() => handleSort('payment')}>{contents.title4}</th>
                            <th className="border text-base border-slate-600 py-2 2xl:w-32"
                                onClick={() => handleSort('debt')}>{contents.title5}</th>
                            {/* <th className="border text-base border-slate-600 py-2 2xl:w-44 w-40">{contents.paidDate}</th> */}
                            {/* <th className="border text-base border-slate-600 py-2 2xl:w-44 w-40">{contents.paidDate}</th> */}
                            <th className="border text-base border-slate-600 py-2 w-28">{contents.payment}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {toggleSearchButton && (
                            <tr className="mb-4">
                                <td className="border text-base border-slate-600 py-2">
                                    <input
                                        type="text"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        className="block w-full text-center text-gray-900 py-1 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="border text-base border-slate-600 py-2">
                                    <input
                                        type="text"
                                        value={searchFio}
                                        onChange={(e) => setSearchFio(e.target.value)}
                                        className="block w-full text-center text-gray-900 py-1 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="border text-base border-slate-600 py-2">
                                    <input
                                        type="text"
                                        value={searchGroup}
                                        onChange={(e) => setSearchGroup(e.target.value)}
                                        className="block w-full text-center text-gray-900 py-1 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="border text-base border-slate-600 py-2">
                                    <input
                                        type="text"
                                        value={searchBalance}
                                        onChange={(e) => setSearchBalance(e.target.value)}
                                        className="block w-full text-center text-gray-900 py-1 border border-gray-300 rounded"
                                    />
                                </td>
                            </tr>
                            // </tr>
                        )}
                        {sortedData.map((item, index) => (
                            <tr key={item.id} className={item.debt - item.payment < 0 ? 'bg-red-100' : ''}>
                                <td className="border border-slate-700 font-normal 2xl:text-lg py-1">{index + 1}</td>
                                <td className="border border-slate-700 font-normal 2xl:text-lg py-1"><Link to={`${item.id}`}>{item.fullName}</Link></td>
                                <td className="border border-slate-700 font-normal 2xl:text-lg py-1">{item.group}</td>
                                <td className="border border-slate-700 font-normal 2xl:text-lg text-red-700 py-1">{formatDebt(item.debt - item.payment)}</td>
                                <td className="border border-slate-700 font-normal 2xl:text-lg py-1">{formatDebt(item.payment)}</td>
                                <td className="border border-slate-700 font-normal 2xl:text-lg py-1">{formatDebt(item.debt)}</td>
                                {/*<td className="border border-slate-700 font-normal text- 2xl:text-2xl py-1">{item.payments.length > 0 ? formatDate(item.payments[0].date) : ""}</td>*/}
                                <td className="border border-slate-700 font-normal text- 2xl:text-lg py-1">
                                    <button
                                        onClick={() => {
                                            setShowModal(true);
                                            setSelectedStudentId(item.id)
                                        }}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        {contents.payment}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={3} className="border border-slate-700 font-normal py-2">{contents.debt}</td>
                            <td className="border border-slate-700 font-normal py-2 text-red-700">{getTotalDebt(debtorsData)}</td>
                            <td colSpan={2} className="border border-slate-700 font-normal py-2 text-red-700"></td>

                        </tr>
                        </tfoot>
                    </table>
                    </div>
                </div>
            )}

            {showModal && selectedStudentId && (
                <ACDebtsModal
                    isOpen={showModal}
                    studentId={selectedStudentId}
                    onClose={() => setShowModal(false)}
                    fetchDebtorsData={() => {
                    }}
                />
            )}

        </div>
    );
}

export default ACDebts;
