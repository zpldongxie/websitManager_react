export type MemberStatus = '申请中' | '初审通过' | '申请驳回' | '正式会员' | '禁用';
export type MemberTypes = {
  id: string;
  name: string;
};
// 渲染企业会员表单行
export type TableListItem = {
  key: number;
  id: string;
  /**
   * 企业名称
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
   * 所属行业
   *
   * @type {string}
   * @memberof TableListItem
   */
  industry: string;
  /**
   * 法人
   *
   * @type {string}
   * @memberof TableListItem
   */
  legalPerson: string;
  /**
   * 企业网站
   *
   * @type {string}
   * @memberof TableListItem
   */
  website: string;
  /**
   * 地址
   *
   * @type {string}
   * @memberof TableListItem
   */
  address: string;
  /**
   * 邮编
   *
   * @type {string}
   * @memberof TableListItem
   */
  zipCode: string;
  /**
   * 单位简介
   *
   * @type {string}
   * @memberof TableListItem
   */
  intro: string;
  /**
   * 注册日期
   *
   * @type {string}
   * @memberof TableListItem
   */
  logonDate: string;
  /**
   * 申请日期
   *
   * @type {string}
   * @memberof TableListItem
   */
  createdAt: string;
  /**
  * 更新日期
  *
  * @type {string}
  * @memberof TableListItem
  */
  updatedAt: string;
  /**
  * 会员等级
  *
  * @type {string}
  * @memberof TableListItem
  */
  MemberTypeId: string;
  MemberType: MemberTypes;
  /**
  * 邮件发送状态
  *
  * @type {string}
  * @memberof TableListItem
  */
  sendEmailStatus: string;
  /**
   * 状态
   *
   * @type {string}
   * @memberof TableListItem
   */
  status: MemberStatus;
  /**
   * 驳回原因
   *
   * @type {string}
   * @memberof TableListItem
   */
  rejectDesc?: string;
}

// 渲染个人会员表单行
export type PersonalTableListItem = {
  key: number;
  id: string;
  /**
   * 真实姓名
   *
   * @type {string}
   * @memberof TableListItem
   */
  name: string;
  /**
   * 认证类型
   *
   * @type {string}
   * @memberof TableListItem
   */
  idType: string;
  /**
   * 认证编号
   *
   * @type {string}
   * @memberof TableListItem
   */
  idNumber: string;
  /**
   * 手机
   *
   * @type {string}
   * @memberof TableListItem
   */
  mobile: string;
  /**
   * 邮箱地址
   *
   * @type {string}
   * @memberof TableListItem
   */
  email: string;
  /**
   * 英文名称
   *
   * @type {string}
   * @memberof TableListItem
   */
  enName: string;
  /**
   * 性别
   *
   * @type {string}
   * @memberof TableListItem
   */
  sex: string;
  /**
   * 婚姻状况
   *
   * @type {string}
   * @memberof TableListItem
   */
  maritalStatus?: string;
  /**
   * 个人网站
   *
   * @type {string}
   * @memberof TableListItem
   */
  website?: string;
  /**
   * 家庭地址
   *
   * @type {string}
   * @memberof TableListItem
   */
  homeAddress?: string;
  /**
   * 邮编
   *
   * @type {string}
   * @memberof TableListItem
   */
  zipCode?: string;
  /**
   * 职业
   *
   * @type {string}
   * @memberof TableListItem
   */
  profession?: string;
  /**
   * 出生日期
   *
   * @type {string}
   * @memberof TableListItem
   */
  birthday?: string;
  /**
   * 个人简介
   *
   * @type {string}
   * @memberof TableListItem
   */
  intro: string;
  /**
   * 注册日期
   *
   * @type {string}
   * @memberof TableListItem
   */
  logonDate?: string;
  /**
   * 申请日期
   *
   * @type {string}
   * @memberof TableListItem
   */
  createdAt: string;
  /**
  * 更新日期
  *
  * @type {string}
  * @memberof TableListItem
  */
  updatedAt: string;
  /**
  * 会员等级
  *
  * @type {string}
  * @memberof TableListItem
  */
  MemberTypeId: string;
  /**
  * 邮件发送状态
  *
  * @type {string}
  * @memberof TableListItem
  */
  sendEmailStatus: string;
  /**
   * 状态
   *
   * @type {string}
   * @memberof TableListItem
   */
  status: MemberStatus;
  /**
   * 驳回原因
   *
   * @type {string}
   * @memberof TableListItem
   */
  rejectDesc?: string;
}

// 翻页信息
export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
}

// 企业会员表结构定义
export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

// 个人会员表结构定义
export type PersonalTableListData = {
  list: PersonalTableListItem[];
  pagination: Partial<TableListPagination>;
}

/**
 * 查询参数
 *
 * @export
 * @interface TableListParams
 */
export type TableListParams = {
  corporateName?: string;
  contactsMobile?: string;
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
  status?: Record<string, any>;
}

/**
 * 编辑企业会员参数
 *
 * @export
 * @interface UpsertParams
 */
export type UpsertParams = {
  corporateName: string;
  tel: string;
  email: string;
  contacts: string;
  contactsMobile: string;
  intro: string;
  industry?: string;
  legalPerson?: string;
  website?: string;
  address: string;
  zipCode?: string;
  logonData?: string;
  status?: string;
}

/**
 * 编辑个人会员参数
 *
 * @export
 * @interface PersonalUpsertParams
 */
export type PersonalUpsertParams = {
  name: string;
  idType?: string;
  idNumber: string;
  mobile: string;
  email: string;
  enName?: string;
  sex: string;
  maritalStatus?: string;
  website?: string;
  homeAddress?: string;
  zipCode?: string;
  profession?: string;
  birthday?: string;
  intro: string;
  zipCode?: string;
  logonDate?: string;
  status?: string;
}

/**
 * 审批会员参数
 *
 * @export
 * @interface AuditMemberParams
 */
export type AuditMemberParams = {
  id: string;
  status: MemberStatus;
  rejectDesc?: string;
}