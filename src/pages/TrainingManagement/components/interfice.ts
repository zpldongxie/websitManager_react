/*
 * @description: 
 * @author: zpl
 * @Date: 2020-07-30 10:21:18
 * @LastEditTime: 2020-07-30 18:31:38
 * @LastEditors: zpl
 */ 
export interface FormInputProps {
  name: string;
  label: string;
  requiredMsg?: string;
  placeholder?: string;
  hidden?: boolean;
}

export interface FormSelectProps {
  name: string;
  label: string;
  requiredMsg?: string;
  placeholder?: string;
  hidden?: boolean;
  items: {
    value: string | number;
    text: string;
  }[];
}

export interface FormTimeRangeProps {
  name: string;
  label?: string;
  requiredMsg?: string;
  children?: any;
  onChange?: (_: any, formatString: [string, string]) => void;
  hidden?: boolean;
}

export interface FormTextAreaProps {
  name: string;
  label?: string;
  requiredMsg?: string;
  children?: any;
  placeholder?: string;
  hidden?: boolean;
}