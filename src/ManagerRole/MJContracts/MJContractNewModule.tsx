/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {useEffect, useContext, useState} from 'react';
import {Form, Input, InputNumber, DatePicker, Button} from 'antd';
import InputMask from 'react-input-mask';
import {toast} from "react-toastify";
import moment, {Moment} from 'moment';
import {Langs} from "../../enums.ts";
import {GlobalContext} from "../../App.tsx";
import client from "../../components/services";
import {useParams} from "react-router-dom";


// type TUser = {
//     id: number,
//     name: string,
//     status: boolean,
//     amount: string,
//     first_name?: string,
//     last_name?: string,
//     surname?: string,
//     phone_number?: string,
//     passport_seria?: string,
//     pinfl?: string,
//     passport_date?: string,
//     passport_address?: string,
//     address?: string,
//     discount?: number,
//     student?: {
//         first_name?: string,
//         sure_name?: string,
//         last_name?: string,
//         phone_number?: string,
//         birthday?: string,
//         groups?: number
//     }
// }


type MJContractModuleContent = {
    title: string;
    first_name: string;
    last_name: string;
    sure_name: string;
    groups: string;
    price: string;
    refereed_by: string;
    phone_number: string;
    gender: string;
    birthday: string;
    passport: string;
    pinfl: string;
    email: string;
    password: string;
    status: string;
    submit: string;
    choose1: string;
    choose2: string;
    choose3: string;
    choose4: string;
    man: string;
    woman: string;
    amount: string;
    discount: string;
    total: string;
    course: string;
    address: string;
    passport_address: string;
    education_language: string;
    uzbek: string;
    russian: string;
    required: string;
    cfirst_name: string,
    clast_name: string,
    csure_name: string,
    error1: string,
    error2: string,
    pasportdate: string,
    student: string,
    contract_maker: string,
    ivalid_value: string,
    invalid_passport: string,
    invalid_pinfl: string
};

