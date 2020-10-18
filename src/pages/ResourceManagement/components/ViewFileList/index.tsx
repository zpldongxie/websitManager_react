/** !
 * @description: 文件展示列表
 * @author: zpl
 * @Date: 2020-10-18 14:48:49
 * @LastEditTime: 2020-10-18 14:52:49
 * @LastEditors: zpl
 */
import React, { useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';

const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

interface PropsType {
  currentFileList: UploadFile<any>[];
  setCurrentFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
}

const ViewFileList = ({ currentFileList, setCurrentFileList }: PropsType) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: any) => {
    const currentFile = { ...file };
    if (!currentFile.url && !currentFile.preview) {
      currentFile.preview = await getBase64(currentFile.originFileObj);
    }

    setPreviewVisible(true);
    setPreviewTitle(
      currentFile.name || currentFile.url.substring(currentFile.url.lastIndexOf('/') + 1),
    );
    setPreviewImage(currentFile.url || currentFile.preview);
  };

  const handleChange = ({ file, fileList }: { file: UploadFile; fileList: Array<UploadFile> }) => {
    if (file.status === 'error') {
      message.error(file.response.message);
    }
    if (file.status === 'done') {
      message.success('上传成功');
    }
    setCurrentFileList(fileList);
  };

  return (
    <div>
      <Upload
        name="image"
        action="/api/upload"
        accept="image/*"
        listType="picture-card"
        fileList={currentFileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传</div>
        </div>
      </Upload>
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ViewFileList;
