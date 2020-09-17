/** !
 * @description: 表格操作列
 * @author: zpl
 * @Date: 2020-09-12 17:13:00
 * @LastEditTime: 2020-09-12 17:31:45
 * @LastEditors: zpl
 */
import React from 'react';
import { Divider, Popconfirm, message } from 'antd';

import { remove, setPub } from '../service';

interface OptType {
  id: string;
  refreshHandler: () => void;
}

const EditOpt = ({ id }: { id: string }) => (
  <a
    onClick={() => {
      window.open(`/editArticle/edit?id=${id}`);
    }}
  >
    编辑
  </a>
);

const PubOpt = ({ id, refreshHandler }: OptType) => (
  <a
    onClick={async () => {
      try {
        const result = await setPub([id], '已发布');
        if (result.status === 'ok') {
          message.info('发布成功');
          refreshHandler();
        } else {
          message.error('发布失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('发布失败，请联系管理员或稍后重试。');
      }
    }}
  >
    发布
  </a>
);

const UnPubOpt = ({ id, refreshHandler }: OptType) => (
  <a
    onClick={async () => {
      try {
        const result = await setPub([id], '草稿');
        if (result.status === 'ok') {
          message.info('撤稿成功');
          refreshHandler();
        } else {
          message.error('撤稿失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('撤稿失败，请联系管理员或稍后重试。');
      }
    }}
  >
    撤稿
  </a>
);

const UnDelOpt = ({ id, refreshHandler }: OptType) => (
  <a
    href="#"
    onClick={async () => {
      try {
        const result = await setPub([id], '草稿');
        if (result.status === 'ok') {
          message.info('恢复成功');
          refreshHandler();
        } else {
          message.error('恢复失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('恢复失败，请联系管理员或稍后重试。');
      }
    }}
  >恢复</a>
);

const DelOpt = ({ id, refreshHandler }: OptType) => (
  <Popconfirm
    title="确定要删除吗?"
    onConfirm={async () => {
      try {
        const result = await setPub([id], '已删除');
        if (result.status === 'ok') {
          message.info('删除成功');
          refreshHandler();
        } else {
          message.error('删除失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('删除失败，请联系管理员或稍后重试。');
      }
    }}
    okText="Yes"
    cancelText="No"
    placement="topLeft"
  >
    <a href="#">删除</a>
  </Popconfirm>
);

const RealDelOpt = ({ id, refreshHandler }: OptType) => (
  <Popconfirm
    title="彻底删除后数据将不可恢复，是否确定?"
    onConfirm={async () => {
      try {
        const result = await remove([id]);
        if (result.status === 'ok') {
          message.info('删除成功');
          refreshHandler();
        } else {
          message.error('删除失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('删除失败，请联系管理员或稍后重试。');
      }
    }}
    okText="Yes"
    cancelText="No"
    placement="topLeft"
  >
    <a href="#">彻底删除</a>
  </Popconfirm>
);

interface Props {
  id: string;
  pubStatus: string;
  refreshHandler: () => void;
}

const Option: React.FC<Props> = (props) => {
  const { id, pubStatus, refreshHandler } = props;
  switch (pubStatus) {
    case '已发布':
      return <UnPubOpt id={id} refreshHandler={refreshHandler} />;
    case '已删除':
      return (
        <>
          <UnDelOpt id={id} refreshHandler={refreshHandler} />
          <Divider type="vertical" />
          <RealDelOpt id={id} refreshHandler={refreshHandler} />
        </>
      )
    default:
      return (
        <>
          <EditOpt id={id} />
          <Divider type="vertical" />
          <PubOpt id={id} refreshHandler={refreshHandler} />
          <Divider type="vertical" />
          <DelOpt id={id} refreshHandler={refreshHandler} />
        </>
      );
  }
};

export default Option;
