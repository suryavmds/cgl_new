import { Spin } from 'antd'
import React from 'react'
import {AiOutlineLoading3Quarters} from 'react-icons/ai'

const Loading = ({isLoading}) => {

if(isLoading){
    return (
      <div className='cdx_overloading'>
          {/* <AiOutlineLoading3Quarters /> */}
          <Spin size='large' />
      </div>
    )
}
return null

}

export default Loading