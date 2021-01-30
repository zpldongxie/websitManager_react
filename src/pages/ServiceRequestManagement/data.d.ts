export type ServiceStatus = '申请中' | '接受申请' | '拒绝申请' | '服务中' | '服务完成';

// 渲染表单行
export type TableListItem = {
  key: number;
  id?: string;
  /**
   * 单位名称
   *
   * @type {string}
   * @memberof TableListItem
   */
  corporateName: string;
  /**
   * 座机
   *
   * @type {string}
   * @memberof TableListItem
   */
  tel: string;
  /**
   * 邮箱
   *
   * @type {string}
   * @memberof TableListItem
   */
  email: string;
  /**
   * 地址
   *
   * @type {string}
   * @memberof TableListItem
   */
  address?: string;
  /**
   * 邮编
   *
   * @type {string}
   * @memberof TableListItem
   */
  zipCode?: string;
  /**
   * 企业网站
   *
   * @type {string}
   * @memberof TableListItem
   */
  website?: string;
  /**
   * 联系人
   *
   * @type {string}
   * @memberof TableListItem
   */
  contacts: string;
  /**
   * 联系人手机
   *
   * @type {string}
   * @memberof TableListItem
   */
  contactsMobile: string;
  /**
   * 需求类型
   *
   * @type {string}
   * @memberof TableListItem
   */
  demandType: string;
  /**
   * 需求描述
   *
   * @type {string}
   * @memberof TableListItem
   */
  requestDesc: string;
  status: ServiceStatus;
  /**
   * 拒绝原因
   *
   * @type {string}
   * @memberof TableListItem
   */
  rejectReason?: string;
  /**
   * 用务描述，管理员选填，便于事后追溯
   *
   * @type {string}
   * @memberof TableListItem
   */
  serviceDesc?: string;
  /**
   * 更新时间
   *
   * @type {string}
   * @memberof TableListItem
   */
  updatedAt?: string;
  /**
   * 创建时间
   *
   * @type {string}
   * @memberof TableListItem
   */
  createdAt?: string;
};

// 翻页信息
export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

// 表结构定义
export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

/**
 * 查询参数
 *
 * @export
 * @interface TableListParams
 */
export type TableListParams = {
  corporateName?: string;
  tel?: string;
  contacts?: string;
  contactsMobile?: number;
  demandType?: string;
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
