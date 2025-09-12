import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from "../../../../components/LoadingComponent/Loading";

interface NewsItem {
    id: number;
    news_tittle: string;
    photo: string;
    created_at: string;
    description: string;
}

const staticData: NewsItem = {
    id: 1,
    news_tittle: "PRESIDENT OF SOUTH KOREA ARRIVES IN UZBEKISTAN",
    photo: "https://demo.ba.lms.uft.uz/media/news_photos/05_3.png",
    created_at: "2024-07-21",
    description: "The High-Ranking Guest Was Welcomed At The Tashkent International Airport By The Prime Minister Of Uzbekistan Abdulla Aripov And Other Officials. After A Brief Conversation, The President Of Korea, Accompanied By His Spouse, Headed To The Residence Allocated For Them.According To The Agenda Of The Visit, High-Level Talks To Be Held In Tashkent Will Oversee The Development Of Uzbek-Korean Relations Of Friendship And Special Strategic Partnership. Trade, Innovation And Technological Exchange, Energy, Electronics And Electrical Engineering, Chemical Industry, Agriculture, Infrastructure Development, And Other Priority Areas Will Be The Focus Of Expanding Practical Cooperation."
};

const NewsSingle: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const [data, setData] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            setData(staticData);
            setLoading(false);
        }, 1000); 
    }, [id]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    return (
        <div className="dark:bg-gradient-dark bg-center-center bg-full block  w-full max-h-[850px] m-10 py-8 rounded drop-shadow-xl overflow-y-auto ">
            {loading ? <Loading /> :
                data ? (
                    <div className="w-full">
                        <div className="ml-16 flex align-center">
                            <Link to={`/news`}>
                                <button className='w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded'>
                                    <i className='fa-solid fa-arrow-left text-black'></i>
                                </button>
                            </Link>

                            <h1 className='2xl:text-4xl text-3xl font-bold dark:text-gray-300 ml-6 uppercase'>{data.news_tittle}</h1>
                        </div>
                        <img className='w-[90%] h-[550px] mt-11 rounded shadow-lg ml-16 dark:text-gray-300'
                            src={data.photo} alt={data.news_tittle} />
                        <div className='flex mt-3 mb-2'>
                            <img className="filter dark:invert ml-16" src="/path/to/calendar/icon.png" alt="" />
                            <p className='dark:text-gray-300'>{formatDate(data.created_at)}</p>
                        </div>
                        <p className='text-2xl font-normal ml-16 mt-10 capitalize mb-10 dark:text-gray-300'>{data.description}</p>
                    </div>
                ) : (
                    <div className='flex justify-between'>
                        <Link to={`/news`}>
                            <button className='w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded ml-5'>
                                <i className='fa-solid fa-arrow-left text-black'></i>
                            </button>
                        </Link>
                        <p className='m-auto text-xl'></p>
                    </div>
                )
            }
        </div>
    );
};

export default NewsSingle;

