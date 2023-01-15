export interface ContexerDialogParams {
  baseUrl: string
  publicKey: string
  className?: string
}

export interface InitMessage {
  messageType: 'init'
  data: {
    /** User public key */
    publicKey: string
    className: string | undefined
  }
}

export interface OpenMessage {
  messageType: 'open'
}

export interface CloseMessage {
  messageType: 'close'
}

export interface ErrorMessage {
  messageType: 'error'
  data: {
    message: string
  }
}

export type ContexerMessage =
  | OpenMessage
  | CloseMessage
  | ErrorMessage
  | InitMessage
