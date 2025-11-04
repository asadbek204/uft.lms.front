import {useEffect, useState, useContext, useRef} from "react";
import saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import {GlobalContext} from "../../App";
import {Langs} from "../../enums";
import client from "../../components/services";
import Loading from "../../components/LoadingComponent/Loading.tsx";
import {Link} from "react-router-dom";
import arrowSort from "../../images/arrow-sort-default.svg"
// import '../../index.css'
// import '../../index.css'

type TDebtors = {
    id: number;
    fullName: string;
    group: string;
    debt: number;
    payment: number;
    student: {
        status: string
    }
}

type TKeyTDebtors = keyof TDebtors;

type TNewsComponentContent = {
    title: string,
    title1: string,
    title2: string,
    title3: string,
    title4: string,
    title5: string,
    title6: string,
    debt: string,
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        title: "Qarzdorlar ro'yxati",
        title1: "F.I.O",
        title2: "Guruh",
        title3: "Qarzdorlik",
        title4: "To'langan",
        title5: "Umumiy",
        title6: "T/r",
        debt: "Jami qarz:"
    }],
    [Langs.RU, {
        title: "Список должников",
        title1: "Ф.И.О",
        title2: "Группа",
        title3: "Задолженность",
        title4: "Оплаченный",
        title5: "Общий",
        title6: "Т/р",
        debt: "Общая задолженность:"
    }],
    [Langs.EN, {
        title: "List of debtors",
        title1: "Full name",
        title2: "Group",
        title3: "Debt",
        title4: "Paid",
        title5: "Total",
        title6: "T/r",
        debt: "Total debt:"
    }],
]);

const topShadow = 'inset 0 10px 10px -10px black'
const bottomShadow = 'inset 0 -10px 10px -10px black'

