/** !
 * @description: 表格操作列
 * @author: zpl
 * @Date: 2020-09-12 17:13:00
 * @LastEditTime: 2020-09-12 17:31:45
 * @LastEditors: zpl
 */
import React from 'react';
import { Divider } from 'antd';

const InfoOpt = () => <a onClick={() => {}}>详情</a>;

const EditOpt = () => <a onClick={() => {}}>编辑</a>;

const PubOpt = () => <a onClick={() => {}}>发布</a>;

const UnPubOpt = () => <a onClick={() => {}}>撤稿</a>;

const DelOpt = () => <a onClick={() => {}}>删除</a>;

interface Props {
  pubStatus: string;
}

const Option: React.FC<Props> = (props) => {
  const { pubStatus } = props;
  if (pubStatus === '已发布') {
    return (
      <>
        <InfoOpt />
        <Divider type="vertical" />
        <UnPubOpt />
      </>
    );
  }
  return (
    <>
      <EditOpt />
      <Divider type="vertical" />
      <PubOpt />
      <Divider type="vertical" />
      <DelOpt />
    </>
  );
};

export default Option;
