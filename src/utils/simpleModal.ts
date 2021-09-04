import { Modal, ModalFuncProps } from 'antd'

export function simpleModal(props: ModalFuncProps) {
  return Modal.info({
    // 样式参考 ./index.module.less 内的 .signin-box-container
    width: '80%',
    style: {
      maxWidth: '350px',
      paddingBottom: '0',
      boxShadow: '0 0 20px #565656',
    },
    centered: true,
    mask: true,
    maskClosable: true,
    keyboard: true,
    ...props,
  })
}
