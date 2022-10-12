import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

type Room = {
  code: string
  adminID: string
  players: Array<Player>
  chat: Array<ChatMessage>
  availableColors: Array<string>
  started: boolean
  reverseDirection: boolean
  waitingForUno: boolean
  awaitingUnoFrom: number | null
  turn: number
  drawStack: Array<string>
  playStack: Array<string>
  winner: string
}

type Player = {
  id: string
  name: string
  image: string | null
  color: string | null
  hand: Array<string>
}

type ChatMessage = {
  name: string
  message: string
  color: string | null
}

let ROOMS: Array<Room> = []

function createLobbyCode() {
  const alphabet = 'ACDEFGHJKLMNPQRSTUVWXYZ2345679'
  let result = ''
  // appends 3 random characters to result
  for (let i = 0; i < 3; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  // repeats if code already exists
  if (
    !(
      ROOMS.find(room => {
        return room.code === result
      }) === undefined
    )
  ) {
    createLobbyCode()
  }
  return result
}

io.on('connection', socket => {
  console.log(socket.id.substring(0, 3) + ' connected')
  io.to(socket.id).emit('return-to-home')

  // initiates player
  let player: Player = {
    id: socket.id,
    name: '',
    image: null,
    color: null,
    hand: []
  }

  let joinedRoom: Room | undefined = undefined

  socket.on('create-room', () => {
    // initiates room
    let room: Room = {
      code: createLobbyCode(),
      adminID: socket.id,
      players: [],
      chat: [],
      availableColors: [
        '#ff355e',
        '#ff9966',
        '#ffcc33',
        '#ccff00',
        '#aaf0d1',
        '#50bfe6',
        '#ff6eff'
      ],
      started: false,
      turn: 0,
      reverseDirection: false,
      waitingForUno: false,
      awaitingUnoFrom: null,
      drawStack: [],
      playStack: [],
      winner: ''
    }
    ROOMS.push(room)

    // add admin player to room and create player page
    socket.join(room.code)

    player.color = room.availableColors.splice(
      Math.floor(Math.random() * room.availableColors.length),
      1
    )[0]
    joinedRoom = room
    room.players.push(player)
    io.to(socket.id).emit('admit-player')

    console.log(socket.id.substring(0, 3) + ' made room ' + room.code)
  })

  // join room logic
  socket.on('join-room', code => {
    joinedRoom = ROOMS.find(room => {
      return room.code === code
    })
    if (joinedRoom != undefined) {
      //add player to socket.io room and room state
      socket.join(code)

      player.color = joinedRoom.availableColors.splice(
        Math.floor(Math.random() * joinedRoom.availableColors.length),
        1
      )[0]
      joinedRoom.players.push(player)
      io.to(socket.id).emit('admit-player')

      console.log(socket.id.substring(0, 3) + ' joined room ' + joinedRoom.code)
    }
  })

  // initiate create player page upon request
  socket.on('request-create-player-page', () => {
    if (joinedRoom === undefined) {
      io.to(socket.id).emit('return-to-home')
    } else {
      io.to(socket.id).emit('initiate-create-player-page', {
        color: player.color,
        roomCode: joinedRoom.code
      })
    }
  })

  socket.on('create-player', name => {
    if (name !== '') {
      player.name = name
      io.to(socket.id).emit('admit-player')
      if (joinedRoom !== undefined) {
        io.to(joinedRoom.code).emit('update-players', joinedRoom.players)
      }
    }
  })

  // initiate lobby page upon request
  socket.on('request-lobby-page', () => {
    if (joinedRoom === undefined || player.name === '') {
      io.to(socket.id).emit('return-to-home')
    } else {
      // add "user joined!" message to chat
      joinedRoom.chat.push({
        name: player.name + ' joined!',
        message: '',
        color: '#d3d3d3'
      })
      io.to(socket.id).emit('initiate-lobby-page', {
        players: joinedRoom.players,
        chat: joinedRoom.chat,
        roomCode: joinedRoom.code,
        admin: socket.id === joinedRoom.adminID ? true : false
      })
    }
  })

  socket.on('request-chat', () => {
    if (joinedRoom !== undefined) {
      io.to(joinedRoom.code).emit('update-chat', joinedRoom.chat)
    }
  })

  socket.on('send-chat', chatMessage => {
    if (joinedRoom !== undefined) {
      joinedRoom.chat.push({
        name: player.name,
        message: chatMessage,
        color: player.color
      })
      io.to(joinedRoom.code).emit('update-chat', joinedRoom.chat)
    }
  })

  socket.on('start-game', () => {
    if (joinedRoom !== undefined) {
      io.to(joinedRoom.code).emit('admit-access')
      // initiate game relevant room state
      joinedRoom.started = true
      joinedRoom.drawStack = [
        'R0',
        'R1',
        'R1',
        'R2',
        'R2',
        'R3',
        'R3',
        'R4',
        'R4',
        'R5',
        'R5',
        'R6',
        'R6',
        'R7',
        'R7',
        'R8',
        'R8',
        'R9',
        'R9',
        'RB',
        'RB',
        'RR',
        'RR',
        'RP2',
        'RP2',
        'Y0',
        'Y1',
        'Y1',
        'Y2',
        'Y2',
        'Y3',
        'Y3',
        'Y4',
        'Y4',
        'Y5',
        'Y5',
        'Y6',
        'Y6',
        'Y7',
        'Y7',
        'Y8',
        'Y8',
        'Y9',
        'Y9',
        'YB',
        'YB',
        'YR',
        'YR',
        'YP2',
        'YP2',
        'G0',
        'G1',
        'G1',
        'G2',
        'G2',
        'G3',
        'G3',
        'G4',
        'G4',
        'G5',
        'G5',
        'G6',
        'G6',
        'G7',
        'G7',
        'G8',
        'G8',
        'G9',
        'G9',
        'GB',
        'GB',
        'GR',
        'GR',
        'GP2',
        'GP2',
        'B0',
        'B1',
        'B1',
        'B2',
        'B2',
        'B3',
        'B3',
        'B4',
        'B4',
        'B5',
        'B5',
        'B6',
        'B6',
        'B7',
        'B7',
        'B8',
        'B8',
        'B9',
        'B9',
        'BB',
        'BB',
        'BR',
        'BR',
        'BP2',
        'BP2',
        'XS',
        'XS',
        'XS',
        'XS',
        'XP4',
        'XP4',
        'XP4',
        'XP4'
      ]
      joinedRoom.drawStack = shuffle(joinedRoom.drawStack)
      joinedRoom.playStack.push(drawCard(joinedRoom, true))

      // deal 8 cards to each player
      for (let i in joinedRoom.players) {
        for (let j = 0; j < 8; j++) {
          joinedRoom.players[i].hand.push(drawCard(joinedRoom))
        }
      }
      assessPlayerEligble(joinedRoom)
    }
  })

  socket.on('request-game-room-page', () => {
    if (joinedRoom === undefined || !joinedRoom.started) {
      io.to(socket.id).emit('return-to-home')
    } else {
      io.to(socket.id).emit('initiate-game-room-page')
      updateGame(joinedRoom)
    }
  })

  socket.on('play-card', cardIndex => {
    // if card is eligble to play, add to play stack
    // if card is special, handle special logic
    if (
      joinedRoom !== undefined &&
      cardEligble(joinedRoom.playStack[joinedRoom.playStack.length - 1], player.hand[cardIndex])
    ) {
      // if previous player didn't press UNO in time, go back to previous player and draw 2 cards
      if (joinedRoom.waitingForUno) {
        joinedRoom.waitingForUno = false

        const correctTurn = joinedRoom.turn
        joinedRoom.turn = joinedRoom.awaitingUnoFrom || 0

        joinedRoom.players[joinedRoom.turn].hand.push(drawCard(joinedRoom))
        joinedRoom.players[joinedRoom.turn].hand.push(drawCard(joinedRoom))
        io.to(joinedRoom.players[joinedRoom.turn].id).emit('cancel-uno')

        joinedRoom.turn = correctTurn
      }

      // win logic
      if (player.hand.length === 1) {
        joinedRoom.winner = player.name
        io.to(joinedRoom.code).emit('initiate-win')
      }

      if (player.hand[cardIndex][0] === 'X') {
        joinedRoom.playStack.push(player.hand.splice(cardIndex, 1)[0])
        io.to(socket.id).emit('request-color')
      } else if (player.hand[cardIndex][1] === 'B') {
        joinedRoom.playStack.push(player.hand.splice(cardIndex, 1)[0])
        nextPlayer(joinedRoom)
        nextPlayer(joinedRoom)
        assessPlayerEligble(joinedRoom)
        updateGame(joinedRoom)
      } else if (player.hand[cardIndex][1] === 'R') {
        joinedRoom.playStack.push(player.hand.splice(cardIndex, 1)[0])
        joinedRoom.reverseDirection = !joinedRoom.reverseDirection
        nextPlayer(joinedRoom)
        assessPlayerEligble(joinedRoom)
        updateGame(joinedRoom)
      } else if (player.hand[cardIndex][1] === 'P') {
        joinedRoom.playStack.push(player.hand.splice(cardIndex, 1)[0])
        nextPlayer(joinedRoom)
        joinedRoom.players[joinedRoom.turn].hand.push(drawCard(joinedRoom))
        joinedRoom.players[joinedRoom.turn].hand.push(drawCard(joinedRoom))
        nextPlayer(joinedRoom)
        assessPlayerEligble(joinedRoom)
        updateGame(joinedRoom)
      } else {
        joinedRoom.playStack.push(player.hand.splice(cardIndex, 1)[0])
        nextPlayer(joinedRoom)
        assessPlayerEligble(joinedRoom)
        updateGame(joinedRoom)
      }

      // 1 card left (uno) logic
      if (player.hand.length === 1) {
        joinedRoom.waitingForUno = true
        joinedRoom.awaitingUnoFrom = joinedRoom.players.indexOf(player)
        io.to(socket.id).emit('request-uno')
      }
    }
  })

  socket.on('pick-color', color => {
    if (joinedRoom !== undefined) {
      let newCard = color + joinedRoom.playStack[joinedRoom.playStack.length - 1].substring(1)
      joinedRoom.playStack[joinedRoom.playStack.length - 1] = newCard
      // check whether special card was normal swap or +4 swap, handle accordingly
      if (newCard.substring(1) === 'S') {
        nextPlayer(joinedRoom)
        assessPlayerEligble(joinedRoom)
        updateGame(joinedRoom)
      } else {
        nextPlayer(joinedRoom)
        joinedRoom.players[joinedRoom.turn].hand.push(drawCard(joinedRoom))
        joinedRoom.players[joinedRoom.turn].hand.push(drawCard(joinedRoom))
        joinedRoom.players[joinedRoom.turn].hand.push(drawCard(joinedRoom))
        joinedRoom.players[joinedRoom.turn].hand.push(drawCard(joinedRoom))
        nextPlayer(joinedRoom)
        assessPlayerEligble(joinedRoom)
        updateGame(joinedRoom)
      }
    }
  })

  socket.on('uno', () => {
    if (joinedRoom !== undefined) {
      joinedRoom.waitingForUno = false
      joinedRoom.awaitingUnoFrom = null
    }
  })

  socket.on('request-game-result', () => {
    if (joinedRoom !== undefined) {
      io.to(socket.id).emit('initiate-game-result', joinedRoom.winner)
    }
  })

  socket.on('disconnect', () => {
    // if player has joined a room, remove them
    if (joinedRoom !== undefined) {
      const index = joinedRoom.players.indexOf(player)
      socket.leave(joinedRoom.code)
      joinedRoom.players.splice(index, 1)

      // if player that left was admin, pass on admin to next player
      if (joinedRoom.adminID === socket.id && joinedRoom.players.length < 1) {
        joinedRoom.adminID = joinedRoom.players[0].id
      }

      io.to(joinedRoom.code).emit('update-players', joinedRoom.players)

      if (joinedRoom.started) {
        // if player with active hand left
        if (joinedRoom.turn === index) {
          nextPlayer(joinedRoom)
          assessPlayerEligble(joinedRoom)
        }
        updateGame(joinedRoom)
      }

      // add "user left..." message to chat
      joinedRoom.chat.push({
        name: player.name + ' left...',
        message: '',
        color: '#d3d3d3'
      })
      io.to(joinedRoom.code).emit('update-chat', joinedRoom.chat)
    }
    console.log(socket.id.substring(0, 3) + ' disconnected')
  })
})

function shuffle(stack: Array<String>) {
  let shuffledStack = stack.sort(() => Math.random() - 0.5) as Array<string>
  for (let i in shuffledStack) {
    if (shuffledStack[i].length === 3 && shuffledStack[i][2] === '4') {
      shuffledStack[i] = 'XP4'
    }
    if (shuffledStack[i][1] === 'S') {
      shuffledStack[i] = 'XS'
    }
  }
  return shuffledStack
}

// draws a card from draw stack to current player's hand
// basic = true returns no special cards (for initial play stack card)
function drawCard(joinedRoom: Room, basic: boolean = false) {
  if (joinedRoom.drawStack.length === 0) {
    joinedRoom.drawStack = shuffle(joinedRoom.playStack)
    joinedRoom.playStack = []
    joinedRoom.playStack.push(drawCard(joinedRoom))
  }

  let index = Math.floor(Math.random() * joinedRoom.drawStack.length)
  if (basic) {
    if (
      joinedRoom.drawStack[index][0] === 'X' ||
      ['B', 'R', 'P'].includes(joinedRoom.drawStack[index][1])
    ) {
      const card = drawCard(joinedRoom, true) as string
      return card
    }
  }
  return joinedRoom.drawStack.splice(index, 1)[0]
}

// checks which direction game is going and proceeds to next player from current player accordingly
function nextPlayer(joinedRoom: Room) {
  if (joinedRoom.reverseDirection) {
    joinedRoom.turn <= 0 ? (joinedRoom.turn = joinedRoom.players.length - 1) : joinedRoom.turn--
  } else {
    joinedRoom.turn >= joinedRoom.players.length - 1 ? (joinedRoom.turn = 0) : joinedRoom.turn++
  }
}

// returns whether card can be played on playStackCard
function cardEligble(playStackCard: string, card: string) {
  if (
    card[0] === 'X' ||
    card[0] === playStackCard[0] ||
    (card[1] === playStackCard[1] && card[2] === playStackCard[2])
  ) {
    return true
  } else {
    return false
  }
}

// returns whether active player can play
function playerEligble(joinedRoom: Room) {
  if (joinedRoom.players[joinedRoom.turn] !== undefined) {
    for (let i in joinedRoom.players[joinedRoom.turn].hand) {
      if (
        cardEligble(
          joinedRoom.playStack[joinedRoom.playStack.length - 1],
          joinedRoom.players[joinedRoom.turn].hand[i]
        )
      ) {
        return true
      }
    }
    return false
  }
}

// checks whether active player can play and draws a maximum of 3 cards if not
function assessPlayerEligble(joinedRoom: Room) {
  if (!playerEligble(joinedRoom) && joinedRoom.players[joinedRoom.turn] !== undefined) {
    let i = 0
    while (i < 3) {
      let card = drawCard(joinedRoom)
      joinedRoom.players[joinedRoom.turn].hand.push(card)
      if (cardEligble(joinedRoom.playStack[joinedRoom.playStack.length - 1], card)) {
        return
      }
      i += 1
    }
    nextPlayer(joinedRoom)
    assessPlayerEligble(joinedRoom)
  }
}

// maps the game state to a maximum of 4 individual states and updates players individually
function updateGame(joinedRoom: Room) {
  if (io.sockets.adapter.rooms.get(joinedRoom.code)) {
    let sockets = Array.from(io.sockets.adapter.rooms.get(joinedRoom.code)!.values())
    for (let i in joinedRoom.players) {
      let players = [...joinedRoom.players]
      let turn = joinedRoom.turn
      // moves player's hand to first index
      while (players[0].id !== sockets[i]) {
        players.unshift(players.pop() as Player)
        turn === players.length - 1 ? (turn = 0) : turn++
      }

      let hands = players.map(player => {
        return player.hand.slice()
      })

      // hides opponent hand values from player
      for (let i = 1; i < hands.length; i++) {
        for (let j in hands[i]) {
          hands[i][j] = 'H'
        }
      }

      // populate hands array with empty hands for missing players
      for (let i = 0; i < 4; i++) {
        if (hands[i] === undefined) {
          hands.push([])
        }
      }

      io.to(sockets[i]).emit('update-game', {
        drawStack: joinedRoom.drawStack.length,
        playStack: joinedRoom.playStack,
        hands: hands,
        turn: turn,
        reverse: joinedRoom.reverseDirection,
        players: players
      })
    }
  }
}

httpServer.listen(4000)
console.log('listening on port 4000')
