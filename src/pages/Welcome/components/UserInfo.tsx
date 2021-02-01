/*
 * @description: 拆线图
 * @author: zpl
 * @Date: 2021-01-24 18:21:05
 * @LastEditTime: 2021-01-24 20:58:46
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import request from 'umi-request';
import styles from '../index.module.less';

const defaultUser: string = "管理员";

type PropsType = {
  data?: string;
  dataRequest?: {
    method: 'post' | 'get';
    url: string;
  };
};

const UserInfo: React.FC<PropsType> = ({ data, dataRequest }) => {
  const [currentUser, setCurrentUser] = useState<string | undefined>('管理员');

  useEffect(() => {
    (async () => {
      let userName = '';
      if (data) {
        userName = data;
      } else if (dataRequest) {
        const { method, url } = dataRequest;
        userName = await request(url, {
          method
        });
      } else {
        userName = defaultUser;
      }
      setCurrentUser(userName);
    })();
  }, [data, dataRequest]);
  return <div className={styles.welcomeInfo}>
    <div className={styles.userInfo}>
      <h3>您好，{currentUser}，欢迎使用云适配网站管理系统。祝您开心每一天！</h3>
      <p>轻松创建和管理您的网站信息，提升管理效率，降低运营成本。
        <Link to="http://www.snains.cn/">使用手册</Link></p>
    </div>
    <div className={styles.collectData}>
      <div>
        <p>文章总数</p>
        <span>254</span>
      </div>
      <div>
        <p>入驻厂商</p>
        <span>9</span>
      </div>
      <div>
        <p>入驻产品</p>
        <span>34</span>
      </div>
    </div>
  </div>
};

export default UserInfo;
