import ReconnectingWebSocket from 'reconnecting-websocket'
import { Storage } from './storage'

const url = `ws://username:password@localhost:3001?Authorization=${Storage.get('Authorization')}`

const ws = new ReconnectingWebSocket(url, 'ws', {
  maxRetries: 0,
})

ws.addEventListener('open', (e) => {
  console.log(e)
  ws.send(JSON.stringify({
    event: 'chat-list-2',
    data: 'hello from client',
  }))
})

ws.addEventListener('message', (e) => {
  console.log(e)
})

ws.addEventListener('close', (e) => {
  console.error(e)
})

ws.addEventListener('error', (e) => {
  console.error(e)
})
