export type ServiceStatus = '申请中' | '初审通过' | '正式入驻' | '申请驳回' | '禁用';
export type status = '未发送' | '发送失败' | '发送成功';
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
   * 电话
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
   * 官方网站
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
   * 申请类别
   *
   * @type {string}
   * @memberof TableListItem
   */
  type: string;
  /**
   * 申请描述
   *
   * @type {string}
   * @memberof TableListItem
   */
  descStr: string;

  /**
   * 申请时间
   *
   * @type {string}
   * @memberof TableListItem
   */
  createdAt: string;

  /**
   * 审批状态
   *
   * @type {string}
   * @memberof TableListItem
   */
  status: ServiceStatus;
  /**
   * 驳回原因
   *
   * @type {string}
   * @memberof TableListItem
   */
  rejectDesc?: string;
  /**
   * 入驻时间
   *
   * @type {string}
   * @memberof TableListItem
   */
  lodonDate?: string;
  /**
   * 邮件发送状态
   *
   * @type {string}
   * @memberof TableListItem
   */
  sendEmailStatus: status;
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
