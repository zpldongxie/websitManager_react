/*
 * @description: 操作说明
 * @author: zpl
 * @Date: 2021-02-27 12:35:42
 * @LastEditTime: 2021-02-27 13:01:59
 * @LastEditors: zpl
 */
import React from 'react';
import { Space } from 'antd';

import styles from './index.module.less';

const Index = () => {
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
    <div className={styles.con}>
      <div className={styles.header}>
        <h1>云适配网站管理平台操作说明</h1>
      </div>
      <div className={styles.body}>
        <div>技术栈：</div>
      </div>
      <div className={styles.footer}>
      <Space size={30}>
          {
            defaultLinks.map(link => (
              <a key={link.key} href={link.href} target="_blank" rel="noopener noreferrer">{link.title}</a>
            ))
          }
        </Space>
      </div>
    </div>
  )
}

export default Index
