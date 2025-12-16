import  { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Langs } from "../../enums";
import { GlobalContext, TGlobalContext } from "../../App";

type TSettingsComponentContent = {
    title: string;
    changePassword: string;
    resetPassword: string;
    selectRole: string; 
};

const contentsMap = new Map<Langs, TSettingsComponentContent>([
    [Langs.UZ, {
        title: "Sozlamalar",
        changePassword: "PAROLNI O'ZGARTIRISH",
        resetPassword: 'PAROLNI TIKLASH',
        selectRole: "Rolni tanlang"
    }],
    [Langs.RU, {
        title: "Настройки",
        changePassword: 'ИЗМЕНИТЬ ПАРОЛЬ',
        resetPassword: 'ВОССТАНОВЛЕНИЕ ПАРОЛЯ',
        selectRole: "Выберите роль" 
    }],
    [Langs.EN, {
        title: "Settings",
        changePassword: 'CHANGE PASSWORD',
        resetPassword: 'RESET PASSWORD',
        selectRole: "Select Role" 
    }],
]);

const SettingsPage = () => {
    // const rolesJSON = window.localStorage.getItem('roles');
    // const roles: string[] = rolesJSON ? JSON.parse(rolesJSON) : [];

    const { lang } = useContext(GlobalContext) as TGlobalContext;
    const contents = contentsMap.get(lang) as TSettingsComponentContent;

    // const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const newRole = event.target.value;
    //     if (setRole) {
    //         setRole(newRole as Roles);
    //         window.localStorage.setItem('role', newRole);
    //     }
    // };

    return (
        <div className="mt-14 md:mt-0 text-center flex flex-col items-center mx-auto">
  <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-center dark:text-customText">
    {contents.title}
  </h1>
  <div className="courses pt-6 px-4 sm:px-8 lg:px-16 flex flex-wrap gap-5 justify-center 2xl:justify-center mx-auto">
    <Link
      className="w-full sm:w-96 uppercase text-lg sm:text-xl p-3 sm:p-4 drop-shadow-lg bg-white duration-300 ease-in-out rounded-md hover:text-blue-400 dark:text-white dark:hover:text-blue-400 dark:bg-gray-700"
      to="/change-password"
    >
      {contents.changePassword}
    </Link>
    <Link
      className="w-full sm:w-96 uppercase text-lg sm:text-xl p-3 sm:p-4 drop-shadow-lg bg-white duration-300 ease-in-out rounded-md hover:text-blue-400 dark:text-white dark:hover:text-blue-400 dark:bg-gray-700"
      to="/reset-password"
    >
      {contents.resetPassword}
    </Link>
    {/* {role !== 'guest' ? (
      <select
        className="py-2 sm:py-3 px-4 sm:px-5 block w-full sm:w-96 bg-white text-center text-lg sm:text-xl rounded-md focus:border-blue-500 dark:hover:text-blue-400 drop-shadow-lg focus:ring-blue-500 disabled:opacity-50 dark:text-white dark:bg-gray-700 disabled:pointer-events-none"
        value={role}
        onChange={handleRoleChange}
      >
        <option disabled={true}>{contents.selectRole}</option>
        {roles.map((item, index) => (
          <option className="text-start" key={index} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
    ) : null} */}
  </div>
</div>

    );
};

export default SettingsPage;
