'use client';

import { useState, useEffect, useRef } from 'react';
import { questionsWeb3 } from './questionsWeb3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// ⚠️ À MODIFIER : Ton adresse de réception
const TREASURY_ADDRESS = "0x18799902c24dEe7F499205f9e647C69e97EB193B"; 
// Prix du ticket : 0.00001 ETH
const TICKET_PRICE_HEX = "0x9184E72A000"; 

const MONEY_TREE = [
  "200 USDT", "300 USDT", "500 USDT", "1 000 USDT",
  "1 500 USDT", "2 000 USDT", "4 000 USDT", "8 000 USDT", "12 000 USDT", "24 000 USDT", "48 000 USDT", "72 000 USDT",
  "150 000 USDT", "300 000 USDT", "1 000 000 USDT"
];

export default function Home() {
  const [gameState, setGameState] = useState<'welcome' | 'playing'>('welcome');
  const [networkTheme, setNetworkTheme] = useState('Web3');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // États du jeu
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [jokerMessage, setJokerMessage] = useState<string | null>(null);
  const [jokers, setJokers] = useState({ fiftyFifty: true, phone: true, audience: true });
  
  // Audio
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const bgAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgAudio.current = new Audio('/sounds/background.mp3');
    bgAudio.current.loop = true;
    bgAudio.current.volume = 0.4;

    checkNetwork();
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', checkNetwork);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) setWalletAddress(accounts[0]);
    else setWalletAddress(null);
  };

  const checkNetwork = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId === '0x2105') setNetworkTheme('Base');
        else if (chainId === '0xREMPLACER_PAR_HEX') setNetworkTheme('Arc');
        else setNetworkTheme('Web3');
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
      alert("Veuillez installer MetaMask ou Rabby !");
    }
  };

  const toggleMusic = () => {
    if (bgAudio.current) {
      if (isPlayingMusic) {
        bgAudio.current.pause();
        setIsPlayingMusic(false);
      } else {
        bgAudio.current.play().catch(e => console.log("Erreur audio:", e));
        setIsPlayingMusic(true);
      }
    }
  };

  const playSound = (type: 'select' | 'win' | 'lose' | 'joker') => {
    try {
      const sounds = {
        select: new Audio('/sounds/suspense.mp3'),
        win: new Audio('/sounds/win.mp3'),
        lose: new Audio('/sounds/lose.mp3'),
        joker: new Audio('/sounds/joker.mp3')
      };
      if (sounds[type]) {
        sounds[type].volume = 0.8;
        sounds[type].play().catch(e => console.log("Audio non dispo", e));
      }
    } catch (err) {
      console.log("Erreur système audio", err);
    }
  };

  // Payer puis lancer la partie
  const payTicketAndStart = async () => {
    if (!walletAddress) return;
    try {
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: walletAddress, to: TREASURY_ADDRESS, value: TICKET_PRICE_HEX }],
      });
      
      // Paiement validé : On lance le plateau
      setCurrentLevel(0);
      setJokers({ fiftyFifty: true, phone: true, audience: true });
      setHiddenOptions([]);
      resetTurn();
      setGameState('playing');
      
      if (bgAudio.current) {
        bgAudio.current.pause();
        bgAudio.current.currentTime = 0;
        setIsPlayingMusic(false);
      }
    } catch (error) {
      console.error("Paiement refusé :", error);
    }
  };

  const handleAnswer = (option: string) => {
    if (isChecking) return;
    setSelectedOption(option);
    setIsChecking(true);
    playSound('select');

    setTimeout(() => {
      const currentQ = questionsWeb3[currentLevel];
      setCorrectAnswer(currentQ.answer);
      
      if (option === currentQ.answer) {
        playSound('win');
        setTimeout(() => {
          setCurrentLevel(currentLevel + 1);
          resetTurn();
        }, 3000);
      } else {
        playSound('lose');
        setTimeout(() => {
          alert("Fin de la partie ! Vous repartez avec " + getSafeHavenValue());
          setGameState('welcome');
          if (bgAudio.current) {
            bgAudio.current.pause();
            setIsPlayingMusic(false);
          }
        }, 3000);
      }
    }, 3000);
  };

  const resetTurn = () => {
    setSelectedOption(null);
    setCorrectAnswer(null);
    setIsChecking(false);
    setHiddenOptions([]); 
    setJokerMessage(null);
  };

  const getSafeHavenValue = () => {
    if (currentLevel >= 11) return "72 000 USDT";
    if (currentLevel >= 3) return "1 000 USDT";
    return "0 USDT";
  };

  // Jokers
  const useFiftyFifty = () => {
    if (!jokers.fiftyFifty || isChecking) return;
    setJokers({ ...jokers, fiftyFifty: false });
    playSound('joker');
    const currentQ = questionsWeb3[currentLevel];
    const wrongOptions = currentQ.options.filter(opt => opt !== currentQ.answer);
    const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffledWrong[0], shuffledWrong[1]]);
  };

  const usePhone = () => {
    if (!jokers.phone || isChecking) return;
    setJokers({ ...jokers, phone: false });
    playSound('joker');
    const currentQ = questionsWeb3[currentLevel];
    setJokerMessage(`📞 APPEL À UN AMI :\n\n"Salut ! Écoute, je ne suis pas sûr à 100%, mais je dirais bien que c'est la réponse : ${currentQ.answer}."`);
  };

  const useAudience = () => {
    if (!jokers.audience || isChecking) return;
    setJokers({ ...jokers, audience: false });
    playSound('joker');
    const currentQ = questionsWeb3[currentLevel];
    setJokerMessage(`👥 AVIS DU PUBLIC :\n\n✔️ ${currentQ.answer} : 72%\n❌ Les autres réponses se partagent les 28% restants.`);
  };

  const getButtonClass = (option: string) => {
    if (!isChecking && selectedOption === option) return "answer-btn selected";
    if (isChecking && correctAnswer === option) return "answer-btn correct";
    if (isChecking && selectedOption === option && correctAnswer !== option) return "answer-btn wrong";
    if (isChecking && selectedOption === option) return "answer-btn selected";
    return "answer-btn";
  };

  // --- ÉCRAN 1 : ACCUEIL & PAIEMENT ---
  if (gameState === 'welcome') {
    return (
      <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
        <h1 style={{ color: '#e5b80b', fontSize: '3.5rem', textShadow: '2px 2px 5px #000', margin: '0 0 10px 0' }}>
          WHO WANTS TO BE A
        </h1>
        <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px', letterSpacing: '2px' }}>
          CRYPTO MILLIONAIRE?
        </h2>
        <h3 style={{ color: '#00d4ff', fontSize: '1.2rem', marginBottom: '40px', letterSpacing: '3px', fontWeight: 'bold' }}>
          {networkTheme.toUpperCase()} EDITION
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <button
            onClick={toggleMusic}
            style={{ padding: '10px 20px', fontSize: '1rem', borderRadius: '10px', background: 'transparent', border: '1px solid #e5b80b', color: '#e5b80b', cursor: 'pointer' }}
          >
            {isPlayingMusic ? '⏸️ Couper la musique' : '🎵 Lancer la musique'}
          </button>

          {!walletAddress ? (
            <button 
              onClick={connectWallet}
              style={{ padding: '15px 40px', fontSize: '1.5rem', borderRadius: '30px', background: '#e5b80b', border: '3px solid white', color: 'black', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}
            >
              🦊 Connecter le Wallet
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
              <p style={{ color: '#00ff00', fontWeight: 'bold', marginBottom: '15px' }}>
                🟢 Wallet : {walletAddress.substring(0,6)}...{walletAddress.substring(38)}
              </p>
              <button 
                onClick={payTicketAndStart}
                style={{ padding: '15px 40px', fontSize: '1.5rem', borderRadius: '30px', background: '#00d4ff', border: '3px solid white', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ▶️ Payer (0.00001 ETH) & Jouer
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- ÉCRAN 2 : LE PLATEAU DE JEU ---
  const currentQuestion = questionsWeb3[currentLevel];

  // Si le joueur a répondu à toutes les questions dispos
  if (!currentQuestion) return (
    <div style={{ color: "white", padding: "50px", textAlign: "center", fontSize: "2rem" }}>
      🏆 FÉLICITATIONS ! VOUS ÊTES UN CRYPTO MILLIONNAIRE ! 🏆
      <br/>
      <button onClick={() => setGameState('welcome')} style={{ marginTop: "30px", padding: "15px 30px", cursor: "pointer", fontSize: "1.2rem", borderRadius: "10px", background: "#e5b80b", border: "2px solid white", color: "black", fontWeight: "bold" }}>Retour à l'accueil</button>
    </div>
  );

  return (
    <div className="game-container">
      <div className="jokers">
        <button className="joker-btn" disabled={!jokers.fiftyFifty} onClick={useFiftyFifty}>50:50</button>
        <button className="joker-btn" disabled={!jokers.phone} onClick={usePhone}>☎️</button>
        <button className="joker-btn" disabled={!jokers.audience} onClick={useAudience}>👥</button>
        <button className="joker-btn" onClick={toggleMusic} title="Activer/Désactiver la musique">
          {isPlayingMusic ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="main-board">
        <div className="hexagon-box question-container">
          {currentQuestion.question}
        </div>

        <div className="answers-grid">
          {currentQuestion.options.map((option, index) => {
            if (hiddenOptions.includes(option)) {
              return <div key={index} style={{ visibility: 'hidden' }}></div>;
            }

            return (
              <button
                key={index}
                className={getButtonClass(option)}
                onClick={() => handleAnswer(option)}
              >
                <span style={{ color: '#e5b80b', fontWeight: 'bold', marginRight: '10px' }}>
                  {String.fromCharCode(65 + index)}:
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {jokerMessage && (
          <div className="joker-result-box">
            <p>{jokerMessage}</p>
            <button className="close-joker-btn" onClick={() => setJokerMessage(null)}>
              OK
            </button>
          </div>
        )}
      </div>

      <div className="money-tree">
        {MONEY_TREE.map((amount, index) => {
          const isSafeHaven = index === 3 || index === 11;
          const isActive = index === currentLevel;
          
          let className = "gain-level";
          if (isSafeHaven) className += " safe-haven";
          if (isActive) className += " active";

          return (
            <div key={index} className={className}>
              <span>{index + 1} ⯁</span>
              <span>{amount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
