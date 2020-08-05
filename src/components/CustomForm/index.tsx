import React from 'react'
import { Form } from 'antd'
import { FormInstance } from 'antd/lib/form/hooks/useForm.d'
import { FormItemType, FormSelectProps } from './interfice';
import { FormInput, FormSelect, FormTimeRange, FormTextArea } from './CustomFormItem';

interface Props {
  formLayout: {
    labelCol: { span: number };
    wrapperCol: { span: number };
  };
  formItems: FormItemType[];
  onFinish: (values: any) => void
}

// eslint-disable-next-line import/no-mutable-exports
let [form]: (FormInstance | undefined)[] = [];

const CustomForm = (props: Props) => {
  const {
    formLayout,
    formItems,
    onFinish
  } = props;
  [form] = Form.useForm();

  return (
    <Form {...formLayout} form={form} onFinish={onFinish}>
      {
          formItems.map(formItem => {
            const {type, ...currentProps} = formItem;
            switch(type) {
              case 'input':
                return <FormInput {...currentProps} key={formItem.label} />
              case 'select':
                return <FormSelect {...currentProps as FormSelectProps} key={formItem.label} />
              case 'timeRange':
                return <FormTimeRange {...currentProps} key={formItem.label} />
              case 'textArae':
                return <FormTextArea {...currentProps} key={formItem.label} />
              default: 
                return ''
            }            
          })
        }
    </Form>
  )
}

export {form};

export default CustomForm
