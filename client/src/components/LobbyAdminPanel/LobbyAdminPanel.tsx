import { socket } from '../../socket'
import './LobbyAdminPanel.scss'

const LobbyAdminPanel = () => {
    const handleClick = () => {
        socket.emit('start-game')
    }

    return (
        <section className='lobbyAdminPanelContainer'>
            <button onClick={handleClick}>Start game</button>
        </section>
    )
}

export default LobbyAdminPanel