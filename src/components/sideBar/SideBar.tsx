import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { langs, Langs, Pages } from "../../enums";
import { Icons, Translator } from "../../maps";
import { TTranslator } from "../../types";
import { GlobalContext } from "../../App";
import DarkModeToggle from "../DarkModeToggler/DarkModeToggler.tsx";
import logolight from "../../assets/uftDark.png";
import logodark from "../../assets/uftWhite.png";
import MoreVertical from "../../images/nav-icons/more-vertical.svg";
import JustifyRegular from "../../images/nav-icons/Justify-Regular.svg";
import LeftRegular from "../../images/nav-icons/LeftAlign-Regular.svg";
import { Link, useLocation } from "react-router-dom";
import client from "../services";

type TSideBarProperties = {
  readonly pages: Pages[];
  readonly setLang: (newLang: Langs) => void;
  readonly setPage: Dispatch<SetStateAction<Pages>>;
};

type TUser = {
  first_name: string;
  last_name: string;
};

function SideBar({ pages, setLang, setPage }: TSideBarProperties) {
  const { lang, role, userId } = useContext(GlobalContext);
  const [expanded, setExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLang, setIsOpenLang] = useState(false);
  const [user, setUser] = useState<TUser>({ first_name: "", last_name: "" });
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpenLang) setIsOpenLang(false);
  };

  const toggleDropdownLang = () => {
    setIsOpenLang(!isOpenLang);
    if (isOpen) setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown")) {
        setIsOpen(false);
        setIsOpenLang(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await client.get("accounts/me/");
        setUser(response.data as TUser);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    window.location.reload();
  };

  const handleAuthAction = () => {
    if (role === "guest") {
      window.location.href = "/login";
    } else {
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  const getPageInfo = (page: Pages) => {
    const pageNames = Translator.get(page) as TTranslator;
    let pageName = pageNames.en;
    if (lang === "uz") pageName = pageNames.uz;
    if (lang === "ru") pageName = pageNames.ru;
    return [page, pageName, Icons.get(page)];
  };

  const loc = useLocation();
  const currentPath = loc.pathname.split("/")[1] || "";

  const toggleSidebar = () => setExpanded((prev) => !prev);

  useEffect(() => {
    const handleClickOutsideSidebar = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 768
      ) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSidebar);
    return () => document.removeEventListener("mousedown", handleClickOutsideSidebar);
  }, []);

  return (
    <>
      {expanded && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 z-50 md:hidden">
        <button onClick={toggleSidebar} className="text-2xl text-gray-800 dark:text-gray-200">
          <i className={`fa-solid ${expanded ? "fa-xmark" : "fa-bars"}`}></i>
        </button>

        <Link to="/" onClick={() => setPage(Pages.Home)}>
          <img
            src={isDarkMode ? logodark : logolight}
            className="h-10 object-contain"
            alt="Logo"
          />
        </Link>

        <div className="w-10" /> 
      </div>

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen z-50
          transition-all duration-300 ease-in-out
          md:static md:z-auto
          ${expanded ? "md:w-96 w-[50%] " : "w-23"}
          bg-white dark:bg-gray-800 border-r dark:border-gray-700
          shadow-lg md:shadow-none
          ${expanded ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <nav className="flex flex-col h-full">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <Link to="/" onClick={() => setPage(Pages.Home)} className="flex-shrink-0">
              <img
                src={isDarkMode ? logodark : logolight}
                className={`transition-all duration-300 ${expanded ? "w-40" : "w-0"}`}
                alt="Logo"
              />
            </Link>

            <button
              onClick={toggleSidebar}
              className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {expanded ? (
                <img src={JustifyRegular} className="w-6 h-6 dark:invert" alt="Collapse" />
              ) : (
                <img src={LeftRegular} className="w-6 h-6 dark:invert" alt="Expand" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {pages.map((item) => {
                const [key, pageName, icon] = getPageInfo(item);
                const isActive = currentPath === key.toLowerCase();

                return (
                  <Link key={key} to={`/${key.toLowerCase()}`} className="block">
                    <li
                      className={`
                        flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer
                        transition-colors duration-200 group relative
                        ${isActive
                          ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                      `}
                    >
                      <img
                        src={icon}
                        alt={pageName}
                        className="w-6 h-6 object-contain filter dark:invert"
                      />

                      <span
                        className={`
                          font-medium whitespace-nowrap overflow-hidden transition-all duration-300
                          ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}
                        `}
                      >
                        {pageName}
                      </span>

                      {!expanded && (
                        <div
                          className="
                            absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-md
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            transition-all duration-200 pointer-events-none whitespace-nowrap
                            shadow-lg z-50
                          "
                        >
                          {pageName}
                        </div>
                      )}
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>

          <div className="border-t dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.first_name?.charAt(0) || "U"}&background=000000&color=fff&bold=true`}
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div
                  className={`
                    transition-all duration-300 overflow-hidden
                    ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}
                  `}
                >
                  <p className="font-medium text-sm text-black dark:text-white truncate">
                    {user.first_name || "User"}
                  </p>
                </div>
              </div>

              <div
                className={`
                  flex items-center gap-2 transition-all duration-300
                  ${expanded ? "opacity-100" : "opacity-0 w-0"}
                `}
              >
                <div className="relative dropdown">
                  <button
                    onClick={toggleDropdownLang}
                    className="py-0.5 px-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-400 rounded-lg  dark:hover:bg-gray-700"
                  >
                    <i className="fa-solid  fa-globe text-gray-700 dark:text-gray-300"></i>
                  </button>

                  {isOpenLang && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 py-2 px-3 flex gap-2">
                      {langs.map((el) => (
                        <button
                          key={el}
                          onClick={() => setLang(el)}
                          className={`
                            py-1.5 text-sm font-medium rounded
                            ${lang === el
                              ? "bg-gray-200 p-2 dark:text-white dark:bg-gray-700"
                              : "hover:bg-gray-100 p-2 dark:text-white  dark:hover:bg-gray-700"}
                          `}
                        >
                          {el.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

                <div className="relative dropdown">
                  <button
                    onClick={toggleDropdown}
                    className="p-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-400 rounded-lg  dark:hover:bg-gray-700"
                  >
                    <img
                      src={MoreVertical}
                      className="w-5 h-5 dark:invert"
                      alt="More"
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 py-1">
                      <button
                        onClick={handleAuthAction}
                        className="block px-5 py-2.5 text-sm dark:text-white text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {role === "guest" ? "Login" : "Logout"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default SideBar;