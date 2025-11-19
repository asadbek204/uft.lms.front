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

const PersonalInfoSection: React.FC<Props> = ({ contents }) => {
  return (
    <div className=" p-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
        {contents.personal_info || "Shaxsiy ma'lumotlar"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Form.Item
          name="first_name"
          label={<span className="font-medium">{contents.first_name}</span>}
          rules={[{ required: true, message: contents.required }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label={<span className="font-medium">{contents.last_name}</span>}
          rules={[{ required: true, message: contents.required }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="sure_name"
          label={<span className="font-medium">{contents.sure_name}</span>}
          rules={[{ required: true, message: contents.required }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="birthday"
          label={
            <span className="font-medium">
              {contents.birthday || "Tug'ilgan sana"}
            </span>
          }
          rules={[{ required: true, message: contents.required }]}
        >
          <DatePicker size="large" className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label={<span className="font-medium">{contents.phone_number}</span>}
        >
          <PhoneInput size="large" />
        </Form.Item>

        <Form.Item
          name="passport"
          label={<span className="font-medium">{contents.passport}</span>}
          rules={[
            { required: true, message: contents.required },
            {
              pattern: /^[A-Z]{2}\d{7}$/,
              message: "AA1234567 formatida bo‘lsin",
            },
          ]}
        >
          <Input
            size="large"
            maxLength={9}
            style={{ textTransform: "uppercase" }}
          />
        </Form.Item>

        <Form.Item
          name="pinfl"
          label={<span className="font-medium">{contents.pinfl}</span>}
          rules={[{ required: true, len: 14, message: contents.required }]}
        >
          <Input size="large" maxLength={14} />
        </Form.Item>

        <Form.Item
          name="address"
          label={<span className="font-medium">{contents.address}</span>}
          className="md:col-span-2"
        >
          <Input.TextArea rows={1} size="large" />
        </Form.Item>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
