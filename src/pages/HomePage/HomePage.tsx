/* eslint-disable @typescript-eslint/no-explicit-any */
import {GlobalContext} from "../../App";
import {Langs} from "../../enums"
import {useContext, useEffect, useState} from "react";
import client from "../../components/services";
import {createSwapy} from "swapy";

type TNewsComponentContent = {
    title1: string;
    title2: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    p5: string;
    p6: string;
    students: string;
    groups: string
}

type TUser = {
    first_name: string;
    last_name: string;
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        title1: "Boshqaruv paneli",
        title2: "Xush kelibsiz,",
        p1: "Bugun",
        p2: "Talabalar soni",
        p3: "Faol guruhlar",
        p4: "Yangi guruhga yig'ilish",
        p5: "Guruhga qo'shilish",
        p6: "Bu oydagi talabalar soni",
        students: "Talabalar",
        groups: "Guruhlar",

    }],
    [Langs.RU, {
        title1: "Панель управления",
        title2: "Добро пожаловать,",
        p1: "Сегодня",
        p2: "Количество студентов",
        p3: "Активные группы",
        p4: "Собираемся в новую группу",
        p5: "Присоединяйтесь к группе",
        p6: "Количество студентов в этом месяце",
        students: "Студенты",
        groups: "Группы"
    }],
    [Langs.EN, {
        title1: "Control Panel",
        title2: "Welcome,",
        p1: "Today",
        p2: "Number of students",
        p3: "Active Groups",
        p4: "Collecting to new group",
        p5: "Join the group",
        p6: "Number of students this month",
        students: "Students",
        groups: "Groups"
    }],
]);

const DEFAULT = {"1": "c", "2": "b", "3": "a", "4": "d", "5": "i"}

