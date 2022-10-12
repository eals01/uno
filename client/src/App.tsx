import { BrowserRouter, Route, Routes } from "react-router-dom"

import Home from './pages/Home/Home'
import CreatePlayer from './pages/CreatePlayer/CreatePlayer'
import Lobby from './pages/Lobby/Lobby'
import GameRoom from './pages/GameRoom/GameRoom'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create-player' element={<CreatePlayer />} />
          <Route path='/lobby' element={<Lobby />} />
          <Route path='/game-room' element={<GameRoom />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
