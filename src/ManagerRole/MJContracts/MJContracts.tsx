import {useEffect, useState, useContext, useRef} from "react";
import {GlobalContext} from "../../App";
import {Langs} from "../../enums";
import {Link} from "react-router-dom";
import client from "../../components/services";
import Loading from "../../components/LoadingComponent/Loading";

type User = {
    first_name: string;
    last_name: string;
    sure_name: string;
};

type Document = {
    id: number;
    created_at: string;
    document: {
        file: string;
    };
    manager: number
};

type Group = {
    name: string;
};

type ApiResponse = {
    id: number;
    user: User;
    groups: Group;
    document: Document[];
};

type TDebtors = {
    id: number;
    fullName: string;
    group: string;
    documents: Document[];
};

type TNewsComponentContent = {
    title: string;
    title1: string;
    title2: string;
    title3: string;
    title6: string;
    title7: string;
    title8: string;
    contract: string
};

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        title: "Kontraktlar",
        title1: "F.I.O",
        title2: "Guruh",
        title3: "Qo'shilgan sana",
        title6: "T/r",
        title7: "Yuklab olish",
        title8: "Yuklab olish",
        contract: "Menenjer hali shartnoma tuzmagan"
    }],
    [Langs.RU, {
        title: "Контракты",
        title1: "Ф.И.О",
        title2: "Группа",
        title3: "Дата добавления",
        title6: "Т/р",
        title7: "Скачать",
        title8: "Скачать",
        contract: "Менеджер еще не подписал контракт"
    }],
    [Langs.EN, {
        title: "Contracts",
        title1: "Full name",
        title2: "Group",
        title3: "Added Date",
        title6: "T/r",
        title7: "Download",
        title8: "Download",
        contract: "The manager has not signed a contract yet"
    }],
]);

const topShadow = 'inset 0 10px 10px -10px black'
const bottomShadow = 'inset 0 -10px 10px -10px black'

function MJContracts() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [toggleSearchButton, setToggleSearchButton] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchId, setSearchId] = useState<string>('');
    const [searchFio, setSearchFio] = useState<string>('');
    const [searchGroup, setSearchGroup] = useState<string>('');
    const [debtorsData, setDebtorsData] = useState<TDebtors[]>([]);
    const scrollRef = useRef(null);
    const [scrollShadow, setScrollShadow] = useState<string>('')

    useEffect(() => {
        (async () => {

        })()
    }, []);

    useEffect(() => {
        (async () => {
            // const managerID = (await client.get<Me>('accounts/me/')).data.roles?.manager
            try {
                const response = await client.get<ApiResponse[]>('students/manager/');
                if (response.data instanceof Array) {
                    const data: TDebtors[] = response.data.map((value) => ({
                        id: value.id,
                        fullName: `${value.user.first_name} ${value.user.last_name} ${value.user.sure_name}`,
                        group: value.groups.name,
                        documents: value.document as Document[],
                    }));
                    setDebtorsData(data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setLoading(false);
            }
        })();
    },[]);


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
        <div className="w-full  mt-12 md:mt-0">
            <div className="header  w-full ">
                <div className="my-5 mx-5 flex  align-center justify-between">
                    <div></div>
                    <h1 className="2xl:text-4xl text-3xl ml-5 font-bold  dark:text-customText">{contents.title}</h1>
                    <div className="flex  gap-3 flex-col-reverse items-center md:flex-row md:align-center">
                        <button
                            onClick={() => setToggleSearchButton(!toggleSearchButton)}
                            className="bg-gray-200 md:me-5 hover:bg-gray-300 rounded py-3 px-4"
                        >
                            <i className="fa fa-search"></i>
                        </button>

                        <Link to='/contracts/form-students'>
                            <button
                                className={`py-3 px-4 text-white bg-blue-400 rounded hover:bg-blue-700`}
                            >
                                <i className="fa-solid fa-plus"/>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            {loading ? (<div><Loading/></div> ):
            debtorsData.length > 0 ? (
            <div ref={scrollRef}
            style={{
                boxShadow: scrollShadow
            }}
            className="mx-auto border-x-slate-600 border-collapse 2xl:h-[88%] h-[87%] h-[200px] overflow-y-auto w-11/12">
                   
                        <div className="courses shadow-md flex flex-col gap-7 justify-center content-center">
                            <table
                                className="text-center font-bold text-xl 2xl:text-2xl sm:text-md table-fixed border-collapse border border-slate-500 dark:text-white">
                                <thead>
                                <tr>
                                    <th className="border text-base  border-slate-600 py-2 w-12">{contents.title6}</th>
                                    <th className="border text-base border-slate-600 py-2">
                                        <div className="flex  justify-center gap-3">
                                            {contents.title1}
                                        </div>
                                    </th>
                                    <th className="border text-base border-slate-600 py-2 w-52">
                                        <div className="flex  justify-center align-center gap-3">
                                            {contents.title2}
                                        </div>
                                    </th>
                                    <th className="border text-base border-slate-600 py-2 w-52">
                                        <div className="flex  justify-center align-center gap-3">
                                            {contents.title3}
                                        </div>
                                    </th>
                                    <th className="border text-base border-slate-600 py-2 w-52">
                                        <div className="flex  justify-center align-center gap-3">
                                            {contents.title7}
                                        </div>
                                    </th>
                                    <th className="border text-base border-slate-600 py-2 w-10">
                                        <div className="flex justify-center align-center gap-3">
                                            {/*{contents.title7}*/}
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
                                        <td className="border text-base  border-slate-600 py-2">
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
                                        <td className="border text-base border-slate-600 py-2"></td>
                                    </tr>
                                )}
                                {debtorsData.map((item, index) => (
                                    <tr key={item.id} className="py-4">
                                        <td className="border text-center border-slate-700 font-normal text-lg py-1">{index + 1}</td>
                                        <td className="border text-center border-slate-700 font-normal text-lg py-1 hover:text-blue-400">
                                            <Link to={`${item.id}`}>{item.fullName}</Link>
                                        </td>
                                        <td className="border text-center border-slate-700 font-normal text-lg py-1">{item.group}</td>
                                        <td className="border text-center border-slate-700 font-normal text-lg py-1">{new Date(item.documents[item.documents.length - 1]?.created_at).toISOString().split('T')[0]}</td>
                                        <td className="border text-center border-slate-700 font-normal text-lg py-1">

                                            <a href={item.documents[item.documents.length - 1]?.document.file} download
                                               className="text-blue-500 pointer hover:underline">
                                                {contents.title7}
                                            </a>

                                        </td>
                                        <td className="border text-center border-slate-700 font-normal text-lg py-1">
                                            <Link to={`/new/agreement/${item.documents[item.documents.length-1].id}`}>+</Link>
                                        </td>

                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    
                </div>
           ) : (
            <div className="flex justify-center mt-6 items-center ">
                <p>{contents.contract}</p>
            </div>
        )}
        </div>
    );
}

export default MJContracts;
