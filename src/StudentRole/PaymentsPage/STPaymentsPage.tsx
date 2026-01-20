import { useEffect, useState, useContext } from "react";
import arrowSort from "../../images/arrow-sort-default.svg";
import Loading from "../../components/LoadingComponent/Loading.tsx";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import sv1 from "../../images/s1.svg";
import sv2 from "../../images/s2.svg";
import client from "../../components/services";

type TPayment = {
  id: number;
  amount: number;
  date: string;
  total_payment: number;
};

type TModule = {
  name: string;
  debt: number;
  discount: { discount: string }[];
  payments: TPayment[];
  total_payment: number;
};

type TDebtors = {
  id: number;
  student: {
    full_name: string;
  };
  total_debt: number;
  modules: TModule[];
  total_payment: number
};

const defaultDebtor: TDebtors = {
  id: 0,
  student: {
    full_name: "",
  },
  total_debt: 0,
  modules: [],
  total_payment: 0
};

type TNewsComponentContent = {
  title: string;
  title1: string;
  title2: string;
  title3: string;
  title4: string;
  title5: string;
  title6: string;
  debt: string;
  clock: string;
  error1: string;
};

const contentsMap = new Map<Langs, TNewsComponentContent>([
  [
    Langs.UZ,
    {
      title: "To'lovlar",
      title1: "F.I.O",
      title2: "Sana",
      title3: "Qarzdorlik",
      title4: "To'langan",
      title5: "Hisob",
      title6: "T/r",
      debt: "Jami:",
      clock: "Soat",
      error1: "Hali to'lanmagan",
    },
  ],
  [
    Langs.RU,
    {
      title: "Платежи",
      title1: "Ф.И.О",
      title2: "Дата",
      title3: "Задолженность",
      title4: "Оплаченный",
      title5: "Баланс",
      title6: "Т/р",
      debt: "Общee:",
      clock: "Час",
      error1: "Еще не оплачено",
    },
  ],
  [
    Langs.EN,
    {
      title: "Payments",
      title1: "Full name",
      title2: "Date",
      title3: "Debt",
      title4: "Paid",
      title5: "Balance",
      title6: "T/r",
      debt: "Total:",
      clock: "Hour",
      error1: "Not paid yet",
    },
  ],
]);

