import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { socket } from '../../socket'
import './GameResult.scss'

const GameResult = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [winner, setWinner] = useState('')

    const handleClick = () => {
        navigate('/')
    }

    useEffect(() => {
        socket.emit('request-game-result')

        socket.on('initiate-game-result', result => {
            setLoading(false)
            setWinner(result)
        })

        return () => {
            socket.off('initiate-game-result')
        }
    }, [null])

    if(loading) {
        return (
            <section className='gameResultContainer'>
                Loading result...
            </section>
        )
    } else {
        return (
            <section className='gameResultContainer'>
                <div className='gameResult'>
                    <h1>🏆</h1>
                    <h2>Winner: {winner}</h2>
                    <button onClick={handleClick}>Return to home</button>
                </div>
            </section>
        )
    }
}

export default GameResult