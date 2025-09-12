import { GlobalContext } from "../App";
import { Langs } from "../enums";
import { useContext, useEffect, useState } from "react";
import client from "../components/services";
import { Link } from "react-router-dom";
import { createSwapy } from "swapy";

type TStudent = {
  id: number;
  first_name: string;
  last_name: string;
};

type TNewsComponentContent = {
    title1: string;
    title2: string;
    btn: string;
    data: string;
    task: string;
    lesson: string;
  }

const contentsMap = new Map<Langs, TNewsComponentContent>([
  [
    Langs.UZ,
    {
      title1: "Boshqaruv paneli",
      title2: "Xush kelibsiz,",
      btn: "Kabinetga kirish",
      data: "Bugun",
      task: "Oxirgi vazifa",
      lesson: "Keyingi dars",
    },
  ],
  [
    Langs.RU,
    {
      title1: "Панель управления",
      title2: "Добро пожаловать,",
      btn: "Войти в кабинет",
      data: "Сегодня",
      task: "Последняя задача",
      lesson: "Следующий урок",
    },
  ],
  [
    Langs.EN,
    {
      title1: "Control Panel",
      title2: "Welcome,",
      btn: "Enter the cabinet",
      data: "Today",
      task: "Last task",
      lesson: "Next lesson",
    },
  ],
    ])

const DEFAULT = { "1": "a", "2": "b", "3": "c" };

function A() {
  const {lang} = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TNewsComponentContent;
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const formattedDate = `${day < 10 ? "0" + day : day}.${
    month < 10 ? "0" + month : month
  }.${year}`;

  return (
    <div
      className="item a p-4 w-1/3 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800"
      data-swapy-item="a"
    >
      <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">{contents.data}</h2>

      <div className="text-black text-xl md:text-4xl dark:text-white">{formattedDate}</div>
    </div>
  );
}

function B() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
  return (
    <div
      data-swapy-item="b"
      className="item b p-4 w-1/3 h-96 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800"
    >
      <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">{contents.lesson}</h2>
      <div className="md:flex items-center space-x-4">
        {/*<div className="2xl:w-5/6 w-full flex justify-center md:block mb-2 md:mb-0">*/}
        <img
          src="https://via.placeholder.com/150"
          alt="Article"
          className="w-16 h-16 rounded mx-auto"
        />
        {/*</div>*/}
        <div>
          <h3 className="font-semibold text-sm text-black dark:text-white">BlockchainReporter</h3>
          <p className="text-xs md:text-sm text-black dark:text-white">
            Bitcoin Whale Holdings Indicating Growing Investor Confidence
          </p>
          <div className="md:flex items-center text-sm text-gray-500 space-x-2">
            <span className="text-black dark:text-white">Jul 20</span>
            <span className="text-black dark:text-white">•</span>
            <span className="text-black dark:text-white">15 room</span>
            <span className="text-black dark:text-white">•</span>
            <span className="text-black dark:text-white">0 comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function C() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    
  return (
    <div
      data-swapy-item="c"
      className="item c p-4 w-4/5 shadow-md rounded-2xl bg-white dark:bg-gray-800 flex flex-col"
    >
      <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">{contents.task}</h2>
      <div className="space-y-2">
        <div className="flex gap-1 text-sm items-center">
          <span className="text-black dark:text-white">1</span>
          <span className="text-black dark:text-white">What is Variables ?</span>
        </div>
        <div className="flex gap-1 text-xs md:text-sm items-center">
          <span className="text-black dark:text-white">2</span>
          <span className="text-black dark:text-white">What's the difference between for and while loop? </span>
        </div>
      </div>
    </div>
  );
}

function getItemById(itemId: "a" | "b" | "c") {
  switch (itemId) {
    case "a":
      return <A />;
    case "b":
      return <B />;
    case "c":
      return <C />;
  }
}

function STHomePage() {
  const { lang, userId } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as {
    title1: string;
    title2: string;
    btn: string;
  };
  const [student, setStudent] = useState<TStudent | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await client.get("students/me/");
        
        setStudent(response.data[0]);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchUser();
  }, [userId]);




  const slotItems: Record<string, "a" | "b" | "c"> = localStorage.getItem(
    "slotItemStudent"
  )
    ? JSON.parse(localStorage.getItem("slotItemStudent")!)
    : DEFAULT;
  useEffect(() => {
    const container = document.querySelector(".containerer")!;
    const swapy = createSwapy(container, { animation: "dynamic" });

    swapy.onSwap(({ data }) => {
      localStorage.setItem("slotItemStudent", JSON.stringify(data.object));
    });
  }, []);

  const capitalize = (str: string) => {
    if (typeof str !== "string" || !str) return ""; // Return empty string if not a string or is empty
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/\s+/g, " ");
  };



  return (
    <div className="header w-full mt-12 md:mt-0">
      <div className="mt-5 ms-5">
        <h1 className="2xl:text-4xl text-xl md:text-3xl text-customText font-bold ">
          {contents.title1}

        </h1>
        <h1 className="mt-2 text-xl md:text-3xl font-bold dark:text-white">
          {contents.title2} {student ? capitalize(student.first_name) : ""}{" "}
          {student ? capitalize(student.last_name) : ""}
        </h1>
      </div>

      <Link to={`/debts/${student?.id}`}>
        <button className="mt-10 mb-3 md:mb-0 px-3 ml-10 py-2 text-sm lg:text-base text-white bg-blue-400 rounded hover:bg-blue-700">
          {contents.btn}
        </button>
      </Link>


      <div className="w-full 2xl:h-[85%] h-[70%] overflow-y-auto">
      <div className="student flex justify-between w-11/12 xl:w-8/12 gap-5 mt-8 mx-auto flex-col">

        <div className="containerer bg-gradient-radial from-[#F5F5FF] to-[#EAEAEA] via-[#EBF2FF]">
          <div className="second-row">
            <div className="slot b" data-swapy-slot="2">
              {getItemById(slotItems["2"])}
            </div>
            <div className="slot c" data-swapy-slot="3">
              {getItemById(slotItems["3"])}
            </div>
          </div>
          <div className="slot a" data-swapy-slot="1">
            {getItemById(slotItems["1"])}
          </div>
        </div>
      </div>
    </div>
     </div>
  );
}

export default STHomePage;
