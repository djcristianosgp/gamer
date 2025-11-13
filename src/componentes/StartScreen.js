import React, { useState, useEffect, useRef, useCallback } from 'react';
// Regras do jogo
const rules = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

function StartScreen({ objectCount, setObjectCount, startGame, moveSpeed, setMoveSpeed, playerName, setPlayerName }) {
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
      <input
        type="text"
        name="name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Digite seu nome"
        style={{
          padding: '10px',
          fontSize: '16px',
          marginBottom: '10px',
          width: '100%',
          maxWidth: '300px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />
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
      <button onClick={startGame} className="bg-blue-600 text-white px-6 py-2 rounded">
        Iniciar Jogo
      </button>
    </div>
  );
}

export default StartScreen;
