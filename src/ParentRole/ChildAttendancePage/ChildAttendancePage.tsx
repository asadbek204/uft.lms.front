import { useState, useEffect, useContext } from 'react';
import { Table, Card, Tag, Spin, Empty, Typography, Divider, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import client from '../../components/services';
import { GlobalContext } from '../../App';
import { Langs } from '../../enums';

const { Title, Text } = Typography;

interface AttendanceRecord {
  id: number;
  student: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
      sure_name?: string;
    };
    groups?: {
      name: string;
      teacher?: {
        first_name: string;
        last_name: string;
        sure_name?: string;
      };
      module?: {
        id: number;
        name: string;
      };
      schedule?: Array<{
        id: number;
        day: string;
        starts_at: string;
        ends_at: string;
      }>;
    };
  };
  lesson: {
    date: string;
    group?: {
      name: string;
    };
  };
  score?: number | null;
  status: boolean;
  date: string;
}

const translations = {
  [Langs.UZ]: {
    title: "Farzandlarimning davomati",
    date: "Sana",
    module: "Modul",
    teacher: "O'qituvchi",
    group: "Guruh",
    schedule: "Dars jadvali",
    status: "Holati",
    score: "Baho",
    came: "Keldi",
    notCame: "Kelmadi",
    noData: "Davomat ma'lumotlari topilmadi",
    errorLoading: "Davomat ma'lumotlarini yuklab bo'lmadi",
    noModule: "—",
    noTeacher: "—",
    noGroup: "—",
    noSchedule: "—",
  },
  [Langs.RU]: {
    title: "Посещаемость моих детей",
    date: "Дата",
    module: "Модуль",
    teacher: "Преподаватель",
    group: "Группа",
    schedule: "Расписание",
    status: "Статус",
    score: "Оценка",
    came: "Присутствовал",
    notCame: "Отсутствовал",
    noData: "Данные по посещаемости не найдены",
    errorLoading: "Не удалось загрузить данные посещаемости",
    noModule: "—",
    noTeacher: "—",
    noGroup: "—",
    noSchedule: "—",
  },
  [Langs.EN]: {
    title: "My Children's Attendance",
    date: "Date",
    module: "Module",
    teacher: "Teacher",
    group: "Group",
    schedule: "Schedule",
    status: "Status",
    score: "Score",
    came: "Present",
    notCame: "Absent",
    noData: "No attendance records found",
    errorLoading: "Failed to load attendance data",
    noModule: "—",
    noTeacher: "—",
    noGroup: "—",
    noSchedule: "—",
  },
};

