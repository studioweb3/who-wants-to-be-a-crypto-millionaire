'use client';

import { useState, useEffect, useRef } from 'react';
import { questionsBase, questionsArc } from './questionsWeb3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// ⚠️ ADRESSES ET CONFIGURATIONS À VÉRIFIER
const TREASURY_ADDRESS = "0x18799902c24dEe7F499205f9e647C69e97EB193B"; 

// --- CONFIGURATION BASE ---
const BASE_CHAIN_ID = "0x2105"; // 8453 en hex
const TICKET_PRICE_ETH_HEX = "0x9184E72A000"; // 0.00001 ETH

// --- CONFIGURATION ARC TESTNET ---
const ARC_CHAIN_ID = "0x4CEF52"; // Chain ID de Arc Testnet
const USDC_CONTRACT_ARC = "0x3600000000000000000000000000000000000000"; // Adresse du contrat USDC sur Arc
// Prix en USDC (ex: 1 USDC = 1 000 000 (car 6 décimales) -> "0xF4240" en hex)
const TICKET_PRICE_USDC_HEX = "0xF4240"; 

const MONEY_TREE = [
  "200 USDT", "300 USDT", "500 USDT", "1 000 USDT",
  "1 500 USDT", "2 000 USDT", "4 000 USDT", "8 000 USDT", "12 000 USDT", "24 000 USDT", "48 000 USDT", "72 000 USDT",
  "150 000 USDT", "300 000 USDT", "1 000 000 USDT"
];

type ModalState = {
  title: string;
  content: string;
  type: 'joker' | 'gameover';
} | null;

// Fonction maison pour encoder un transfert ERC-20 (USDC)
const encodeERC20Transfer = (recipient: string, amountHex: string) => {
  const cleanRecipient = recipient.toLowerCase().replace('0x', '').padStart(64, '0');
  const cleanAmount = amountHex.replace('0x', '').padStart(64, '0');
  return `0xa9059cbb${cleanRecipient}${cleanAmount}`; // 0xa9059cbb = transfer(address,uint256)
};