function DebtorsPage() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [toggleSearchButton, setToggleSearchButton] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortConfig, setSortConfig] = useState({key: '', direction: ''});
    const [searchId, setSearchId] = useState('');
    const [searchFio, setSearchFio] = useState('');
    const [searchGroup, setSearchGroup] = useState('');
    const [searchBalance, setSearchBalance] = useState('');
    const [debtorsData, setDebtorsData] = useState<TDebtors[]>([]);

    useEffect(() => {
        (async () => {
            const response = await client.get('students/payment/list/');
            console.log(response)
            const activeStudents = response.data.filter((item: TDebtors) => item.student.status !== "inactive");

            if (activeStudents instanceof Array) {
                const data: TDebtors[] = activeStudents.map(
                    value => ({
                        id: value.student.id,
                        fullName: value.student.full_name,
                        group: value.student.group,
                        debt: value.total_debt,
                        payment: value.total_payment
                    } as TDebtors)
                );
                setDebtorsData(data);
                setLoading(false);
            }
        })();
    }, []);

    const handleSort = (key: string) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
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
        item.debt.toString().toLowerCase().includes(searchBalance.toLowerCase())
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
                if (aValue < bValue) return direction;
                if (aValue > bValue) return -direction;
            }
        }
        return 0;
    });

    const handleDownloadXLSX = () => {
        const dataToExport = sortedData.map((item, index) => ({
            [contents.title6]: index + 1,
            [contents.title1]: item.fullName,
            [contents.title2]: item.group,
            [contents.title3]: formatDebt(item.debt - item.payment),
            [contents.title4]: formatDebt(item.payment),
            [contents.title5]: formatDebt(item.debt)
        }));

        dataToExport.push({
            [contents.title6]: dataToExport.length + 1,
            [contents.title1]: "",
            [contents.title2]: contents.debt,
            [contents.title3]: getTotalDebt(debtorsData),
            [contents.title4]: "",
            [contents.title5]: ""
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        worksheet["!cols"] = [
            {wpx: 50}, 
            {wpx: 200}, 
            {wpx: 100}, 
            {wpx: 100}, 
            {wpx: 100},
            {wpx: 100}  
        ];

        const rowHeights = [];
        for (let i = 0; i < 100; i++) {
            rowHeights.push({hpx: 34});
        }

        worksheet["!rows"] = rowHeights;


        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Debtors");
        const wbout = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
        const blob = new Blob([wbout], {type: "application/octet-stream"});
        saveAs(blob, "debtors.xlsx");
    };

    const scrollRef = useRef(null);
    const [scrollShadow, setScrollShadow] = useState<string>('')

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
        console.log(scrollRef.current,'e')
        const element = scrollRef.current as HTMLElement;
        element.addEventListener("scroll", handleScroll);

        return () => {
            element.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="w-full  mt-12 md:mt-0">
            <div className="header flex w-full justify-end">
                <div className="my-5 mx-5 flex w-2/3 align-center justify-between">
                    <h1 className="2xl:text-4xl text-center text-3xl font-bold  dark:text-customText">{contents.title}</h1>
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

            <div ref={scrollRef}
                 style={{
                     boxShadow: scrollShadow
                 }}
                 className="mx-auto border-x-slate-600 border-collapse 2xl:h-[88%]  h-[70%] overflow-y-auto w-11/12">
                {loading ? <Loading/> : (
                    <div className="courses shadow-md flex flex-col gap-7 justify-center content-center">
                        <table
                            className="text-center  text-xl 2xl:text-2xl sm:text-md table-fixed border-collapse border border-slate-500 dark:text-white">
                            <thead>
                            <tr>
                                <th className="border text-base border-slate-600 py-2 w-12">{contents.title6}</th>
                                <th className="border text-base border-slate-600 py-2 2xl:w-96 w-80">
                                    <div className="flex justify-center align-center gap-3">
                                        {contents.title1}
                                        <button onClick={() => handleSort('fullName')}>
                                            <img className="filter dark:invert" src={arrowSort} alt=""/>
                                        </button>
                                    </div>
                                </th>
                                <th className="border text-base border-slate-600 py-2 w-44">
                                    <div className="flex justify-center align-center gap-3">
                                        {contents.title2}
                                        <button onClick={() => handleSort('group')}>
                                            <img className="filter dark:invert" src={arrowSort} alt=""/>
                                        </button>
                                    </div>
                                </th>
                                <th className="border text-base border-slate-600 py-2 2xl:w-60 w-44">
                                    <div className="flex justify-center align-center gap-3">
                                        {contents.title3}
                                        <button onClick={() => handleSort('debt')}>
                                            <img className="filter dark:invert" src={arrowSort} alt=""/>
                                        </button>
                                    </div>
                                </th>
                                <th className="border text-base border-slate-600 py-2 2xl:w-48 w-40">
                                    <div className="flex justify-center align-center gap-3">
                                        {contents.title4}
                                        <button onClick={() => handleSort('payment')}>
                                            <img className="filter dark:invert" src={arrowSort} alt=""/>
                                        </button>
                                    </div>
                                </th>
                                <th className="border text-base border-slate-600 py-2 2xl:w-60 w-48">
                                    <div className="flex justify-center align-center gap-3">
                                        {contents.title5}
                                        <button onClick={() => handleSort('payment')}>
                                            <img className="filter dark:invert" src={arrowSort} alt=""/>
                                        </button>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {toggleSearchButton && (
                                <tr>
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
                            )}
                            {sortedData.map((item, index) => (
                                <tr key={item.id} className="py-4">
                                    <td className="border border-slate-700 font-normal text- 2xl:text-lg py-1">{index + 1}</td>
                                    <td className="border border-slate-700 font-normal text- 2xl:text-lg py-1 hover:text-blue-400">
                                        <Link to={`${item.id}`}>{item.fullName}</Link></td>
                                    <td className="border border-slate-700 font-normal text- 2xl:text-lg py-1">{item.group}</td>
                                    <td className="border border-slate-700 font-normal text- 2xl:text-lg text-red-700 py-1">{formatDebt(item.debt - item.payment)}</td>
                                    <td className="border border-slate-700 font-normal text- 2xl:text-lg text-green-700 py-1">{formatDebt(item.payment)}</td>
                                    <td className="border border-slate-700 font-normal text- 2xl:text-lg py-1">{formatDebt(item.debt)}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan={3}
                                    className="border border-slate-700 font-normal 2xl:text-lg py-2">{contents.debt}</td>
                                <td className="border border-slate-700 font-normal 2xl:text-lg py-2 text-red-700">{getTotalDebt(debtorsData)}</td>
                                <td colSpan={2} className="border border-slate-700 font-normal py-2 text-red-700"></td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DebtorsPage;