const ChildAttendancePage = () => {
  const { lang } = useContext(GlobalContext) || { lang: Langs.UZ };
  const t = translations[lang as keyof typeof translations] || translations[Langs.UZ];

  const [groupedByChild, setGroupedByChild] = useState<
    Map<
      number,
      {
        child: AttendanceRecord['student'];
        records: AttendanceRecord[];
      }
    >
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        setLoading(true);
        const response = await client.get('/education/attendance/children/');
        const data: AttendanceRecord[] = response.data || [];

        const grouped = new Map<
          number,
          { child: AttendanceRecord['student']; records: AttendanceRecord[] }
        >();

        data.forEach(record => {
          const childId = record.student.id;
          if (!grouped.has(childId)) {
            grouped.set(childId, {
              child: record.student,
              records: [],
            });
          }
          grouped.get(childId)!.records.push(record);
        });

        setGroupedByChild(grouped);
      } catch (err) {
        console.error('Attendance fetch error:', err);
        setError(t.errorLoading);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAttendance();
  }, [lang, t.errorLoading]);

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '—';
    let date: Date;
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      date = new Date(dateStr);
    } else {
      const cleaned = dateStr.split(' 00:00:00')[0] || dateStr;
      date = new Date(cleaned);
    }
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getDayName = (day: string) => {
    const days = {
      [Langs.UZ]: { MO: 'Du', TU: 'Se', WE: 'Ch', TH: 'Pa', FR: 'Ju', SA: 'Sh', SU: 'Ya' },
      [Langs.RU]: { MO: 'Пн', TU: 'Вт', WE: 'Ср', TH: 'Чт', FR: 'Пт', SA: 'Сб', SU: 'Вс' },
      [Langs.EN]: { MO: 'Mon', TU: 'Tue', WE: 'Wed', TH: 'Thu', FR: 'Fri', SA: 'Sat', SU: 'Sun' },
    };

    const langDays = days[lang as keyof typeof days] || days[Langs.UZ];
    return langDays[day as keyof typeof langDays] || day;
  };

  const getModuleNumber = (moduleName?: string) => {
    if (!moduleName) return '';
    const lower = moduleName.toLowerCase();
    if (lower.includes('first') || lower.includes('birinchi')) return '1';
    if (lower.includes('second') || lower.includes('ikkinchi')) return '2';
    if (lower.includes('third') || lower.includes('uchinchi')) return '3';
    return '';
  };

  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: t.date,
      key: 'date',
      width: 110,
  render: (_, record) => (
  <div className="text-gray-800 dark:text-gray-200">
    <Text strong>{formatDate(record.lesson.date)}</Text>
  </div>
)
,
      sorter: (a, b) => new Date(a.lesson.date).getTime() - new Date(b.lesson.date).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: t.module,
      key: 'module',
      width: 110,
      render: (_, record) => {
        const name = record.student.groups?.module?.name || '';
        const num = getModuleNumber(name);
        return num ? (
          <span className="dark:text-blue-400 text-blue-600 font-medium">
            {num}-{t.module}
          </span>
        ) : (
          name || t.noModule
        );
      },
    },
   {
  title: t.teacher,
  key: 'teacher',
  width: 180,
  render: (_, record) => {
    const teacher = record.student.groups?.teacher;

    if (!teacher) {
      return (
        <div className="text-gray-500 dark:text-gray-400">
          {t.noTeacher}
        </div>
      );
    }

    return (
      <div className="text-gray-100 dark:text-gray-800">
        {teacher.first_name} {teacher.last_name} {teacher.sure_name || ''}
      </div>
    );
  },
}
,
    {
      title: t.group,
      key: 'group',
      width: 140,
      render: (_, record) => (
        <Tag color="blue" className=" dark:text-blue-300 bg-blue-50 text-blue-700">
          {record.student.groups?.name || t.noGroup}
        </Tag>
      ),
    },
    {
      title: t.schedule,
      key: 'schedule',
      width: 200,
      render: (_, record) => {
        const sched = record.student.groups?.schedule || [];
        if (sched.length === 0) return <span className="text-gray-500 dark:text-gray-400">{t.noSchedule}</span>;

        return (
          <Tooltip
            title={
              <div className="text-xs">
                {sched.map(s => (
                  <div key={s.id}>
                    {getDayName(s.day)} {s.starts_at.slice(0, 5)}–{s.ends_at.slice(0, 5)}
                  </div>
                ))}
              </div>
            }
          >
            <div className=" text-gray-600 truncate max-w-[180px]">
              {sched.map(s => `${getDayName(s.day)} ${s.starts_at.slice(0, 5)}`).join(', ')}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t.status,
      key: 'status',
      width: 110,
      align: 'center',
      render: (_, record) =>
        record.status ? (
          <Tag color="success" className=" text-green-300">
            {t.came}
          </Tag>
        ) : (
          <Tag color="error" className="text-red-300">
            {t.notCame}
          </Tag>
        ),
    },
    {
      title: t.score,
      dataIndex: 'score',
      key: 'score',
      width: 80,
      align: 'center',
      render: (score: number | null) =>
        score != null ? (
          <Text strong className={score >= 80 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}>
            {score}
          </Text>
        ) : (
          <Text type="secondary" className="dark:text-gray-500">-</Text>
        ),
    },
  ];

  return (
    <div className="w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 ">
      <Card
        className="
          bg-white 
          dark:bg-gray-800 
          border-gray-200 
          dark:border-gray-700 
          shadow-sm 
          rounded-xl
        "
      >
        <Title
          level={4}
          className="mb-8 dark:text-gray-100 text-gray-800 text-center md:text-left"
        >
          {t.title}
        </Title>

        {loading ? (
          <div className="text-center py-24">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Empty description={<span className="dark:text-gray-400">{error}</span>} />
        ) : groupedByChild.size === 0 ? (
          <Empty description={<span className="dark:text-gray-400">{t.noData}</span>} />
        ) : (
          Array.from(groupedByChild.values()).map(({ child, records }) => (
            <div key={child.id} className="mb-12 last:mb-0">
              <Title
                level={5}
                className="mb-5 dark:text-gray-100 text-gray-800 flex items-center gap-2"
              >
                {child.user.first_name} {child.user.last_name}
                {child.user.sure_name && <span className="text-gray-500 dark:text-gray-400">({child.user.sure_name})</span>}
              </Title>

              {/* Desktop Table */}
              <div className="desktop-table overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={records}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                  scroll={{ x: 'max-content' }}
                  className="
                    dark:bg-gray-800 
                    dark:text-gray-200 
                    [&_.ant-table-thead>tr>th]:dark:bg-gray-700
                    [&_.ant-table-thead>tr>th]:dark:text-gray-300
                    [&_.ant-table-cell]:dark:border-gray-700
                    border-gray-200
                  "
                />
              </div>

              {/* Mobile Card-like Table */}
              <div className="mobile-table hidden">
                {records.map(record => (
                  <Card
                    key={record.id}
                    size="small"
                    className="
                      mb-4 
                      bg-white 
                      dark:bg-gray-800 
                      border-gray-200 
                      dark:border-gray-700
                    "
                  >
                    <div className="space-y-2">
                      <div className="font-semibold dark:text-gray-200 text-gray-800">
                        {formatDate(record.lesson.date)}
                      </div>
                      <div className="text-sm dark:text-gray-400 text-gray-600">
                        {record.student.groups?.name || t.noGroup}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {record.status ? (
                          <Tag color="success" className="dark:bg-green-900/40 dark:text-green-300">
                            {t.came}
                          </Tag>
                        ) : (
                          <Tag color="error" className="dark:bg-red-900/40 dark:text-red-300">
                            {t.notCame}
                          </Tag>
                        )}
                        {record.score != null && (
                          <span className="text-sm dark:text-gray-300 text-gray-700">
                            {t.score}: <strong>{record.score}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Divider className="dark:bg-gray-700 bg-gray-200" />
            </div>
          ))
        )}

        <style>{`
          @media (max-width: 1024px) {
            .desktop-table {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
          }
          @media (max-width: 768px) {
            .desktop-table {
              display: none;
            }
            .mobile-table {
              display: block;
            }
          }
        `}</style>
      </Card>
    </div>
  );
};

export default ChildAttendancePage;