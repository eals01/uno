import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {  AnimatePresence } from 'framer-motion'
import './GameRoom.scss'
import Card from '../../components/Card/Card'
import ColorPicker from '../../components/ColorPicker/ColorPicker'
import UnoButton from '../../components/UnoButton/UnoButton'
import GameResult from '../../components/GameResult/GameResult'
import Chat from '../../components/Chat/Chat'
import { socket } from '../../socket'

type Player = {
    id: string
    name: string
    image: string | null 
    color: string | null
    hand: Array<string>
}

const GameRoom = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [choosingColor, setChoosingColor] = useState(false)
    const [unoTriggered, setUnoTriggered] = useState(false)
    const [turn, setTurn] = useState(0)
    const [reverse, setReverse] = useState(false)
    const [players, setPlayers] = useState<Player[]>([])
    const [hand, setHand] = useState([])
    const [opponentHands, setOpponentHands] = useState([[], [], [], []])
    const [drawStack, setDrawStack] = useState<Array<string>>([])
    const [playStack, setPlayStack] = useState([])
    const [gameOver, setGameOver] = useState(false)
 
    // initiate page
    useEffect(() => {
        socket.emit('request-game-room-page')

        socket.on('return-to-home', () => {
            navigate('/')
        })

        socket.on('initiate-game-room-page', pageContent => {
            setLoading(false)
        })

        socket.on('request-color', () => {
            setChoosingColor(true)
        })

        socket.on('request-uno', () => {
            setUnoTriggered(true)
        })

        socket.on('cancel-uno', () => {
            setUnoTriggered(false)
        })

        socket.on('update-game', gameState => {
            let newDrawStack = []
            for(let i = 0; i < gameState.drawStack; i++) {newDrawStack.push('E')}
            
            setPlayers(gameState.players)
            setTurn(gameState.turn)
            setReverse(gameState.reverse)
            setDrawStack(newDrawStack)
            setPlayStack(gameState.playStack)
            setHand(gameState.hands[0])
            setOpponentHands(gameState.hands.slice(1))
        })

        socket.on('initiate-win', () => {
            setGameOver(true)
        })

        // cleanup listeners on dismount
        return () => {
            socket.off('return-to-home')
            socket.off('initiate-game-room-page')
            socket.off('update-players')
            socket.off('admit-access')
            socket.off('request-color')
            socket.off('request-uno')
            socket.off('cancel-uno')
            socket.off('update-game')
            socket.off('initiate-win')
        }
    }, [null])

    // position cards in draw stack
    const drawStackRef = useRef<HTMLDivElement|null>(null)
    useEffect(() => {
        const drawStackArray = Array.from(drawStackRef.current ? drawStackRef.current.children : [])
        let difference = 0
        for(let i in drawStackArray) {
            let card = drawStackArray[i] as HTMLDivElement
            card.style.bottom = difference + 'px'
            card.style.transform = 'rotateZ(-45deg)'
            difference += 1
        }
    }, [drawStack])

    // position cards in play stack
    const playStackRef = useRef<HTMLDivElement|null>(null)
    useEffect(() => {
        const playStackArray = Array.from(playStackRef.current ? playStackRef.current.children : [])
        let difference = 0
        for(let i in playStackArray) {
            let card = playStackArray[i] as HTMLDivElement
            card.style.bottom = difference + 'px'
            card.style.transform = `rotateZ(${Math.floor(Math.random() * 30)}deg)`
            difference += 1.2
        }
    }, [playStack])

    // position cards in player hand
    const playerHandRef = useRef<HTMLDivElement|null>(null)
    useEffect(() => {
        if(playerHandRef.current !== null) {
            const playerHandArray = Array.from(playerHandRef.current ? playerHandRef.current.children : [])
            let difference = 0
            let span = 8
            let degreeDifference = span / 2 * -1
            let degreeDifferenceValue = span / playerHandArray.length
            for(let i in playerHandArray) {
                let card = playerHandArray[i] as HTMLDivElement
                card.style.transform = `translateY(${Math.pow(- degreeDifference, 2) / 2}px) rotateZ(${degreeDifference}deg)`
                card.style.left = difference + 'px'
                difference += 60
                degreeDifference += degreeDifferenceValue
            }
            playerHandRef.current.style.width = 125 + 60 * (playerHandArray.length - 1) + 'px'
        }
    }, [hand])

    // position cards in opponent hands
    const leftOpponentHandRef = useRef<HTMLDivElement|null>(null)
    const middleOpponentHandRef = useRef<HTMLDivElement|null>(null)
    const rightOpponentHandRef = useRef<HTMLDivElement|null>(null)
    useEffect(() => {
        if(leftOpponentHandRef.current !== null) {
            const leftOpponentHandArray = Array.from(leftOpponentHandRef.current ? leftOpponentHandRef.current.children : [])
            let step = 250 / leftOpponentHandArray.length 
            if(step > 80) {step = 80}
            let difference = 0
            let span = -8
            let degreeDifference = span / 2 * -1
            let degreeDifferenceValue = span / leftOpponentHandArray.length
            for(let i in leftOpponentHandArray) {
                let card = leftOpponentHandArray[i] as HTMLDivElement
                card.style.transform = `translateY(${-Math.pow(degreeDifference, 2) / 2}px)`
                card.style.left = difference + 'px'
                difference += step
                degreeDifference += degreeDifferenceValue
            }
            leftOpponentHandRef.current.style.width = 125 + step * (leftOpponentHandArray.length - 1) + 'px'
        }

        if(middleOpponentHandRef.current !== null) {
            const middleOpponentHandArray = Array.from(middleOpponentHandRef.current ? middleOpponentHandRef.current.children : [])
            let step = 250 / middleOpponentHandArray.length 
            if(step > 80) {step = 80}
            let difference = 0
            let span = -8
            let degreeDifference = span / 2 * -1
            let degreeDifferenceValue = span / middleOpponentHandArray.length
            for(let i in middleOpponentHandArray) {
                let card = middleOpponentHandArray[i] as HTMLDivElement
                card.style.transform = `translateY(${-Math.pow(degreeDifference, 2) / 2}px)`
                card.style.left = difference + 'px'
                difference += step
                degreeDifference += degreeDifferenceValue
            }
            middleOpponentHandRef.current.style.width = 125 + step * (middleOpponentHandArray.length - 1) + 'px'
        }

        if(rightOpponentHandRef.current !== null) {
            const rightOpponentHandArray = Array.from(rightOpponentHandRef.current ? rightOpponentHandRef.current.children : [])
            let step = 250 / rightOpponentHandArray.length 
            if(step > 80) {step = 80}
            let difference = 0
            let span = -8
            let degreeDifference = span / 2 * -1
            let degreeDifferenceValue = span / rightOpponentHandArray.length
            for(let i in rightOpponentHandArray) {
                let card = rightOpponentHandArray[i] as HTMLDivElement
                card.style.transform = `translateY(${-Math.pow(degreeDifference, 2) / 2}px)`
                card.style.left = difference + 'px'
                difference += step
                degreeDifference += degreeDifferenceValue
            }
            rightOpponentHandRef.current.style.width = 125 + step * (rightOpponentHandArray.length - 1) + 'px'
        }
    }, [opponentHands])

    if(loading) {
        return (
            <div>LOADING...</div>
        ) 
    } else {
        return (
            <AnimatePresence>
                <main className='tableContainer'>
                    <section className='table'>
                        <section className='tableUI' />
                        <img className={reverse ? 'rotatingArrowsReverse' : 'rotatingArrows'} src='./assets/rotating_arrows.svg' />

                        <section ref={drawStackRef} className='stack drawStack'>
                            {drawStack.map((card, index) => {
                                return <Card key={index + 'D'} index={index} value='H' playable={false} />
                            })}
                        </section>
                        <section ref={playStackRef} className='stack playStack'>
                            {playStack.map((value, index) => {return <Card key={index + 'P'} index={index} value={value} playable={false} />})}
                        </section>

                        {players[0] !== undefined ? <div className='playerName' style={{color: players[0].color as string}}><span>{players[0].name}</span></div> : null}
                        <section ref={playerHandRef} className={'playerHand ' + (turn === 0 ? 'active' : 'inactive')}>
                            {hand.map((value, index) => {return <Card key={index + 'H'} index={index} value={value} playable={turn === 0 ? true : false} />})}
                        </section>

                        {players[1] !== undefined ? <div className='leftOpponentName' style={{color: players[1].color as string}}><span>{players[1].name}</span></div> : null}
                        <section ref={leftOpponentHandRef} className={'opponentHand leftOpponentHand ' + (turn === 1 ? 'active' : 'inactive')}>
                            {opponentHands[0].map((value, index) => {return <Card key={index + 'LH'} index={index} value={value} playable={false} />})}
                        </section>

                        {players[2] !== undefined ? <div className='middleOpponentName' style={{color: players[2].color as string}}><span>{players[2].name}</span></div> : null}
                        <section ref={middleOpponentHandRef} className={'opponentHand middleOpponentHand ' + (turn === 2 ? 'active' : 'inactive')}>
                            {opponentHands[1].map((value, index) => {return <Card key={index + 'MH'} index={index} value={value} playable={false} />})}
                        </section>

                        {players[3] !== undefined ? <div className='rightOpponentName' style={{color: players[3].color as string}}><span>{players[3].name}</span></div> : null}
                        <section ref={rightOpponentHandRef} className={'opponentHand rightOpponentHand ' + (turn === 3 ? 'active' : 'inactive')}>
                            {opponentHands[2].map((value, index) => {return <Card key={index + 'RH'} index={index} value={value} playable={false} />})}
                        </section>

                        {choosingColor ? <ColorPicker setchoosingcolor={setChoosingColor}/> : null}
                        {unoTriggered && !choosingColor ? <UnoButton setunotriggered={setUnoTriggered}/> : null} 
                        {gameOver ? <GameResult /> : null}
                    </section>
                    <Chat />
                </main>
            </AnimatePresence>
        )
    }
}

export default GameRoom