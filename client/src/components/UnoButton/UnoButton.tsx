import { socket } from '../../socket'
import './UnoButton.scss'

interface UnoButtonProps {
    setunotriggered: Function
}

const UnoButton = (props: UnoButtonProps) => {
    function handleClick() {
        socket.emit('uno')
        props.setunotriggered(false)
    }

    return <section onClick={handleClick} className='UNOButtonContainer'>UNO</section>
}

export default UnoButton