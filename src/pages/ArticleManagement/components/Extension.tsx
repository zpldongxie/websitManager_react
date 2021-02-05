import React, { FC, useEffect, useState } from 'react';
import { Button, Col, Collapse, Divider, Input, Row } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

interface AddExtensionPropsType {
  addHandler: (title: string, info: string, market: string) => void;
}

/**
 * 新增数据
 *
 * @param {AddExtensionPropsType} { addHandler }
 * @return {*}
 */
const AddExtension = ({ addHandler }: AddExtensionPropsType) => {
  const [title, setTitle] = useState('');
  const [info, setInfo] = useState('');
  const [market, setMarket] = useState('');

  const clickHandler = () => {
    if (title && info) {
      addHandler(title, info, market);
      setTitle('');
      setInfo('');
      setMarket('');
    }
  };

  return (
    <Row gutter={10}>
      <Col sm={6} xs={10}>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </Col>
      <Col sm={7} xs={12}>
        <Input
          value={info}
          onChange={(e) => {
            setInfo(e.target.value);
          }}
        />
      </Col>
      <Col sm={10} xs={0}>
        <Input
          value={market}
          onChange={(e) => {
            setMarket(e.target.value);
          }}
        />
      </Col>
      <Col sm={1} xs={2}>
        <Button
          style={{ border: 'none', padding: 0, boxShadow: 'none' }}
          onClick={() => {
            clickHandler();
          }}
        >
          <PlusCircleOutlined style={{ opacity: 0.5 }} />
        </Button>
      </Col>
    </Row>
  );
};

interface PropsType {
  value?: any;
  disabled: boolean;
  form: FormInstance<any>;
}

/**
 * 主组件
 *
 * @param {PropsType} { value, disabled, form }
 * @return {*}
 */
const Extension: FC<PropsType> = ({ value, disabled, form }: PropsType) => {
  const [list, setList] = useState<
    {
      id?: string;
      title: string;
      info: string;
      market: string;
    }[]
  >([]);

  /**
   * 已有数据修改
   *
   * @param {number} index 行号
   * @param {string} k 键
   * @param {string} v 值
   */
  const onValueChange = (index: number, k: string, v: string) => {
    const newList = [...list];
    const item = newList[index];
    item[k] = v;
    setList(newList);
  };

  // 大表单读取到信息后会写到value中，需要监听回填
  useEffect(() => {
    setList(value || []);
  }, [value]);

  // 数据发生变化时，如果与已有数据不同，则更新表单，必须加此判断，否则会进入死循环
  useEffect(() => {
    const oldValue = form.getFieldValue('ArticleExtensions') || [];
    if (oldValue !== list && (oldValue.length || list.length)) {
      form.setFieldsValue({ ArticleExtensions: list });
    }
  }, [list]);

  return (
    <div data-value={list}>
      <Collapse>
        <Collapse.Panel header="扩展配置" key="1">
          <Row gutter={10} style={{ marginBottom: '1rem' }}>
            <Col className="gutter-row" sm={6} xs={10}>
              标题
            </Col>
            <Col className="gutter-row" sm={7} xs={12}>
              内容
            </Col>
            <Col className="gutter-row" sm={10} xs={0}>
              备注
            </Col>
          </Row>
          {list.map((item, index) => (
            <Row key={item.title} gutter={10} data-id={item.id} style={{ marginBottom: '1rem' }}>
              <Col className="gutter-row" sm={6} xs={10}>
                <Input
                  disabled={disabled}
                  value={item.title}
                  onChange={(e) => {
                    onValueChange(index, 'title', e.target.value);
                  }}
                />
              </Col>
              <Col className="gutter-row" sm={7} xs={12}>
                <Input
                  disabled={disabled}
                  value={item.info}
                  onChange={(e) => {
                    onValueChange(index, 'info', e.target.value);
                  }}
                />
              </Col>
              <Col className="gutter-row" sm={10} xs={0}>
                <Input
                  disabled={disabled}
                  value={item.market}
                  onChange={(e) => {
                    onValueChange(index, 'market', e.target.value);
                  }}
                />
              </Col>
              <Col className="gutter-row" sm={1} xs={2}>
                <Button
                  style={{ border: 'none', padding: 0, boxShadow: 'none' }}
                  onClick={() => {
                    const newList = [...list];
                    newList.splice(index, 1);
                    setList(newList);
                  }}
                >
                  <MinusCircleOutlined style={{ opacity: 0.5 }} />
                </Button>
              </Col>
            </Row>
          ))}
          <Divider />
          {!disabled && (
            <AddExtension
              addHandler={(title: string, info: string, market: string) => {
                setList([
                  ...list,
                  {
                    title,
                    info,
                    market,
                  },
                ]);
              }}
            />
          )}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default Extension;
