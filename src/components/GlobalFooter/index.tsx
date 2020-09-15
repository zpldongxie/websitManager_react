import React from 'react'
import { DefaultFooter } from '@ant-design/pro-layout'

const GlobalFooter = () => {
  const defaultLinks = [{
    key: 'Ant Design',
    title: 'Ant Design',
    href: 'https://ant.design',
    blankTarget: true
  }, {
    key: 'ProComponents',
    title: 'ProComponents',
    href: 'https://procomponents.ant.design/',
    blankTarget: true
  }, {
    key: 'Ant Design Pro',
    title: 'Ant Design Pro',
    href: 'https://pro.ant.design',
    blankTarget: true
  }, {
    key: 'Braft Editor',
    title: 'Braft Editor',
    href: 'https://braft.margox.cn/',
    blankTarget: true
  }, {
    key: 'fastify',
    title: 'fastify',
    href: 'https://www.fastify.cn/docs/latest/',
    blankTarget: true
  }, {
    key: 'sequelize',
    title: 'sequelize',
    href: 'https://github.com/demopark/sequelize-docs-Zh-CN',
    blankTarget: true
  }, {
    key: 'Swagger API',
    title: 'Swagger API',
    href: 'http://49.234.158.74:3000/documentation/static/index.html',
    blankTarget: true
  }];
  return (
    <DefaultFooter copyright={`${new Date().getFullYear()} 西安云适配`} links={defaultLinks} />
  )
}

export default GlobalFooter
