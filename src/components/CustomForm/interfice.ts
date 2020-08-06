/*
* @description: 
* @author: zpl
* @Date: 2020-07-30 10:21:18
 * @LastEditTime: 2020-08-06 14:05:27
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
  type: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  items?: {
    value: string | number;
    text: string;
  }[];
  onChange?: (_: any, formatString: [string, string]) => void;
}