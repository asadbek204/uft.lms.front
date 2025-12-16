import React from "react";
import { Form, Input, DatePicker } from "antd";
import InputMask from "react-input-mask";

const PhoneInput = (props: any) => (
  <InputMask mask="(99) 999-99-99" maskChar={null} {...props}>
    {(inputProps: any) => <Input {...inputProps} addonBefore="+998" />}
  </InputMask>
);

interface Props {
  contents: any;
}

const FamilyInfoSection: React.FC<Props> = ({ contents }) => {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className=" p-8">
        <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          {contents.father_info || "Ota ma'lumotlari"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 dark-form">
          <Form.Item
            name={["father", "first_name"]}
            label={<span className="font-medium">{contents.first_name}</span>}
            rules={[
              {
                required: false,
                message: contents.required || "Majburiy maydon",
              },
            ]}
          >
            <Input size="large" placeholder={contents.first_name} />
          </Form.Item>

          <Form.Item
            name={["father", "last_name"]}
            rules={[{ required: false, message: contents.required }]}
            label={<span className="font-medium">{contents.last_name}</span>}
          >
            <Input size="large" placeholder={contents.last_name} />
          </Form.Item>

          <Form.Item
            name={["father", "sure_name"]}
            rules={[{ required: false, message: contents.required }]}
            label={<span className="font-medium">{contents.sure_name}</span>}
          >
            <Input size="large" placeholder={contents.sure_name} />
          </Form.Item>

          <Form.Item
            name={["father", "passport"]}
            rules={[{ required: false, message: contents.required }]}
            label={<span className="font-medium">{contents.passport}</span>}
          >
            <Input
              size="large"
              maxLength={9}
              style={{ textTransform: "uppercase" }}
              placeholder="AA1234567"
            />
          </Form.Item>

          <Form.Item
            name={["father", "pinfl"]}
            label={<span className="font-medium">{contents.pinfl}</span>}
            rules={[{ len: 14, message: "14 ta raqam bo‘lishi kerak" }]}
          >
            <Input size="large" maxLength={14} />
          </Form.Item>

          <Form.Item
            name={["father", "phone_number"]}
            rules={[{ required: false, message: contents.required }]}
            label={<span className="font-medium">{contents.phone_number}</span>}
          >
            <PhoneInput size="large" />
          </Form.Item>

          <Form.Item
            name={["father", "email"]}
            label={<span className="font-medium">{contents.email}</span>}
            rules={[
              { required: false, message: contents.required },
              { type: "email", message: "To‘g‘ri email kiriting" },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name={["father", "birthday"]}
            label={<span className="font-medium">{contents.birthday}</span>}
          >
            <DatePicker
              format="DD.MM.YYYY"
              className="w-full"
              size="large"
              placeholder="DD.MM.YYYY"
            />
          </Form.Item>
        </div>
      </div>

      <div className=" p-8">
        <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          {contents.mother_info || "Ona ma'lumotlari"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 dark-form">
          <Form.Item
            name={["mother", "first_name"]}
            rules={[{ required: false, message: contents.required }]}
            label={<span className="font-medium">{contents.first_name}</span>}
          >
            <Input size="large" placeholder={contents.first_name} />
          </Form.Item>

          <Form.Item
            name={["mother", "last_name"]}
            label={<span className="font-medium">{contents.last_name}</span>}
            rules={[{ required: false, message: contents.required }]}
          >
            <Input size="large" placeholder={contents.last_name} />
          </Form.Item>

          <Form.Item
            name={["mother", "sure_name"]}
            rules={[{ required: false, message: contents.required }]}
            label={<span className="font-medium">{contents.sure_name}</span>}
          >
            <Input size="large" placeholder={contents.sure_name} />
          </Form.Item>

          <Form.Item
            name={["mother", "passport"]}
            rules={[{ required: false, message: contents.required }]}
            label={<span className="font-medium">{contents.passport}</span>}
          >
            <Input
              size="large"
              maxLength={9}
              style={{ textTransform: "uppercase" }}
              placeholder="AA1234567"
            />
          </Form.Item>

          <Form.Item
            name={["mother", "pinfl"]}
            label={<span className="font-medium">{contents.pinfl}</span>}
            rules={[{ len: 14, message: "14 ta raqam bo‘lishi kerak" }]}
          >
            <Input size="large" maxLength={14} />
          </Form.Item>

          <Form.Item
            name={["mother", "phone_number"]}
            rules={[{ required: false, message: contents.required }]}
            label={<span className="font-medium">{contents.phone_number}</span>}
          >
            <PhoneInput size="large" />
          </Form.Item>

          <Form.Item
            name={["mother", "email"]}
            label={<span className="font-medium">{contents.email}</span>}
            rules={[{ required: false, message: contents.required },{ type: "email", message: "To‘g‘ri email kiriting" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name={["mother", "birthday"]}
            label={<span className="font-medium">{contents.birthday}</span>}
          >
            <DatePicker
              format="DD.MM.YYYY"
              className="w-full"
              size="large"
              placeholder="DD.MM.YYYY"
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default FamilyInfoSection;
