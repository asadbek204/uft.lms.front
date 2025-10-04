import { Langs } from "../../enums";
import Logo from "../../assets/uftDark.png";
import Logo2 from "../../assets/uftWhite.png";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../App";
import client from "../../components/services";
import { toast } from "react-toastify";

type TChPassComponentContent = {
  title: string;
  confirm: string;
  newPassword: string;
  confirmPassword: string;
  placeholder1: string;
  placeholder2: string;
  placeholder3: string;
  alert: string;
  toast1: string;
  toast2: string;
};

const contentsMap = new Map<Langs, TChPassComponentContent>([
  [
    Langs.UZ,
    {
      title: "Parolni o'zgartirish",
      confirm: "Tasdiqlash",
      placeholder1: "Hozirgi parolni kiriting",
      newPassword: "Yangi parol",
      confirmPassword: "Yangi parolni tasdiqlash",
      placeholder2: "Yangi parolni kiriting",
      placeholder3: "Yangi parolni qayta kiriting",
      alert: "Parollar mos kelmaydi",
      toast1: "Parol muvaffaqiyatli almashtirildi",
      toast2: "Parolni o‘zgartirib bo‘lmadi",
    },
  ],
  [
    Langs.RU,
    {
      title: "Изменить пароль",
      confirm: "Подтверждение",
      placeholder1: "Введите ваш текущий пароль",
      newPassword: "Новый пароль",
      confirmPassword: "Подтвердите новый пароль",
      placeholder2: "Введите новый пароль",
      placeholder3: "Повторно введите новый пароль",
      alert: "Пароли не совпадают",
      toast1: "Пароль успешно изменен",
      toast2: "Не удалось изменить пароль",
    },
  ],
  [
    Langs.EN,
    {
      title: "Change password",
      confirm: "Confirm",
      placeholder1: "Enter your current password",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      placeholder2: "Enter a new password",
      placeholder3: "Re-enter the new password",
      alert: "Passwords do not match",
      toast1: "Password changed successfully",
      toast2: "Failed to change password",
    },
  ],
]);

function ChangePasswordPage() {
  const { lang, userId } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TChPassComponentContent;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      alert(contents.alert);
      return;
    }

    try {
      await client.patch(`accounts/update/${userId}/`, {
        password: newPassword,
      });
      toast.success(contents.toast1);
    } catch (error) {
      toast.error(contents.toast2);
    }
  };

  return (
    <div className="mt-16 md:mt-0 w-full flex justify-center items-center dark:bg-gray-900 text-black dark:text-white">
      <div className="lg:w-3/6 sm:w-full bg-white rounded-lg dark:text-dark drop-shadow-lg dark:bg-gray-800">
        <div>
          <img className="w-1/3 sm:w-1/3 mx-auto m-4"  src={theme === "dark" ? Logo2 : Logo} alt="" />
          <h2 className="text-center text-2xl sm:text-3xl mt-2">
            {contents.title}
          </h2>
          <div className=" w-full h-full mx-auto lg:m-2 p-4 sm:p-5">
            <form
              onSubmit={handleSubmit}
              className="flex gap-4 sm:gap-5 flex-col"
            >
              <div>
                <label className="text-lg sm:text-2xl" htmlFor="newPassword">
                  {contents.newPassword}
                </label>
                <br />
                <input
                  type="password"
                  id="newPassword"
                  className="bg-gray-200 dark:bg-gray-600 outline-0 p-2 mt-1 rounded w-full dark:text-black"
                  placeholder={contents.placeholder2}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="text-lg sm:text-2xl"
                  htmlFor="confirmPassword"
                >
                  {contents.confirmPassword}
                </label>
                <br />
                <input
                  type="password"
                  id="confirmPassword"
                  className="bg-gray-200 outline-0 dark:bg-gray-600 p-2 mt-1 rounded w-full dark:text-black"
                  placeholder={contents.placeholder3}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ChangePasswordPage;
