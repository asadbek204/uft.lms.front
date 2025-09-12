import React, {useState} from 'react';
import Logo from "../../images/logo.png";
import {Link} from "react-router-dom";
import {client} from '../../components/services';
import { useContext } from "react";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";

type TNewsComponentContent = {
    error1: string;
    error2: string;
    error3: string;
    error4: string; 
    button1: string;
    button2: string;
    email: string;
    account: string;
    title: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        error1: "Emailni kiriting",
        error2: "Email noto‘g‘ri formatda",
        error3: "Parolni tiklash havolasi emailingizga yuborildi",
        error4: "Xatolik yuz berdi, qayta urinib ko‘ring",
        title: "Parolni tiklash",
        email: "Email",
        button1: "Kirish",
        button2: "Tasdiqlash",
        account: "Allaqachon akkaunt bormi?"
    }],
    [Langs.RU, {
        error1: "Введите адрес электронной почты",
        error2: "Электронная почта имеет неправильный формат",
        error3: "Ссылка для сброса пароля была отправлена ​​на вашу электронную почту",
        error4: "Произошла ошибка, попробуйте еще раз",
        title: "Сбросить пароль",
        email: "Электронная почта",
        button1: "Входить",
        button2: "Подтверждать",
        account: "У вас уже есть аккаунт?"
    }],
    [Langs.EN, {
        error1: "Enter your email",
        error2: "The email is in the wrong format",
        error3: "A password reset link has been sent to your email",
        error4: "An error occurred, please try again",
        title: "Reset password",
        email: "Email",
        button1: "Enter",
        button2: "Confirm",
        account: "Already have an account?"
    }],
])

const Forgot: React.FC = () => {
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [token] = useState<string | null>(window.localStorage.getItem("token"));
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            setError(contents.error1);
            return;
        }
        if (!validateEmail(email)) {
            setError(contents.error2);
            return;
        }
        setError('');

        client.post(`password-reset/`, {email})
            .then(() => {
                setSuccess(contents.error3);
                setEmail('');
            })
            .catch(() => {
                setError(contents.error4);
            });
    };

    return (
        <div className="bg-gray-200 absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center dark:bg-gray-900 text-black dark:text-white">
            <div className="lg:w-3/6 sm:w-full bg-white rounded-lg dark:text-dark drop-shadow-lg dark:bg-gray-800">
                <div>
                    <img className="w-1/4 mx-auto m-4" src={Logo} alt="Logo"/>
                    <h2 className='text-center text-3xl mt-2'>{contents.title} </h2>
                    <div className='my_form lg:w-2/3 sm:w-full h-full 2xl:mx-auto mx-auto lg:m-2 lg:mx-auto 2xl:m-16 p-5'>
                        <form onSubmit={handleSubmit} className="flex gap-7 lg:gap-5 flex-col">
                            <div>
                                <label className="text-2xl" htmlFor="email">{contents.email}</label>
                                <br/>
                                <input
                                    type='email'
                                    id='email'
                                    placeholder="Emailni kiriting"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-200 outline-0 p-2 mt-1 rounded w-full"
                                />
                                {error && <p className="text-red-500">{error}</p>}
                                {success && <p className="text-green-500">{success}</p>}
                            </div>
                            <button type="submit" className="w-full bg-black text-white p-2 rounded-xl text-xl">
                                {contents.button2}
                            </button>
                            {!token && (
                                <h1 className="flex justify-end">
                                    {contents.account}&nbsp;
                                    <Link to='/'>
                                        <button className="sign">{contents.button1}</button>
                                    </Link>
                                </h1>
                            )}
                        </form>
                    </div>
                </div>
                {token && (
                    <Link to={`/login`}>
                        <button className='w-12 h-12 mx-3 my-3 sticky bg-gray-200 rounded'>
                            <i className='fa-solid fa-arrow-left text-black'></i>
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Forgot;
