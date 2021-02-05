/*
 * @description:
 * @author: zpl
 * @Date: 2020-07-30 10:21:18
 * @LastEditTime: 2021-02-04 19:00:27
 * @LastEditors: zpl
 */
import type { FormItemProps } from 'antd/lib/form/FormItem.d';
import type { SwitchChangeEventHandler } from 'antd/lib/switch';

export type FormInputProps = {
  disabled?: boolean;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & FormItemProps;

export type FormSelectProps = {
  disabled?: boolean;
  placeholder?: string;
  items: {
    value: string | number;
    text: string;
  }[];
  onChange?: (value: string, option: any) => void;
  defaultValue?: string | number;
} & FormItemProps;

export type FormRadioProps = {
  disabled?: boolean;
  items: {
    value: string | number;
    text: string;
  }[];
  defaultValue?: string | number;
} & FormItemProps;

export type FormTimeRangeProps = {
  disabled?: boolean;
  onChange?: (_: any, formatString: [string, string]) => void;
} & FormItemProps;

export type FormTextAreaProps = {
  disabled?: boolean;
  placeholder?: string;
} & FormItemProps;

export type FormSwitchProps = {
  disabled?: boolean;
  onChange?: SwitchChangeEventHandler | undefined;
} & FormItemProps;

export type FormCustomProps = FormInputProps;

export type FormItemType = {
  key?: string | number;
  type?:
    | 'input'
    | 'select'
    | 'timeRange'
    | 'textArae'
    | 'radio'
    | 'switch'
    | 'custom'
    | 'group'
    | 'empty';
  name?: string;
  label?: string;
  // placeholder?: string;
  // disabled?: boolean;
  hidden?: boolean;
  // defaultValue?: string | number;
  rules?: {
    required?: boolean;
    value?: string | number;
    message: string;
  }[];
  // items?: {
  //   value: string | number;
  //   text: string;
  // }[];
  // onChange?: (_: any, formatString: [string, string]) => void;
  /**
   * 类型为group横向排列时，需要设置子数组
   *
   * @type {FormItemType[]}
   * @memberof FormItemType
   */
  groupItems?: FormItemType[];
  /**
   * 类型为group横向排列时，可设置宽度，不设置时为平均分配
   *
   * @type {(number | string)}
   * @memberof FormItemType
   */
  span?: number | string;
  /**
   * 类型为group横向排列时，可设置宽度，不设置时为平均分配
   *
   * @type {(number | 'none' | 'auto' | string)}
   * @memberof FormItemType
   */
  flex?: number | 'none' | 'auto' | string;
} & (
  | FormInputProps
  | FormSelectProps
  | FormRadioProps
  | FormTimeRangeProps
  | FormTextAreaProps
  | FormCustomProps
);
