import  {ReactNode} from "react";
import CoursePage from './pages/CoursesPage/CoursePage';
import TeachersPage from './pages/TeachersPage/TeachersPage';
import GroupsPage from './pages/GroupsPage/GroupsPage';
import DebtorsPage from './pages/DebtorsPage/DebtorsPage';
import VideosPageList from './pages/VideosPage/VideosPageList';
import TopicsPage from './pages/TopicsPage/TopicsPage';
import AttendancePage from './pages/AttendancePage/AttendancePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ChangePasswordPage from './pages/ChangePassword/ChangePasswordPage';
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage';
import AddEmployee from './pages/StuffList/AddUsers/AddEmployee';
import TeachersPageList from "./pages/TeachersPage/TeacherPageList/TeachersPageList.tsx";
import GroupDetailPage from "./pages/TeachersPage/TeacherPageList/GroupDetailPage/GroupDetailPage.tsx";
// import StudentDetailPage from "./pages/TeachersPage/TeacherPageList/StudentDetailPage/StudentDetailPage.tsx";
import VideosModuleList from "./pages/VideosPage/VideosModuleList/VideosModuleList.tsx";
import VideoListItems from "./pages/VideosPage/VideosModuleList/VideoListItems/VideoListItems.tsx";
import NewsSingle from './pages/News/New/NewSingle/NewSingle.tsx';
import News from "./pages/News/News.tsx";
import GroupSingle from './pages/GroupsPage/GroupSingle/GroupSingle.tsx';
// import GroupSingleUsers from './pages/GroupsPage/GroupSingle/GroupSingleUsers/GroupSingleUsers.tsx'
import Login from './pages/Login/Login'
import Forgot from './pages/Forgot/Forgot.tsx';
// import DebtorsPageUsers from './pages/DebtorsPage/DebtorsPageUsers/DebtorsPageUsers.tsx'
import AttendanceTablePage from "./pages/AttendancePage/AttendanceTablePage/AttendanceTablePage.tsx";
import {Roles} from './enums'
import {GlobalContext} from "../src/App.tsx";
import {Langs} from "../src/enums.ts"
import {useContext} from 'react';
import {Link, Route, Routes} from 'react-router-dom';
import HomePage from "./pages/HomePage/HomePage.tsx";
import LibraryPage from "./pages/LibraryPage/LibraryPage.tsx";
import MJHomePage from './ManagerRole/MJHomePage.tsx';
import MJContacts from './ManagerRole/MJContracts/MJContracts.tsx'
import ShopPage from "./pages/ShopPage/ShopPage.tsx";
// import MJContactsDetail from './ManagerRole/MJContracts/MJContractsDetail/MJContactsDetail.tsx';
import ShopItemsPage from "./pages/ShopPage/ShopItems/ShopItemsPage.tsx";

import TCHTopicsPage from './TeacherRole/TCHTopicsPage/TChTopicsPage.tsx';
import TCHVideos from './TeacherRole/TCHVideosPage/TCHVideosModule/TCHVideos/TCHVideos.tsx';
import TCHHomePage from './TeacherRole/TCHHomePage.tsx';
import TCHGroupPage from './TeacherRole/TCHGroupPage/TCHGroupPage.tsx';
import TCHGroupList from './TeacherRole/TCHGroupPage/TCHGroupList/TCHGroupList.tsx';
// import TCHGroupInform from './TeacherRole/TCHGroupPage/TCHGroupList/TCHGroupInform/TCHGroupInform.tsx';
import TCHAttandancePage from './TeacherRole/TCHAttendancePage/TCHAttandancePage.tsx';
import TCHAttendanceDetailPage from "./TeacherRole/TCHAttendancePage/TCHAttendanceDetailPage/TCHAttendanceDetailPage.tsx";
import TCHShedule from "./TeacherRole/TCHShedulePage/TCHShedulePage.tsx";
import TCHTopicsSingle from "./TeacherRole/TCHTopicsPage/TCHTopicsSingle/TCHTopicsSingle.tsx";
import TCHTopicsSingleDetail from './TeacherRole/TCHTopicsPage/TCHTopicsSingle/TCHTopicsSingleDetail/TCHTopicsSingleDetail.tsx'
import TCHSheduleSingle from "./TeacherRole/TCHShedulePage/TCHSchedule/TCHSchedule.tsx"

