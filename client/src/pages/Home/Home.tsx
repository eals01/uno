import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../socket'
import './Home.scss'

const Home = () => {
    const navigate = useNavigate()

    const [roomCode, setRoomCode] = useState('')

    const handleCreate = () => {
        socket.emit('create-room')
    }

    const handleJoin = () => {
        if(roomCode.length === 3) socket.emit('join-room', roomCode)
    }

    useEffect(() => {
        socket.on('admit-player', () => {
            navigate('/create-player')
        })

        // cleanup listeners on dismount
        return () => {
            socket.off('admit-player')
        }
    }, [null])

    return (
        <main className='homeContainer'>
            <h1>UNO</h1>
            <button onClick={handleCreate}>Create room</button>
            <span>or</span>
            <input 
                type = 'text'
                placeholder = 'Enter room code'
                maxLength = {3}

                value = {roomCode}
                onChange = {event => setRoomCode(event.target.value.toUpperCase())}
            />
            <button onClick={handleJoin}>Join game</button>
        </main>
    )
}

export default Home