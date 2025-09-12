import {Link, useParams} from "react-router-dom";
import {GlobalContext} from "../../../App";
import {Langs} from "../../../enums";
import {createContext, useContext} from "react";


type TNewsComponentContent = {
    title: string
}

const contentsMap = new Map<Langs, TNewsComponentContent>([

    [Langs.UZ, {
        title: " Modulni tanlang"
    }],

    [Langs.RU, {
        title: "Выберите модуль"
    }],

    [Langs.EN, {
        title: "Select the module"
    }],

]);

export const VideosContext = createContext<{ group: number }>({group: 1});

function Module() {
    const {id} = useParams();
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;

    const modules = [
        {
            id: 1,
            name: new Map([
                    [Langs.UZ, '1 - modul'],
                    [Langs.RU, '1 - модуль'],
                    [Langs.EN, '1 - module'],
                ]
            )
        },
        {
            id: 2,
            name: new Map([
                    [Langs.UZ, '2 - modul'],
                    [Langs.RU, '2 - модуль'],
                    [Langs.EN, '2 - module'],
                ]
            )
        },
        {
            id: 3,
            name: new Map([
                    [Langs.UZ, '3 - modul'],
                    [Langs.RU, '3 - модуль'],
                    [Langs.EN, '3 - module'],
                ]
            )
        },
    ];


    return (
        <VideosContext.Provider value={{group: Number(id)}}>
            <div
                className="w-full  mt-12 md:mt-0">
                <div className="header mt-5 mx-5 flex items-center">
                    <button onClick={() => window.history.back()}
                            className='w-12 h-12 my-3 ms-5 bg-gray-200 hover:bg-gray-300 rounded'>
                        <i className='fa-solid fa-arrow-left text-black'></i>
                    </button>
                    <div className="flex w-full my-5 justify-center align-center">
                        <h1 className="2xl:text-4xl  text-xl font-bold leading-[80px]  dark:text-customText">
                            {contents.title}
                        </h1>
                    </div>
                    <button onClick={() => window.history.back()}
                            className='w-12 h-12 invisible my-3 ms-5 bg-gray-200 hover:bg-gray-300 rounded'>
                        <i className='fa-solid fa-arrow-left text-black'></i>
                    </button>
                </div>
                <div className="courses  p-0 flex flex-col gap-5 justify-center content-center">
                    {modules.map((module) => (
                        <Link to={`${module.id}`}
                              key={module.id}
                              className="w-5/6 block uppercase text-xl  border-gray-300 rounded-md p-4 mx-auto drop-shadow-lg bg-white dark:text-white dark:bg-gray-700 cursor-pointer"
                        >
                            {module.name.get(lang)}
                        </Link>

                    ))}
                </div>
            </div>
        </VideosContext.Provider>
    );
}

export default Module;