import STHomePage from "./StudentRole/STHomePage.tsx";
import STPaymentsPage from './StudentRole/PaymentsPage/STPaymentsPage'
import STAttendancePages from './StudentRole/AttendancePage/STAttendancePage.tsx'
import STAttendanceList from './StudentRole/AttendancePage/AttendanceList/STAttendenceList.tsx'
// import STLibraryPage from './StudentRole/LibraryPage/STLibraryPage.tsx'
import STTopics from './StudentRole/TopicsPage/TopicsModulePage/TopicsModulePage.tsx'
import STTopicsItem from './StudentRole/TopicsPage/TopicsModulePage/TopicsModuleVideos/TopicsModuleItems.tsx'
import STToicsDetails from './StudentRole/TopicsPage/TopicsModulePage/TopicsModuleVideos/TopicDetailPage/TopicDetailPage.tsx'

import ACHomePage from './AccountantRole/ACHomePage.tsx';
import ACTeachers from './AccountantRole/ACTeachers/ACTeachers.tsx';
import ACDebts from './AccountantRole/ACDebts/ACDebts.tsx'
import STTopicGroups from "./StudentRole/TopicsPage/STTopicGroups.tsx";
import StudentsForm from "./StudentsForm.tsx";
import STVideoGroups from "./StudentRole/VideosPage/STVideoGroups.tsx";
import StVIdeoModuletems from "./StudentRole/VideosPage/VideoModulsPage/StVIdeoModule.tsx";
import STVideo from "./StudentRole/VideosPage/VideoModulsPage/Videos/STVideo.tsx";
import StudentDetailPageAll from './pages/StudentDetailPage/StudentDetailPage.tsx';
import ShopDetail from "./StudentRole/ShopDetail/ShopDetail.tsx";
import OrderList from "./StudentRole/ShopDetail/OrderList.tsx";
import TCHTopicsAttendance from "./TeacherRole/TCHTopicsPage/TCHTopicsSingle/TCHTopicsSingleDetail/TCHTopicsAttendance.tsx";
import StudentsFormWithId from "./StudentsFormWithId.tsx";
import StaffList from "./pages/StuffList/StuffList.tsx";
import ManagerStudentsForm from "./ManagerRole/ManagerStudentsForm.tsx";
import MJContractNewModule from "./ManagerRole/MJContracts/MJContractNewModule.tsx";
import AttachContractModal from "./pages/StudentDetailPage/AttachContractModal.tsx";

