import React, {
  useState, useRef, useCallback, CSSProperties, useMemo, useEffect,
} from 'react'
import {
  Button, Input,
} from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useSize } from 'xiaoming-hooks'
import { TextAreaProps } from 'antd/lib/input'

import { joinSpace } from '@Src/utils/others'
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

  const [isFocused, setIsFocused] = useState(false)
  const docSize = useSize('DOC_CLIENT_SIZE', 500)
  const isBigScreen = !isMobile
  const inputAreaClassName = joinSpace(
    isBigScreen ? Styles.bigScreen : Styles.miniScreen,
    isFocused && Styles.focus,
  )

  const textAreaProps: Pick<TextAreaProps, 'rows' | 'autoSize'> = useMemo(() => {
    if (isBigScreen) {
      return {
        rows: Math.floor(docSize.height / 80),
      }
    }
    return {
      autoSize: {
        minRows: 1,
        maxRows: 8,
      },
    }
  }, [docSize.height, isBigScreen])

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
        if (res) {
          setContent('')
        }
      }).finally(() => {
        setLoading(false)
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
    <div className={joinSpace(Styles.inputArea, inputAreaClassName)}>
      <Input.TextArea
        ref={inputRef}
        className={Styles.inputBox}
        value={content}
        bordered={!isBigScreen}
        maxLength={500}
        placeholder={isMobile ? '输入...' : 'ctrl + Enter 快捷发送'}
        onChange={innerOnChange}
        onPressEnter={onPressEnter}
        onFocus={() => {
          setIsFocused(true)
        }}
        onBlur={() => {
          setIsFocused(false)
        }}
        // key 的作用是, 当 textAreaProps 更新时更新, 由于当前 isBigScreen 不是响应值, 所以不要也行
        // 移动端弹出输入法时, 会改变 doc-height/window-height
        // 所以 key 中不能包含高度信息
        // 否则输入法弹出, 高度更新, 导致 key 更新, 导致输入法失焦退出, 死循环
        key={`${isBigScreen}`}
        {...textAreaProps}
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
