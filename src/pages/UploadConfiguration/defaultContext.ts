import React from 'react';

export default React.createContext([{
  descStr: "文件保存位置",
  name: "upload_path",
  value: "",
}, {
  descStr: "音频格式限制，以英文逗号分隔",
  name: "audio_ext",
  value: "mp3",
}, {
  descStr: "音频大小限制，单位KB",
  name: "audio_size",
  value: "51200",
}, {
  descStr: "访问域名/IP",
  name: "base_url",
  value: "http://49.234.158.74/",
},  {
  descStr: "图片格式限制，以英文逗号分隔",
  name: "image_ext",
  value: "gif,jpg,jpeg,png,bmp",
},{
  descStr: "图片大小限制，单位KB",
  name: "image_size",
  value: "51200",
}, {
  descStr: "视频格式限制，以英文逗号分隔",
  name: "video_ext",
  value: "mp4,ogg,wav",
}, {
  descStr: "视频大小限制，单位KB",
  name: "video_size",
  value: "51200",
}, {
  descStr: "其他格式限制，以英文逗号分隔",
  name: "other_ext",
  value: "doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz",
}, {
  descStr: "其他大小限制，单位KB",
  name: "other_size",
  value: "5120",
}]);