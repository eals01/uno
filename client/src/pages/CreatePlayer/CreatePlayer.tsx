import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../socket'
import './CreatePlayer.scss'

const CreatePlayer = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [color, setColor] = useState('transparent')
    const [roomCode, setRoomCode] = useState('---')
    const [name, setName] = useState('')

    // initiate page
    useEffect(() => {
        socket.emit('request-create-player-page')

        socket.on('return-to-home', () => {
            navigate('/')
        })

        socket.on('initiate-create-player-page', pageContent => {
            setLoading(false)
            setColor(pageContent.color)
            setRoomCode(pageContent.roomCode)
        })

        socket.on('admit-player', () => {
            navigate('/lobby')
        })

        // cleanup listeners on dismount
        return () => {
            socket.off('return-to-home')
            socket.off('initiate-create-player-page')
            socket.off('admit-player')
        }
    }, [null])

    const handleCreate = () => {
        if(name !== '') {
            socket.emit('create-player', name)
        }
    }

    if(loading) {
        return (
            <div>LOADING</div>
        ) 
    } else {
        return (
        <main className='createPlayerContainer'>
            <span className='lobbyCode'>{roomCode}</span>
            <input 
                type = 'text'
                placeholder = 'Enter name'

                value = {name}
                onChange = {event => setName(event.target.value.toUpperCase())}

                style = {{color: color}}
            />
            <button onClick={handleCreate}>Create player</button>
        </main>
        )   
    }
}

export default CreatePlayer