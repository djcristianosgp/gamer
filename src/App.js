import React, { useState, useEffect, useRef, useCallback } from 'react';

// Componente principal da aplicação
function App() {
  // Estado para controlar a tela atual: 'start', 'game', 'results'
  const [screen, setScreen] = useState('start');
  // Estado para a quantidade de objetos por tipo no jogo (padrão 50)
  const [objectCount, setObjectCount] = useState(50);
  // Estado para a velocidade dos objetos (padrão 1)
  const [moveSpeed, setMoveSpeed] = useState(1);
  // Estado para armazenar o tipo de objeto vencedor
  const [winner, setWinner] = useState(null);

  // Função para iniciar o jogo, transiciona para a tela 'game'
  const startGame = () => {
    setScreen('game');
  };

  // Função para reiniciar o jogo, transiciona para a tela 'start' e reseta estados
  const restartGame = () => {
    setScreen('start');
    setObjectCount(50); // Reseta para o valor padrão
    setMoveSpeed(1); // Reseta para o valor padrão
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-500 ease-in-out scale-100 opacity-100">
        {screen === 'start' && (
          <StartScreen
            objectCount={objectCount}
            setObjectCount={setObjectCount}
            startGame={startGame}
          />
        )}
        {screen === 'game' && (
          <GameScreen
            initialObjectCount={objectCount} // Agora representa a quantidade por tipo
            moveSpeed={moveSpeed}
            setMoveSpeed={setMoveSpeed}
            setScreen={setScreen}
            setWinner={setWinner}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            winner={winner}
            restartGame={restartGame}
          />
        )}
      </div>
    </div>
  );
}

// Componente da tela inicial
function StartScreen({ objectCount, setObjectCount, startGame }) {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-8 animate-pulse">Pedra, Papel e Tesoura</h1>
      <div className="mb-8">
        <label htmlFor="objectCount" className="block text-gray-700 text-lg font-semibold mb-2">
          Quantidade de Objetos por Tipo:
        </label>
        <input
          type="number"
          id="objectCount"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center text-xl"
          value={objectCount}
          onChange={(e) => setObjectCount(Math.max(1, parseInt(e.target.value) || 0))} // Garante que o valor não seja menor que 1
          min="1"
        />
        <p className="text-sm text-gray-500 mt-2">Padrão: 50 objetos de cada tipo (total de 150)</p>
      </div>
      <button
        onClick={startGame}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        Iniciar Jogo
      </button>
    </div>
  );
}

