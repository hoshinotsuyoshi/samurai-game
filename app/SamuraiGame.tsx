'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sword } from 'lucide-react'

export default function SamuraiGame() {
  const [gameState, setGameState] = useState('waiting') // 'waiting', 'ready', 'action', 'result'
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [winner, setWinner] = useState('')

  const startGame = useCallback(() => {
    setGameState('ready')
    const delay = Math.random() * 3000 + 1000 // Random delay between 1-4 seconds
    setTimeout(() => {
      setGameState('action')
      setStartTime(Date.now())
    }, delay)
  }, [])

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState === 'action') {
      setEndTime(Date.now())
      setGameState('result')
      setWinner('player')
    } else if (gameState === 'ready') {
      setGameState('result')
      setWinner('cpu')
    }
  }, [gameState])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  const resetGame = () => {
    setGameState('waiting')
    setStartTime(0)
    setEndTime(0)
    setWinner('')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-8 text-2xl font-bold">Samurai Reaction Game</div>
      <div className="flex items-center justify-between w-full max-w-2xl px-4">
        <div className="flex flex-col items-center">
          <Sword className="w-20 h-20 text-blue-500" />
          <div className="mt-2 text-lg font-semibold">Player</div>
        </div>
        <div className="flex flex-col items-center">
          <Sword className="w-20 h-20 text-red-500 transform rotate-180" />
          <div className="mt-2 text-lg font-semibold">CPU</div>
        </div>
      </div>
      <div className="mt-8 text-xl">
        {gameState === 'waiting' && (
          <button
            onClick={startGame}
            className="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
          >
            Start Game
          </button>
        )}
        {gameState === 'ready' && <div className="text-yellow-600">Get ready...</div>}
        {gameState === 'action' && <div className="text-red-600 animate-pulse">STRIKE NOW!</div>}
        {gameState === 'result' && (
          <div className="flex flex-col items-center">
            <div className={winner === 'player' ? 'text-green-600' : 'text-red-600'}>
              {winner === 'player' ? 'You win!' : 'Too early! CPU wins!'}
            </div>
            {winner === 'player' && (
              <div className="mt-2">
                Your reaction time: {endTime - startTime} ms
              </div>
            )}
            <button
              onClick={resetGame}
              className="px-4 py-2 mt-4 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-gray-600">
        Press any key when you see "STRIKE NOW!" to win!
      </div>
    </div>
  )
}
