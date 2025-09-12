import { useEffect, useState, useContext } from "react";
import Loading from "../../components/LoadingComponent/Loading.tsx";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";
import client from "../../components/services"; 


type Order = {
  id: string;
  created_at: string;
  product: {
    id: number;
    name: string;
    image: string;
    category: number;
    price: string;
    tags: string;
  };
};

type TNewsComponentContent = {
  title: string;
  empty: string;
  order: string;
  product: string;
  date: string
};

const contentsMap = new Map<Langs, TNewsComponentContent>([
  [Langs.UZ, { 
    title: "To'lovlar tarixi", 
    empty:"Siz hali hech narsa sotib olmagansiz",
    order: "Buyurtma ID si",
    product: "Mahsulot",
    date: "Sana"

  }],
  [Langs.RU, { 
    title: "Платежи", 
    empty:"Вы еще ничего не купили" ,
    order: "ID заказа",
    product: "Продукт",
    date: "Дата"
  }],
  [Langs.EN, { 
    title: "Payments", 
    empty:"You haven't bought anything yet" ,
    order: "Order ID",
    product: "Product",
    date: "Date"
  }],
]);

function OrderList() {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TNewsComponentContent;
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await client.get("/shop/orders/list/");
            setOrders(response.data);
        } catch (error) {
            console.error("Buyurtmalarni olishda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchOrders();
}, []);

return (
    <div className="w-full mt-12 md:mt-0">
      <div className="header mt-5 mx-5 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="w-12 h-12 my-3 ms-5 bg-gray-200 hover:bg-gray-300 rounded"
        >
          <i className="fa-solid fa-arrow-left text-black"></i>
        </button>
        <div className="flex w-full my-5 justify-center align-center">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold dark:text-customText">
            {contents.title}
          </h1>
        </div>
        <div className="w-12 invisible"></div>
      </div>
      <div className="2xl:h-[88%] h-[75%] overflow-y-auto">
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? ( 
          <div className="flex justify-center items-center h-full">
            <p className="text-lg font-semibold text-gray-500">
             {contents.empty}
            </p>
          </div>
        ) : (
          <div className="px-4 md:px-10 py-4 flex flex-col gap-4">
            <div className="hidden md:flex justify-between px-4 py-2 bg-gray-200 dark:text-gray-100  dark:bg-gray-800 rounded-xl font-bold text-sm">
              <div className="w-1/12">{contents.order}</div>
              <div className="w-5/12">{contents.product}</div>
              <div className="w-2/12">{contents.date}</div>
            </div>
            {orders.map((order) => {
              const { id, product, created_at: date } = order;
              const productImage = product?.image || "https://via.placeholder.com/500x500";
              const productName = product?.name || "Noma'lum mahsulot";
              const productTags = product?.tags || "Manzil kiritilmagan";
  
              return (
                <div
                  key={id}
                  className="flex justify-between bg-gray-200  dark:bg-gray-800 dark:text-gray-100 rounded-2xl my-2 items-center px-4 py-4"
                >
                  <div className="w-1/12 flex items-center">
                    <span>{id}</span>
                  </div>
                  <div className="w-5/12 flex items-center">
                    <img
                      src={productImage}
                      alt={productName}
                      className="h-12 w-12 rounded-md mr-4"
                    />
                    <div>
                      <h2 className="font-semibold">{productName}</h2>
                      <p className="text-sm text-gray-500">{productTags}</p>
                    </div>
                  </div>
                  <div className="w-2/12">{date}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
  
}

export default OrderList;