// Componente da tela do jogo
function GameScreen({ initialObjectCount, moveSpeed, setMoveSpeed, setScreen, setWinner }) {
  // Referência para o elemento canvas do jogo
  const gameAreaRef = useRef(null);
  // Estado para todos os objetos no jogo
  const [objects, setObjects] = useState([]);
  // Estado para os contadores de cada tipo de objeto
  const [counts, setCounts] = useState({ rock: 0, paper: 0, scissors: 0 });
  // Referência para o ID da animação (para cancelar no unmount)
  const animationFrameId = useRef(null);
  // Estado para controlar se os objetos já apareceram (após o delay inicial)
  const [allObjectsAppeared, setAllObjectsAppeared] = useState(false);
  // Contador para o delay de aparecimento dos objetos
  const nextObjectIndexToSpawn = useRef(0);
  // Referência para o timeout de carregamento
  const loadingTimeoutId = useRef(null);

  // Definição das regras do jogo (quem vence quem)
  const rules = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };

  // Função para gerar um objeto aleatório
  const generateRandomObject = useCallback((type, id, width, height) => {
    const size = 30; // Tamanho dos objetos
    // Posição inicial aleatória dentro da área do jogo
    const x = Math.random() * (width - size);
    const y = Math.random() * (height - size);
    // Velocidade inicial aleatória (direção e magnitude)
    const vx = (Math.random() - 0.5) * 2 * moveSpeed;
    const vy = (Math.random() - 0.5) * 2 * moveSpeed;
    return { id, type, x, y, vx, vy, size };
  }, [moveSpeed]);

  // Efeito para inicializar os objetos e o loop do jogo
  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const { clientWidth, clientHeight } = gameArea;
    const initialObjects = [];
    const types = ['rock', 'paper', 'scissors'];

    // Gera os objetos inicialmente: initialObjectCount de CADA tipo
    types.forEach(type => {
      for (let i = 0; i < initialObjectCount; i++) {
        initialObjects.push(generateRandomObject(type, `${type}-${i}`, clientWidth, clientHeight));
      }
    });

    // Embaralha o array de objetos para garantir uma distribuição aleatória na tela
    for (let i = initialObjects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialObjects[i], initialObjects[j]] = [initialObjects[j], initialObjects[i]];
    }
    setObjects(initialObjects);

    // Reseta contadores e flags
    nextObjectIndexToSpawn.current = 0;
    setAllObjectsAppeared(false);

    // Inicia o timeout de 3 segundos para garantir que todos os objetos apareçam
    loadingTimeoutId.current = setTimeout(() => {
      setAllObjectsAppeared(true);
      nextObjectIndexToSpawn.current = initialObjects.length; // Garante que todos os objetos sejam visíveis
    }, 3000); // 3 segundos

    // Função principal do loop do jogo
    const gameLoop = () => {
      setObjects((prevObjects) => {
        const newObjects = prevObjects.map((obj) => ({ ...obj })); // Cria uma cópia para modificação

        // Lógica de aparecimento gradual dos objetos (se ainda não todos apareceram)
        if (!allObjectsAppeared && nextObjectIndexToSpawn.current < newObjects.length) {
          // Incrementa o número de objetos visíveis a cada frame
          nextObjectIndexToSpawn.current = Math.min(newObjects.length, nextObjectIndexToSpawn.current + 1);
        }

        // Atualiza a posição dos objetos e trata colisões com as bordas SOMENTE se o jogo já começou (todos apareceram)
        if (allObjectsAppeared) {
          for (let i = 0; i < newObjects.length; i++) {
            const obj = newObjects[i];

            obj.x += obj.vx * moveSpeed;
            obj.y += obj.vy * moveSpeed;

            // Colisão com as bordas (inverte a velocidade)
            if (obj.x < 0 || obj.x + obj.size > clientWidth) {
              obj.vx *= -1;
              obj.x = Math.max(0, Math.min(obj.x, clientWidth - obj.size)); // Garante que o objeto não saia da tela
            }
            if (obj.y < 0 || obj.y + obj.size > clientHeight) {
              obj.vy *= -1;
              obj.y = Math.max(0, Math.min(obj.y, clientHeight - obj.size));
            }
          }

          // Lógica de colisão entre objetos SOMENTE se o jogo já começou (todos apareceram)
          for (let i = 0; i < newObjects.length; i++) {
            for (let j = i + 1; j < newObjects.length; j++) {
              const obj1 = newObjects[i];
              const obj2 = newObjects[j];

              // Colisão de bounding box
              if (
                obj1.x < obj2.x + obj2.size &&
                obj1.x + obj1.size > obj2.x &&
                obj1.y < obj2.y + obj2.size &&
                obj1.y + obj1.size > obj2.y
              ) {
                // Colisão detectada, aplica as regras do jogo
                if (rules[obj1.type] === obj2.type) {
                  // obj1 vence obj2, obj2 se transforma em obj1
                  obj2.type = obj1.type;
                  // Ajusta ligeiramente a posição para evitar colisão contínua
                  obj2.x += obj1.vx * 0.5;
                  obj2.y += obj1.vy * 0.5;
                } else if (rules[obj2.type] === obj1.type) {
                  // obj2 vence obj1, obj1 se transforma em obj2
                  obj1.type = obj2.type;
                  // Ajusta ligeiramente a posição para evitar colisão contínua
                  obj1.x += obj2.vx * 0.5;
                  obj1.y += obj2.vy * 0.5;
                }
                // Se forem do mesmo tipo, apenas inverte as velocidades para simular um "ricochete"
                else if (obj1.type === obj2.type) {
                  const tempVx1 = obj1.vx;
                  const tempVy1 = obj1.vy;
                  obj1.vx = obj2.vx;
                  obj1.vy = obj2.vy;
                  obj2.vx = tempVx1;
                  obj2.vy = tempVy1;
                }
              }
            }
          }
        }

        return newObjects;
      });

      // Atualiza os contadores de objetos
      const currentCounts = { rock: 0, paper: 0, scissors: 0 };
      objects.forEach(obj => {
        // Conta apenas os objetos que já apareceram
        if (objects.indexOf(obj) < nextObjectIndexToSpawn.current) {
          currentCounts[obj.type]++;
        }
      });
      setCounts(currentCounts);

      // Verifica a condição de fim de jogo SOMENTE se o jogo já começou (todos apareceram)
      if (allObjectsAppeared) {
        const activeTypes = Object.keys(currentCounts).filter(type => currentCounts[type] > 0);
        if (activeTypes.length === 1) { // Isso significa que apenas um tipo permanece
          setWinner(activeTypes[0]);
          setScreen('results');
          cancelAnimationFrame(animationFrameId.current); // Para o loop de animação
          return; // Sai do loop para evitar mais atualizações
        }
      }

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    // Inicia o loop do jogo
    animationFrameId.current = requestAnimationFrame(gameLoop);

    // Limpeza: cancela o loop de animação e o timeout quando o componente é desmontado
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      clearTimeout(loadingTimeoutId.current);
    };
  }, [initialObjectCount, moveSpeed, generateRandomObject, setScreen, setWinner, allObjectsAppeared]); // Dependências do useEffect

  // Renderiza o jogo
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">A Bricadeira Acontece!</h2>

      {/* Contadores de objetos */}
      <div className="flex justify-around mb-4 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="text-center">
          <span role="img" aria-label="rock" className="text-4xl">🪨</span>
          <p className="text-xl font-semibold text-gray-700 mt-1">Pedra: {counts.rock}</p>
        </div>
        <div className="text-center">
          <span role="img" aria-label="paper" className="text-4xl">📄</span>
          <p className="text-xl font-semibold text-gray-700 mt-1">Papel: {counts.paper}</p>
        </div>
        <div className="text-center">
          <span role="img" aria-label="scissors" className="text-4xl">✂️</span>
          <p className="text-xl font-semibold text-gray-700 mt-1">Tesoura: {counts.scissors}</p>
        </div>
      </div>

      {/* Controle de velocidade */}
      <div className="mb-6">
        <label htmlFor="moveSpeed" className="block text-gray-700 text-lg font-semibold mb-2 text-center">
          Velocidade dos Objetos: {moveSpeed.toFixed(1)}x
        </label>
        <input
          type="range"
          id="moveSpeed"
          min="0.1"
          max="5"
          step="0.1"
          value={moveSpeed}
          onChange={(e) => setMoveSpeed(parseFloat(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Área do jogo */}
      <div
        ref={gameAreaRef}
        className="relative border-4 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex-grow w-full aspect-video min-h-[300px]"
      >
        {!allObjectsAppeared && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-bold z-10">
            Carregando objetos...
          </div>
        )}
        {objects.map((obj, index) => (
          // Renderiza o objeto apenas se ele já "apareceu"
          (index < nextObjectIndexToSpawn.current) && (
            <div
              key={obj.id}
              className={`absolute rounded-full flex items-center justify-center transition-opacity duration-500 ${!allObjectsAppeared && index >= nextObjectIndexToSpawn.current ? 'opacity-0' : 'opacity-100'}`}
              style={{
                left: obj.x,
                top: obj.y,
                width: obj.size,
                height: obj.size,
                backgroundColor:
                  obj.type === 'rock' ? '#A0A0A0' :
                  obj.type === 'paper' ? '#E0E0E0' :
                  '#FF6666', // Tesoura
                boxShadow: `0 0 8px ${
                  obj.type === 'rock' ? '#606060' :
                  obj.type === 'paper' ? '#B0B0B0' :
                  '#FF3333'
                }`,
              }}
            >
              <span className="text-xl">
                {obj.type === 'rock' && '🪨'}
                {obj.type === 'paper' && '📄'}
                {obj.type === 'scissors' && '✂️'}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

// Componente da tela de resultados
function ResultsScreen({ winner, restartGame }) {
  // Mapeia o tipo de objeto vencedor para um nome amigável em português
  const winnerName = {
    rock: 'Pedra',
    paper: 'Papel',
    scissors: 'Tesoura',
  }[winner];

  // Mapeia o tipo de objeto vencedor para um emoji correspondente
  const winnerEmoji = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️',
  }[winner];

  return (
    <div className="text-center">
      <h2 className="text-5xl font-extrabold text-gray-800 mb-6">Fim de Jogo!</h2>
      <div className="text-7xl mb-8 animate-bounce">
        {winnerEmoji}
      </div>
      <p className="text-3xl font-semibold text-gray-700 mb-8">
        O vencedor é: <span className="text-blue-600 font-bold">{winnerName}!</span>
      </p>
      <button
        onClick={restartGame}
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        Reiniciar Jogo
      </button>
    </div>
  );
}

export default App;