import { React, useState } from 'react';
import StartScreen from './componentes/StartScreen';
import GameScreen from './componentes/GameScreen';
import ResultsScreen from './componentes/ResultsScreen';
import './App.css';

const versaosystem = {
  ano: '2025',
  mes: '11',
  dia: '13',
  comp: '1856'
}

const COLORS = {
  rock: 'bg-gray-700',
  paper: 'bg-green-500',
  scissors: 'bg-red-500',
};

export default function App() {
  const [screen, setScreen] = useState('start');
  const [objectCount, setObjectCount] = useState(50);
  const [moveSpeed, setMoveSpeed] = useState(0.5);
  const [winner, setWinner] = useState(null);
  const [elapsedTimeFinal, setElapsedTimeFinal] = useState(0);
  const [playerName, setPlayerName] = useState('');

  const startGame = () => setScreen('game');
  const restartGame = () => {
    setObjectCount(objectCount);
    setMoveSpeed(moveSpeed);
    setWinner(null);
    setScreen('start');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
        {screen === 'start' && (
          <StartScreen
            objectCount={objectCount}
            setObjectCount={setObjectCount}
            startGame={startGame}
            setMoveSpeed={setMoveSpeed}
            moveSpeed={moveSpeed}
            playerName={playerName}
            setPlayerName={setPlayerName}
          />
        )}
        {screen === 'game' && (
          <GameScreen
            initialObjectCount={objectCount}
            moveSpeed={moveSpeed}
            setMoveSpeed={setMoveSpeed}
            setScreen={setScreen}
            setWinner={setWinner}
            setElapsedTimeFinal={setElapsedTimeFinal}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen winner={winner} restartGame={restartGame} elapsedTime={elapsedTimeFinal} playerName={playerName} />
        )}
        <div className="text-center text-sm text-gray-500 mt-4">
          Desenvolvido por <strong>Cristiano Grobério</strong> -
          <a href="https://www.instagram.com/djcristianosgp" target="_blank" rel="noopener noreferrer" className="text-blue-500 mx-1">
            Instagram
          </a>
          - {new Date().getFullYear()}
        </div>
        <div className="text-center text-sm text-gray-500 mt-4">
          Versão: <strong>{versaosystem.ano}.{versaosystem.mes}.{versaosystem.dia}.{versaosystem.comp}</strong>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function compartilharNoWhatsApp(winner, time, nome) {
  const mensagem = `🏆 Resultado da partida!

Jogador: ${nome || 'Anônimo'}
Vencedor: ${winner}
Duração: ${formatTime(time)}

Jogue agora: https://gamer-ruddy.vercel.app/`;

  const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}