function A() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const formattedDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`; // Format date as DD.MM.YYYY

    return (
        <div className="item a p-4 w-1/3 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800" data-swapy-item="a">
        <h2 className="text-sm md:text-xl font-bold mb-4 text-end text-black dark:text-white">{contents.p1}</h2>
        <div className="text-xs md:text-5xl text-black dark:text-white">{formattedDate}</div>
    </div>
    )
}

function B() {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [activeStudentCount, setActiveStudentCount] = useState<number>(0);
  
    useEffect(() => {
      const fetchActiveStudents = async () => {
        try {
          const response = await client.get('students/payment/list/');
          const activeStudents = response.data.filter((studentData: any) => studentData.student.status === "active");
          setActiveStudentCount(activeStudents.length);
        } catch (error) {
          console.error("Error fetching students:", error);
          setActiveStudentCount(0); 
        }
      };
  
      fetchActiveStudents();
    }, []);
  
    return (
      <div data-swapy-item="b" className="item b p-4 w-1/3 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800">
        <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">
          {contents.p2}
        </h2>
        <div className="space-y-1">
          <div className="gap-2 flex items-end">
            <h1 className="text-xs md:text-5xl text-black dark:text-white">
              {activeStudentCount} 
            </h1>
          </div>
        </div>
      </div>
    );
  }
  

function C() {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
  
    const [groupCount, setGroupCount] = useState<number>(0);
  
    useEffect(() => {
      const fetchGroups = async () => {
        try {
          const response = await client.get("education/group/list/?needed_role=admin");
          const groups = response.data;
  
          const activeGroups = groups.filter((el: { status: boolean; }) => el.status === true); // Faol guruhlarni tanlash
          setGroupCount(activeGroups.length); 
        } catch (error) {
          console.error("Error fetching groups:", error);
          setGroupCount(0); 
        }
      };
  
      fetchGroups();
    }, []);
  
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
            <h1 className="text-xs md:text-5xl text-black dark:text-white">
              {groupCount}
            </h1>
          </div>
        </div>
      </div>
    );
  }
  


function D() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    return (
        <div data-swapy-item="d" className="item d p-4 w-1/3 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800">
    <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">
        {contents.p6}
    </h2>
    <div className="space-y-1">
        <div className="gap-2 flex items-end">
            <h1 className="text-xs md:text-5xl text-black dark:text-white">17</h1>
           
        </div>
    </div>
</div>
    )
}

function I() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    return (
        <div data-swapy-item="i" className="item i shadow-md overflow-x-scroll flex rounded-2xl gap-1 md:gap-3 bg-white dark:bg-gray-800 p-2 md:p-4">
            <div
                className="p-2 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800 border-2 dark:border-slate-600">
                <h2 className="text-xs md:text-lg font-bold mb-0 text-center text-black dark:text-white">{contents.p4}</h2>
                <h2 className="text-xs md:text-lg font-bold mb-4 text-center text-black dark:text-white">C#-U-1-25</h2>
                <div className="space-y-1">
                    <div className="gap-1 flex justify-center">
                        <h1 className="text-xs md:text-3xl text-black dark:text-white">5/16</h1>
                        {/*<span className="text-2xl leading-2 text-black dark:text-white">Students</span>*/}
                    </div>
                </div>
            </div>
            <div
                className="p-2 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800 border-2 dark:border-slate-600">
                <h2 className="text-xs md:text-lg font-bold mb-0 text-center text-black dark:text-white">{contents.p4}</h2>
                <h2 className="text-xs md:text-lg font-bold mb-4 text-center text-black dark:text-white">AI-U-2-25</h2>
                <div className="space-y-1">
                    <div className="gap-1 flex justify-center">
                        <h1 className="text-xs md:text-3xl text-black dark:text-white">5/16</h1>
                        {/* <span className="text-2xl leading-2 text-black dark:text-white">Students</span> */}
                    </div>
                </div>
            </div>
            <div
                className="p-2 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800 border-2 dark:border-slate-600">
                <h2 className="text-xs md:text-lg font-bold mb-0 text-center text-black dark:text-white">{contents.p4}</h2>
                <h2 className="text-xs md:text-lg font-bold mb-4 text-center text-black dark:text-white">FSP-R-2-25</h2>
                <div className="space-y-1">
                    <div className="gap-1 flex justify-center">
                        <h1 className="text-xs md:text-3xl text-black dark:text-white">5/16</h1>
                        {/*<span className="text-2xl leading-2 text-black dark:text-white">Students</span>*/}
                    </div>
                </div>
            </div>
            <div
                className="p-2 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800 border-2 dark:border-slate-600">
                <h2 className="text-xs md:text-lg font-bold mb-0 text-center text-black dark:text-white">{contents.p4}</h2>
                <h2 className="text-xs md:text-lg font-bold mb-4 text-center text-black dark:text-white">FSP-U-5-25</h2>
                <div className="space-y-1">
                    <div className="gap-1 flex justify-center">
                        <h1 className="text-xs md:text-3xl text-black dark:text-white">5/16</h1>
                        {/*<span className="text-2xl leading-2 text-black dark:text-white">Students</span>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}

function getItemById(itemId: 'a' | 'b' | 'c' | 'd' | 'i') {
    switch (itemId) {
        case 'a':
            return <A/>
        case 'b':
            return <B/>
        case 'c':
            return <C/>
        case 'd':
            return <D/>
        case 'i':
            return <I/>
    }
}


function HomePage() {
    const { lang, userId } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [user, setUser] = useState<TUser>({ first_name: '', last_name: '' });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await client.get('accounts/me/');
                setUser(response.data as TUser);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, [userId]);

    const slotItems: Record<string, 'a' | 'b' | 'c' | 'd' | 'i'> = localStorage.getItem('slotItem')
        ? JSON.parse(localStorage.getItem('slotItem')!)
        : DEFAULT;

    useEffect(() => {
        const container = document.querySelector('.containerer')!;
        const swapy = createSwapy(container, { animation: 'dynamic' });

        swapy.onSwap(({ data }) => {
            localStorage.setItem('slotItem', JSON.stringify(data.object));
        });
    }, []);

    return (
        <div className="w-full mt-12 md:mt-0">
            {/* Header */}
            <div className="mt-5 ms-5">
                <h1 className="text-xl md:text-3xl lg:text-4xl text-customText font-bold">
                    {contents.title1}
                </h1>
                <h1 className="mt-2 mb-5 text-xl md:text-3xl font-bold dark:text-white">
                    {contents.title2} {user.first_name} {user.last_name}
                </h1>
            </div>

            {/* Main Container */}
            <div className="w-full 2xl:h-[87%] h-[65%] overflow-y-auto">
                <div className=" flex justify-center ">
                    <div className="containerer grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                        <div className="slot" data-swapy-slot="1">
                            {getItemById(slotItems['1'])}
                        </div>

                        <div className="flex xl:flex-row flex-col gap-5">
                            <div className="slot" data-swapy-slot="2">
                                {getItemById(slotItems['2'])}
                            </div>

                            <div className="slot" data-swapy-slot="3">
                                {getItemById(slotItems['3'])}
                            </div>
                        </div>

                        <div className="slot" data-swapy-slot="5">
                            {getItemById(slotItems['5'])}
                        </div>

                        <div className="slot" data-swapy-slot="4">
                            {getItemById(slotItems['4'])}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
