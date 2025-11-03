import {Pages, Roles} from './enums'
import {TTranslator} from './types'
import coursesIcon from '../src/images/nav-icons/courses.svg'
import teachersIcon from '../src/images/nav-icons/teachers.svg'
import groupsIcon from '../src/images/nav-icons/groups.svg'
import debtsIcon from '../src/images/nav-icons/debts.svg'
import videosIcon from '../src/images/nav-icons/video.svg'
import topicsIcon from '../src/images/nav-icons/topics.svg'
import newsIcon from '../src/images/nav-icons/news.svg'
import attendanceIcon from '../src/images/nav-icons/attendance.svg'
import addStaffIcon from '../src/images/nav-icons/add-staff.svg'
import paymentIcon from '../src/images/nav-icons/payment.svg'
import settingsIcon from '../src/images/nav-icons/settings.svg'
import booksIcon from '../src/images/nav-icons/open-book.svg'
import shopIcon from '../src/images/nav-icons/shop.svg'

export const Icons = new Map<Pages, any>([
    [Pages.Courses, coursesIcon],
    [Pages.Teachers, teachersIcon],
    [Pages.Groups, groupsIcon],
    [Pages.Debts, debtsIcon],
    [Pages.Videos, videosIcon],
    [Pages.Topics, topicsIcon],
    [Pages.News, newsIcon],
    [Pages.Attendance, attendanceIcon],
    [Pages.StaffList, addStaffIcon],
    [Pages.ClassSchedule, addStaffIcon],
    [Pages.Payments, paymentIcon],
    [Pages.Settings, settingsIcon],
    [Pages.Library, booksIcon],
    [Pages.Shop, shopIcon],
    [Pages.Contracts, topicsIcon]

])

export const Translator = new Map<Pages, TTranslator>([

    [Pages.Home, {
        uz: 'Bobir Akilkhanov',
        ru: 'Bobir Akilkhanov',
        en: 'Bobir Akilkhanov'
    }],

    [Pages.Courses, {
        uz: 'Kurslar',
        ru: 'Курсы',
        en: 'Courses'
    }],

    [Pages.Teachers, {
        uz: 'O\'qituvchilar',
        ru: 'Учителя',
        en: 'Teachers'
    }],

    [Pages.Groups, {
        uz: 'Guruhlar',
        ru: 'Группы',
        en: 'Groups'
    }],

    [Pages.Debts, {
        uz: 'Qarzdorlik',
        ru: 'Задолженность',
        en: 'Debtors'
    }],

    [Pages.Videos, {
        uz: 'Videolar',
        ru: 'Видео',
        en: 'Videos'
    }],

    [Pages.Topics, {
        uz: 'Mavzular',
        ru: 'Темы',
        en: 'Topics'
    }],


    [Pages.News, {
        uz: 'Yangiliklar',
        ru: 'Новости',
        en: 'News'
    }],

    [Pages.Attendance, {
        uz: 'Davomat',
        ru: 'Посещаемость',
        en: 'Attendance'
    }],

    [Pages.ClassSchedule, {
        uz: 'Dars jadvali',
        ru: 'Расписание',
        en: 'Schedule'
    }],

    [Pages.StaffList, {
        uz: 'Xodimlar ro\'yxati',
        ru: 'Список персонала',
        en: 'Stuff list'
    }],

    [Pages.Payments, {
        uz: 'To\'lo\'vlar',
        ru: 'Платежи',
        en: 'Payments'
    }],

    [Pages.Settings, {
        uz: 'Sozlamalar',
        ru: 'Настройки',
        en: 'Settings'
    }],

    [Pages.Library, {
        uz: 'Kutubxona',
        ru: 'Библиотека',
        en: 'Library'
    }],
    [Pages.Shop, {
        uz: 'Do\'kon',
        ru: 'Магазин',
        en: 'Shop'
    }],
    [Pages.Contracts, {
        uz: 'Kontraktlar',
        ru: 'Контракты',
        en: 'Contracts'
    }]
])

const PagesMap = new Map<Roles, Pages[]>([

    [Roles.Admin, [
        Pages.Courses,
        Pages.Teachers,
        Pages.Groups,
        Pages.Debts,
        Pages.Videos,
        Pages.Topics,
        Pages.Attendance,
        Pages.StaffList,
        Pages.Library,
        Pages.News,
        Pages.Shop,
        Pages.Settings

    ]],

    [Roles.Teacher, [
        Pages.Groups,
        Pages.Topics,
        Pages.Attendance,
        Pages.ClassSchedule,
        Pages.Library,
        Pages.News,
        Pages.Settings
    ]],

    
    [Roles.Support, [
        Pages.Groups,
        Pages.Topics,
        Pages.Attendance,
        Pages.ClassSchedule,
        Pages.Library,
        Pages.News,
        Pages.Settings
    ]],

    [Roles.Student, [
        Pages.Topics,
        Pages.Payments,
        Pages.Attendance,
        Pages.Videos,
        Pages.Library,
        Pages.News,
        Pages.Shop,
        Pages.Settings
    ]],

    [Roles.Accountant, [
        Pages.Teachers,
        Pages.Debts,
        Pages.News,
        Pages.Settings
    ]],

    [Roles.Manager, [
        Pages.Contracts,
        Pages.Debts,  
        Pages.Library,
        Pages.News,
        Pages.Settings
    ]]
])
export default PagesMap