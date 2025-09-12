import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import 'dayjs/locale/uz';
import { Langs } from "../../../enums.ts";
import { GlobalContext } from '../../../App.tsx';
import client from '../../../components/services';
import Loading from '../../../components/LoadingComponent/Loading.tsx';

dayjs.locale('uz');


interface AttendanceRecord {
    date: string;
    status: boolean; 
}


interface AttendanceResponse {
    date: string;
    status: boolean;
}

type TGroupsComponentContent = {
    title: string;
    data: string;
    status: string
};

const contentsMap = new Map<Langs, TGroupsComponentContent>([
    [Langs.UZ, { title: "Sizning davomatingiz", data: "Sana", status: "Status" }],
    [Langs.RU, { title: "Ваша посещаемость", data: "Дата", status: "Статус" }],
    [Langs.EN, { title: "Your attendance", data: "Date", status: "Status" }],
]);

const STAttendanceList: React.FC = () => {
    const { lang } = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TGroupsComponentContent;

    const { id } = useParams<{ id: string }>();
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
            
                const response = await client.get<AttendanceResponse[]>(`education/my_attendance/${id}`);
                const filteredData = response.data.map((record) => ({
                    date: record.date,
                    status: record.status 
                }));
                
                setAttendanceData(filteredData);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch attendance data:', error);
                setError(error as Error);
                setLoading(false);
                toast.error("Error fetching attendance data");
            }
        };
    
        fetchAttendanceData();
    }, [id]);

    return (
        <div className="mt-12 md:mt-0 bg-center-center bg-full block w-full max-h-[850px] rounded drop-shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between w-full">
                <button onClick={() => window.history.back()} className='w-12 h-12 mx-3 my-3 bg-gray-200 hover:bg-gray-300 rounded'>
                    <i className='fa-solid fa-arrow-left text-black'></i>
                </button>
                <h1 className=" text-xl md:text-4xl font-bold dark:text-white">
                    {contents.title}
                </h1>
                <div></div>
            </div>
            <div className="w-full  md:max-w-4xl  max-w-xs  mt-8 mx-auto">
                {loading && (
                    <div className="text-center text-xl dark:text-white">
                        <Loading />
                    </div>
                )}
                {error && (
                    <div className="text-center text-xl text-red-500">
                        Error: {error.message}
                    </div>
                )}
                {!loading && !error && (
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700">
                                <th className="py-3 px-4 text-left text-sm  text-gray-800 dark:text-gray-200">
                                    {contents.data}
                                </th>
                                <th className="py-3 px-4 text-left text-sm  text-gray-800 dark:text-gray-200">
                                    {contents.status}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((record, index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-gray-200 dark:border-gray-700 ${
                                        index % 2 === 0
                                            ? 'bg-gray-100 dark:bg-gray-700'
                                            : 'bg-white dark:bg-gray-800'
                                    }`}
                                >
                                    <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                                        {dayjs(record.date).format('YYYY-MM-DD')}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div
                                            className={`inline-block w-4 h-4 rounded-full ${
                                                record.status
                                                    ? 'bg-green-500'
                                                    : 'bg-red-500'
                                            }`}
                                        ></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default STAttendanceList;
