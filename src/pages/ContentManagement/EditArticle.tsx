/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Form, Input, Select, TreeSelect, Image, Switch, DatePicker, Button, Space, message } from 'antd';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
import moment from 'moment';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

import { convertChannelsToTree } from '@/utils/utils';
import { TreeNodeType, ChannelType } from '@/utils/data';
import styles from './index.module.less';
import { queryChannels, upsert, getById } from './service';
import Success from './components/Success';

const { TreeNode } = TreeSelect;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
};

const createOrUpdate = async (values: any) => {
  const params = {
    ...values,
    conDate: values.conDate.format('YYYY-MM-DD HH:mm:ss'),
    mainCon: values.mainCon.toHTML(),
  };
  const result = await upsert(params);
  return result.status === 'ok';
};

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

/**
 * 主组件
 *
 * @returns
 */
const EditArticle = () => {
  const [channels, setChannels] = useState<TreeNodeType[]>([]);
  const [successVisible, setSuccessVisible] = useState(false);

  const [form] = Form.useForm();
  const initialValues = {
    contentType: '文章',
    orderIndex: 10,
    conDate: moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    source: '本站原创',
    isHead: false,
    isRecom: false,
  };

  const submit = async (params: any) => {
    try {
      const result = await createOrUpdate(params);
      if (result) {
        setSuccessVisible(true);
      } else {
        message.error('保存失败，请联系管理员或稍后再试。');
      }
    } catch (err) {
      console.log(err);
      message.error('保存失败，请联系管理员或稍后再试。');
    }
  }

  useEffect(() => {
    (async () => {
      // 组件加载完成立即获取栏目信息
      const channelList: ChannelType[] = await queryChannels();
      // 更新栏目组件
      const cns: TreeNodeType[] = [];
      convertChannelsToTree(channelList, cns, null);
      setChannels(cns);
    })();
    (async () => {
      // 如果有id参数，说明是编辑文章，需要回填信息
      try {
        const url = new URL(window.location.href);
        const editId = url.searchParams.get('id');
        if (editId) {
          const result = await getById(editId);
          if (result.status === 'ok') {
            const { data } = result;
            const initData = { ...data };
            initData.Channels = data.Channels.map((c: ChannelType) => c.id);
            initData.conDate = moment(data.conDate);
            initData.mainCon = BraftEditor.createEditorState(data.mainCon);
            form.setFieldsValue(initData);
          } else {
            message.error('获取文章内容失败，请联系管理员或稍后再试。');
          }
        }
      } catch (err) {
        console.log(err);
        message.error('获取文章内容失败，请联系管理员或稍后再试。');
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <Form
        {...formItemLayout}
        form={form}
        initialValues={initialValues}
        onFinish={ submit }
      >
        <Divider orientation="left">文章属性</Divider>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
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
            <Form.Item name="thumbnail" label="标题图片：" valuePropName="src">
              <Image
                width={100}
                height={100}
                preview={false}
                src="error"
                fallback="data:image/png;base64,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"
                onClick={() => {
                  message.info('设置标题图片');
                }}
              />
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
            <Form.Item
              name="conDate"
              label="时间："
              labelCol={{ sm: { span: 8 } }}
              rules={[
                {
                  required: true,
                  message: '请选择时间！',
                },
              ]}
            >
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
                    window.open('', '_self', '');
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
      <div
        style={{
          display: successVisible ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          paddingTop: '10rem',
          backgroundColor: '#fff',
          zIndex: 100,
        }}
      >
        <Success previewHandler={() => { }} backToEditHandler={() => setSuccessVisible(false)} />
      </div>
    </div>
  );
};

export default EditArticle;
