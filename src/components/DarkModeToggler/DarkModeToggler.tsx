import { useEffect } from 'react';
import SunIcon from '../../images/nav-icons/sun.svg';
import MoonIcon from '../../images/nav-icons/moon.svg';

type DarkModeToggleProps = {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
};

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }: DarkModeToggleProps) => {
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <button
            className="p-1.5 focus:outline-none rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-400"
            onClick={toggleDarkMode}
        >
            <img src={isDarkMode ? SunIcon : MoonIcon} alt="icon" className="w-[20px] h-[20px]" />
        </button>
    );
};

export default DarkModeToggle;
