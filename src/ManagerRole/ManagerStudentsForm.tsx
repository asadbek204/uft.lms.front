/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {useState, useEffect, useContext} from 'react';
import {Form, Input, InputNumber, DatePicker, Select, Button} from 'antd';
import InputMask from 'react-input-mask';
import {toast} from "react-toastify";
import moment, {Moment} from 'moment';
import {GlobalContext} from "../App.tsx";
import client from "../components/services";
import {Langs} from "../enums.ts";
import {useParams} from "react-router-dom"; 


type TGroup = {
    id: number,
    name: string,
    status: boolean,
    amount: string
}

type TNewsComponentContent = {
    title: string;
    first_name: string;
    last_name: string;
    sure_name: string;
    groups: string;
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
    invalid_pinfl: string,
    summa: string
};

const contentsMap = new Map<Langs, TNewsComponentContent>([
    [Langs.UZ, {
        invalid_passport: "Pasport raqami noto'g'ri! U 2 ta harfdan keyin 7 ta raqamdan iborat bo'lishi kerak",
        invalid_pinfl: "JSHSHIR 14 sondan iborat bo'lishi kerak",
        ivalid_value: "Qiymat notog'ri",
        title: "Yangi o'quvchi qo'shish",
        first_name: "Ism",
        last_name: "Familiya",
        sure_name: "Otasining ismi",
        groups: "Guruh",
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
        contract_maker: "Shartnoma tuzuvchi",
        summa: 'Modul narxi'
    }],
    [Langs.RU, {
        invalid_passport: "Неверный номер паспорта! Это должно быть 2 буквы, за которыми следуют 7 цифр",
        invalid_pinfl: "PINFL должен состоять из 14 цифр",
        ivalid_value: "Неверное значение",
        title: "Добавить нового студента",
        first_name: "Имя",
        last_name: "Фамилия",
        sure_name: "Отчество",
        groups: "Группа",
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
        contract_maker: "Контрактник",
        summa: 'Цена модуля'
    }],
    [Langs.EN, {
        invalid_passport: "Invalid passport number! It should be 2 letters followed by 7 digits",
        invalid_pinfl: "PINFL must be 14 digits long",
        ivalid_value: "Invalid value",
        title: "Add new student",
        first_name: "First Name",
        last_name: "Last Name",
        sure_name: "Surname",
        groups: "Groups",
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
        contract_maker: "Contract maker",
        summa: "Module price"
    }],
]);

function StudentsForm() {
    const {id} = useParams()
    const {lang} = useContext(GlobalContext);
    const contents = contentsMap.get(lang) as TNewsComponentContent;
    const [groups, setGroups] = useState<TGroup[]>([]);
    const {role} = useContext(GlobalContext);
    const [form] = Form.useForm();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await client.get(`education/group/list/?needed_role=${role}`);
                if (response.data) setGroups(response.data.filter((el: { status: unknown; }) => el.status) as TGroup[]);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        fetchData();
    }, [role]);

  

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function onFinish(data: any) {
        // Adjust data to meet Backend Criteria
        data.phone_number = `+998${data.phone_number.replace(/[^0-9]/g, '')}`;
        data.student.phone_number = `+998${data.student.phone_number.replace(/[^0-9]/g, '')}`;

        // Correctly format the birthday using Moment
        const birthday: Moment = moment(data.student.birthday);
        data.student.birthday = birthday.format('YYYY-MM-DD'); // Format to 'YYYY-MM-DD'

        // Adjust passport date
        if (data.passport_date) {
            const passportDate: Moment = moment(data.passport_date);
            data.passport_date = passportDate.format('YYYY-MM-DD');
        }

        const myAccountResponse = await client.get('accounts/me/');
        data.manager = myAccountResponse.data.roles[role];


        data.price = data.price || 0; // Default to 0 if not provided

        // Add additional data
        data.student.password = '1234';
        try {
            await client.post('students/agreement/create/', {old_student: id, ...data}, {
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
                    <Form.Item label={contents.groups} name={['student', 'groups']}
                               rules={[{required: true, message: contents.required}]}>
                        <Select>
                            {groups?.map(item => (
                                <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label={contents.summa} name="price"
                               rules={[{required: false, message: contents.required}]}>
                        <InputNumber min={0} style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item label={contents.discount} name="discount"
                               rules={[{required: false, message: contents.required}]}>
                        <InputNumber min={0} style={{width: '100%'}}/>
                    </Form.Item>
                </div>

                {/* Student Information */}
                <h3 className="text-2xl font-medium mb-4">{contents.student}</h3>
                <div className="md:grid grid-cols-3 gap-x-[30px] gap-y-[10px] mb-4">
                    <Form.Item label={contents.first_name} name={['student', 'first_name']}
                               rules={[{required: true, message: contents.required}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={contents.last_name} name={['student', 'last_name']}
                               rules={[{required: true, message: contents.required}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={contents.sure_name} name={['student', 'sure_name']}
                               rules={[{required: true, message: contents.required}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={contents.phone_number} name={['student', 'phone_number']} rules={[
                        {required: true, message: contents.required},
                        // { validator: validatePhoneNumber }
                    ]}>
                        <InputMask mask="(99) 999-99-99">
                            {/* @ts-expect-error */}

                            {(inputProps) => <Input {...inputProps} addonBefore="+998"/>}
                        </InputMask>
                    </Form.Item>
                    <Form.Item label={contents.birthday} name={['student', 'birthday']}
                               rules={[{required: false, message: contents.required}]}>
                        <DatePicker placeholder="DD.MM.YYYY" format="DD.MM.YYYY" style={{width: '100%'}}/>
                    </Form.Item>
                </div>

                <Form.Item className="[&_button]:w-[200px]">
                    <Button type="primary" htmlType="submit">{contents.submit}</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default StudentsForm;

