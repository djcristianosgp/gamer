import React, { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';
// Regras do jogo
const rules = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

function ResultsScreen({ winner, restartGame, elapsedTime, playerName }) {
  const label = {
    rock: 'Pedra 🪨',
    paper: 'Papel 📄',
    scissors: 'Tesoura ✂️',
  };

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
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Fim de Jogo!</h2>
      <p className="text-xl mb-6">Vencedor: <strong>{label[winner]}</strong></p>
      <p className="text-lg mb-2">⏱ Duração da partida: <strong>{formatTime(elapsedTime)}</strong></p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <button onClick={restartGame} className="bg-blue-600 text-white px-6 py-2 rounded">
          Jogar Novamente
        </button>
        <button
          onClick={() => compartilharNoWhatsApp(winner, elapsedTime, playerName)}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#25D366',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >📤 Compartilhar no WhatsApp
        </button>
      </div>
    </div>
  );
}

export default ResultsScreen;