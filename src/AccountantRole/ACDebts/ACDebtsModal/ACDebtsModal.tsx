import React, { useState, FormEvent, useContext, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import client from '../../../components/services';
import { GlobalContext } from '../../../App';
import { Langs } from '../../../enums';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  fetchDebtorsData: () => void;
}

type TNewsComponentContent = {
  title: string;
  title1: string;
  title2: string;
  title3: string;
}

type APIError = {
  response?: {
    status: number;
  };
};

const contentsMap = new Map<Langs, TNewsComponentContent>([
  [Langs.UZ, { 
    title: "To'lo'v summasini kiriting",
    title1: "Summa",
    title2: "Bekor qilish",
    title3: "To'lash",
  }],
  [Langs.RU, { 
    title: "Введите сумму платежа",
    title1: "Суммa",
    title2: "Отмена",
    title3: "Платить"
  }],
  [Langs.EN, { 
    title: "Enter the payment amount",
    title1: "Amount",
    title2: "Cancel",
    title3: "Pay"
  }],
]);

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, studentId, fetchDebtorsData }) => {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TNewsComponentContent;
  const [amount, setAmount] = useState<string>("");
  const paymentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (paymentRef.current) {
      paymentRef.current.value = '';
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await client.post('students/payment/', {
        student: studentId,
        amount: Number(amount)
      });
      toast.success('Payment successful');
      onClose();
      fetchDebtorsData();
    } catch (err) {
      const error = err as APIError;

      if (error.response && error.response.status === 403) {
        toast.error('403: Access denied. You do not have permission to make this payment.');
      } else {
        toast.error('Failed to process payment');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white p-4 md:p-5 rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{contents.title}</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-3 md:mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{contents.title1}</label>
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
