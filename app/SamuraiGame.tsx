'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Sword } from 'lucide-react'

export default function SamuraiGame() {
  const [gameState, setGameState] = useState('waiting') // 'waiting', 'ready', 'action', 'result'
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [winner, setWinner] = useState('')
  const msPerframe = 16.6666666666

  // useRef to track the latest state
  const gameStateRef = useRef(gameState)
  const winnerRef = useRef(winner)

  // Update refs whenever the state changes
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  useEffect(() => {
    winnerRef.current = winner
  }, [winner])

  const audioContextRef = useRef<AudioContext | null>(null)

  const playBeep = useCallback(() => {
    if (!audioContextRef.current) {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      /* eslint-enable  @typescript-eslint/no-explicit-any */
    }
    const context = audioContextRef.current
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(440, context.currentTime) // 440 Hz - A4 note
    gainNode.gain.setValueAtTime(0.5, context.currentTime)

    oscillator.start()
    oscillator.stop(context.currentTime + 0.2) // Beep for 0.2 seconds
  }, [])

  const startGame = useCallback(() => {
    setGameState('ready')
    const delay = Math.random() * 3000 + 1000 // Random delay between 1-4 seconds
    setTimeout(() => {
      if (winnerRef.current !== 'cpu' && gameStateRef.current === 'ready') {
        setGameState('action')
        setStartTime(Date.now())
        playBeep()
      }
    }, delay)
  }, [playBeep])

  const handleKeyPress = useCallback(() => {
    if (gameState === 'action') {
      setEndTime(Date.now())
      setGameState('result')
      setWinner('player')
    } else if (gameState === 'ready') {
      setGameState('result')
      setWinner('cpu')
    }
  }, [gameState])
  const areaClick = () => {
    if (gameState === 'action') {
      setEndTime(Date.now())
      setGameState('result')
      setWinner('player')
    } else if (gameState === 'ready') {
      setGameState('result')
      setWinner('cpu')
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100" onClick={areaClick}>
      {/* QRコードの画像を追加 */}
      <img
        src="/qr-code.png" // ここにQRコード画像のパスを設定
        alt="QR Code"
        className="w-24 h-24 mb-4" // サイズと余白を調整
      />
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
        {gameState === 'action' && <div className="text-red-600 animate-pulse">❗❗❗</div>}
        {gameState === 'result' && (
          <div className="flex flex-col items-center">
            <div className={winner === 'player' ? 'text-green-600' : 'text-red-600'}>
              {winner === 'player' ? 'You win!' : 'Too early! CPU wins!'}
            </div>
            {winner === 'player' && (
              <div className="mt-2">
                Your reaction time: {Math.round((endTime - startTime) / msPerframe)} frames ( {Math.round(endTime - startTime)} ms )
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
        Press any key or click when you see &quot;❗❗❗&quot; to win!
      </div>
    </div>
  )
}
