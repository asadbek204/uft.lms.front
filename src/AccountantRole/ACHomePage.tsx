import { GlobalContext } from "../App";
import { Langs } from "../enums";
import { useContext } from "react";
import client from "../components/services";
import { useEffect, useState } from "react";
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
  groups: string
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
      groups: "Guruhlar"

  }],
  [Langs.RU, {
      title1: "Панель управления", 
      title2: "Добро пожаловать,",
      p1: "Сегодня",
      p2: "Количество студентов",
      p3: "Активные группы",
      p4: "Собираемся в новую группу",
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
      students: "Students",
      groups: "Groups"
  }],
]);


const DEFAULT = {"1":"b","2":"c","3":"a","4":"d"}
function A() {
  const {lang} = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TNewsComponentContent;
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear(); 

  const formattedDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`; // Format date as DD.MM.YYYY

  return (
      <div className="item a p-4 w-1/3 flex flex-col shadow-md rounded-2xl bg-white dark:bg-gray-800"
           data-swapy-item="a">
          <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">{contents.p1}</h2>
          <div className="text-black text-xl md:text-4xl dark:text-white">{formattedDate}</div>
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          <h2 className="text-xs md:text-xl font-bold mb-4 text-end text-black dark:text-white">{contents.p4}</h2>
          <div className="space-y-1">
              <div className="gap-2 flex items-end">
                  <h1 className="text-xs md:text-5xl text-black dark:text-white">7</h1>
                  {/*<span className="leading-none text-xs md:text-4xl lg:text-5xl text-black dark:text-white">{contents.students}</span>*/}
              </div>
          </div>
      </div>
  )
}


function getItemById(itemId: 'a' | 'b' | 'c' | 'd') {
    switch (itemId) {
        case 'a':
            return <A/>
        case 'b':
            return <B/>
        case 'c':
            return <C/>
        case 'd':
            return <D/>
    }
}

function ACHomePage() {

  const { lang, userId } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TNewsComponentContent;
  const [student, setStudent] = useState<TUser>({id: 0, first_name: 'string', last_name: ""})


  useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await client.get('employees/list/');
            if (!(response.data instanceof Array)) return;
            const matchedUser = response.data.find(user => user.user.id === userId);
            setStudent(matchedUser.user);
        } catch (error) {
          ""
        }
    };
    fetchUser();
}, [userId])


const capitalize = (text: string) => {
  return text.replace(/\b\w/g, char => char.toUpperCase());
};

const slotItems: Record<string, 'a' | 'b' | 'c' | 'd'> = localStorage.getItem('slotItem') ? JSON.parse(localStorage.getItem('slotItem')!) : DEFAULT
    useEffect(() => {
        const container = document.querySelector('.containerer')!
        const swapy = createSwapy(container, {animation: 'dynamic'})

        swapy.onSwap(({data}) => {
            localStorage.setItem('slotItem', JSON.stringify(data.object))
        })
    }, [])

  return (
    <div className="header w-full  mt-12 md:mt-0">
      <div className="mt-5 ms-5">
        <h1 className="2xl:text-4xl text-xl text-customText font-bold ">
          {contents.title1}
        </h1>
        <h1 className="mt-2 mb-4 2xl:text-3xl text-xl  font-bold dark:text-white">
        {contents.title2} {capitalize(student.first_name)} {capitalize(student.last_name)}
        </h1>
      </div>
      <div className="w-full 2xl:h-[87%] h-[65%] overflow-y-auto">

      <div className="accountant flex justify-between w-11/12 xl:w-8/12 gap-5 mt-20 mx-auto">
        <div className="containerer">
          <div className="slot a" data-swapy-slot="1">
            {getItemById(slotItems['1'])}
          </div>
          <div className="second-row ">
            <div className="slot b" data-swapy-slot="2">
              {getItemById(slotItems['2'])}
            </div>
            <div className="slot c" data-swapy-slot="3">
              {getItemById(slotItems['3'])}
            </div>
          </div>
          <div className="slot d" data-swapy-slot="4">
            {getItemById(slotItems['4'])}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default ACHomePage;
