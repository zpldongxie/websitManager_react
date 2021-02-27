import React from 'react'
import { CopyrightOutlined } from '@ant-design/icons';

const GlobalFooter = () => {
  return (
    <>
      <div className='ant-pro-global-footer-copyright' style={{ padding: '0.5rem', textAlign: 'center'}}>
        Copyright <CopyrightOutlined /> {`${new Date().getFullYear()} 西安云适配`}
      </div>
      {/* <DefaultFooter copyright={`${new Date().getFullYear()} 西安云适配`} links={defaultLinks} /> */}
    </>
  )
}

export default GlobalFooter
