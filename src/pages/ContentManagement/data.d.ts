export interface TableListItem {
  key: number;
  id: number;
  /**
   * 标题
   *
   * @type {string}
   * @memberof TableListItem
   */
  title: string;
  /**
   * 所属栏目
   *
   * @type {{ name: string; id: string }[]}
   * @memberof TableListItem
   */
  channels: { name: string; id: string }[];
  /**
   * 文章类型
   *
   * @type {string}
   * @memberof TableListItem
   */
  contentType: string;
  /**
   * 副标题
   *
   * @type {string}
   * @memberof TableListItem
   */
  subtitle: string;
  /**
   * 关键词
   *
   * @type {string}
   * @memberof TableListItem
   */
  keyWord: string;
  /**
   * 摘要
   *
   * @type {string}
   * @memberof TableListItem
   */
  summary: string;
  /**
   * 标题图片
   *
   * @type {string}
   * @memberof TableListItem
   */
  thumbnail: string;
  /**
   * 作者
   *
   * @type {string}
   * @memberof TableListItem
   */
  auth: string;
  /**
   * 来源
   *
   * @type {string}
   * @memberof TableListItem
   */
  source: string;
  /**
   * 发布时间
   *
   * @type {string}
   * @memberof TableListItem
   */
  conDate: string;
  /**
   * 头条
   *
   * @type {boolean}
   * @memberof TableListItem
   */
  isHead: boolean;
  /**
   * 推荐
   *
   * @type {boolean}
   * @memberof TableListItem
   */
  isRecom: boolean;
  /**
   * 排序值
   *
   * @type {number}
   * @memberof TableListItem
   */
  orderIndex: number;
  /**
   * 允许评论
   *
   * @type {boolean}
   * @memberof TableListItem
   */
  canComment: boolean;
  /**
   * 评论开始时间
   *
   * @type {string}
   * @memberof TableListItem
   */
  commentStartTime: string;
  /**
   * 评论结束时间
   *
   * @type {string}
   * @memberof TableListItem
   */
  commentEndTime: string;
  /**
   * 文章内容
   *
   * @type {string}
   * @memberof TableListItem
   */
  mainCon?: string;
  /**
   * 图片地址
   *
   * @type {string}
   * @memberof TableListItem
   */
  mainPic: string;
  /**
   * 视频地址
   *
   * @type {string}
   * @memberof TableListItem
   */
  mainVideo: string;
  /**
   * 链接
   *
   * @type {string}
   * @memberof TableListItem
   */
  mainUrl: string;
  /**
   * 审核状态
   *
   * @type {string}
   * @memberof TableListItem
   */
  approvalStatus: string;
  /**
   * 发布状态
   *
   * @type {string}
   * @memberof TableListItem
   */
  pubStatus: string;

  /**
   * 创建时间
   *
   * @type {string}
   * @memberof TableListItem
   */
  createTime: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  title?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  current?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
  channelId: string;
}

export interface QueryContentListParams {
  channelId: string,
  contentType: string,
  length: number,
  orderName: string,
  orderValue: string,
  search: string;
  start: number,
}
