/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Divider,
  Form,
  Input,
  Select,
  TreeSelect,
  Image,
  Switch,
  DatePicker,
  Button,
  Space,
  message,
} from 'antd';
import dayjs from 'dayjs';
// 引入编辑器组件
import BraftEditor, { ExtendControlType } from 'braft-editor';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ContentUtils } from 'braft-utils';
import { defImg } from '@/constant';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

import { convertChannelsToTree } from '@/utils/utils';
import { TreeNodeType, ChannelType } from '@/utils/data';
import ContentPreview from '@/components/ContentPreview';
import styles from './index.module.less';
import { queryChannels, upsert, getById, upload } from './service';
import Success from './components/Success';
import MyUpload from './components/MyUpload';
import SelectImage from './components/SelectImage';

const { TreeNode } = TreeSelect;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
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
  const [channels, setChannels] = useState<TreeNodeType[]>([]); // 栏目信息
  const [id, setId] = useState<string | undefined>(); // 文章ID
  const [selectImageVisible, setSelectImageVisible] = useState(false);  // 选择缩略图对话框
  const [successVisible, setSuccessVisible] = useState(window.location.hash === '#success');  // 操作成功对话框
  const [previewVisible, setPreviewVisible] = useState(false);  // 文章预览

  const [form] = Form.useForm();
  const initialValues = {
    contentType: '文章',
    orderIndex: 10,
    conDate: dayjs(),
    source: '本站原创',
    isHead: false,
    isRecom: false,
  };

  const submit = async (params: any) => {
    try {
      const {thumbnail, mainCon, conDate} = params;
      const data = {
        ...params,
        thumbnail: thumbnail === defImg ? '' : thumbnail,
        conDate: conDate.format('YYYY-MM-DD HH:mm:ss'),
        mainCon: mainCon.toHTML(),
      }
      const result = await upsert(data);
      console.dir(result);

      if (result.status === 'ok') {
        window.opener.history.go(0);
        window.location.hash = '#success';
        if (window.location.search) {
          setSuccessVisible(true);
        } else {
          window.location.search = `id=${result.data.id}`;
          setId(result.data.id);
        }
      } else {
        message.error('保存失败，请联系管理员或稍后再试。');
      }
    } catch (err) {
      console.log(err);
      message.error('保存失败，请联系管理员或稍后再试。');
    }
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
    // 判断url中是否有id
    const url = new URL(window.location.href);
    const editId = url.searchParams.get('id');
    if (editId && !id) {
      setId(editId);
    }
  }, []);

  // 如果有id参数，说明是编辑文章，需要回填信息
  useEffect(() => {
    (async () => {
      try {
        if (id) {
          const result = await getById(id);
          if (result.status === 'ok') {
            const { data } = result;
            const initData = { 
              ...data,
              Channels: data.Channels.map((c: ChannelType) => c.id),
              conDate: dayjs(data.conDate),
              thumbnail: data.thumbnail === '' ? defImg : data.thumbnail,
              mainCon: BraftEditor.createEditorState(data.mainCon)
            };
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
  }, [id]);

  const extendControls: ExtendControlType[] = [
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <MyUpload
          checkFun={() => {
            const befoEditorState = form.getFieldValue('mainCon');
            if (!befoEditorState) {
              message.info('请选择插入位置');
              return false;
            }
            return true;
          }}
          setEditorState={(state) => {
            const befoEditorState = form.getFieldValue('mainCon');
            form.setFieldsValue({
              mainCon: ContentUtils.insertHTML(befoEditorState, state),
            });
          }}
        />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <ContentPreview id={id} visiable={previewVisible} hiddenHandler={()=>{setPreviewVisible(false)}} />
      <Form {...formItemLayout} form={form} initialValues={initialValues} onFinish={submit}>
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
                className={styles.thumbnail}
                preview={false}
                onClick={() => {
                  setSelectImageVisible(true);
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
          <BraftEditor
            className="my-editor"
            placeholder="请输入正文内容"
            media={{
              uploadFn: upload
            }}
            extendControls={extendControls}
          />
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
        <Success
          previewHandler={() => { setPreviewVisible(true) }}
          backToEditHandler={() => {
            setSuccessVisible(false);
            window.location.hash = '';
          }}
        />
      </div>
      <SelectImage 
        title='选择图片'
        visible={selectImageVisible}
        contentHtml={form.getFieldValue('mainCon') ? form.getFieldValue('mainCon').toHTML() : ''}
        defaultImg={form.getFieldValue('thumbnail')}
        onOk={(url: string) => {
          console.log(url);          
          form.setFieldsValue({thumbnail: url === '' ? defImg : url })
        }}
        onCancel={() => {setSelectImageVisible(false)}}
      />
    </div>
  );
};

export default EditArticle;
