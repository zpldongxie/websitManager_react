/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Divider,
  Form,
  Input,
  Select,
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

import { ChannelType } from '@/utils/data';
import ContentPreview from '@/components/ContentPreview';
import ChannelSelector from '@/components/ChannelSelector';
import styles from './index.module.less';
import { upsert, getById, upload, setPub } from './service';
import Success from './components/Success';
import MyUpload from './components/MyUpload';
import SelectImage from './components/SelectImage';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
};

/**
 * 发布文章方法
 *
 * @param {TreeNodeType[]} chs
 * @return {*}
 */
const pubHandler = async (ids: string[], cb: () => void) => {
  try {
    const result = await setPub(ids, '已发布');
    if (result.status === 'ok') {
      message.info('发布成功');
      cb();
    } else {
      message.error('发布失败，请联系管理员或稍后重试。');
    }
  } catch (err) {
    message.error('发布失败，请联系管理员或稍后重试。');
  }
};

/**
 * 撤消发布文章方法
 *
 * @param {TreeNodeType[]} chs
 * @return {*}
 */
const unPubHandler = async (ids: string[], cb: () => void) => {
  try {
    const result = await setPub(ids, '草稿');
    if (result.status === 'ok') {
      message.info('撤稿成功');
      cb();
    } else {
      message.error('撤稿失败，请联系管理员或稍后重试。');
    }
  } catch (err) {
    message.error('撤稿失败，请联系管理员或稍后重试。');
  }
};

/**
 * 主组件
 *
 * @returns
 */
const EditArticle = () => {
  const [id, setId] = useState<string | undefined>(); // 文章ID
  const [pubStatus, setPubStatus] = useState<'草稿' | '已发布' | '已删除'>('草稿'); // 发布状态，用于控制表单是否可提交
  const [selectImageVisible, setSelectImageVisible] = useState(false); // 选择缩略图对话框
  const [successVisible, setSuccessVisible] = useState(window.location.hash === '#success'); // 操作成功对话框
  const [previewVisible, setPreviewVisible] = useState(false); // 文章预览

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
      const { thumbnail, mainCon, conDate } = params;
      const data = {
        ...params,
        thumbnail: thumbnail === defImg ? '' : thumbnail,
        conDate: conDate.format('YYYY-MM-DD HH:mm:ss'),
        mainCon: mainCon.toHTML(),
      };
      const result = await upsert(data);
      console.dir(result);

      if (result.status === 'ok') {
        // window.opener.history.go(0);
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
              mainCon: BraftEditor.createEditorState(data.mainCon),
            };
            form.setFieldsValue(initData);
            setPubStatus(data.pubStatus);
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

  const disabled = pubStatus !== '草稿';
  return (
    <div className={styles.container}>
      <ContentPreview
        id={id}
        visiable={previewVisible}
        hiddenHandler={() => {
          setPreviewVisible(false);
        }}
      />
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
              <Input placeholder="请输入" disabled={disabled} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={12} xs={24}>
            <Form.Item name="subtitle" label="副标题：">
              <Input disabled={disabled} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" sm={12} xs={24}>
            <Form.Item name="keyWord" label="关键词：">
              <Input disabled={disabled} />
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
              <Select disabled={disabled}>
                <Option value="文章">文章</Option>
                <Option value="链接">链接</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={6} xs={12}>
            <Form.Item name="orderIndex" label="排序值：" labelCol={{ sm: { span: 8 } }}>
              <Input disabled={disabled} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" sm={24} xs={24}>
            <Form.Item
              name="Channels"
              label="所属栏目："
              labelCol={{ sm: { span: 2 } }}
              rules={[
                {
                  required: true,
                  message: '请选择所属栏目！',
                },
              ]}
            >
              <ChannelSelector />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" sm={12} xs={24}>
            <Form.Item name="summary" label="文章摘要：">
              <Input.TextArea placeholder="说点什么..." showCount maxLength={200} rows={4} disabled={disabled} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={12} xs={24}>
            <Form.Item name="thumbnail" label="标题图片：" valuePropName="src">
              <Image
                className={styles.thumbnail}
                preview={false}
                onClick={() => {
                  if (!disabled) setSelectImageVisible(true);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" sm={6} xs={12}>
            <Form.Item name="auth" label="作者：" labelCol={{ sm: { span: 8 } }}>
              <Input disabled={disabled} />
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
              <DatePicker showTime disabled={disabled} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={6} xs={12}>
            <Form.Item name="source" label="来源：" labelCol={{ sm: { span: 8 } }}>
              <Input disabled={disabled} />
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
              <Switch disabled={disabled} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" sm={3} xs={6}>
            <Form.Item
              name="isRecom"
              label="是否推荐："
              valuePropName="checked"
              labelCol={{ sm: { span: 16 } }}
            >
              <Switch disabled={disabled} />
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
              uploadFn: upload,
            }}
            extendControls={extendControls}
          />
        </Form.Item>
        <Row justify="end">
          <Col>
            <Form.Item>
              <Space>
                {pubStatus === '草稿' ? (
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() =>
                      unPubHandler([id || ''], () => {
                        setPubStatus('草稿');
                      })
                    }
                  >
                    撤稿并编辑
                  </Button>
                )}
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
          pubStatus={pubStatus}
          previewHandler={() => {
            setPreviewVisible(true);
          }}
          backToEditHandler={() => {
            setSuccessVisible(false);
            window.location.hash = '';
          }}
          pubHandler={() => {
            pubHandler([id || ''], () => {
              setPubStatus('已发布');
            });
          }}
          unPubHandler={() => {
            unPubHandler([id || ''], () => {
              setPubStatus('草稿');
            });
          }}
        />
      </div>
      <SelectImage
        title="选择图片"
        visible={selectImageVisible}
        contentHtml={form.getFieldValue('mainCon') ? form.getFieldValue('mainCon').toHTML() : ''}
        defaultImg={form.getFieldValue('thumbnail')}
        onOk={(url: string) => {
          console.log(url);
          form.setFieldsValue({ thumbnail: url === '' ? defImg : url });
        }}
        onCancel={() => {
          setSelectImageVisible(false);
        }}
      />
    </div>
  );
};

export default EditArticle;
