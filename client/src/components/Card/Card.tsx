import { socket } from '../../socket'
import { motion, AnimatePresence } from 'framer-motion'
import './Card.scss'


interface CardProps {
    value: string
    index: number
    playable: boolean
}

const colors = {
    'R': 'rgb(255, 42, 42)',
    'G': 'rgb(127, 200, 42)',
    'B': 'rgb(42, 127, 255)',
    'Y': 'rgb(255, 204, 0)',
    'H': 'rgb(40,40,40)',
    'X': 'rgb(10,10,10)'
}

const Card = (props: CardProps) => {
    function handleClick() {
        if(props.playable) {
            socket.emit('play-card', props.index)
        }
    }

    if(props.value.length == 1) {
        return (
                <motion.div 
                    key={props.index}
                    initial={{ y: -800 }}
                    animate={{ y: 0 }}
                    exit={{ y: -800 }}
                
                    className='card' 
                    style={{background: (colors as any)[props.value[0]]}}
                >
                    <img src={'./assets/logo.svg'} className='center' />
                </motion.div>
        )
    } else if(props.value[1] === 'B') {
        return (
                <motion.div 
                    key={props.index}
                    initial={{ y: -800, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -800, opacity: 0 }}
                    transition={{ duration: .5}}

                    className='card' 
                    style={{background: (colors as any)[props.value[0]]}} onClick = {handleClick}
                >
                    <img src={'./assets/block.svg'} className='top'></img>
                    <img src={'./assets/block.svg'} className='center'></img>
                    <img src={'./assets/block.svg'} className='bottom'></img>
                </motion.div>
        )
    } else if(props.value[1] === 'R') {
        return (
                <motion.div 
                    key={props.index}
                    initial={{ y: -800, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -800, opacity: 0 }}
                    transition={{ duration: .5}}

                    className='card' 
                    style={{background: (colors as any)[props.value[0]]}} onClick = {handleClick}
                >
                    <img src={'./assets/reverse.svg'} className='top'></img>
                    <img src={'./assets/reverse.svg'} className='center'></img>
                    <img src={'./assets/reverse.svg'} className='bottom'></img>
                </motion.div>
        )
    } else if(props.value[1] === 'S') {
        return (
                <motion.div 
                    key={props.index}
                    initial={{ y: -800, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -800, opacity: 0 }}
                    transition={{ duration: .5}}

                    className='card' 
                    style={{background: (colors as any)[props.value[0]]}} onClick = {handleClick}
                >
                    <img src={'./assets/swap.svg'} className='top'></img>
                    <img src={'./assets/swap.svg'} className='center'></img>
                    <div className='centerCircle' />
                    <img src={'./assets/swap.svg'} className='bottom'></img>
                </motion.div>
        )
    } else if(props.value[1] === 'P' && props.value[2] === '2') {
        return (
                <motion.div 
                    key={props.index}
                    initial={{ y: -800, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -800, opacity: 0 }}
                    transition={{ duration: .5}}

                    className='card' 
                    style={{background: (colors as any)[props.value[0]]}} onClick = {handleClick}
                >
                    <span className='topNumber'>+2</span>
                    <img src={'./assets/plus_two.svg'} className='center' />
                    <span className='bottomNumber'>+2</span>
                </motion.div>
        )
    } else if(props.value[1] === 'P' && props.value[2] === '4') {
        return (
                <motion.div 
                    key={props.index}
                    initial={{ y: -800, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -800, opacity: 0 }}
                    transition={{ duration: .5}}

                    className='card' 
                    style={{background: (colors as any)[props.value[0]]}} onClick = {handleClick}
                >
                        <span className='topNumber'>+4</span>
                        <img src={'./assets/plus_four.svg'} className='center' />
                        <div className='centerCircle' />
                        <span className='bottomNumber'>+4</span>
                </motion.div>
        )
    } else {
        return (
                <motion.div 
                    key={props.index}
                    initial={{ y: -800, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -800, opacity: 0 }}
                    transition={{ duration: .5}}

                    className='card' 
                    style={{background: (colors as any)[props.value[0]]}} onClick = {handleClick}
                >
                    <span className='topNumber'>{props.value[1]}</span>
                    <span className='centerNumber'>{props.value[1]}</span>
                    <span className='bottomNumber'>{props.value[1]}</span>
                </motion.div>
        )
    }
}

export default Card