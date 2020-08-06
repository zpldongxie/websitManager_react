import React, { useEffect } from 'react'
import { Form } from 'antd'
import { FormItemType, FormSelectProps } from './interfice';
import { FormInput, FormSelect, FormTimeRange, FormTextArea } from './CustomFormItem';

interface Props {
  formLayout: {
    labelCol: { span: number };
    wrapperCol: { span: number };
  };
  formItems: FormItemType[];
  values?: any;
  /**
   * 可选，获取提交方法，支持在外部进行触发
   *
   * @memberof Props
   */
  setSubmitFun?: (submit: ()=>void)=>void;
  onFinish: (values: any) => void
}

const CustomForm = (props: Props) => {
  const {
    formLayout,
    formItems,
    values,
    setSubmitFun,
    onFinish
  } = props;
  const [form] = Form.useForm();

  useEffect(()=>{
    if(typeof setSubmitFun === 'function'){
      setSubmitFun(form.submit)
    }
  }, [])

  useEffect(() => {
    form.setFieldsValue(values)
  }, [values]);

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

export default CustomForm
