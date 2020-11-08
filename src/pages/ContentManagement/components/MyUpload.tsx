/** !
 * @description: 自定义附件上传组件，富文本编辑器中引用
 * @author: zpl
 * @Date: 2020-10-22 12:37:07
 * @LastEditTime: 2020-10-22 12:41:31
 * @LastEditors: zpl
 */
import React from 'react';
import { message, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { PaperClipOutlined } from '@ant-design/icons';

interface PropsType {
  checkFun: () => boolean;
  setEditorState: (state: unknown) => void;
}

const MyUpload = ({ checkFun, setEditorState }: PropsType) => {
  const handleChange = ({ file }: { file: UploadFile }) => {
    if (file.status === 'error') {
      const listDom = window.document.body.querySelector('.bf-controlbar .ant-upload-list');
      if (listDom) listDom.innerHTML = '';
      message.error(file.response.message);
    }
    if (file.status === 'done') {
      message.success('上传成功');
      const listDom = window.document.body.querySelector('.bf-controlbar .ant-upload-list');
      if (listDom) listDom.innerHTML = '';
      setEditorState(`<a href=${file.response} download=${file.response}>${file.name}</a>`);
    }
  };

  return (
    <Upload
      name="other"
      action="/api/upload"
      accept="*/*"
      showUploadList
      beforeUpload={checkFun}
      onChange={handleChange}
    >
      {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
      <button type="button" className="control-item button upload-button" data-title="插入附件">
        <PaperClipOutlined />
      </button>
    </Upload>
  );
};

export default MyUpload;
