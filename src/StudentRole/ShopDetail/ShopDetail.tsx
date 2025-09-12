import { useEffect, useState, useContext } from "react";
import Loading from "../../components/LoadingComponent/Loading.tsx";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import client from "../../components/services";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Set the app element for accessibility
Modal.setAppElement("#root");

type TNewsComponentContent = {
  title: string;
  backButton: string;
  coinBalance: string;
  price: string;
  buyNow: string;
  quantity: string;
  totalPrice: string;
  confirmPurchase: string;
  cancel: string;
  error: string;
  success: string;
  required: string;
  notEnoughCoin: string;
  coin: string
};

export interface TCourses {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const contentsMap = new Map<Langs, TNewsComponentContent>([
  [
    Langs.UZ,
    {
      title: "Do'kon Tafsilotlari",
      backButton: "Orqaga",
      coinBalance: "Tanga Balansi",
      price: "Narx",
      buyNow: "Xarid qilish",
      quantity: "Miqdor",
      totalPrice: "Umumiy Narx",
      confirmPurchase: "Xaridni Tasdiqlash",
      cancel: "Bekor qilish",
      error: "Mahsulotni olishda xatolik yuz berdi",
      success: "Sotib olindi!",
      required: "Iltimos to'ldiring",
      notEnoughCoin: "Tanga yetarli emas",
      coin: "tanga"
    },
  ],
  [
    Langs.RU,
    {
      title: "Детали Магазина",
      backButton: "Назад",
      coinBalance: "Баланс Монет",
      price: "Цена",
      buyNow: "Купить сейчас",
      quantity: "Количество",
      totalPrice: "Итоговая цена",
      confirmPurchase: "Подтвердить покупку",
      cancel: "Отменить",
      error: "Ошибка при получении продукта",
      success: "Куплено!",
      required: "Пожалуйста, заполните",
      notEnoughCoin: "Недостаточно монет",
      coin: "монета"

    },
  ],
  [
    Langs.EN,
    {
      title: "Shop Details",
      backButton: "Back",
      coinBalance: "Coin Balance",
      price: "Price",
      buyNow: "Buy Now",
      quantity: "Quantity",
      totalPrice: "Total Price",
      confirmPurchase: "Confirm Purchase",
      cancel: "Cancel",
      error: "Failed to fetch product",
      success: "Purchased!",
      required: "Please fill in",
      notEnoughCoin: "Not enough coin",
      coin: "coin"
    },
  ],
]);

function ShopDetail() {
  const { lang } = useContext(GlobalContext);
  const [course, setCourse] = useState<TCourses | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [coinBalance, setCoinBalance] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const contents = contentsMap.get(lang) as TNewsComponentContent;
  const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);
  // const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

 
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await client.get(`/shop/products/${id}/`);
        setCourse(response.data as TCourses);
      } catch (error) {
        // setError(contents.error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

 
  useEffect(() => {
    const fetchCoinBalance = async () => {
      try {
        const response = await client.get("/shop/wallet/");
        setCoinBalance(response.data.balance);
      } catch (error) {
        console.error("Failed to fetch coin balance:", error);
      }
    };
    fetchCoinBalance();
  }, []);


  const handlePurchase = async () => {
    if (course) {
      if (!quantity || Number(quantity) <= 0) {
       
        setErrorMessage(contents.error); 
        return; 
      }
      
      const totalPrice = course.price * Number(quantity); 
      if (coinBalance >= totalPrice) {
        try {
          await client.post("/shop/orders/create/", {
            product: course.id,
            count: Number(quantity),
          });
         
          setCoinBalance((prevBalance) => prevBalance - totalPrice);
          setQuantity("");
          setErrorMessage(""); 
      
          setTimeout(() => {
            toast.success(contents.success);
          }, 100); 
        } catch (error: unknown) {
          toast.error(contents.error);
        }
      } else {
    
        toast.error(contents.notEnoughCoin);
      }
    }
  };
  

  return (
    <div className="w-full mt-12 md:mt-0">
      <div className="container mx-auto px-4">
        <div className="my-5 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="w-12 h-12 my-3 bg-gray-200 hover:bg-gray-300 rounded"
          >
            <i className="fa-solid fa-arrow-left text-black"></i>
          </button>
          <h1 className="2xl:text-4xl text-center text-xl font-bold text-gray-900 dark:text-gray-100">
            {contents.title}
          </h1>
          <div className="md:flex hidden items-center">
            <p className="text-green-700 2xl:text-4xl text-3xl font-bold  mr-4">
              {contents.coinBalance}: {coinBalance}  <i className="fa-solid fa-coins"></i>
            </p>
          </div>
          <div className="flex md:hidden"/>
        </div>
      </div>

      <div className="flex justify-end md:hidden mb-5">
            <p className=" text-green-700  text-2xl font-semibold  mr-4">
              {contents.coinBalance}: {coinBalance}  <i className="fa-solid fa-coins"></i>
            </p>
          </div>

      <div className="2xl:h-[88%] h-[65%]  overflow-y-auto">
        {loading ? (
          <Loading />
        ) : (
          <>
            {course && (
              <div className="  flex  justify-center  ">
               <div className="bg-white dark:bg-gray-800 p-4 rounded flex flex-wrap justify-center gap-10 shadow-lg ">
               <img
                  src={course.image}
                  alt={course.name}
                  className="mb-4 h-[500px] md:w-[400px] object-cover rounded"
                />
               <div className="flex flex-col justify-center ">
            <div className=" ">
            <h2 className="text-xl uppercase pb-10 text-center font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {course.name}
                </h2>
               <div className="flex justify-between gap-40 items-center">
               <p className="text-lg font-bold mb-7 text-gray-900 dark:text-gray-100">
                  {contents.price}: {course.price}
                </p>
               </div>
               
               <div className="">
          <div className="mb-4">
            <label className="block text-sm mb-2 text-gray-900 dark:text-gray-300">
              {contents.quantity}:
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(String(e.target.value))}
              min={1}
              className="border rounded w-full p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
                          {errorMessage && (
                <p className="text-red-500 mt-2">{contents.required}</p>
              )}
          </div>
          <p className="text-gray-900 dark:text-gray-100">
  {contents.totalPrice}: {course ? course.price * Number(quantity) : 0} {contents.coin}
</p>

          <div className="flex gap-40 justify-between mt-8">
            <button
               type="submit"
              onClick={handlePurchase}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600 transition duration-200"
            >
              {contents.confirmPurchase}
            </button>
            <div />
          </div>
        </div>
            </div>
               </div>
               </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ShopDetail;
