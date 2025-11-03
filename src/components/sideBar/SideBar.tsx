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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLang, setIsOpenLang] = useState(false);
  const [user, setUser] = useState<TUser>({ first_name: "", last_name: "" });
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpenLang) {
      setIsOpenLang(!isOpenLang);
    }
  };

  const toggleDropdownLang = () => {
    setIsOpenLang(!isOpenLang);
    if (isOpen) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
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
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown")) {
        setIsOpen(false);
        setIsOpenLang(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await client.get("accounts/me/");
      setUser(response.data as TUser);
    };

    fetchUser();
  }, [userId]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    window.location.reload();
  };

  const handleAuthAction = () => {
    if (role === "guest") {
      window.location.href = "/login";
    } else {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    window.localStorage.removeItem("role");
    window.localStorage.removeItem("token");
    window.location.href = "/";
  };

  const getPageInfo = (page: Pages) => {
    const pageNames = Translator.get(page) as TTranslator;
    let pageName = pageNames.en;
    switch (lang) {
      case "uz":
        pageName = pageNames.uz;
        break;
      case "ru":
        pageName = pageNames.ru;
        break;
    }
    return [page, pageName, Icons.get(page)];
  };

  const loc = useLocation();
  const currentUrl = loc.pathname;

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
  //     setExpanded(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <>
      {expanded && (
        <div
          className=" md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      <div className="absolute  mb-24 top-0 flex justify-between left-0 w-full md:hidden p-2  bg-white text-black z-50 dark:bg-gray-700">
        <button
          className={` -ml-52 rounded-lg bg-gray-50 hover:bg-gray-100 outline-0 dark:bg-gray-400 ${
            expanded ? "block" : "hidden"
          } md:hidden`}
        ></button>
        <button
          onClick={toggleSidebar}
          className={`transition-transform text-black dark:text-white duration-300 ${
            expanded ? "transform rotate-180" : "transform rotate-0"
          }`}
        >
          <i className={`fas ${expanded ? "" : "fa-bars"}`}></i>
        </button>
        <Link to="/">
          <img
            onClick={() => setPage(Pages.Home)}
            src={isDarkMode ? logodark : logolight}
            className={`overflow-hidden h-14 transition-all`}
            alt="logo"
          />
        </Link>
        <div></div>
      </div>
      <aside
        ref={sidebarRef}
        className={`h-screen ${
          expanded ? "block" : "hidden"
        } lg:block absolute z-40 md:static  md:mt-0 transition-shadow duration-300 ${
          expanded ? "shadow-lg" : ""
        }`}
      >
        <nav
          className={`h-screen overflow-y-hidden md:h-full inline-flex bg-white flex-col border-r dark:border-slate-950 drop-shadow-lg dark:text-dark dark:bg-gray-800`}
        >
          <div
            className={`p-4 pb-2 flex ${
              expanded
                ? "justify-between items-center "
                : "justify-center items-center"
            }`}
          >
            <Link to="/" className=" md:block">
              <img
                onClick={() => setPage(Pages.Home)}
                src={isDarkMode ? logodark : logolight}
                className={`overflow-hidden transition-all ${
                  expanded ? "w-44" : "w-0"
                }`}
                alt="logo"
              />
            </Link>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="hidden lg:block p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 outline-0 dark:bg-gray-400"
            >
              {expanded ? (
                <img
                  className="filter dark:invert"
                  src={JustifyRegular}
                  alt=""
                />
              ) : (
                <img className="filter dark:invert" src={LeftRegular} alt="" />
              )}
            </button>
          </div>

          <div
            className={`${
              expanded ? "overflow-y-auto 2xl:py-5" : ""
            } flex-1 content-center relative`}
          >
            <ul className="mb-3 px-5">
              {pages?.map((item) => {
                const [key, pageName, icon] = getPageInfo(item);
                return (
                  <Link
                    key={key}
                    to={`/${key.toLowerCase()}`}
                    className="flex items-center w-full"
                  >
                    <li
                      className={`
                                flex items-center py-0.5 px-1 2xl:py-3.5 2xl:px-3
                                font-medium rounded-md cursor-pointer my-1
                                transition-colors group text-xl dark:text-white
                                ${
                                  item.toLowerCase() ===
                                  currentUrl.split("/")[1]
                                    ? "bg-gray-200 dark:bg-gray-500 text-black-800"
                                    : "hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-500 dark:text-gray-600"
                                }
                            `}
                    >
                      <img
                        className="w-10 filter dark:invert"
                        src={icon}
                        alt={pageName}
                      />
                      <span
                        className={`overflow-hidden font-semibold transition-all text-black dark:text-white text-base ${
                          expanded ? "w-52 ml-3" : "w-0"
                        }`}
                      >
                        {pageName}
                      </span>

                      {!expanded && (
                        <div
                          id="littletext"
                          className={`little_text 
                                        absolute left-full rounded-md px-2 py-1 ml-2
                                        bg-gray-100 text-black text-sm
                                        invisible opacity-20 -translate-x-3 transition-all
                                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                                    `}
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

          <div
            className={`border-t dark:border-slate-950 flex justify-center p-3 ${
              expanded ? "" : "justify-center items-center"
            }`}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user.first_name}&background=000000&bold=true&color=fff`}
              alt=""
              className="w-10 h-10 rounded-md"
            />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                expanded ? "w-56 ml-3" : "w-0"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold dark:text-white drop-shadow-sm">
                  {user.first_name}
                </h4>
              </div>
              <div className="flex align-center gap-1 content-center">
                <div className="dropdown">
                  <button
                    onClick={toggleDropdownLang}
                    className="px-2 py-1.5 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-400"
                  >
                    <i className="fa fa-globe text-black dark:text-white"></i>
                  </button>
                  {isOpenLang && (
                    <ul className="dropdown-menu1 bg-white dark:bg-black flex gap-2 rounded">
                      {langs?.map((el) => (
                        <button
                          key={"lang-" + el}
                          className={`my-1 px-3 rounded ${
                            lang === el
                              ? "text-gray-50 dark:text-black bg-black dark:bg-gray-300"
                              : "dark:text-white"
                          }`}
                          onClick={() => setLang(el)}
                        >
                          {el}
                        </button>
                      ))}
                    </ul>
                  )}
                </div>
                <DarkModeToggle
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
                <div className="dropdown">
                  <button
                    className="px-1 py-1.5 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-400"
                    onClick={toggleDropdown}
                  >
                    <img
                      className="filter dark:invert"
                      src={MoreVertical}
                      alt=""
                    />
                  </button>
                  {isOpen && (
                    <ul className="dropdown-menu rounded bg-white dark:bg-black">
                      <li>
                        <a
                          className="text-black dark:text-white cursor-pointer font-semibold  dark:hover:bg-transparent dark:hover:text-blue-400"
                          onClick={handleAuthAction}
                        >
                          {role === "guest" ? "login" : "logout"}
                        </a>
                      </li>
                    </ul>
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
