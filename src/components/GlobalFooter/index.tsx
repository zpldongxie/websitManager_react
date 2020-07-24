import React from 'react'
import { DefaultFooter } from '@ant-design/pro-layout'

const GlobalFooter = () => {
  const defaultLinks = [{
    key: 'Ant Design Pro',
    title: 'Ant Design Pro',
    href: 'https://pro.ant.design',
    blankTarget: true
  }, {
    key: 'Ant Design',
    title: 'Ant Design',
    href: 'https://ant.design',
    blankTarget: true
  }];
  return (
    <DefaultFooter copyright={`${new Date().getFullYear()} 西安云适配`} links={defaultLinks} />
  )
}

export default GlobalFooter
