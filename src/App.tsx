import {createContext, useEffect, useState, Suspense, Dispatch, SetStateAction} from 'react';
import {useLocation, Navigate, Route, Routes} from 'react-router-dom';
import SideBar from './components/sideBar/SideBar';
import {Roles, Pages, Langs} from './enums';
import {ToastContainer} from 'react-toastify';
import RoutesMap from './Routes';
import PagesMap from './maps.ts';
import Login from './pages/Login/Login.tsx';
import ForgotPassword from './pages/Forgot/Forgot.tsx';
// import StudentsFormOrg from './StudentsFormOrg.tsx';
import TCHTopicsAttendance from './TeacherRole/TCHTopicsPage/TCHTopicsSingle/TCHTopicsSingleDetail/TCHTopicsAttendance';
import client from "./components/services/index.tsx";

export type TGlobalContext = {
    lang: Langs;
    page: Pages;
    setRole?: Dispatch<SetStateAction<Roles>>;
    username?: string;
    role: Roles;
    userId: number;
    setUserId?: (id: number) => void;
};

export const GlobalContext = createContext<TGlobalContext>({
    role: Roles.Student,
    lang: Langs.UZ,
    page: Pages.Home,
    userId: Number(window.localStorage.getItem('id')),
});

function App() {
    const [role, setRole] = useState<Roles>(window.localStorage.getItem('role') as Roles || Roles.Guest);
    const [pages, setPages] = useState<Pages[]>([]);
    const [page, setPage] = useState<Pages>(Pages.Attendance);
    const [lang, setLang] = useState<Langs>(
      (window.localStorage.getItem("lang") as Langs) ?? Langs.UZ
    );
    const [userId, setUserId] = useState<number>(Number(window.localStorage.getItem('id')));

     useEffect(() => {
       const fetchUser = async () => {
         try {
           // Faqat token bo'lsa accounts/me/ so'rovi yuborish
           const storedToken = window.localStorage.getItem("token");
           if (!storedToken) {
             setRole(Roles.Guest);
             return;
           }

           const res = await client.get("accounts/me/");
           const roles = res.data.roles;

           let detectedRole = Roles.Guest;

           if (roles.admin) detectedRole = Roles.Admin;
           else if (roles.manager) detectedRole = Roles.Manager;
           else if (roles.teacher) detectedRole = Roles.Teacher;
           else if (roles.students?.length > 0) detectedRole = Roles.Student;
           else if (roles.accountant) detectedRole = Roles.Accountant;

           setRole(detectedRole);
           window.localStorage.setItem("role", detectedRole);
         } catch (error) {
           console.error("User data error:", error);
           window.localStorage.removeItem("token");
           window.localStorage.removeItem("refresh");
           window.localStorage.removeItem("id");
           window.localStorage.removeItem("roles");
           setRole(Roles.Guest);
         }
       };

       fetchUser();
     }, []);

   


    useEffect(() => {
        setPages(PagesMap.get(role) as Pages[]);
    }, [role]);

    const location = useLocation();
    const currentUrl = location.pathname;
    const token = window.localStorage.getItem("token");

    const isLoginPage = currentUrl.includes('/login');
    const isForgotPasswordPage = currentUrl.includes('/forgot');
    const isStudentFormPage = currentUrl.includes('/students-form/');
    const isStudentAttendance = currentUrl.includes('/topics-attandance');


    if (token && (isLoginPage || isForgotPasswordPage)) {
        return <Navigate to="/"/>;
    }

    if (!token && !isLoginPage && !isForgotPasswordPage && !isStudentFormPage && !isStudentAttendance) {
        return <Navigate to="/login"/>;
    }

    return (
        <GlobalContext.Provider value={{lang, role, page, setRole, userId, setUserId}}>
            {!isLoginPage && !isForgotPasswordPage && !isStudentFormPage && !isStudentAttendance && (
                <SideBar
                    pages={pages}
                    setPage={setPage}
                    setLang={(newLang: Langs) => {
                        setLang(newLang);
                        window.localStorage.setItem('lang', newLang.toString());
                    }}
                />
            )}
            <div
                className={`${(currentUrl.split("/")[1] !== "change-password" ||
                    currentUrl.split("/")[1] !== "reset-password" &&
                    currentUrl.split("/")[1] !== "forgot" &&
                    currentUrl.split("/")[1] !== "topics-attandance/:id" &&
                    currentUrl.split("/")[1] !== "login")
                    ? "bg-gradient-light dark:bg-gradient-dark"
                    : ""
                } bg-center-center bg-full flex w-full max-h-[850px] m-10 rounded-xl`}
                style={
                    currentUrl.split("/")[1] !== "change-password" &&
                    currentUrl.split("/")[1] !== "reset-password" &&
                    currentUrl.split("/")[1] !== "forgot" &&
                    currentUrl.split("/")[1] !== "topics-attandance/:id" &&
                    currentUrl.split("/")[1] !== "login"
                        ? {boxShadow: "5px 10px 25px rgba(0, 0, 0, 0.15)", padding: '2rem 0'}
                        : {}
                }
            >
                <ToastContainer/>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/forgot" element={<ForgotPassword/>}/>
                        {/* <Route path="/students-form/:id" element={<StudentsFormOrg/>}/> */}
                        <Route path="/topics-attandance/:id" element={<TCHTopicsAttendance/>}/>
                        <Route path="/*" element={RoutesMap.get(role)}/>
                    </Routes>
                </Suspense>
            </div>
        </GlobalContext.Provider>
    );
}

export default App;