type TNewsComponentContent = {
    title: string;
    error: string;
    toback: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([

    [Langs.UZ, {
        title: "404 - Sahifa topilmadi",
        error: "Siz izlayotgan sahifa mavjud emas",
        toback: "Bosh sahifaga qaytish"
    }],
    [Langs.RU, {
        title: "404 - Страница не найдена",
        error: "Страница, которую вы ищете, не существует",
        toback: "Вернуться на главную страницу"
    }],
    [Langs.EN, {
        title: "404 - Page not found",
        error: "The page you are looking for does not exist",
        toback: "Return to home page"
    }],
]);


function Page404() {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;


    setTimeout(() => {
        window.location.pathname = '/'
    }, 2000)

    return (
        <div className="w-full not-found-container flex flex-col items-center justify-center">
            <h1 className="text-6xl mb-10 text-black dark:text-white">{contents.title}</h1>
            <p className="text-xl mb-10 text-black dark:text-white">{contents.error}</p>
            <Link className="bg-blue-500 py-5 px-8 rounded text-black dark:text-white" to="/">
                {contents.toback}
            </Link>
        </div>
    );

}

const admin: ReactNode = (
    <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/courses" element={<CoursePage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/teachers" element={<TeachersPage/>}/>
        <Route path="/teachers/:id" element={<TeachersPageList/>}/>
        <Route path="/teachers/groups/:id" element={<GroupDetailPage/>}/>
        <Route path="/teachers/groups/:id/students-form" element={<StudentsFormWithId/>}/>
        <Route path="/teachers/group/student/:id" element={<StudentDetailPageAll/>}/>
        <Route path="/groups" element={<GroupsPage/>}/>
        <Route path='/groups/:id' element={<GroupSingle/>}/>
        <Route path='/groups/:id/students-form' element={<StudentsFormWithId/>}/>
        <Route path='/groups/:id/:id' element={<StudentDetailPageAll/>}/>
        <Route path="/debts" element={<DebtorsPage/>}/>
        <Route path="/videos" element={<VideosPageList/>}/>
        <Route path="/videos/:groupId" element={<VideosModuleList/>}/>
        <Route path="/videos/:groupId/:id" element={<VideoListItems/>}/>
        <Route path="/topics" element={<TopicsPage/>}/>
        <Route path="/attendance" element={<AttendancePage/>}/>
        <Route path="/attendance/:id" element={<AttendanceTablePage/>}/>
        <Route path='/change-password' element={<ChangePasswordPage/>}/>
        <Route path='/reset-password' element={<ResetPasswordPage/>}/>
        <Route path='/stafflist' element={<StaffList/>}/>
        <Route path='/stafflist/addstaff' element={<AddEmployee/>}/>
        <Route path='/news' element={<News/>}/>
        <Route path='/news/:id' element={<NewsSingle/>}/>
        <Route path='/students-form' element={<StudentsForm/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot' element={<Forgot/>}/>
        <Route path='/library' element={<LibraryPage/>}/>
        <Route path='/shop' element={<ShopPage/>}/>
        <Route path='/shop/:id' element={<ShopItemsPage/>}/>
        <Route path='/debts/:id' element={<StudentDetailPageAll/>}/>
        <Route path="/student/:id/attach-contract" element={<AttachContractModal/>}/>
        <Route path='*' element={<Page404/>}/>

    </Routes>);

const student: ReactNode = (
    <Routes>
        <Route path="/" element={<STHomePage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/videos" element={<STVideoGroups/>}/>
        <Route path="/videos/:id" element={<StVIdeoModuletems/>}/>
        <Route path="/videos/:id/:courseId" element={<STVideo/>}/>
        <Route path="/topics" element={<STTopicGroups/>}/>
        <Route path="/topics/:id" element={<STTopics/>}/>
        <Route path='/topics/:id/:moduleId' element={<STTopicsItem/>}/>
        <Route path="/topics/lesson/:courseId" element={<STToicsDetails/>}/>
        <Route path="/attendance" element={<STAttendancePages/>}/>
        <Route path="/attendance/:id" element={<STAttendanceList/>}/>
        <Route path='/change-password' element={<ChangePasswordPage/>}/>
        <Route path='/reset-password' element={<ResetPasswordPage/>}/>
        <Route path='/news' element={<News/>}/>
        <Route path='/news/:id' element={<NewsSingle/>}/>
        {/* <Route path='/library' element={<STLibraryPage/>}/> */}
        <Route path='/library' element={<LibraryPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot' element={<Forgot/>}/>
        <Route path='/debts/:id' element={<StudentDetailPageAll/>}/>
        <Route path='/payments' element={<STPaymentsPage/>}/>
        <Route path='/shop' element={<ShopPage/>}/>
        <Route path='/shop/:id' element={<ShopItemsPage/>}/>
        <Route path='/shop/buy/:id' element={<ShopDetail/>}/>
        <Route path='/shop/orders/list/' element={<OrderList/>}/>
        <Route path='*' element={<Page404/>}/>
    </Routes>);

const teacher: ReactNode = (
    <Routes>
        <Route path="/" element={<TCHHomePage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/videos" element={<TCHVideos/>}/>
        {/*<Route path="/videos/:id" element={<TCHVideosModulePage/>}/>*/}
        <Route path="/videos/:id/:id" element={<TCHVideos/>}/>
        <Route path="/topics" element={<TCHTopicsPage/>}/>
        <Route path="/topics/:id" element={<TCHTopicsSingle/>}/>
        <Route path="/topics/:groupId/:id" element={<TCHTopicsSingleDetail/>}/>
        <Route path="/topics/attandance" element={<TCHTopicsAttendance/>}/>
        <Route path="/attendance" element={<TCHAttandancePage/>}/>
        <Route path="/attendance/:id" element={<TCHAttendanceDetailPage/>}/>
        <Route path='/change-password' element={<ChangePasswordPage/>}/>
        <Route path='/reset-password' element={<ResetPasswordPage/>}/>
        <Route path='/news' element={<News/>}/>
        <Route path='/news/:id' element={<NewsSingle/>}/>
        <Route path='/library' element={<LibraryPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot' element={<Forgot/>}/>
        <Route path='/groups' element={<TCHGroupPage/>}/>
        <Route path='/groups/:id' element={<TCHGroupList/>}/>
        <Route path='/groups/:id/:id' element={<StudentDetailPageAll/>}/>
        <Route path='/classschedule' element={<TCHShedule/>}/>
        <Route path='/classschedule/:id' element={<TCHSheduleSingle/>}/>
        {/* <Route path='/debts/:id' element={<DebtorsPageUsers/>}/> */}
        {/* <Route path='/payments' element={<STPaymentsPage/>}/> */}
        <Route path='*' element={<Page404/>}/>
    </Routes>);

const support: ReactNode = (
    <Routes>
        <Route path="/" element={<TCHHomePage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/videos" element={<TCHVideos/>}/>
        {/*<Route path="/videos/:id" element={<TCHVideosModulePage/>}/>*/}
        <Route path="/videos/:id/:id" element={<TCHVideos/>}/>
        <Route path="/topics" element={<TCHTopicsPage/>}/>
        <Route path="/topics/:id" element={<TCHTopicsSingle/>}/>
        <Route path="/topics/:groupId/:id" element={<TCHTopicsSingleDetail/>}/>
        <Route path="/topics/attandance" element={<TCHTopicsAttendance/>}/>
        <Route path="/attendance" element={<TCHAttandancePage/>}/>
        <Route path="/attendance/:id" element={<TCHAttendanceDetailPage/>}/>
        <Route path='/change-password' element={<ChangePasswordPage/>}/>
        <Route path='/reset-password' element={<ResetPasswordPage/>}/>
        <Route path='/news' element={<News/>}/>
        <Route path='/news/:id' element={<NewsSingle/>}/>
        <Route path='/library' element={<LibraryPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot' element={<Forgot/>}/>
        <Route path='/groups' element={<TCHGroupPage/>}/>
        <Route path='/groups/:id' element={<TCHGroupList/>}/>
        <Route path='/groups/:id/:id' element={<StudentDetailPageAll/>}/>
        <Route path='/classschedule' element={<TCHShedule/>}/>
        <Route path='/classschedule/:id' element={<TCHSheduleSingle/>}/>
        {/* <Route path='/debts/:id' element={<DebtorsPageUsers/>}/> */}
        {/* <Route path='/payments' element={<STPaymentsPage/>}/> */}
        <Route path='*' element={<Page404/>}/>
    </Routes>);

const accountant: ReactNode = (
    <Routes>
        <Route path="/" element={<ACHomePage/>}/>
        <Route path='/teachers' element={<ACTeachers/>}/>
        <Route path='/debts' element={<ACDebts/>}/>
        <Route path='/debts/:id' element={<StudentDetailPageAll/>}/>
        <Route path='/news' element={<News/>}/>
        <Route path='/news/:id' element={<NewsSingle/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path='/change-password' element={<ChangePasswordPage/>}/>
        <Route path='/reset-password' element={<ResetPasswordPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot' element={<Forgot/>}/>
    </Routes>);

const manager: ReactNode = (
    <Routes>
        <Route path="/" element={<MJHomePage/>}/>
        <Route path='/news' element={<News/>}/>
        <Route path='/news/:id' element={<NewsSingle/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path='/change-password' element={<ChangePasswordPage/>}/>
        <Route path='/reset-password' element={<ResetPasswordPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/debts' element={<DebtorsPage/>}/>
        <Route path='/debts/:id' element={<StudentDetailPageAll/>}/>
        <Route path='/forgot' element={<Forgot/>}/>
        <Route path='/contracts' element={<MJContacts/>}/>
        <Route path='/library' element={<LibraryPage/>}/>
        <Route path='/new/agreement/:id' element={<MJContractNewModule/>}/>
        <Route path='/contracts/:id' element={<StudentDetailPageAll/>}/>
        <Route path='/contracts/form-students' element={<ManagerStudentsForm/>}/>
        <Route path="/student/:id/attach-contract" element={<AttachContractModal/>}/>

    </Routes>
)


const RoutesMap = new Map<Roles, ReactNode>(
    [
        [Roles.Admin, admin],
        [Roles.Manager, manager],
        [Roles.Student, student],
        [Roles.Teacher, teacher],
        [Roles.Support, support],
        [Roles.Accountant, accountant],
    ]
)

export default RoutesMap;