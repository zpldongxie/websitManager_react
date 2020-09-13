// 渲染表单行
export interface TableListItem {
  id?: string;
  name: string;
  mobile: string;
  email: string;
  comp: string;
  passed: boolean;
  signInTime?: string;
  TrainingId: string;
  Training?: { id: string; title: string; Channel: { id: number; name: string } };
  updatedAt?: string;
  createdAt?: string;
}

// 翻页信息
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

// 表结构定义
export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

// 查询参数
export interface TableListParams {
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
