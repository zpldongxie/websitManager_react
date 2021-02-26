import React from 'react';
import { Form, Input, Select, DatePicker, Radio, Switch } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';

import type {
  FormInputProps,
  FormSelectProps,
  FormRadioProps,
  FormTimeRangeProps,
  FormTextAreaProps,
  FormCustomProps,
  FormSwitchProps,
} from './interfice';

const { TextArea } = Input;

// -----------------------------FormInput------------------------------------
/**
 * 表单输入框
 *
 * @param {FormInputProps} props
 * @returns
 */
const FormInput = (props: FormInputProps) => {
  const { disabled, placeholder, onChange, ...formProps } = props;

  return (
    <Form.Item {...formProps}>
      <Input disabled={disabled} placeholder={placeholder || '请输入'} onChange={onChange} />
    </Form.Item>
  );
};

// -----------------------------FormSelect------------------------------------
/**
 * 表单选择框
 *
 * @param {FormSelectProps} props
 * @returns
 */
const FormSelect = (props: FormSelectProps) => {
  const { disabled, placeholder, items, onChange, mode, ...formProps } = props;
  return (
    <Form.Item {...formProps}>
      <Select
        mode={mode}
        disabled={disabled}
        placeholder={placeholder || '请选择'}
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(inputValue: string, option: any) =>
          option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
        }
      >
        {items.map((item) => (
          <Select.Option key={item.value} value={item.value}>
            {item.text}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

// -----------------------------FormRadio------------------------------------
/**
 * 表单radio选择框
 *
 * @param {FormRadioProps} props
 * @returns
 */
const FormRadio = (props: FormRadioProps) => {
  const { disabled, items, defaultValue, ...formProps } = props;

  return (
    <Form.Item {...formProps}>
      <Radio.Group disabled={disabled} defaultValue={defaultValue}>
        {items.map((item) => (
          <Radio key={item.value} value={item.value}>
            {item.text}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

// -----------------------------FormTimeRange------------------------------------
const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i += 1) {
    result.push(i);
  }
  return result;
};
const disabledRangeTime = () => {
  return {
    disabledMinutes: () => range(1, 30).concat(range(31, 60)),
  };
};
const disabledDate = (current: Moment) => {
  // Can not select days before today
  return current < moment().endOf('day');
};

/**
 * 表单时间范围选择框
 *
 * @param {FormTimeRangeProps} props
 * @returns
 */
const FormTimeRange = (props: FormTimeRangeProps) => {
  const { disabled, onChange, ...formProps } = props;
  return (
    <Form.Item {...formProps}>
      <DatePicker.RangePicker
        disabled={disabled}
        showTime={{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }}
        disabledDate={disabledDate}
        disabledTime={disabledRangeTime}
        format="YYYY-MM-DD HH:mm"
        onChange={onChange}
        style={{ width: '100%' }}
      />
    </Form.Item>
  );
};

// -----------------------------FormTextArea------------------------------------
const FormTextArea = (props: FormTextAreaProps) => {
  const { disabled, placeholder, isLengthShow, textAreaLength, ...formProps } = props;
  return (
    <div>
      <Form.Item {...formProps}>
        <TextArea disabled={disabled} rows={4} placeholder={placeholder || '请输入'} />
      </Form.Item>
      {isLengthShow ? (
        <span style={{ float: 'right', color: '#a5a5a5', marginTop: '-25px' }}>
          {textAreaLength} / 200
        </span>
      ) : (
        ''
      )}
    </div>
  );
};

// -----------------------------FormCustom------------------------------------
const FormSwitch = (props: FormSwitchProps) => {
  const { disabled, onChange, ...formProps } = props;
  return (
    <Form.Item {...formProps} valuePropName="checked">
      <Switch defaultChecked onChange={onChange} />
    </Form.Item>
  );
};

// -----------------------------FormCustom------------------------------------
const FormCustom = (props: FormCustomProps) => {
  const { children, ...formProps } = props;
  return <Form.Item {...formProps}>{children}</Form.Item>;
};

export { FormInput, FormSelect, FormRadio, FormTimeRange, FormTextArea, FormSwitch, FormCustom };
