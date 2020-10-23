/**
 * 文章内容
 *
 * @interface ContentType
 */
interface ContentType {
  id: string;
  title: string;
  subtitle: string;
  keyWord: string;
  summary: string;
  thumbnail: string;
  auth: string;
  source: string;
  conDate: string;
  isHead: number;
  isRecom: number;
  orderIndex: number;
  canComment: number;
  commentStartTime: string;
  commentEndTime: string;
  contentType: '文章';
  mainCon: string;
  mainPic: string;
  mainVideo: string;
  mainUrl: string;
  createdAt: string;
  updatedAt: string;
  Channels: ChannelType[]
}