import io from 'socket.io-client'

export const socket = io(`http://${window.location.hostname}:4000`)
socket.on('connect', () => {
    console.log('connected')
})