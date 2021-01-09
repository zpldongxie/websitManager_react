/*
 * @description:
 * @author: zpl
 * @Date: 2020-07-30 10:21:18
 * @LastEditTime: 2021-01-10 00:23:13
 * @LastEditors: zpl
 */
import { FormItemProps } from 'antd/lib/form/FormItem.d';

export interface FormInputProps extends FormItemProps {
  disabled?: boolean;
  placeholder?: string;
}

export interface FormSelectProps extends FormItemProps {
  disabled?: boolean;
  placeholder?: string;
  items: {
    value: string | number;
    text: string;
  }[];
  defaultValue?: string | number;
}

export interface FormTimeRangeProps extends FormItemProps {
  disabled?: boolean;
  onChange?: (_: any, formatString: [string, string]) => void;
}

export interface FormTextAreaProps extends FormItemProps {
  disabled?: boolean;
  placeholder?: string;
}

export interface FormItemType extends FormItemProps {
  key?: string | number;
  type: 'input' | 'select' | 'timeRange' | 'textArae' | 'group' | 'empty';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  items?: {
    value: string | number;
    text: string;
  }[];
  onChange?: (_: any, formatString: [string, string]) => void;
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
}
