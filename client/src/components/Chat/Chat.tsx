import { useEffect, useState, useRef } from 'react'
import { socket } from '../../socket'
import './Chat.scss'

type ChatMessage = {
  name: string
  message: string
  color: string
}

const Chat = () => {
  const messageInputRef = useRef<HTMLInputElement | null>(null)

  const chatRef = useRef<HTMLDivElement | null>(null)

  const [chat, setChat] = useState<Array<ChatMessage>>([])
  const [chatMessage, setChatMessage] = useState('')

  useEffect(() => {
    let isInitiated = false

    socket.emit('request-chat')

    socket.on('update-chat', chat => {
      setChat(chat)
      if (messageInputRef.current !== null) {
        messageInputRef.current.value = ''
      }
      if (chatRef.current !== null) {
        if (
          Math.ceil(chatRef.current.scrollTop) + chatRef.current.clientHeight + 30 >=
          chatRef.current.scrollHeight
        ) {
          chatRef.current.scrollBy(0, 30)
        }
        if (!isInitiated) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight
          isInitiated = true
        }
      }
    })

    return () => {
      socket.off('initiate-lobby-page')
      socket.off('update-chat')
    }
  }, [null])

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (
      event.key === 'Enter' &&
      messageInputRef.current !== undefined &&
      messageInputRef.current !== null &&
      messageInputRef.current.value.trim() !== ''
    ) {
      socket.emit('send-chat', messageInputRef.current.value.trim())
    }
  }

  return (
    <div className='chatContainer'>
      <div ref={chatRef} className='chatMessageContainer'>
        {chat.map(chatMessage => {
          return (
            <p key={chat.indexOf(chatMessage)} className='chatMessage'>
              <span style={{ color: chatMessage.color }}>{chatMessage.name + ' '}</span>
              {chatMessage.message}
            </p>
          )
        })}
      </div>
      <input
        ref={messageInputRef}
        className='messageInput'
        type='text'
        placeholder='Aa'
        value={chatMessage}
        onChange={event => setChatMessage(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default Chat
