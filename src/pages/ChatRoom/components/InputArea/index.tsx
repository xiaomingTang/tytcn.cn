import React, {
  useState, useRef, useCallback, CSSProperties,
} from 'react'
import {
  Button, Input,
} from 'antd'
import { MailOutlined } from '@ant-design/icons'

import { isMobile } from '@Src/utils/device'

import Styles from './index.module.less'

export interface InputAreaProps {
  className?: HTMLDivElement['className'];
  style?: CSSProperties;
  /**
   * 用户点击了'发送'按钮
   * @param content trim() 后的文本
   * @returns 发送是否成功(成功后将会自动清空文本)
   */
  onSubmit?: (content: string) => (boolean | Promise<boolean>);
  /**
   * Input 的 onChange 事件
   * @returns 输入框最终显示的文本
   */
  onChange?: (prevContent: string, newContent: string) => string;
}

const defaultClassName: Required<InputAreaProps>['className'] = ''
const defaultStyle: Required<InputAreaProps>['style'] = {}
const defaultOnSubmit: Required<InputAreaProps>['onSubmit'] = () => true
const defaultOnChange: Required<InputAreaProps>['onChange'] = (prevContent, newContent) => newContent

export function InputArea({
  className = defaultClassName,
  style = defaultStyle,
  onSubmit = defaultOnSubmit,
  onChange = defaultOnChange,
}: InputAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const innerOnSubmit = useCallback(() => {
    const input = inputRef.current
    if (input) {
      input.focus()
    }
    setLoading(true)
    const result = onSubmit(content.trim())
    const promiseResult = result as Promise<boolean>
    if (promiseResult && typeof promiseResult.then === 'function') {
      promiseResult.then((res) => {
        setLoading(false)
        if (res) {
          setContent('')
        }
      })
    } else {
      setLoading(false)
      if (result) {
        setContent('')
      }
    }
  }, [content, onSubmit])

  const innerOnChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent((prevContent) => onChange(prevContent, e.target.value || ''))
  }

  const onPressEnter: React.KeyboardEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault()
      innerOnSubmit()
    }
  }, [innerOnSubmit])

  return <div className={className} style={style}>
    <div className={Styles.inputArea}>
      <Input.TextArea
        className={Styles.inputBox}
        value={content}
        autoFocus
        ref={inputRef}
        maxLength={500}
        placeholder={isMobile ? '' : 'ctrl + Enter 快捷发送'}
        autoSize={{
          minRows: 1,
          maxRows: 6,
        }}
        onChange={innerOnChange}
        onPressEnter={onPressEnter}
      />
      <Button
        className={Styles.actions}
        type='primary'
        loading={loading}
        disabled={!content || loading}
        onClick={innerOnSubmit}
        icon={<MailOutlined />}
      />
    </div>
  </div>
}