export default function Home() {
  const [gameState, setGameState] = useState<'welcome' | 'playing'>('welcome');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  // Savoir quelles questions afficher
  const [activeQuestions, setActiveQuestions] = useState(questionsBase);

  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [jokers, setJokers] = useState({ fiftyFifty: true, phone: true, audience: true });
  const [activeModal, setActiveModal] = useState<ModalState>(null);
  
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const bgAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgAudio.current = new Audio('/sounds/background.mp3');
    bgAudio.current.loop = true;
    bgAudio.current.volume = 0.4;

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) setWalletAddress(accounts[0]);
    else setWalletAddress(null);
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
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

  // --- LOGIQUE DE CHANGEMENT DE RÉSEAU ---
  const switchNetwork = async (chainIdHex: string) => {
    try {
      // 1. On essaie de passer sur le réseau demandé
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      return true;
    } catch (error: any) {
      // 2. Le code 4902 signifie "Ce réseau n'est pas dans le wallet"
      if (error.code === 4902) {
        try {
          // On ajoute Arc Testnet automatiquement
          if (chainIdHex === ARC_CHAIN_ID) { 
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: ARC_CHAIN_ID,
                chainName: 'Arc Testnet',
                nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
                rpcUrls: ['https://rpc.testnet.arc.io'],
                blockExplorerUrls: ['https://testnet.arcscan.app']
              }],
            });
            return true;
          }
          
          // On ajoute Base automatiquement
          if (chainIdHex === BASE_CHAIN_ID) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: BASE_CHAIN_ID,
                chainName: 'Base',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org']
              }],
            });
            return true;
          }
        } catch (addError) {
          console.error("L'utilisateur a refusé d'ajouter le réseau", addError);
          return false;
        }
      } else {
        console.error("Erreur lors du changement de réseau", error);
      }
      return false;
    }
  };

  // --- JOUER SUR BASE ---
  const playOnBase = async () => {
    if (!walletAddress) return;
    const isSwitched = await switchNetwork(BASE_CHAIN_ID);
    if (!isSwitched) return;

    try {
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: walletAddress, to: TREASURY_ADDRESS, value: TICKET_PRICE_ETH_HEX }],
      });
      
      setActiveQuestions(questionsBase); // Charge les questions Base
      launchGame();
    } catch (error) {
      console.error("Paiement refusé :", error);
    }
  };

  // --- JOUER SUR ARC (USDC) ---
  const playOnArc = async () => {
    if (!walletAddress) return;
    const isSwitched = await switchNetwork(ARC_CHAIN_ID);
    if (!isSwitched) return;

    try {
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ 
          from: walletAddress, 
          to: USDC_CONTRACT_ARC, // On contacte le contrat USDC
          value: '0x0', // On n'envoie pas de jeton natif
          data: encodeERC20Transfer(TREASURY_ADDRESS, TICKET_PRICE_USDC_HEX) // On envoie l'instruction de transfert
        }],
      });
      
      setActiveQuestions(questionsArc); // Charge les questions Arc
      launchGame();
    } catch (error) {
      console.error("Paiement refusé :", error);
    }
  };

  const launchGame = () => {
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
  };

  const handleAnswer = (option: string) => {
    if (isChecking) return;
    setSelectedOption(option);
    setIsChecking(true);
    playSound('select');

    setTimeout(() => {
      const currentQ = activeQuestions[currentLevel];
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
          setActiveModal({
            title: "🚨 MAUVAISE RÉPONSE",
            content: `C'est terminé !\n\nVous repartez avec le palier de sécurité de :\n\n${getSafeHavenValue()}`,
            type: 'gameover'
          });
        }, 3000);
      }
    }, 3000);
  };

  const resetTurn = () => {
    setSelectedOption(null);
    setCorrectAnswer(null);
    setIsChecking(false);
    setHiddenOptions([]); 
    setActiveModal(null);
  };

  const getSafeHavenValue = () => {
    if (currentLevel >= 11) return "72 000 USDT";
    if (currentLevel >= 3) return "1 000 USDT";
    return "0 USDT";
  };

  const useFiftyFifty = () => {
    if (!jokers.fiftyFifty || isChecking) return;
    setJokers({ ...jokers, fiftyFifty: false });
    playSound('joker');
    const currentQ = activeQuestions[currentLevel];
    const wrongOptions = currentQ.options.filter(opt => opt !== currentQ.answer);
    const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffledWrong[0], shuffledWrong[1]]);
  };

  const usePhone = () => {
    if (!jokers.phone || isChecking) return;
    setJokers({ ...jokers, phone: false });
    playSound('joker');
    const currentQ = activeQuestions[currentLevel];
    setActiveModal({
      title: "📞 APPEL À UN AMI",
      content: `"Salut ! Écoute, je ne suis pas sûr à 100%, mais je dirais bien que la bonne réponse est :\n\n ${currentQ.answer}"`,
      type: 'joker'
    });
  };

  const useAudience = () => {
    if (!jokers.audience || isChecking) return;
    setJokers({ ...jokers, audience: false });
    playSound('joker');
    const currentQ = activeQuestions[currentLevel];
    setActiveModal({
      title: "👥 AVIS DU PUBLIC",
      content: `✔️ ${currentQ.answer} : 72%\n\n❌ Les autres propositions se partagent les 28% restants.`,
      type: 'joker'
    });
  };

  const getButtonClass = (option: string) => {
    if (!isChecking && selectedOption === option) return "answer-btn selected";
    if (isChecking && correctAnswer === option) return "answer-btn correct";
    if (isChecking && selectedOption === option && correctAnswer !== option) return "answer-btn wrong";
    if (isChecking && selectedOption === option) return "answer-btn selected";
    return "answer-btn";
  };

  if (gameState === 'welcome') {
    return (
      <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
        <h1 style={{ color: '#e5b80b', fontSize: '3.5rem', textShadow: '2px 2px 5px #000', margin: '0 0 10px 0' }}>
          WHO WANTS TO BE A
        </h1>
        <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '40px', letterSpacing: '2px' }}>
          CRYPTO MILLIONAIRE?
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <button onClick={toggleMusic} style={{ padding: '10px 20px', fontSize: '1rem', borderRadius: '10px', background: 'transparent', border: '1px solid #e5b80b', color: '#e5b80b', cursor: 'pointer' }}>
            {isPlayingMusic ? '⏸️ Couper la musique' : '🎵 Lancer la musique'}
          </button>

          {!walletAddress ? (
            <button onClick={connectWallet} style={{ padding: '15px 40px', fontSize: '1.5rem', borderRadius: '30px', background: '#e5b80b', border: '3px solid white', color: 'black', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
              🦊 Connecter le Wallet
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
              <p style={{ color: '#00ff00', fontWeight: 'bold', marginBottom: '25px' }}>
                🟢 Wallet : {walletAddress.substring(0,6)}...{walletAddress.substring(38)}
              </p>
              
              <h3 style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '15px' }}>Choisissez votre réseau d'entrée :</h3>
              
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                 <button onClick={playOnBase} style={{ padding: '15px 30px', fontSize: '1.2rem', borderRadius: '30px', background: '#0052ff', border: '2px solid white', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }}>
                    🔵 Base (0.00001 ETH)
                 </button>
                 
                 <button onClick={playOnArc} style={{ padding: '15px 30px', fontSize: '1.2rem', borderRadius: '30px', background: '#8b5cf6', border: '2px solid white', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }}>
                    🟣 Arc Testnet (USDC)
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = activeQuestions[currentLevel];

  if (!currentQuestion) return (
    <div style={{ color: "white", padding: "50px", textAlign: "center", fontSize: "2rem" }}>
      🏆 FÉLICITATIONS ! VOUS ÊTES UN CRYPTO MILLIONNAIRE ! 🏆
      <br/>
      <button onClick={() => setGameState('welcome')} style={{ marginTop: "30px", padding: "15px 30px", cursor: "pointer", fontSize: "1.2rem", borderRadius: "10px", background: "#e5b80b", border: "2px solid white", color: "black", fontWeight: "bold" }}>Retour à l'accueil</button>
    </div>
  );

  return (
    <div className="game-container">
      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{activeModal.title}</h2>
            <p className="modal-text">{activeModal.content}</p>
            <button 
              className="modal-btn"
              onClick={() => {
                if (activeModal.type === 'gameover') {
                  setGameState('welcome');
                  if (bgAudio.current) {
                    bgAudio.current.pause();
                    setIsPlayingMusic(false);
                  }
                }
                setActiveModal(null);
              }}
            >
              {activeModal.type === 'gameover' ? 'Retourner à l\'accueil' : 'C\'est noté !'}
            </button>
          </div>
        </div>
      )}

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
