import { socket } from '../../socket'
import './ColorPicker.scss'

interface ColorPickerProps {
    setchoosingcolor: Function
}

const ColorPicker = (props: ColorPickerProps)  => {
    function handleClick(color: string) {
        socket.emit('pick-color', color)
        props.setchoosingcolor(false)
    } 

    return (
        <section className='colorPickerContainer'>
            <section className='colorPicker'>
                <div onClick={() => handleClick('R')} className='color red' />
                <div onClick={() => handleClick('G')} className='color green' />
                <div onClick={() => handleClick('B')} className='color blue' />
                <div onClick={() => handleClick('Y')} className='color yellow' />
            </section>
            <section className='colorPickerBackground' />
        </section>
    )
}

export default ColorPicker