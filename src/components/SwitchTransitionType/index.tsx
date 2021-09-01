import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import {
  Button, Dropdown, Menu,
} from 'antd'
import {
  CaretDownOutlined,
} from '@ant-design/icons'

import { State, SyncAction } from '@Src/store'
import { TransitionType, availableTransitionTypes } from '@Src/components/Transitions'

export default function SwitchTransitionType() {
  const { transitionType } = useSelector((state: State) => state.globalSettings)
  const dispatch = useDispatch<Dispatch<SyncAction>>()

  if (availableTransitionTypes.length <= 1) {
    return <Button disabled size='small'>
      {transitionType}
    </Button>
  }

  const menu = <Menu
    selectedKeys={[transitionType]}
    onClick={({ key }) => {
      const tarTransitionType = key.toString()
      dispatch({
        type: '@globalSettings/transitionType',
        value: tarTransitionType as TransitionType,
      })
    }}
  >
    {
      availableTransitionTypes.map((type) => (<Menu.Item key={type}>
        {type}
      </Menu.Item>))
    }
  </Menu>

  return <Dropdown overlay={menu} trigger={['click']}>
    <Button
      type='primary'
      size='small'
    >
      {transitionType}
      <CaretDownOutlined />
    </Button>
  </Dropdown>
}
