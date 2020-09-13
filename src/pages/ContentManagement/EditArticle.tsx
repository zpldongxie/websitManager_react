import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Divider,
  Form,
  Input,
  Select,
  TreeSelect,
  Switch,
  DatePicker,
  Button,
  Space,
} from 'antd';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

import { convertChannelsToTree } from '@/utils/utils';
import { TreeNodeType, ChannelType } from '@/utils/data';
import styles from './index.module.less';
import { queryChannels } from './service';

const { TreeNode } = TreeSelect;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
};

const createOrUpdate = (values: any) => {
  const prams = { ...values, mainCon: values.mainCon.toHTML() };
  // TODO: 向后台提交数据
  // eslint-disable-next-line no-console
  console.log(prams);
};

const EditArticle = () => {
  const [channels, setChannels] = useState<TreeNodeType[]>([]);
  const initialValues = {
    contentType: '文章',
    orderIndex: 10,
    source: '本站原创',
  };

  useEffect(() => {
    (async () => {
      // 组件加载完成立即获取栏目信息
      const channelList: ChannelType[] = await queryChannels();
      // 更新栏目组件
      const cns: TreeNodeType[] = [];
      convertChannelsToTree(channelList, cns, null);
      setChannels(cns);
    })();
  }, []);

  /**
   * 渲染栏目树节点
   *
   * @param {TreeNodeType[]} chs
   * @return {*}
   */
  const renderTreeNode = (chs: TreeNodeType[]) => {
    return chs.map((channel) => (
      <TreeNode key={channel.value} value={channel.value!} title={channel.label}>
        {channel.children && channel.children.length ? renderTreeNode(channel.children) : ''}
      </TreeNode>
    ));
  };

  return (
    <div className={styles.container}>
      <Form {...formItemLayout} initialValues={initialValues} onFinish={createOrUpdate}>
        <Divider orientation="left">文章属性</Divider>
        <Row>
          <Col className="gutter-row" sm={12} xs={24}>
            <Form.Item
              name="title"
              label="文章标题："
              rules={[
                {
                  required: true,
                  message: '请输入文章标题！',
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={12} xs={24}>
            <Form.Item name="subtitle" label="副标题：">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" sm={6} xs={12}>
            <Form.Item name="keyWord" label="关键词：" labelCol={{ sm: { span: 8 } }}>
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={6} xs={12}>
            <Form.Item
              name="Channels"
              label="所属栏目："
              labelCol={{ sm: { span: 8 } }}
              rules={[
                {
                  required: true,
                  message: '请选择所属栏目！',
                },
              ]}
            >
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                allowClear
                multiple
                treeDefaultExpandAll
              >
                {renderTreeNode(channels)}
              </TreeSelect>
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={6} xs={12}>
            <Form.Item
              name="contentType"
              label="文章类型："
              labelCol={{ sm: { span: 8 } }}
              rules={[
                {
                  required: true,
                  message: '请选择文章类型！',
                },
              ]}
            >
              <Select>
                <Option value="文章">文章</Option>
                <Option value="链接">链接</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={6} xs={12}>
            <Form.Item name="orderIndex" label="排序值：" labelCol={{ sm: { span: 8 } }}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" sm={12} xs={24}>
            <Form.Item name="summary" label="文章摘要：">
              <Input.TextArea placeholder="说点什么..." rows={4} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={12} xs={24}>
            <Form.Item name="thumbnail" label="标题图片：">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" sm={6} xs={12}>
            <Form.Item name="auth" label="作者：" labelCol={{ sm: { span: 8 } }}>
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={6} xs={12}>
            <Form.Item name="conDate" label="时间：" labelCol={{ sm: { span: 8 } }}>
              <DatePicker showTime />
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={6} xs={12}>
            <Form.Item name="source" label="来源：" labelCol={{ sm: { span: 8 } }}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" sm={3} xs={6}>
            <Form.Item
              name="isHead"
              label="是否头条："
              valuePropName="checked"
              labelCol={{ sm: { span: 16 } }}
            >
              <Switch />
            </Form.Item>
          </Col>
          {/* canComment */}
          <Col className="gutter-row" sm={3} xs={6}>
            <Form.Item
              name="isRecom"
              label="是否推荐："
              valuePropName="checked"
              labelCol={{ sm: { span: 16 } }}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left">文章内容</Divider>
        <Form.Item
          name="mainCon"
          rules={[
            {
              required: true,
              message: '请输入正文内容！',
            },
          ]}
        >
          <BraftEditor className="my-editor" placeholder="请输入正文内容" />
        </Form.Item>
        <Row justify="end">
          <Col>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
                    window.close();
                  }}
                >
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Col>
          <Col span={1} />
        </Row>
      </Form>
    </div>
  );
};

export default EditArticle;
