import React from 'react'
import { Form, Input, Select, DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import {FormInputProps, FormSelectProps, FormTimeRangeProps, FormTextAreaProps} from './interfice'

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

interface FormInputPropss extends Props {
  value?: string;
  placeholder?: string;
}

/**
 * 表单输入框
 *
 * @param {FormInputPropss} props
 * @returns
 */
const FormInput = (props: FormInputPropss) => {
  const {
    value,
    placeholder,
    ...formProps
  } = props;
  
  return (
    <CommonFormItem {...formProps}>
      {/* antd pro form.item 有bug，必须再加一个div，否则下面的Input组件value值无法自动更新 */}
      <div className={value} />
      {
        value
          ? <Input value={value} placeholder={placeholder || "请输入"} />
          : <Input  placeholder={placeholder || "请输入"} />
      }
    </CommonFormItem >
  )
}

interface FormSelectPropss extends Props {
  placeholder?: string;
  items: {
    value: string | number;
    text: string;
  }[];
  defaultValue?: string | number;
}

/**
 * 表单选择框
 *
 * @param {FormSelectPropss} props
 * @returns
 */
const FormSelect = (props: FormSelectPropss) => {
  const {
    placeholder,
    items,
    defaultValue,
    ...formProps
  } = props;
  return (
    <CommonFormItem {...formProps}>
      <Select placeholder={placeholder} defaultValue={defaultValue}>
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
interface FormTimeRangePropss extends Props {
  onChange?: (_: any, formatString: [string, string]) => void;
}

/**
 * 表单时间范围选择框
 *
 * @param {FormTimeRangePropss} props
 * @returns
 */
const FormTimeRange = (props: FormTimeRangePropss) => {
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

interface FormTextAreaPropss extends Props {
  placeholder?: string;
}

const FormTextArea = (props: FormTextAreaPropss) => {
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


const formInput = ({name, label, requiredMsg, value, placeholder, hidden}: FormInputProps) => (
  <Form.Item
      name={name}
      label={label}
      rules={[{
        required: !!requiredMsg,
        message: requiredMsg || ''
      }]}
      hidden={hidden}
    >
      {/* antd pro form.item 有bug，必须再加一个div，否则下面的Input组件value值无法自动更新 */}
      <div className={value} />
      {
        value
          ? <Input value={value} placeholder={placeholder || "请输入"} />
          : <Input  placeholder={placeholder || "请输入"} />
      }
    </Form.Item>
)


const formSelect = ({name, label, requiredMsg, placeholder, hidden, items, defaultValue}: FormSelectProps) => (
  <Form.Item
      name={name}
      label={label}
      rules={[{
        required: !!requiredMsg,
        message: requiredMsg || ''
      }]}
      hidden={hidden}
    >
      <Select placeholder={placeholder || '请选择'}>
        {
          items.map(item => <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>)
        }
      </Select>
    </Form.Item>
)

const formTimeRange = ({name, label, requiredMsg, onChange, hidden}: FormTimeRangeProps) => (
  <Form.Item
        name={name}
        label={label}
        rules={[{
          required: !!requiredMsg,
          message: requiredMsg || ''
        }]}
        hidden={hidden}
      >
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
  </Form.Item>
)

const formTextArae = ({name, label, requiredMsg, placeholder, hidden}: FormTextAreaProps) => (
  <Form.Item
        name={name}
        label={label}
        rules={[{
          required: !!requiredMsg,
          message: requiredMsg || ''
        }]}
        hidden={hidden}
      >
    <TextArea rows={4} placeholder={placeholder || '请输入'} />
  </Form.Item>
)

export { formInput, formSelect, formTimeRange, formTextArae, FormInput, FormSelect, FormTimeRange, FormTextArea };
