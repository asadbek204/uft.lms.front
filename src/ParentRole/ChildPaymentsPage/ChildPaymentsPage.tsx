import { useState, useEffect, useContext } from "react";
import {
  Card,
  Table,
  Statistic,
  Divider,
  Spin,
  Alert,
  Typography,
  Row,
  Col,
  Tag,
  Badge,
  Space,
} from "antd";
import { DollarOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import client from "../../components/services";
import { toast } from "react-toastify";
import moment from "moment";
import { GlobalContext } from "../../App";
import { Langs } from "../../enums";

const { Title, Text } = Typography;

const translations = {
  [Langs.UZ]: {
    title: "Farzandlar to‘lov holati",
    loading: "Ma'lumotlar yuklanmoqda...",
    noData: "Hozircha farzandlaringizning to'lov ma'lumotlari mavjud emas",
    statusActive: "Faol",
    statusInactive: "Faol emas",
    totalPaid: "To‘langan jami",
    debt: "Qarzdorlik",
    currentModule: "Joriy modul",
    modulePayments: "Modul bo‘yicha to‘lovlar",
    paymentsThisModule: "Ushbu modul bo‘yicha to‘lovlar:",
    noPaymentsThisModule: "Ushbu modul bo‘yicha hali to‘lov yo‘q",
    overallPaymentsHistory: "Umumiy to‘lovlar tarixi",
    date: "Sana",
    paymentAmount: "To‘lov summasi",
    balance: "Qoldiq",
    noPayments: "Hali to‘lov yo‘q",
  },
  [Langs.RU]: {
    title: "Состояние платежей детей",
    loading: "Загрузка данных...",
    noData: "На данный момент нет информации о платежах ваших детей",
    statusActive: "Активен",
    statusInactive: "Неактивен",
    totalPaid: "Всего оплачено",
    debt: "Задолженность",
    currentModule: "Текущий модуль",
    modulePayments: "Платежи по модулю",
    paymentsThisModule: "Платежи по данному модулю:",
    noPaymentsThisModule: "По данному модулю платежей пока нет",
    overallPaymentsHistory: "История всех платежей",
    date: "Дата",
    paymentAmount: "Сумма платежа",
    balance: "Остаток",
    noPayments: "Платежей пока нет",
  },
  [Langs.EN]: {
    title: "Children's Payment Status",
    loading: "Loading data...",
    noData: "No payment information available for your children yet",
    statusActive: "Active",
    statusInactive: "Inactive",
    totalPaid: "Total Paid",
    debt: "Debt",
    currentModule: "Current Module",
    modulePayments: "Payments by Module",
    paymentsThisModule: "Payments for this module:",
    noPaymentsThisModule: "No payments for this module yet",
    overallPaymentsHistory: "Overall Payment History",
    date: "Date",
    paymentAmount: "Payment Amount",
    balance: "Balance",
    noPayments: "No payments yet",
  },
};

interface ModulePayment {
  id?: number;
  date: string;
  amount: string;
  total: string;
}

interface ModuleSummary {
  name: string;
  total_payment: number;
  debt: number;
  payments: ModulePayment[];
  discount: any[];
}

interface ChildPaymentItem {
  student: {
    id: number;
    full_name: string;
    status: string;
    group: string;
  };
  current_module: string;
  total_debt: number;
  total_payment: number;
  modules: ModuleSummary[];
  payments: ModulePayment[];
  discounts: any[];
}

const ChildPaymentsPage = () => {
  const { lang } = useContext(GlobalContext) || { lang: Langs.UZ };
  const t = translations[lang as Langs] || translations[Langs.UZ];

  const [data, setData] = useState<ChildPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildPayments = async () => {
      try {
        setLoading(true);
        const response = await client.get("/students/payment/parents/");
        const result = Array.isArray(response.data) ? response.data : [];
        setData(result);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xato:", error);
        toast.error(t.noData);
      } finally {
        setLoading(false);
      }
    };

    fetchChildPayments();
  }, [lang]);

  const paymentColumns: ColumnsType<ModulePayment> = [
    {
      title: t.date,
      dataIndex: "date",
      key: "date",
      render: (date: string) =>
        date ? moment(date).format("DD.MM.YYYY HH:mm") : "—",
    },
    {
      title: t.paymentAmount,
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => (
        <Text strong style={{ color: "#52c41a" }}>
          {amount ? Number(amount).toLocaleString("ru-RU") : "0"} so'm
        </Text>
      ),
    },
    {
      title: t.balance,
      dataIndex: "total",
      key: "total",
      render: (total: string) => {
        const value = Number(total || 0);
        return (
          <Text strong style={{ color: value >= 0 ? "#52c41a" : "#f5222d" }}>
            {value.toLocaleString("ru-RU")} so'm
          </Text>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" tip={t.loading} />
      </div>
    );
  }

  if (!data.length) {
    return (
      <Alert
        message={t.noData}
        type="info"
        showIcon
        style={{ maxWidth: 600, margin: "40px auto" }}
      />
    );
  }

  return (
    <div className="w-full  overflow-y-scroll mx-auto px-4 py-6 ">
      <Title
        level={2}
        className="dark:text-gray-100 text-gray-800 mb-10 text-center"
      >
        {t.title}
      </Title>

      <Row gutter={[16, 24]}>
        {data.map((item) => {
          const {
            student,
            total_debt,
            total_payment,
            current_module,
            modules = [],
          } = item;
          const hasDebt = total_debt > 0;

          return (
            <Col xs={24} sm={24} md={24} lg={24} xl={24} key={student.id}>
              <Card
                hoverable
                className="
                  dark:bg-gray-800 
                  dark:border-gray-700 
                  bg-white 
                  border-gray-200 
                  shadow-sm
                  rounded-xl
                "
                title={
                  <Space size="middle">
                    <UserOutlined style={{ fontSize: 22, color: "#1890ff" }} />
                    <div>
                      <div className="text-base font-semibold dark:text-gray-100 text-gray-800">
                        {student.full_name}
                      </div>
                      <Badge
                        status={
                          student.status === "active" ? "success" : "default"
                        }
                        text={
                          <span className="dark:text-white text-gray-800">
                            {student.status === "active"
                              ? t.statusActive
                              : t.statusInactive}
                          </span>
                        }
                      />
                    </div>
                  </Space>
                }
                extra={
                  <Tag
                    color={hasDebt ? "error" : "success"}
                    className="text-sm font-medium px-3 py-1"
                  >
                    {t.debt}: {total_debt.toLocaleString("ru-RU")} so'm
                  </Tag>
                }
              >
                <Row
                  gutter={16}
                  className="mb-6 dark:[&_.ant-statistic-title]:text-gray-300 [&_.ant-statistic-title]:font-semibold"
                >
                  <Col span={12}>
                    <Statistic
                      title={t.totalPaid}
                      value={total_payment}
                      precision={0}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<DollarOutlined />}
                      suffix=" so'm"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={t.debt}
                      value={total_debt}
                      precision={0}
                      valueStyle={{ color: hasDebt ? "#cf1322" : "#3f8600" }}
                      prefix={<DollarOutlined />}
                      suffix=" so'm"
                    />
                  </Col>
                </Row>

                <Divider
                  className="dark:text-gray-400 text-gray-600"
                  orientation="left"
                >
                  {t.currentModule}
                </Divider>

                <div className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-6">
                  {current_module || "—"}
                </div>

                {modules.length > 0 && (
                  <>
                    <Divider
                      orientation="left"
                      className="dark:text-gray-400 text-gray-600"
                    >
                      {t.modulePayments}
                    </Divider>

                    {modules.map((mod, idx) => (
                      <div key={idx} className="mb-8">
                        <Space align="center" className="mb-3">
                          <TeamOutlined className="text-gray-500 dark:text-gray-400" />
                          <Text
                            strong
                            className="dark:text-gray-200 text-gray-800"
                          >
                            {mod.name}
                          </Text>
                        </Space>

                        <Row
                          gutter={16}
                          className="mb-6 dark:[&_.ant-statistic-title]:text-gray-300 [&_.ant-statistic-title]:font-semibold"
                        >
                          <Col span={12}>
                            <Statistic
                              title={t.totalPaid}
                              value={mod.total_payment}
                              suffix=" so'm"
                              valueStyle={{ fontSize: 16, color: "#3f8600" }}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              title={t.debt}
                              value={mod.debt}
                              suffix=" so'm"
                              valueStyle={{
                                color: mod.debt > 0 ? "#cf1322" : "#3f8600",
                                fontSize: 16,
                              }}
                            />
                          </Col>
                        </Row>

                        {mod.payments?.length > 0 ? (
                          <>
                            <Text
                              type="secondary"
                              className="dark:text-gray-400 text-gray-600 block mb-3"
                            >
                              {t.paymentsThisModule}
                            </Text>

                            <Table
                              columns={paymentColumns}
                              dataSource={mod.payments}
                              rowKey="id"
                              pagination={false}
                              size="small"
                              bordered
                              className="
                                dark:bg-gray-900 
                                dark:text-gray-200 
                                [&_.ant-table-thead>tr>th]:dark:bg-gray-800
                                [&_.ant-table-thead>tr>th]:dark:text-gray-300
                                [&_.ant-table-cell]:dark:border-gray-700
                                border-gray-200
                              "
                            />
                          </>
                        ) : (
                          <Text
                            type="secondary"
                            className="dark:text-gray-500 text-gray-500 block mt-3"
                          >
                            {t.noPaymentsThisModule}
                          </Text>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {item.payments?.length > 0 && (
                  <>
                    <Divider
                      orientation="left"
                      className="dark:text-gray-400 text-gray-600 mt-8"
                    >
                      {t.overallPaymentsHistory}
                    </Divider>

                    <Table
                      columns={paymentColumns}
                      dataSource={item.payments}
                      rowKey="id"
                      pagination={false}
                      size="small"
                      bordered
                      className="
                        dark:bg-gray-900 
                        dark:text-gray-200 
                        [&_.ant-table-thead>tr>th]:dark:bg-gray-800
                        [&_.ant-table-thead>tr>th]:dark:text-gray-300
                        [&_.ant-table-cell]:dark:border-gray-700
                        border-gray-200
                      "
                    />
                  </>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ChildPaymentsPage;
