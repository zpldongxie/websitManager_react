/** !
 * @description: 文件展示列表
 * @author: zpl
 * @Date: 2020-10-18 14:48:49
 * @LastEditTime: 2020-10-18 14:52:49
 * @LastEditors: zpl
 */
import React, { FC, useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import styles from './index.module.less';

const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

interface PreviewType {
  type: string;
  name: string;
  url: string;
}

const Preview = ({ type, name, url }: PreviewType) => {
  switch (type) {
    case 'image': 
      return <img alt={name} src={url} className={styles.preview} />;
    case 'video':
      return <video src={url} controls className={styles.preview}><track kind="captions" /></video>;
    case 'audio':
      return <audio src={url} controls className={styles.preview}><track kind="captions" /></audio>
    default:
  return <div />
  }
}

interface PropsType {
  type: string;
  currentFileList: UploadFile<any>[];
  setCurrentFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
  onRemove: (fileName: string) => Promise<boolean>;
}

const ViewFileList: FC<PropsType> = ({ type, currentFileList, setCurrentFileList, onRemove }: PropsType) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  /**
   * 取消预览
   *
   */
  const handleCancel = () => setPreviewVisible(false);

  /**
   * 预览
   *
   * @param {*} file
   */
  const handlePreview = async (file: any) => {
    const currentFile = { ...file };
    if (!currentFile.url && !currentFile.preview) {
      currentFile.preview = await getBase64(currentFile.originFileObj);
    }

    setPreviewVisible(true);
    setPreviewTitle(
      currentFile.name || currentFile.url.substring(currentFile.url.lastIndexOf('/') + 1),
    );
    setPreviewUrl(currentFile.url);
  };

  /**
   * 上传状态变更回调
   *
   * @param {{ file: UploadFile; fileList: Array<UploadFile> }} { file, fileList }
   */
  const handleChange = ({ file, fileList }: { file: UploadFile; fileList: Array<UploadFile> }) => {
    if (file.status === 'error') {
      message.error(file.response.message);
    }
    if (file.status === 'done') {
      // eslint-disable-next-line no-param-reassign
      fileList.filter((f: UploadFile<any>) => !!f.xhr).forEach((f: UploadFile<any>) => {f.thumbUrl = ''; f.url = f.xhr.response});
      message.success('上传成功');
    }
    setCurrentFileList(fileList);
  };

  /**
   * 删除文件方法
   *
   * @param {UploadFile<any>} file
   * @returns {(boolean | void | Promise<boolean | void>)}
   */
  const handleRemove = (file: UploadFile<any>): boolean | void | Promise<boolean | void> => { 
    if(file.status === 'error') {
      return true;
    }
    return new Promise((resolve) => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: '确认删除吗？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          (async () => {
            resolve(await onRemove(file.name));
          })()
        },
        onCancel() {
          resolve(false);
        }
      });
    } )      
  }

  let accept: string = '*/*';
  let listType: "text" | "picture" | "picture-card" = 'text';
  if (type === 'image') {accept = "image/*"; listType = "picture-card";}
  if (type === 'video') {accept = "video/*"; listType = 'picture';}
  if (type === 'audio') {accept = "audio/*";}

  return (
    <div>
      <Upload
        name={type}
        action="/api/upload"
        accept={accept}
        listType={listType}
        fileList={currentFileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        <div className={type === 'image' ? styles.blockBtn : styles.flexBtn}>
          <PlusOutlined />
          <div className={styles.uploadText}>上传</div>
        </div>
      </Upload>
      <Modal 
        visible={previewVisible}
        title={previewTitle}
        footer={
          <div className={styles.previewFooter}>
            <CopyToClipboard text={previewUrl}
              onCopy={() => message.info('链接已复制到剪贴板')}>
              <a>复制链接</a>
            </CopyToClipboard>
            {type !== 'image' && <a href={previewUrl} download={previewUrl}>下载文件</a>}
          </div>
        } 
        onCancel={handleCancel}
        okText={false}
        cancelText={false}
      >
        <Preview type={type} name={previewTitle} url={previewUrl} />
      </Modal>
    </div>
  );
};

export default ViewFileList;
