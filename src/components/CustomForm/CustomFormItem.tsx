import React from 'react'
import { Form, Input, Select, DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { FormInputProps, FormSelectProps, FormTimeRangeProps, FormTextAreaProps } from './interfice';

const { TextArea } = Input;

interface Props {
  name: string;
  label?: string;
  requiredMsg?: string;
  children?: any;
  hidden?: boolean;
}

const CommonFormItem = (props: Props) => {
  const {
    name,
    label,
    requiredMsg,
    children,
    hidden
  } = props;

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{
        required: !!requiredMsg,
        message: requiredMsg || ''
      }]}
      hidden={hidden}
    >
      {children}
    </Form.Item>
  )
}

// interface FormInputProps extends Props {
//   value?: string;
//   placeholder?: string;
// }

/**
 * 表单输入框
 *
 * @param {FormInputProps} props
 * @returns
 */
const FormInput = (props: FormInputProps) => {
  const {
    placeholder,
    ...formProps
  } = props;

  return (
    <CommonFormItem {...formProps}>
      <Input placeholder={placeholder || "请输入"} />
    </CommonFormItem >
  )
}

// interface FormSelectProps extends Props {
//   placeholder?: string;
//   items: {
//     value: string | number;
//     text: string;
//   }[];
//   defaultValue?: string | number;
// }

/**
 * 表单选择框
 *
 * @param {FormSelectProps} props
 * @returns
 */
const FormSelect = (props: FormSelectProps) => {
  const {
    placeholder,
    items,
    ...formProps
  } = props;
  return (
    <CommonFormItem {...formProps}>
      <Select placeholder={placeholder || '请选择'}>
        {
          items.map(item => <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>)
        }
      </Select>
    </CommonFormItem>
  )
}

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i += 1) {
    result.push(i);
  }
  return result;
}
const disabledRangeTime = () => {
  return {
    disabledMinutes: () => range(1, 30).concat(range(31, 60)),
  };
}
const disabledDate = (current: Moment) => {
  // Can not select days before today
  return current < moment().endOf('day');
}
// interface FormTimeRangeProps extends Props {
//   onChange?: (_: any, formatString: [string, string]) => void;
// }

/**
 * 表单时间范围选择框
 *
 * @param {FormTimeRangeProps} props
 * @returns
 */
const FormTimeRange = (props: FormTimeRangeProps) => {
  const {
    onChange,
    ...formProps
  } = props;
  return (
    <CommonFormItem {...formProps}>
      <DatePicker.RangePicker
        showTime={{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }}
        disabledDate={disabledDate}
        disabledTime={disabledRangeTime}
        format='YYYY-MM-DD HH:mm'
        onChange={onChange}
        style={{ width: '100%' }}
      />
    </CommonFormItem>
  )
}

// interface FormTextAreaProps extends Props {
//   placeholder?: string;
// }

const FormTextArea = (props: FormTextAreaProps) => {
  const {
    placeholder,
    ...formProps
  } = props;
  return (
    <CommonFormItem {...formProps}>
      <TextArea rows={4} placeholder={placeholder || '请输入'} />
    </CommonFormItem>
  )
}

export { FormInput, FormSelect, FormTimeRange, FormTextArea };