const contentsMap = new Map<Langs, MJContractModuleContent>([
    [Langs.UZ, {
        invalid_passport: "Pasport raqami noto'g'ri! U 2 ta harfdan keyin 7 ta raqamdan iborat bo'lishi kerak",
        invalid_pinfl: "JSHSHIR 14 sondan iborat bo'lishi kerak",
        ivalid_value: "Qiymat notog'ri",
        title: "Yangi kontrakt qo'shish",
        first_name: "Ism",
        last_name: "Familiya",
        sure_name: "Otasining ismi",
        groups: "Guruh",
        price: "To'lov summmasi",
        refereed_by: "Yuborgan shaxs",
        phone_number: "Telefon raqami",
        gender: "Jinsi",
        birthday: "Tug'ilgan sana",
        passport: "Pasport",
        pinfl: "JSHSHIR",
        email: "Email",
        password: "Parol",
        status: "Holati",
        submit: "Yuborish",
        choose1: "Guruhni tanlang",
        choose2: "Jinsini tanlang",
        choose3: "Ta'lim tilini tanlang",
        choose4: "Kursni tanlang",
        man: "Erkak",
        woman: "Ayol",
        amount: "Summa",
        discount: "Chegirma",
        total: "Umumiy hisob",
        course: "Kurs nomi",
        address: "Manzil",
        passport_address: "Pasport kim tomonidan berilgan",
        education_language: "Ta'lim tili",
        uzbek: "O'zbek tili",
        russian: "Rus tili",
        required: "to'ldirish shart",
        cfirst_name: 'Shartnoma tuzuvchining ismi',
        clast_name: 'Shartnoma tuzuvchining familiyasi',
        csure_name: 'Shartnoma tuzuvchining otasining ismi',
        error1: "muvaffaqiyatli qo'shildi",
        error2: "qo'shib bo'lmadi",
        pasportdate: "Pasport berilgan sana",
        student: "Talaba",
        contract_maker: "Shartnoma tuzuvchi"
    }],
    [Langs.RU, {
        invalid_passport: "Неверный номер паспорта! Это должно быть 2 буквы, за которыми следуют 7 цифр",
        invalid_pinfl: "PINFL должен состоять из 14 цифр",
        ivalid_value: "Неверное значение",
        title: "Продлить контракт",
        first_name: "Имя",
        last_name: "Фамилия",
        sure_name: "Отчество",
        groups: "Группа",
        price: "Сумма платежа",
        refereed_by: "Рекомендатель",
        phone_number: "Телефон",
        gender: "Пол",
        birthday: "Дата рождения",
        passport: "Паспорт",
        pinfl: "ПИНФЛ",
        email: "Эл. адрес",
        password: "Пароль",
        status: "Статус",
        submit: "Отправить",
        choose1: "Выберите группу",
        choose2: "Выберите пол",
        choose3: "Выберите язык обучения",
        choose4: "Выбрать курс",
        man: "Мужчина",
        woman: "Женщина",
        amount: "Сумма",
        discount: "Скидка",
        total: "Итог",
        course: "Название курса",
        address: "Адрес",
        passport_address: "Кем выдан паспорт",
        education_language: "Язык обучения",
        uzbek: "Узбекский",
        russian: "Русский",
        required: "должен быть заполнен",
        cfirst_name: 'Имя подрядчика',
        clast_name: 'Фамилия подрядчика',
        csure_name: 'Имя отца договаривающейся стороны',
        error1: "успешно добавлено",
        error2: "не удалось добавить",
        pasportdate: "Дата выдачи паспорта",
        student: "Студент",
        contract_maker: "Контрактник"
    }],
    [Langs.EN, {
        invalid_passport: "Invalid passport number! It should be 2 letters followed by 7 digits",
        invalid_pinfl: "PINFL must be 14 digits long",
        ivalid_value: "Invalid value",
        title: "Add new contract",
        first_name: "First Name",
        last_name: "Last Name",
        sure_name: "Surname",
        groups: "Groups",
        price: "Payment",
        refereed_by: "Referred by",
        phone_number: "Phone Number",
        gender: "Gender",
        birthday: "Birthday",
        passport: "Passport",
        pinfl: "PINFL",
        email: "Email",
        password: "Password",
        status: "Status",
        submit: "Submit",
        choose1: "Select group",
        choose2: "Select gender",
        choose3: "Select the language of instruction",
        choose4: "Choose a course",
        man: "Male",
        woman: "Female",
        amount: "Amount",
        discount: "Discount",
        total: "Total",
        course: "Course name",
        address: "Address",
        passport_address: "Passport issued by",
        education_language: "Education language",
        uzbek: "Uzbek",
        russian: "Russian",
        required: "required",
        cfirst_name: 'Name of the contractor',
        clast_name: 'Surname of the contractor',
        csure_name: "Father's name of the contracting party",
        error1: "successfully added",
        error2: "failed to add",
        pasportdate: "Passport issue date",
        student: "Student",
        contract_maker: "Contract maker"
    }],
]);