function STDebtorsPage() {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TNewsComponentContent;
  const [loading, setLoading] = useState<boolean>(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({ key: "", direction: "" });
  const [debtorData, setDebtorData] = useState<TDebtors>(defaultDebtor);
  const [showList, setShowList] = useState(false);
  const [sortedPayments, setSortedPayments] = useState<TPayment[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await client.get("students/payment/list/");
      console.log(response.data, 'raw response');

      // API dan kelayotgan struktura: array ichida array
      const realData = response.data?.[0]?.[0];   // ← mana bu muhim

      if (realData) {
        setDebtorData({
          id: realData.id || 0,                    // agar id bo‘lmasa
          student: realData.student || { full_name: "" },
          total_debt: realData.total_debt || 0,
          total_payment: realData.total_payment || 0,
          modules: realData.modules || [],
        });
      } else {
        console.warn("Ma'lumot topilmadi");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };
  fetchData();
}, []);

  useEffect(() => {
    if (debtorData.modules.length > 0) {
      setSortedPayments([...debtorData.modules[0].payments]);
    }
  }, [debtorData]);

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sorted = [...sortedPayments].sort((a, b) => {
      if (key === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return direction === "ascending"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else {
        return direction === "ascending"
          ? (a[key as keyof TPayment] as number) -
              (b[key as keyof TPayment] as number)
          : (b[key as keyof TPayment] as number) -
              (a[key as keyof TPayment] as number);
      }
    });

    setSortedPayments(sorted);
  };

  const formatDebt = (debt: number) => {
    return new Intl.NumberFormat("de-DE").format(debt);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    setIsScrolled(target.scrollTop > 0);
  };

  return (
    <div className="w-full mt-12 md:mt-0">
      <div className="container">
        <div className="my-5 flex justify-between ">
          <div />
          <h1 className="2xl:text-4xl text-center text-xl font-bold  dark:text-customText">
            {contents.title}
          </h1>
          <button
            onClick={() => setShowList(!showList)}
            className="py-2 px-4 mr-5  bg-blue-400 text-white rounded"
          >
            {showList ? <img src={sv1} alt="" /> : <img src={sv2} alt="" />}
          </button>
        </div>
      </div>
      <div className="2xl:h-[88%] h-[75%]  overflow-y-auto">
        {loading ? (
          <Loading />
        ) : showList ? (
          <div className="px-10 py-4 flex flex-col gap-1 justify-center content-center">
            {debtorData?.modules[0]?.payments.length > 0 ? (
              debtorData.modules[0].payments.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between bg-white dark:bg-gray-700 rounded shadow-md p-4 mb-4"
                >
                  <div className="text-lg dark:text-white">
                    {item.date.split("T")[0]}
                  </div>
                  <div className="dark:text-white">
                    {contents.clock}: {item.date.split("T")[1].slice(0, 8)}
                  </div>
                  <div className="dark:text-white">
                    {contents.title4}:{" "}
                    <span className="text-green-600">+{item.amount}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-lg text-red-500 dark:text-red-400">
                {contents.error1}
              </div>
            )}
          </div>
        ) : (
          <div
            className="mx-auto border-x-slate-600 border-collapse 2xl:h-[88%] h-[87%] h-[460px] overflow-y-auto w-11/12"
            onScroll={handleScroll}
            style={{
              boxShadow: isScrolled
                ? "black 0px 10px 10px -10px inset, black 0px -10px 10px -10px inset"
                : "none",
            }}
          >
            <table className="text-center font-bold text-xl 2xl:text-2xl sm:text-md mx-auto table-fixed border-collapse border border-slate-500 dark:text-white">
              <thead>
                <tr>
                  <th className="border text-base border-slate-600 py-2 w-12">
                    {contents.title6}
                  </th>
                  <th className="border text-base border-slate-600 py-2 2xl:w-96 w-80">
                    <div className="flex  bold justify-center align-center gap-3">
                      {contents.title1}
                    </div>
                  </th>
                  <th className="border text-base border-slate-600 py-2 w-44">
                    <div className="flex  justify-center align-center gap-3">
                      {contents.title2}
                      <button onClick={() => handleSort("date")}>
                        <img
                          className="filter dark:invert"
                          src={arrowSort}
                          alt=""
                        />
                      </button>
                    </div>
                  </th>
                  <th className="border text-base border-slate-600 py-2 2xl:w-48 w-40">
                    <div className="flex  justify-center align-center gap-3">
                      {contents.title4}
                      <button onClick={() => handleSort("amount")}>
                        <img
                          className="filter dark:invert"
                          src={arrowSort}
                          alt="..."
                        />
                      </button>
                    </div>
                  </th>
                  <th className="border text-base border-slate-600 py-2 2xl:w-60 w-44">
                    <div className="flex  justify-center align-center gap-3">
                      {contents.title3}
                    </div>
                  </th>
                  <th className="border text-base border-slate-600 py-2 2xl:w-60 w-48">
                    <div className="flex  justify-center align-center gap-3">
                      {contents.title5}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="py-4">
                  <td className="border border-slate-700 font-normal text-2xl py-1"></td>
                  <td className="border border-slate-700 font-normal text-2xl py-1">
                    {debtorData?.student.full_name}
                  </td>
                  <td className="border border-slate-700 font-normal text-2xl py-1">
                    0
                  </td>
                  <td className="border border-slate-700 font-normal text-2xl text-green-700 py-1">
                    0
                  </td>
                  <td className="border border-slate-700 font-normal text-2xl text-red-700 py-1">
                    {formatDebt(debtorData?.total_debt - debtorData?.total_payment)}
                  </td>
                  <td className="border border-slate-700 font-normal text-2xl py-1">
                    {formatDebt(debtorData?.total_debt)}
                  </td>
                </tr>
                {sortedPayments.map((item, index) => (
                  <tr key={item.id} className="py-4">
                    <td className="border border-slate-700 font-normal text-2xl py-1">
                      {index + 1}
                    </td>
                    <td className="border border-slate-700 font-normal text-2xl py-1">
                      {debtorData?.student.full_name}
                    </td>
                    <td className="border border-slate-700 font-normal text-2xl py-1">
                      {item.date.split("T")[0]}
                    </td>
                    <td className="border border-slate-700 font-normal text-2xl text-green-700 py-1">
                      {formatDebt(item.amount)}
                    </td>
                    <td className="border border-slate-700 font-normal text-2xl text-red-700 py-1">
                      {formatDebt(debtorData.total_debt - item.amount)}
                    </td>
                    <td className="border border-slate-700 font-normal text-2xl py-1">
                      {formatDebt(debtorData?.total_debt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default STDebtorsPage;
