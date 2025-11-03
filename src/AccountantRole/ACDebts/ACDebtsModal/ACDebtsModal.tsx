import React, { useState, FormEvent, useContext, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import client from "../../../components/services";
import { GlobalContext } from "../../../App";
import { Langs } from "../../../enums";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  fetchDebtorsData: () => void;
}

type TPaymentContent = {
  title: string;
  title1: string;
  title2: string;
  title3: string;
  success: string;
  accessDenied: string;
  failed: string;
  debtError: string; // yangi matn
};

type APIError = {
  response?: {
    status: number;
    data?: any;
  };
};

const contentsMap = new Map<Langs, TPaymentContent>([
  [
    Langs.UZ,
    {
      title: "To‘lov summasini kiriting",
      title1: "Summa",
      title2: "Bekor qilish",
      title3: "To‘lash",
      success: "To‘lov muvaffaqiyatli amalga oshirildi",
      accessDenied:
        "403: Ruxsat yo‘q. Sizda bu to‘lovni amalga oshirish huquqi yo‘q.",
      failed: "To‘lovni amalga oshirishda xatolik yuz berdi",
      debtError: "Sizning qarzingiz: ", 
    },
  ],
  [
    Langs.RU,
    {
      title: "Введите сумму платежа",
      title1: "Сумма",
      title2: "Отмена",
      title3: "Оплатить",
      success: "Платеж успешно выполнен",
      accessDenied:
        "403: Доступ запрещен. У вас нет прав для выполнения этого платежа.",
      failed: "Ошибка при обработке платежа",
      debtError: "Ваша задолженность: ",
    },
  ],
  [
    Langs.EN,
    {
      title: "Enter the payment amount",
      title1: "Amount",
      title2: "Cancel",
      title3: "Pay",
      success: "Payment successful",
      accessDenied: "403: Access denied. You do not have permission to make this payment.",
      failed: "Failed to process payment",
      debtError: "Your debt is: ",
    },
  ],
]);

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  studentId,
  fetchDebtorsData,
}) => {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang)!;
  const [amount, setAmount] = useState<string>("");
  const paymentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && paymentRef.current) {
      paymentRef.current.value = "";
      setAmount("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await client.post("students/payment/", {
        student: studentId,
        amount: Number(amount),
      });

      toast.success(contents.success);
      onClose();
      fetchDebtorsData();
    } catch (err) {
      const error = err as APIError;

      if (error.response) {
        const data = error.response.data;
        if (data?.amount && typeof data.amount === "string" && data.amount.includes("your debt")) {
          const debt = data.amount.replace("your debt is", "").trim();
          toast.error(`${contents.debtError}${debt}`);
          return;
        }

        if (error.response.status === 403) {
          toast.error(contents.accessDenied);
        } else {
          toast.error(contents.failed);
        }
      } else {
        toast.error(contents.failed);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 md:p-5 rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{contents.title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 md:mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {contents.title1}
            </label>
            <input
              ref={paymentRef}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 md:mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-3 md:px-4 rounded"
            >
              {contents.title2}
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 md:px-4 rounded"
            >
              {contents.title3}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
