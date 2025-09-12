import React, {useRef, useState} from "react";
import Logo from "../../images/logo.png";
import {Link} from "react-router-dom";
import client from "../../components/services";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Roles} from "../../enums.ts";
import {useContext} from "react";
import {GlobalContext} from "../../App";
import {Langs} from "../../enums";


type TNewsComponentContent = {
    toast1: string;
    toast2: string;
    toast3: string;
    number: string;
    button1: string;
    password: string;
    chekbox: string;
    placeholder1: string,
    placeholder2: string,
    parol: string

}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        toast1: "Kirish muvaffaqiyatli bajarildi",
        toast2: "Foydalanuvchi nomi yoki parol noto'g'ri",
        toast3: "Kutilmagan xatolik yuz berdi.",
        number: "Telefon raqami",
        chekbox: "Meni eslab qol",
        password: "Parol",
        button1: "Kirish",
        placeholder1: "telefon raqamingizni kiriting",
        placeholder2: "parolingizni kiriting",
        parol: "Parol esdan chiqdimi?"

    }],
    [Langs.RU, {
        toast1: "Вход успешен",
        toast2: "Имя пользователя или пароль неверны",
        toast3: "Произошла непредвиденная ошибка.",
        number: "Номер телефона",
        chekbox: "Запомнить меня",
        password: "Пароль",
        button1: "Входить",
        placeholder1: "введите свой номер телефона",
        placeholder2: "введите свой пароль",
        parol: "Забыли пароль?"

    }],
    [Langs.EN, {
        toast1: "Login successful",
        toast2: "Username or password is incorrect",
        toast3: "An unexpected error occurred.",
        number: "Phone number",
        chekbox: "Remember me",
        password: "Password",
        button1: "Enter",
        placeholder1: "enter your phone number",
        placeholder2: "enter your password",
        parol: "Forgot your password?"

    }],
])

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    // const passwordInput = useRef(null);
    const loginInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loginInput.current && passwordInput.current) {
            try {
                const response = await client.post("token/", {
                    phone_number: loginInput.current.value,
                    password: passwordInput.current.value,
                });
                toast.success(contents.toast1);

                window.localStorage.setItem(
                    "roles",
                    JSON.stringify(response.data.role)
                );
                window.localStorage.setItem(
                    "role",
                    response.data.role.includes(Roles.Student)
                        ? Roles.Student.toString()
                        : response.data.role[0]
                );
                window.localStorage.setItem("token", response.data.access);
                window.localStorage.setItem("refresh", response.data.refresh);
                window.localStorage.setItem("id", response.data.id);
                window.location.href = "/";
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(contents.toast2);
                } else {
                    toast.error(contents.toast3);
                }
            }
        }
    };

    return (
        <div
            className="bg-gray-200 absolute top-0 bottom-0 left-0 right-0 h-screen flex justify-center items-center text-black dark:text-white">
            <ToastContainer/>
            <div className="lg:w-3/6 w-11/12 bg-white rounded-lg dark:text-dark dark:bg-gray-800 drop-shadow-lg">
                <div>
                    <img className="w-1/4 mx-auto pt-12" src={Logo} alt="Logo"/>
                    <h2 className="text-center text-3xl mt-2">
                        Bobir Akilhanov Tech Academy
                    </h2>
                    <div
                        className="my_form lg:w-2/3 sm:w-full h-full 2xl:mx-auto mx-auto lg:m-2 lg:mx-auto 2xl:m-3 p-5">
                        <form onSubmit={onLogin} className="flex gap-7 lg:gap-5 flex-col">
                            <div>
                                <label className="text-2xl" htmlFor="username">
                                    {contents.number}
                                </label>
                                <br/>
                                <input
                                    ref={loginInput}
                                    defaultValue="+998"
                                    placeholder={contents.placeholder1}
                                    type="text"
                                    id="username"
                                    className="outline-0 p-2 mt-1 bg-gray-200 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="text-2xl " htmlFor="password">
                                    {contents.password}
                                </label>
                                <br/>
                                {/* <input ref={passwordInput} type="password" id="password"
                                       placeholder="enter your password"
                                       className="outline-0 p-2 mt-1 bg-gray-200 rounded w-full"
                                       autoComplete="new-password"/> */}
                                <div className="flex items-center mt-1 bg-gray-200 rounded w-full">
                                    <input
                                        ref={passwordInput}
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder={contents.placeholder2}
                                        className="outline-0 p-2 bg-gray-200 w-full"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="p-2 text-gray-500"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                 viewBox="0 0 20 20" fill="currentColor">

                                                <path
                                                    d="M10 4.5c-5.25 0-9.72 4.16-9.72 5.5 0 1.34 4.47 5.5 9.72 5.5s9.72-4.16 9.72-5.5c0-1.34-4.47-5.5-9.72-5.5zM10 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                 viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    d="M10 4.5c-5.25 0-9.72 4.16-9.72 5.5 0 1.34 4.47 5.5 9.72 5.5s9.72-4.16 9.72-5.5c0-1.34-4.47-5.5-9.72-5.5zM10 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM10 8.25c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center">
                                    <input
                                        id="link-checkbox"
                                        type="checkbox"
                                        value=""
                                        className="w-4 h-4 outline-0 accent-gray-500 rounded dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        htmlFor="link-checkbox"
                                        className="ms-2 text-md font-medium text-gray-900 opacity-70 dark:text-gray-300"
                                    >
                                        {contents.chekbox}
                                    </label>
                                    <br/>
                                </div>
                                <Link className="text-md font-medium text-gray-900 opacity-70 dark:text-gray-300"
                                      to="/forgot">{contents.parol}</Link>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white p-2 rounded-xl text-xl"
                            >
                                {contents.button1}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
