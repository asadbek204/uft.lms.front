import Logo from "../../assets/uftDark.png";
import Logo2 from "../../assets/uftWhite.png";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";

type TConfPassComponentContent = {
  title: string;
  confirm: string;
  email: string;
  placeholder: string;
};

const contentsMap = new Map<Langs, TConfPassComponentContent>([
  [
    Langs.UZ,
    {
      title: "Parolni tiklash",
      email: "Email",
      confirm: "Tasdiqlash",
      placeholder: "Hozirgi parolni kiriting",
    },
  ],

  [
    Langs.RU,
    {
      title: "Восстановление пароля",
      confirm: "Подтверждение",
      email: "Электронная почта",
      placeholder: "Введите ваш текущий пароль",
    },
  ],

  [
    Langs.EN,
    {
      title: "Password recovery",
      confirm: "Confirm",
      email: "Email",
      placeholder: "Enter your current password",
    },
  ],
]);

function ResetPasswordPage() {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TConfPassComponentContent;

  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <div className="mt-16 md:mt-0 w-full flex justify-center items-center dark:bg-gray-900 text-black dark:text-white">
      <div className="lg:w-3/6 sm:w-full bg-white rounded-lg dark:text-dark drop-shadow-lg dark:bg-gray-800">
        <div className="">
          <img
            className="w-1/3 sm:w-1/3 mx-auto m-4"
            src={theme === "dark" ? Logo2 : Logo}
            alt=""
          />
          <h2 className="text-center text-2xl sm:text-3xl mt-2">
            {contents.title}
          </h2>
          <div className=" w-full h-full mx-auto lg:m-2 p-4 sm:p-5">
            <form className="flex gap-4 sm:gap-5 flex-col">
              <div>
                <label className="text-lg sm:text-2xl" htmlFor="email">
                  {contents.email}
                </label>
                <br />
                <input
                  type="text"
                  id="email"
                  className="bg-gray-200 dark:bg-gray-600 outline-0 p-2 mt-1 rounded w-full"
                  placeholder={contents.placeholder}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 sm:p-3 rounded-xl text-lg sm:text-xl"
              >
                {contents.confirm}
              </button>
            </form>
          </div>

          <button
            onClick={() => window.history.back()}
            className="w-12 h-12 mx-3 my-3 bg-gray-200 hover:bg-gray-300 rounded"
          >
            <i className="fa-solid fa-arrow-left text-black"></i>
          </button>
        </div>
      </div>
      <div className="Toastify"></div>
    </div>
  );
}

export default ResetPasswordPage;
