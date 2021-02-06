/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Col, Form, Row } from 'antd';
import type {
  FormCustomProps,
  FormInputProps,
  FormItemType,
  FormRadioProps,
  FormSelectProps,
  FormSwitchProps,
} from './interfice';
import {
  FormInput,
  FormSelect,
  FormTimeRange,
  FormTextArea,
  FormRadio,
  FormSwitch,
  FormCustom,
} from './CustomFormItem';

const renderFormItems = (formItems: FormItemType[]) => {
  return formItems.map((formItem) => {
    const { type, key, groupItems, span, flex, ...currentProps } = formItem;
    const currentKey = key || formItem.label;
    switch (type) {
      case 'input':
        return <FormInput {...(currentProps as FormInputProps)} key={currentKey} />;
      case 'select':
        return <FormSelect {...(currentProps as FormSelectProps)} key={currentKey} />;
      case 'timeRange':
        return <FormTimeRange {...currentProps} key={currentKey} />;
      case 'textArea':
        return <FormTextArea {...currentProps} key={currentKey} />;
      case 'radio':
        return <FormRadio {...(currentProps as FormRadioProps)} key={currentKey} />;
      case 'switch':
        return <FormSwitch {...(currentProps as FormSwitchProps)} key={currentKey} />;
      case 'custom':
        return <FormCustom {...(currentProps as FormCustomProps)} key={currentKey} />;
      case 'group': {
        const colW = 24 / (groupItems ? groupItems.length : 1);
        return (
          <Row gutter={10} key={currentKey}>
            {groupItems?.map((item) => {
              const wInfo: {
                span?: number | string;
                flex?: number | 'none' | 'auto' | string;
              } = {};
              if (item.span) {
                wInfo.span = item.span;
              } else if (item.flex) {
                wInfo.flex = item.flex;
              } else {
                wInfo.span = colW;
              }
              const colKey = `Col${item.key || item.label}`;
              return (
                <Col {...wInfo} key={colKey}>
                  {renderFormItems([item])}
                </Col>
              );
            })}
          </Row>
        );
      }
      case 'empty':
      default:
        return '';
    }
  });
};

type Props = {
  formLayout: {
    labelCol: {
      span?: number | string;
      flex?: number | 'none' | 'auto' | string;
    };
    wrapperCol: {
      span?: number | string;
      flex?: number | 'none' | 'auto' | string;
    };
  };
  formItems: FormItemType[];
  values?: any;
  /**
   * 可选，获取提交方法，支持在外部进行触发
   *
   * @memberof Props
   */
  setSubmitFun?: (submit: () => void) => void;
  onFinish: (values: any) => void;
  onFinishFailed?: ({
    errorFields,
  }: {
    errorFields: {
      name: (string | number)[];
      errors: string[];
    }[];
  }) => void;
  style?: React.CSSProperties;
};

const CustomForm = (props: Props) => {
  const {
    formLayout,
    formItems,
    values,
    setSubmitFun,
    onFinish = () => {},
    onFinishFailed = () => {},
    style,
  } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (typeof setSubmitFun === 'function') {
      setSubmitFun(form.submit);
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue(values);
  }, [values]);

  return (
    <Form
      {...formLayout}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={style}
    >
      {renderFormItems(formItems)}
    </Form>
  );
};

export default CustomForm;
