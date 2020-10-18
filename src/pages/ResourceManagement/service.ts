import request from 'umi-request';

/**
 * 按条件查询文章列表
 *
 * @export
 * @param {TableListParams} [params]
 * @return {*}
 */
export async function showFileList(params: { currentPath: string }) {
  const result = await request('/api/showFileList', {
    method: 'POST',
    data: { ...params },
  });

  if (result.status === 'ok') {
    // const list = result.data.map((file: FileItemType, index: number) => ({
    //   ...file,
    //   uid: index,
    //   status: 'done',
    //   size: 100,
    // }));
    // return list;
    return result.data;
  }
  return [];
}
