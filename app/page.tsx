'use client';

import { useState, useEffect } from 'react';
import { questionsWeb3 } from './questionsWeb3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// ⚠️ À MODIFIER : Remplace par l'adresse de ton portefeuille
const TREASURY_ADDRESS = "0x18799902c24dEe7F499205f9e647C69e97EB193B"; 
const TICKET_PRICE_HEX = "0x9184E72A000"; 

export default function Home() {
  const [gameState, setGameState] = useState('welcome');
  const [networkTheme, setNetworkTheme] = useState('Web3');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Nouveaux états pour gérer le quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    checkNetwork();
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', checkNetwork);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
    } else {
      setWalletAddress(null);
    }
  };

  const checkNetwork = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId === '0x2105') { 
          setNetworkTheme('Base');
        } else if (chainId === '0xREMPLACER_PAR_HEX') { 
          setNetworkTheme('Arc');
        } else {
          setNetworkTheme('Web3');
        }
      } catch (error) {
        console.error("Erreur réseau", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        checkNetwork();
      } catch (error) {
        console.error("Erreur de connexion", error);
      }
    } else {
      alert("Veuillez installer MetaMask ou un portefeuille Web3 !");
    }
  };

  const payTicketAndStart = async () => {
    if (!walletAddress) return;
    try {
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: walletAddress, to: TREASURY_ADDRESS, value: TICKET_PRICE_HEX }],
      });
      setGameState('playing'); 
    } catch (error) {
      console.error("Paiement refusé :", error);
    }
  };

  // Fonction pour gérer la réponse choisie par le joueur
  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questionsWeb3[currentQuestionIndex].answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    // Attendre 2 secondes pour lire l'explication avant de passer à la suite
    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestionIndex + 1 < questionsWeb3.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 2500);
  };

  const resetGame = () => {
    setGameState('welcome');
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      
      {gameState === 'welcome' && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ color: '#e5b80b', fontSize: '3rem', textShadow: '2px 2px 5px #000', margin: '0 0 10px 0' }}>
            WHO WANTS TO BE A
          </h1>
          <h2 style={{ color: '#00d4ff', fontSize: '2.5rem', marginBottom: '10px', letterSpacing: '2px', textShadow: '2px 2px 5px #000' }}>
            CRYPTO MILLIONAIRE?
          </h2>
          <h3 style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px', letterSpacing: '3px', fontWeight: 'bold' }}>
            {networkTheme.toUpperCase()} EDITION
          </h3>

          {!walletAddress ? (
            <button onClick={connectWallet} style={{ padding: '15px 30px', fontSize: '1.2rem', backgroundColor: '#e5b80b', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Connecter le portefeuille
            </button>
          ) : (
            <div>
              <p style={{ marginBottom: '20px', color: '#22c55e', fontWeight: 'bold' }}>
                🟢 Connecté : {walletAddress.substring(0,6)}...{walletAddress.substring(38)}
              </p>
              <button onClick={payTicketAndStart} style={{ padding: '15px 30px', fontSize: '1.2rem', backgroundColor: '#00d4ff', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Payer le ticket & Jouer
              </button>
            </div>
          )}
        </div>
      )}

      {gameState === 'playing' && (
         <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%' }}>
            <h2 style={{ fontSize: '2rem', color: '#e5b80b', marginBottom: '5px' }}>Questions Web3</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Question {currentQuestionIndex + 1} sur {questionsWeb3.length}</p>
            
            {!showResult ? (
              <div style={{ padding: '2rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
                 <h3 style={{ fontSize: '1.4rem', marginBottom: '30px', lineHeight: '1.4' }}>
                   {questionsWeb3[currentQuestionIndex].question}
                 </h3>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                   {questionsWeb3[currentQuestionIndex].options.map((option, index) => {
                      let bgColor = '#334155';
                      // Logique de couleur si une réponse est cliquée
                      if (selectedAnswer) {
                         if (option === questionsWeb3[currentQuestionIndex].answer) bgColor = '#22c55e'; // Vert si c'est la bonne
                         else if (option === selectedAnswer) bgColor = '#ef4444'; // Rouge si c'est la mauvaise choisie
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => !selectedAnswer && handleAnswer(option)}
                          style={{ padding: '15px', backgroundColor: bgColor, color: 'white', border: 'none', borderRadius: '8px', cursor: selectedAnswer ? 'default' : 'pointer', fontSize: '1.1rem', transition: 'background-color 0.3s' }}
                        >
                          {option}
                        </button>
                      )
                   })}
                 </div>

                 {/* Affichage de l'explication après avoir cliqué */}
                 {selectedAnswer && (
                    <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#0f172a', borderRadius: '8px', borderLeft: '4px solid #00d4ff' }}>
                       <p style={{ color: '#e2e8f0', margin: 0, fontStyle: 'italic' }}>
                          {questionsWeb3[currentQuestionIndex].explanation}
                       </p>
                    </div>
                 )}
              </div>
            ) : (
              <div style={{ padding: '3rem 2rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
                 <h3 style={{ fontSize: '2.5rem', color: '#e5b80b', marginBottom: '10px' }}>Terminé !</h3>
                 <p style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '30px' }}>
                   Votre score : <strong style={{ color: '#00d4ff' }}>{score}</strong> / {questionsWeb3.length}
                 </p>
                 <button onClick={resetGame} style={{ padding: '15px 30px', backgroundColor: '#e5b80b', color: '#000', fontWeight: 'bold', fontSize: '1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                    Rejouer une partie
                 </button>
              </div>
            )}
         </div>
      )}
    </main>
  );
}
