import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// Regras do jogo
const rules = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

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
          />
        )}
        {screen === 'game' && (
          <GameScreen
            initialObjectCount={objectCount}
            moveSpeed={moveSpeed}
            setMoveSpeed={setMoveSpeed}
            setScreen={setScreen}
            setWinner={setWinner}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen winner={winner} restartGame={restartGame} />
        )}
      </div>
    </div>
  );
}

function StartScreen({ objectCount, setObjectCount, startGame }) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Pedra 🪨 , Papel 📄 e Tesoura ✂️</h1>
      <label className="block mb-2">Quantidade por tipo:</label>
      <input
        type="number"
        value={objectCount}
        onChange={(e) => setObjectCount(Math.max(1, parseInt(e.target.value)))}
        className="p-2 border rounded text-center w-full mb-4"
      />
      <button onClick={startGame} className="bg-blue-600 text-white px-6 py-2 rounded">
        Iniciar Jogo
      </button>
    </div>
  );
}

function GameScreen({ initialObjectCount, moveSpeed, setMoveSpeed, setScreen, setWinner }) {
  const gameAreaRef = useRef(null);
  const [objects, setObjects] = useState([]);
  const [counts, setCounts] = useState({ rock: 0, paper: 0, scissors: 0 });
  const [ready, setReady] = useState(false);
  const animationId = useRef(null);

  const generateObject = useCallback((type, id, width, height) => {
  const size = 30;
  const angle = Math.random() * Math.PI * 2;
  const speed = (Math.random() * 0.5 + 0.3) * moveSpeed; // velocidade entre 0.3 e 0.8 vezes moveSpeed

  return {
    id,
    type,
    x: Math.random() * (width - size),
    y: Math.random() * (height - size),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size,
  };
}, [moveSpeed]);


  useEffect(() => {
  const area = gameAreaRef.current;
  if (!area) return;

  const waitForSizeAndInitialize = () => {
    const { clientWidth, clientHeight } = area;

    // Aguarda até a div estar visível com tamanho significativo
    if (clientWidth < 100 || clientHeight < 100) {
      setTimeout(waitForSizeAndInitialize, 50);
      return;
    }

    const all = [];

    ['rock', 'paper', 'scissors'].forEach(type => {
      for (let i = 0; i < initialObjectCount; i++) {
        all.push(generateObject(type, `${type}-${i}`, clientWidth, clientHeight));
      }
    });

    setObjects(all);
    setCounts({
      rock: initialObjectCount,
      paper: initialObjectCount,
      scissors: initialObjectCount,
    });

    const timeout = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timeout);
  };

  waitForSizeAndInitialize();
}, [generateObject, initialObjectCount]);

  useEffect(() => {
    if (!ready) return;

    const update = () => {
      setObjects(prev => {
        const next = [...prev];
        const updatedCounts = { rock: 0, paper: 0, scissors: 0 };

        for (let i = 0; i < next.length; i++) {
          const obj = next[i];
          obj.x += obj.vx;
          obj.y += obj.vy;

          // Borda
          if (obj.x < 0 || obj.x + obj.size > gameAreaRef.current.clientWidth) obj.vx *= -1;
          if (obj.y < 0 || obj.y + obj.size > gameAreaRef.current.clientHeight) obj.vy *= -1;

          // Colisão
          for (let j = 0; j < next.length; j++) {
            if (i === j) continue;
            const other = next[j];
            const dx = obj.x - other.x;
            const dy = obj.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < obj.size) {
              if (rules[obj.type] === other.type) {
                other.type = obj.type;
              }
            }
          }

          updatedCounts[obj.type]++;
        }

        setCounts(updatedCounts);

        const alive = Object.entries(updatedCounts).filter(([_, v]) => v > 0);
        if (alive.length === 1) {
          setWinner(alive[0][0]);
          setScreen('results');
          cancelAnimationFrame(animationId.current);
        } else {
          animationId.current = requestAnimationFrame(update);
        }

        return next;
      });
    };

    animationId.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId.current);
  }, [ready]);

  return (
   <div
    id="divGame"
    style={{
      position: 'fixed',
      top: '15px',
      left: '15px',
      right: '15px',
      bottom: '15px',
      overflow: 'auto', // opcional, se tiver rolagem
      backgroundColor: '#f8f8f8', // opcional para visualização
      padding: '15px', 
      borderRadius: '12px',// opcional, caso queira espaço interno
    }}
  >
      <div className="mb-4">
        <label>Velocidade: {moveSpeed}</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={moveSpeed}
          onChange={(e) => setMoveSpeed(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="flex justify-around mb-4">
        <div>🪨: {counts.rock}</div>
        <div>📄: {counts.paper}</div>
        <div>✂️: {counts.scissors}</div>
      </div>
      <div ref={gameAreaRef} className="relative w-full h-[500PX] border rounded overflow-hidden bg-gray-100">      
        {objects.map(obj => (
         <div
  key={obj.id}
  className="absolute flex items-center justify-center text-white font-bold text-sm rounded-full"
  style={{
    left: obj.x,
    top: obj.y,
    width: obj.size,
    height: obj.size,
    boxshadow:' rgba(0, 0, 0, 0.24) 0px 3px 8px',
    border: '0.5mm ridge rgb(211 220 50 / 0.6)',
    borderColor: obj.type === 'rock' ? '#666163' :
                     obj.type === 'paper' ? '#d4d489' : '#adeada',
    backgroundColor: obj.type === 'rock' ? '#FFF' :
                      obj.type === 'paper' ? '#FFF' : '#FFF',
  }}
>
  {obj.type === 'rock' && '🪨'}
  {obj.type === 'paper' && '📄'}
  {obj.type === 'scissors' && '✂️'}
</div>
        ))}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 text-xl font-bold">
            Preparando...
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({ winner, restartGame }) {
  const label = {
    rock: 'Pedra 🪨',
    paper: 'Papel 📄',
    scissors: 'Tesoura ✂️',
  };
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Fim de Jogo!</h2>
      <p className="text-xl mb-6">Vencedor: <strong>{label[winner]}</strong></p>
      <button onClick={restartGame} className="bg-blue-600 text-white px-6 py-2 rounded">
        Jogar Novamente
      </button>
    </div>
  );
}
