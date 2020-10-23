import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Modal, Row } from 'antd'
// import { defImg } from '@/constant'

import styles from './index.module.less'

interface PropsType {
  title: string;
  visible: boolean;
  contentHtml: string;
  defaultImg: string;
  onOk: (url: string) => void;
  onCancel: () => void;
}
const SelectImage = ({ title, visible, contentHtml, defaultImg, onOk, onCancel }: PropsType) => {
  const [list, setList] = useState<string[]>([]); // 图片列表
  const [selectedUrl, setSelectedUrl] = useState<string>(defaultImg || ''); // 已选图片
  const [netInputValue, setNetInputValue] = useState(''); // 网络资源输入框内容

  useEffect(() => {
    const strList = contentHtml ? contentHtml.match(/img.*?src=['"].*?['"]/g) : [];
    const urlList = strList?.map((str) => {
      const s = str.match(/src=['"](\S*)['"]/);
      if (s) return s[1];
      return '';
    }) || [];
    // urlList.push(defImg); // 任何情况下都追加一个空，用来取消选择
    setList(urlList);
  }, [contentHtml]);

  useEffect(() => {
    if (!selectedUrl && defaultImg)
      setSelectedUrl(defaultImg);
  }, [defaultImg, visible]);

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={() => { onOk(selectedUrl === 'none' ? '' : selectedUrl); onCancel(); }}
      onCancel={onCancel}
    >
      <Row className={styles.listCon} gutter={10}>
        {
          list.map((item: string) => (
            <Col
              key={item}              
              onClick={() => { setSelectedUrl(item === selectedUrl ? '' : item) }}
            >
              <div
                className={styles.col}
                style={{ borderColor: selectedUrl === item ? 'rgba(24, 144, 255, 1)' : '#ccc' }}
              >
                <img
                  src={item}
                  alt=''
                  width='100px'
                  height='100px'
                />
              </div>
            </Col>
          ))
        }
      </Row>
      <div className={styles.netInputCon}>
        <Input 
          placeholder='添加网络资源' 
          allowClear 
          addonAfter={
            <Button 
              size='small' 
              className={styles.btn}
              onClick={() => {
                if (netInputValue)
                  setList([...list, netInputValue])
              }}
            >添加</Button>
          }
          value={netInputValue}
          onChange={(e) => {
            setNetInputValue(e.target.value)            
          }}
        />
      </div>
    </Modal>
  )
}

export default SelectImage
