'use client';

import { useState, useEffect } from 'react';
// 👇 AJOUTE CE BLOC POUR RASSURER TYPESCRIPT 👇
declare global {
  interface Window {
    ethereum?: any;
  }
}
// 👆 FIN DU BLOC 👆
// ⚠️ À MODIFIER : Remplace par l'adresse de ton portefeuille qui recevra les paiements
const TREASURY_ADDRESS = "0x18799902c24dEe7F499205f9e647C69e97EB193B"; 

// ⚠️ À MODIFIER : Prix du ticket en Wei (format Hexadécimal). Ici 0.001 ETH par défaut.
const TICKET_PRICE_HEX = "0x38D7EA4C68000"; 

export default function Home() {
  const [gameState, setGameState] = useState('welcome');
  const [networkTheme, setNetworkTheme] = useState('Web3');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Détection du réseau au chargement
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
        
        if (chainId === '0x2105') { // 8453 en hex (Base Mainnet)
          setNetworkTheme('Base');
        } else if (chainId === '0xREMPLACER_PAR_HEX') { // ⚠️ À MODIFIER : Chain ID de Arc Network en hex
          setNetworkTheme('Arc');
        } else {
          setNetworkTheme('Web3');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du réseau", error);
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
        console.error("Erreur de connexion au portefeuille", error);
      }
    } else {
      alert("Veuillez installer MetaMask, Rabby ou un autre portefeuille Web3 !");
    }
  };

  const payTicketAndStart = async () => {
    if (!walletAddress) {
      alert("Veuillez connecter votre portefeuille d'abord !");
      return;
    }

    try {
      // Demande de transaction au joueur
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: walletAddress,
            to: TREASURY_ADDRESS,
            value: TICKET_PRICE_HEX, 
          },
        ],
      });
      
      console.log("Transaction validée avec le hash :", txHash);
      setGameState('playing'); // Le paiement est passé, on lance le jeu
    } catch (error) {
      console.error("Paiement refusé ou erreur :", error);
      alert("Le paiement est requis pour lancer la partie.");
    }
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
            <button 
              onClick={connectWallet}
              style={{ padding: '15px 30px', fontSize: '1.2rem', backgroundColor: '#e5b80b', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
            >
              Connecter le portefeuille
            </button>
          ) : (
            <div>
              <p style={{ marginBottom: '20px', color: '#22c55e', fontWeight: 'bold' }}>
                🟢 Portefeuille connecté : {walletAddress.substring(0,6)}...{walletAddress.substring(38)}
              </p>
              <button 
                onClick={payTicketAndStart}
                style={{ padding: '15px 30px', fontSize: '1.2rem', backgroundColor: '#00d4ff', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Payer le ticket & Jouer
              </button>
            </div>
          )}
        </div>
      )}

      {gameState === 'playing' && (
         <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%' }}>
            <h2 style={{ fontSize: '2rem', color: '#e5b80b' }}>Questions Web3</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Mode actif : {networkTheme}</p>
            
            {/* L'interface du quiz viendra ici et lira le fichier questionsWeb3.ts */}
            <div style={{ padding: '2rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
               <p>Interface des questions en cours de construction...</p>
            </div>
         </div>
      )}

    </main>
  );
}
