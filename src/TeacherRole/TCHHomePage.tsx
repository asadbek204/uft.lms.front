import {GlobalContext} from "../App";
import {Langs} from "../enums";
import {useContext, useState, useEffect} from "react";
import client from "../components/services";
import {createSwapy} from "swapy";

type TUser = {
    id: number;
    first_name: string;
    last_name: string;
};

type TNewsComponentContent = {
    title1: string;
    title2: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    students: string;
    groups: string;
    lessonT: string
}


const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        title1: "Boshqaruv paneli",
        title2: "Xush kelibsiz,",
        p1: "Bugun",
        p2: "Talabalar soni",
        p3: "Faol guruhlar",
        p4: "Yangi guruhga yig'ilish",
        students: "Talabalar",
        groups: "Guruhlar",
        lessonT: "Bugungi dars"

    }],
    [Langs.RU, {
        title1: "Панель управления",
        title2: "Добро пожаловать,",
        p1: "Сегодня",
        p2: "Количество студентов",
        p3: "Активные группы",
        p4: "Собираемся в новую группу",
        students: "Студенты",
        groups: "Группы",
        lessonT: "Сегодняшний урок"
    }],
    [Langs.EN, {
        title1: "Control Panel",
        title2: "Welcome,",
        p1: "Today",
        p2: "Number of students",
        p3: "Active Groups",
        p4: "Collecting to new group",
        students: "Students",
        groups: "Groups",
        lessonT: " Today's lesson"
    }],
]);

const DEFAULT = {"1": "e", "2": "c", "3": "a", "4": "d", "5": "b"};

function A() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const today = new Date();
    const day = today.getDate(); // Get the day (1-31)
    const month = today.getMonth() + 1; // Get the month (0-11, so we add 1)
    const year = today.getFullYear(); // Get the full year

    const formattedDate = `${day < 10 ? "0" + day : day}.${
        month < 10 ? "0" + month : month
    }.${year}`;

    return (
        <div
            className="item a p-4 w-1/3 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800"
            data-swapy-item="a"
        >
            <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">{contents.p1}</h2>
            <div className="text-black text-xs md:text-5xl dark:text-white">{formattedDate}</div>
        </div>
    );
}

function B() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    return (
        <div
            data-swapy-item="b"
            className="item b p-4 w-1/3 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800"
        >
            <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">
                {contents.p2}
            </h2>
            <div className="space-y-1">
                <div className="gap-2 flex items-end">
                    <h1 className="text-xs md:text-5xl text-black dark:text-white">42</h1>
                    {/*<span className="leading-none text-4xl text-black dark:text-white">{contents.students}          </span>*/}
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
            className="item c p-4 w-1/4 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800"
        >
            <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">
                {contents.p3}
            </h2>
            <div className="space-y-1">
                <div className="gap-2 flex items-end">
                    <h1 className="text-xs md:text-5xl text-black dark:text-white">3</h1>
                    {/*<span className="leading-none text-4xl text-black dark:text-white">{contents.groups}          </span>*/}
                </div>
            </div>
        </div>
    );
}

function D() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    return (
        <div
            data-swapy-item="d"
            className="item d p-4 w-1/3 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800"
        >
            <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">
                {contents.p4}
            </h2>
            <div className="space-y-1">
                <div className="gap-2 flex items-end">
                    <h1 className="text-xs md:text-5xl text-black dark:text-white">7</h1>
                    {/*<span className="leading-none text-4xl text-black dark:text-white">{contents.students}          </span>*/}
                </div>
            </div>
        </div>
    );
}

function E() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    return (
        <div
            data-swapy-item="e"
            className="item e p-4 w-1/3 flex flex-col non-swappable shadow-md rounded-2xl bg-white dark:bg-gray-800"
        >
            <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">
                {contents.lessonT}
            </h2>
            <div className="space-y-1">
                <div className="gap-2 flex items-end">
                    <h1 className="text-xs md:text-5xl text-black dark:text-white">"Try Except"</h1>
                    <span className="leading-none text-xs md:text-5xl text-black dark:text-white">
            for FPS-U-1-22
          </span>
                </div>
            </div>
        </div>
    );
}

function getItemById(itemId: "a" | "b" | "c" | "d" | 'e') {
    switch (itemId) {
        case "a":
            return <A/>;
        case "b":
            return <B/>;
        case "c":
            return <C/>;
        case "d":
            return <D/>;
        case 'e':
            return <E/>;
    }
}

function STHomePage() {
    const {lang, userId} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [student, setStudent] = useState<TUser>({
        id: 0,
        first_name: "string",
        last_name: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await client.get("employees/list/");
                if (!(response.data instanceof Array)) return;
                const matchedUser = response.data.find(
                    (user) => user.user.id === userId
                );
                setStudent(matchedUser.user);
            } catch (error) {
                // console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, [userId]);

    const capitalize = (text: string) => {
        return text.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const slotItems: Record<string, "a" | "b" | "c" | "d" | "e"> =
        localStorage.getItem("slotItemTeacher")
            ? JSON.parse(localStorage.getItem("slotItemTeacher")!)
            : DEFAULT;

    useEffect(() => {
        const container = document.querySelector(".containerer")!;
        const swapy = createSwapy(container, {animation: "dynamic"});

        swapy.onSwap(({data}) => {
            localStorage.setItem("slotItemTeacher", JSON.stringify(data.object));
        });
    }, []);

    return (
        <div className="header w-full mt-12 md:mt-0">
            <div className="mt-5 ms-5">
                <h1 className="2xl:text-4xl text-3xl text-customText font-bold ">
                    {contents.title1}
                </h1>
                <h1 className="mt-2 text-3xl mb-5 md:mb-0 font-bold dark:text-white">
                    {contents.title2} {capitalize(student.first_name)}{" "}
                    {capitalize(student.last_name)}
                </h1>
            </div>

            <div className="w-full 2xl:h-[87%] h-[65%] overflow-y-auto">

            <div className="teacher flex justify-between w-11/12 xl:w-8/12 gap-5 mt-10 mx-auto">
                <div className="containerer">
                    <div className="slot a" data-swapy-slot="1">
                        {getItemById(slotItems["1"])}
                    </div>
                    <div className="second-row">
                        <div className="slot b" data-swapy-slot="2">
                            {getItemById(slotItems["2"])}
                        </div>
                        <div className="slot c" data-swapy-slot="3">
                            {getItemById(slotItems["3"])}
                        </div>
                    </div>
                    <div className="third-row">
                        <div className="slot d" data-swapy-slot="4">
                            {getItemById(slotItems["4"])}
                        </div>
                        <div className="slot e" data-swapy-slot="5">
                            {getItemById(slotItems["5"])}
                        </div>
                    </div>
                </div>
            </div>
           </div>
        </div>
    );
}

export default STHomePage;