function MJContractNewModule() {
    const {id} = useParams()
    const {lang, role} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as MJContractModuleContent;
    const [form] = Form.useForm();
    const [studentId, setStudentId] = useState(0)


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await client.get(`/students/agreement/${id}/`);
                console.log(response.data)

                if (response.data) {
                    setStudentId(response.data.student.id)
                    // Set the form values directly from response.data
                    form.setFieldsValue({
                        // Contract maker fields
                        last_name: response.data.last_name,
                        first_name: response.data.first_name,
                        surname: response.data.surname,
                        phone_number: response.data.phone_number?.replace('+998', ''),
                        passport_seria: response.data.passport_seria,
                        pinfl: response.data.pinfl,
                        passport_date: response.data.passport_date ? moment(response.data.passport_date) : null,
                        passport_address: response.data.passport_address,
                        address: response.data.address,
                        discount: 0,
                        groups: response.data.student.groups.name,
                        price: response.data.price
                        // Student fields


                    });

                    // bu nimaga ?
                    // if (Array.isArray(response.data.groups)) {
                    //     setGroups(response.data.groups.filter((el: { status: unknown; }) => el.status));
                    // }

                }
            } catch (error) {
                console.error('Error fetching data: ', error);
                toast.error('Failed to load initial data');
            }
        }

        if (id) {
            fetchData();
        }
    }, [form, id]);
    // function validatePhoneNumber(_: unknown, value: string) {
    //     const unmaskedValue = value?.replace(/\D/g, '');
    //     if (unmaskedValue && unmaskedValue.length === 9) return Promise.resolve();
    //     return Promise.reject(new Error(contents.ivalid_value));
    // }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function onFinish(data: any) {
        // Adjust data to meet Backend Criteria
        console.log('onfinish')
        data.phone_number = `+998${data.phone_number.replace(/[^0-9]/g, '')}`;
        // data.student.phone_number = `+998${data.student.phone_number.replace(/[^0-9]/g, '')}`;

        // Correctly format the birthday using Moment
        // const birthday: Moment = moment(data.student.birthday);
        // data.student.birthday = birthday.format('YYYY-MM-DD'); // Format to 'YYYY-MM-DD'

        // Adjust passport date
        if (data.passport_date) {
            const passportDate: Moment = moment(data.passport_date);
            data.passport_date = passportDate.format('YYYY-MM-DD');
        }

        const myAccountResponse = await client.get('accounts/me/');
        data.manager = myAccountResponse.data.roles[role];
        data.old_student = studentId
        // Add additional data
        try {
            await client.post('students/agreement/create/', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            toast.success(contents.error1);
        } catch (error) {
            toast.error(contents.error2);
            console.error(error);
        }
    }
    return (
        <div className="px-10 w-full mt-12 md:mt-0">
            <div className="flex items-center mb-8">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-[50px] h-[50px] rounded-xl bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
                >
                    <i className="fa-solid fa-arrow-left dark:text-white"></i>
                </button>
                <h1 className="text-center text-3xl dark:text-white font-semibold font-sans mx-auto">{contents.title}</h1>
            </div>
            <Form className='w-full 2xl:h-[87%] h-[65%] overflow-y-auto' layout="vertical" size="large" form={form}
                  onFinish={onFinish}>

                {/* Contract Maker Information */}
                <h3 className="text-2xl font-medium mb-4">{contents.contract_maker}</h3>
                <div className="md:grid grid-cols-4 gap-x-[30px] gap-y-[10px] mb-6">
                    <Form.Item label={contents.last_name} name="last_name"
                               rules={[{required: false, message: contents.required}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={contents.first_name} name="first_name"
                               rules={[{required: false, message: contents.required}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={contents.sure_name} name="surname"
                               rules={[{required: false, message: contents.required}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={contents.phone_number} name="phone_number" rules={[
                        {required: false, message: contents.required},
                        // { validator: validatePhoneNumber }
                    ]}>
                        <InputMask mask="(99) 999-99-99">
                            {/* @ts-expect-error */}

                            {(inputProps) => <Input {...inputProps} addonBefore="+998" minLength={14}/>}
                        </InputMask>
                    </Form.Item>
                    <Form.Item
                        label={contents.passport}
                        name="passport_seria"
                        rules={[
                            {
                                required: false,
                                message: contents.required,
                            },
                            {
                                pattern: /^[A-Z]{2}\d{7}$/,
                                message: contents.invalid_passport,
                            },
                        ]}
                    >
                        <Input placeholder="AA1234567" maxLength={9}/>
                    </Form.Item>
                    <Form.Item label={contents.pinfl} name="pinfl" rules={[
                        {required: false, message: contents.required},
                        {len: 14, message: contents.invalid_pinfl},
                        {pattern: /^[0-9]*$/, message: contents.ivalid_value}
                    ]}>
                        <Input maxLength={14}/>
                    </Form.Item>
                    <Form.Item label={contents.pasportdate} name="passport_date"
                               rules={[{required: false, message: contents.required}]}>
                        <DatePicker placeholder="DD.MM.YYYY" format="DD.MM.YYYY" style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item label={contents.passport_address} name="passport_address"
                               rules={[{required: false, message: contents.required}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item className="col-span-1" label={contents.address} name="address"
                               rules={[{required: false, message: contents.required}]}>
                        <Input/>
                    </Form.Item>

                    <Form.Item label={contents.groups} name="groups"
                               rules={[{required: false, message: contents.required}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={contents.price} name="price"
                               rules={[{required: false, message: contents.required}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={contents.discount} name="discount"
                               rules={[{required: false, message: contents.required}]}>
                        <InputNumber min={0} style={{width: '100%'}}/>
                    </Form.Item>
                </div>



                <Form.Item className="[&_button]:w-[200px]">
                    <Button type="primary" htmlType="submit">{contents.submit}</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default MJContractNewModule;
