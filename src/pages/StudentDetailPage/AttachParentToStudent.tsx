// src/components/AttachParentToStudent.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Form, Spin, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import client from '../../components/services'; // axios instance
// import { toast } from 'react-toastify'; // agar ishlatmoqchi bo'lsangiz

interface ParentShort {
  id: number;
  first_name: string;
  last_name: string;
  sure_name?: string;
  phone_number: string;
  children: number[];
}

interface AttachParentProps {
  studentId: number;  
  student?: any;        // Bog'lanadigan o'quvchi ID (child)
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;     // Muvaffaqiyatdan keyin chaqiriladigan funksiya
}

const AttachParentToStudent: React.FC<AttachParentProps> = ({
  student,
  open,
  onClose,
  onSuccess,
}) => {
  const [parents, setParents] = useState<ParentShort[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Modal ochilganda ota-onalarni yuklash
  useEffect(() => {
    if (open) {
      loadParents();
    }
  }, [open]);

  const loadParents = async () => {
    try {
      setLoading(true);
      const { data } = await client.get<ParentShort[]>('/parents/list/');
      setParents(data);
    } catch (error) {
      console.error("Ota-onalarni yuklashda xato:", error);
      message.error("Ota-onalarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (values: { parentId: number }) => {
  try {
    setSubmitting(true);

    const childUserId = student?.user?.id;

    if (!childUserId) {
      throw new Error("Talaba ma'lumotlari yuklanmagan");
    }

    await client.post('/parents/attach/', {
      user: values.parentId,      // parent user id
      child: childUserId          // student user id !!!
    });

    message.success("Ota-ona muvaffaqiyatli bog'landi!");
    onSuccess?.();
    onClose();
    form.resetFields();
  } catch (error: any) {
    const errMsg = error.response?.data?.non_field_errors?.[0] ||
                   error.response?.data?.detail ||
                   "Bog'lashda xatolik yuz berdi";

    message.error(errMsg);
  } finally {
    setSubmitting(false);
  }
};


const childUserId = student?.user?.id;

const parentOptions = parents.map(p => ({
  value: p.id,
  label: (
    <div className="flex items-center gap-2">
      <UserOutlined />
      <span className="font-medium">
        {p.first_name} {p.last_name} {p.sure_name ? `(${p.sure_name})` : ''}
      </span>
      <span className="text-gray-500 text-sm ml-2">
        ({p.phone_number})
      </span>
    </div>
  ),

  disabled: childUserId && p.children.includes(childUserId),
}));

  return (
    <Modal
      title="Ota-onani o'quvchiga bog'lash"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      {loading ? (
        <div className="text-center py-10">
          <Spin tip="Ota-onalar yuklanmoqda..." />
        </div>
      ) : parents.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Hozircha ota-onalar ro'yxati mavjud emas
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="parentId"
            label="Ota-ona tanlang"
            rules={[{ required: true, message: "Ota-onani tanlang!" }]}
          >
            <Select
              placeholder="Ota-onani qidiring yoki tanlang..."
              showSearch
              optionFilterProp="label"
              options={parentOptions}
              size="large"
              filterOption={(input, option) =>
                (option?.label as any)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <div className="text-right mt-6 space-x-2">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={submitting}
            >
              Bog'lash
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default AttachParentToStudent;