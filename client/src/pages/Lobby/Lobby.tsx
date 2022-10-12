import { useState, useEffect, useRef } from 'react'
import './Lobby.scss'
import Chat from '../../components/Chat/Chat'
import LobbyAdminPanel from '../../components/LobbyAdminPanel/LobbyAdminPanel'
import { socket } from '../../socket'
import { useNavigate } from 'react-router-dom'

type Player = {
    id: string
    name: string
    image: string | null 
    color: string | null
}

const Lobby = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [admin, setAdmin] = useState(false)
    const [roomCode, setRoomCode] = useState<String>('XYZ')
    const [players, setPlayers] = useState<Array<Player>>([])

    // initiate page
    useEffect(() => {
        socket.emit('request-lobby-page')

        socket.on('return-to-home', () => {
            navigate('/')
        })

        socket.on('initiate-lobby-page', pageContent => {
            setLoading(false)
            setAdmin(pageContent.admin)
            setRoomCode(pageContent.roomCode)
            setPlayers(pageContent.players)
        })

        socket.on('update-players', players => {
            setPlayers(players)
        })

        socket.on('admit-access', () => {
            navigate('/game-room')
        })

        // cleanup listeners on dismount
        return () => {
            socket.off('return-to-home')
            socket.off('initiate-lobby-page')
            socket.off('update-players')
            socket.off('admit-access')
        }
    }, [null])

    // position users in userCircle
    const userCircleRef = useRef<HTMLDivElement|null>(null)
    useEffect(() => {
        if(userCircleRef.current !== null) {
            let userList = Array.from(userCircleRef.current.children)
            let corners = userList.length
            let degrees = 360 / corners
            let radius = 100

            let currentDegree = 0
            for(let i in userList) {
                let user = userList[i] as HTMLDivElement
                user.style.transform = `translate(
                    ${Math.floor(Math.cos(currentDegree * (Math.PI / 180)) * radius) - (user.offsetWidth / 2) + 'px'}, 
                    ${Math.floor(Math.sin(currentDegree * (Math.PI / 180)) * radius) - (user.offsetHeight / 2)+ 'px'}
                )`
                currentDegree += degrees
            }
        }
    }, [players])
    
    if(loading) {
        return <div>LOADING</div>
    } else {
        return (
            <main className='lobbyContainer'>
                <section className='userCircleContainer'>
                    <span className='lobbyCode'>{roomCode}</span>
                    <section ref={userCircleRef} className='userCircle'>
                        {players.map(player => {
                            return (
                                <div key={player.name}>
                                    <span style={player.color !== null ? {color: player.color} : {color: 'black'}}>
                                        {player.name}
                                    </span>
                                </div>
                            )
                        })}
                    </section>
                </section>
                <Chat />
                {admin ? <LobbyAdminPanel /> : null}
            </main>
        )
    }
}

export default Lobby