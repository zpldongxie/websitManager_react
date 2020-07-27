/** !
 * @description: 选择栏目组件
 * @author: zpl
 * @Date: 2020-07-17 17:59:12
 * @LastEditTime: 2020-07-17 18:01:54
 * @LastEditors: zpl
 */
import React from 'react'

interface Props {
  show: boolean;
  currentIds: string[];
}

const SelectChannels = (props: Props) => {
  const { show = false, currentIds = [] } = props;
  return (
    <>
      {
        show
          ? <div>channels</div>
          : ''
      }
    </>
  )
}

export default SelectChannels
