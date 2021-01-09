import React, { useEffect } from 'react';
import { Col, Form, Row } from 'antd';
import { FormItemType, FormSelectProps } from './interfice';
import { FormInput, FormSelect, FormTimeRange, FormTextArea } from './CustomFormItem';

const renderFormItems = (formItems: FormItemType[]) => {
  return formItems.map((formItem) => {
    const { type, groupItems, span, flex, ...currentProps } = formItem;
    switch (type) {
      case 'input':
        return <FormInput {...currentProps} key={formItem.label || new Date().getTime()} />;
      case 'select':
        return (
          <FormSelect
            {...(currentProps as FormSelectProps)}
            key={formItem.label || new Date().getTime()}
          />
        );
      case 'timeRange':
        return <FormTimeRange {...currentProps} key={formItem.label || new Date().getTime()} />;
      case 'textArae':
        return <FormTextArea {...currentProps} key={formItem.label || new Date().getTime()} />;
      case 'group': {
        const colW = 24 / (groupItems ? groupItems.length : 1);
        return (
          <Row gutter={10} key={formItem.label || new Date().getTime()}>
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
              return (
                <Col {...wInfo} key={item.label || new Date().getTime()}>
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

interface Props {
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
}

const CustomForm = (props: Props) => {
  const { formLayout, formItems, values, setSubmitFun, onFinish } = props;
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
    <Form {...formLayout} form={form} onFinish={onFinish}>
      {renderFormItems(formItems)}
    </Form>
  );
};

export default CustomForm;
