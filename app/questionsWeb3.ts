// ==========================================
// 🔵 QUESTIONS POUR LE RÉSEAU BASE (15)
// ==========================================
export const questionsBase = [
  {
    question: "Quelle célèbre entreprise crypto a développé et lancé le réseau Base ?",
    options: ["Binance", "Coinbase", "Kraken", "Ledger"],
    answer: "Coinbase",
    explanation: "Base a été incubé et lancé par Coinbase, l'un des plus grands échanges cryptos au monde."
  },
  {
    question: "Quel est le jeton (token) natif utilisé pour payer les frais de gaz sur Base ?",
    options: ["BASE", "USDC", "ETH", "CB"],
    answer: "ETH",
    explanation: "Contrairement à d'autres réseaux, Base n'a pas de token propre et utilise l'Ethereum (ETH) pour le gaz."
  },
  {
    question: "Sur quel écosystème principal la blockchain Base est-elle construite ?",
    options: ["Optimism (OP Stack)", "Arbitrum Nitro", "Polygon zkEVM", "Solana"],
    answer: "Optimism (OP Stack)",
    explanation: "Base a été développée en utilisant l'OP Stack d'Optimism, une infrastructure open-source."
  },
  {
    question: "Que signifie le terme 'L2' qui définit le réseau Base par rapport à Ethereum ?",
    options: ["Level 2", "Layer 2", "Local 2", "Loop 2"],
    answer: "Layer 2",
    explanation: "Base est une 'Couche 2' (Layer 2) qui s'appuie sur la sécurité d'Ethereum (Couche 1) tout en étant plus rapide."
  },
  {
    question: "Quel type de technologie de mise à l'échelle (scaling) Base utilise-t-elle ?",
    options: ["ZK Rollup", "Optimistic Rollup", "Validium", "Plasma"],
    answer: "Optimistic Rollup",
    explanation: "Comme Optimism, Base utilise les Optimistic Rollups pour traiter les transactions hors chaîne."
  },
  {
    question: "Quel est le slogan principal et l'objectif affiché par l'équipe de Base ?",
    options: ["Tuer Ethereum", "Remplacer le Bitcoin", "Amener le prochain milliard d'utilisateurs on-chain", "Devenir la banque centrale du Web3"],
    answer: "Amener le prochain milliard d'utilisateurs on-chain",
    explanation: "L'objectif de Base est de rendre le Web3 accessible à 1 milliard de personnes à travers le monde."
  },
  {
    question: "Base possède-t-il son propre token de gouvernance (comme ARB ou OP) ?",
    options: ["Oui, le jeton $BASE", "Oui, le jeton $CBB", "Non, Base n'a pas de token", "Il est en phase d'ICO"],
    answer: "Non, Base n'a pas de token",
    explanation: "Coinbase a toujours affirmé qu'il n'y avait aucun plan pour émettre un token réseau spécifique à Base."
  },
  {
    question: "En quel mois et année le réseau principal (Mainnet) de Base a-t-il été ouvert au grand public ?",
    options: ["Janvier 2022", "Août 2023", "Décembre 2023", "Mars 2024"],
    answer: "Août 2023",
    explanation: "Le Mainnet public de Base a été officiellement lancé le 9 août 2023."
  },
  {
    question: "Quel est le nom de la campagne estivale massive lancée par Coinbase pour célébrer l'ouverture de Base ?",
    options: ["Crypto Summer", "Onchain Summer", "Base Festival", "Web3 Holidays"],
    answer: "Onchain Summer",
    explanation: "Onchain Summer était un événement de plusieurs semaines réunissant des marques comme Coca-Cola et Atari."
  },
  {
    question: "Quelle application 'Social-Fi' a connu un succès fulgurant à ses débuts exclusifs sur Base ?",
    options: ["Farcaster", "Lens Protocol", "friend.tech", "Steemit"],
    answer: "friend.tech",
    explanation: "friend.tech a généré une activité massive sur Base en permettant d'acheter des 'clés' liées à des comptes X (Twitter)."
  },
  {
    question: "Quel DEX (échange décentralisé) est considéré comme le hub de liquidité principal natif de Base ?",
    options: ["Uniswap", "SushiSwap", "PancakeSwap", "Aerodrome"],
    answer: "Aerodrome",
    explanation: "Bien qu'Uniswap y soit présent, Aerodrome a été conçu spécifiquement comme le principal moteur de liquidité de Base."
  },
  {
    question: "Quelle mise à jour majeure d'Ethereum a permis de réduire drastiquement les frais sur Base en 2024 ?",
    options: ["The Merge", "Shanghai", "Dencun (EIP-4844)", "London"],
    answer: "Dencun (EIP-4844)",
    explanation: "La mise à jour Dencun a introduit les 'blobs', réduisant les frais des L2 comme Base de plus de 90%."
  },
  {
    question: "Comment les données de transaction de Base sont-elles sécurisées au final ?",
    options: ["Par un réseau de nœuds privés", "Elles sont publiées sur le réseau principal Ethereum", "Par l'algorithme de Coinbase", "Sur des serveurs AWS"],
    answer: "Elles sont publiées sur le réseau principal Ethereum",
    explanation: "Les L2 héritent de la sécurité de leur L1. Base regroupe les transactions et les écrit sur Ethereum."
  },
  {
    question: "Dans l'écosystème Optimism, Base fait partie d'un réseau interconnecté appelé...",
    options: ["Le Superchain", "Le Multiverse", "L'Omni-Network", "Le Base-Layer"],
    answer: "Le Superchain",
    explanation: "Base et OP Mainnet font partie de la 'Superchain', une vision de plusieurs chaînes partageant la même technologie."
  },
  {
    question: "Quel protocole permet de transférer de l'USDC nativement vers Base depuis d'autres chaînes sans utiliser de pont tiers ?",
    options: ["LayerZero", "Wormhole", "CCTP de Circle", "Synapse"],
    answer: "CCTP de Circle",
    explanation: "Le Cross-Chain Transfer Protocol (CCTP) permet de graver l'USDC sur une chaîne et de le frapper nativement sur Base."
  }
];

// ==========================================
// 🟣 QUESTIONS POUR LE RÉSEAU ARC TESTNET (15)
// ==========================================
export const questionsArc = [
  {
    question: "Que signifie l'acronyme USDC ?",
    options: ["United States Digital Cash", "USD Coin", "Universal Stable Digital Currency", "Union Standard Dollar Crypto"],
    answer: "USD Coin",
    explanation: "USDC signifie 'USD Coin', un stablecoin dont la valeur est arrimée au dollar américain."
  },
  {
    question: "Quelle entreprise est l'émetteur principal et le créateur historique de l'USDC ?",
    options: ["Tether", "Binance", "Circle", "MakerDAO"],
    answer: "Circle",
    explanation: "L'USDC est émis par Circle, une entreprise mondiale de technologie financière."
  },
  {
    question: "Quel est le jeton utilisé pour payer l'entrée sur cette version d'Arc Testnet ?",
    options: ["ETH", "ARC", "BTC", "USDC"],
    answer: "USDC",
    explanation: "Sur cette édition spéciale, l'entrée et les frais se paient directement en stablecoin USDC."
  },
  {
    question: "Comment l'USDC maintient-il sa valeur d'un dollar de manière stable ?",
    options: ["Par un algorithme complexe", "Il est adossé à 1:1 par des réserves en dollars", "Grâce à la preuve de travail", "Par un vote communautaire"],
    answer: "Il est adossé à 1:1 par des réserves en dollars",
    explanation: "Chaque USDC en circulation est couvert par 1 dollar (ou actif équivalent) conservé dans des réserves réglementées."
  },
  {
    question: "Quelle norme de jeton de la blockchain Ethereum l'USDC utilise-t-il communément ?",
    options: ["ERC-721", "ERC-1155", "ERC-20", "ERC-404"],
    answer: "ERC-20",
    explanation: "L'USDC utilise la norme ERC-20, le standard technique pour les jetons fongibles sur les réseaux compatibles Ethereum."
  },
  {
    question: "Combien de décimales utilise l'interface ERC-20 classique du token USDC ?",
    options: ["2 décimales", "6 décimales", "8 décimales", "18 décimales"],
    answer: "6 décimales",
    explanation: "Contrairement à l'ETH qui en a 18, l'interface ERC-20 de l'USDC utilise 6 décimales (1 USDC = 1 000 000 d'unités)."
  },
  {
    question: "Comment s'appelle le stablecoin adossé à l'Euro émis par l'entreprise derrière Arc ?",
    options: ["EURS", "EUROC", "EURC", "cEUR"],
    answer: "EURC",
    explanation: "L'EURC est le stablecoin libellé en euros émis par Circle et supporté nativement sur Arc."
  },
  {
    question: "Quel outil gratuit devez-vous utiliser pour obtenir de faux USDC pour tester vos applications sur Arc Testnet ?",
    options: ["Un Faucet", "Un DEX", "Un Bridge", "Un Mixer"],
    answer: "Un Faucet",
    explanation: "Un 'Faucet' (robinet) distribue gratuitement des jetons de test (comme l'USDC) aux développeurs."
  },
  {
    question: "Sur Arc Testnet, le jeton natif pour payer le gaz est aussi l'USDC. Combien de décimales utilise sa version *native* ?",
    options: ["6 décimales", "8 décimales", "18 décimales", "Aucune"],
    answer: "18 décimales",
    explanation: "C'est une subtilité : l'interface ERC-20 de l'USDC a 6 décimales, mais le jeton de gaz natif Arc en utilise 18."
  },
  {
    question: "Que signifie l'acronyme 'CCTP' développé pour transférer l'USDC en toute sécurité ?",
    options: ["Crypto Coin Transfer Protocol", "Cross-Chain Transfer Protocol", "Circle Cash Transaction Platform", "Centralized Currency Trading Protocol"],
    answer: "Cross-Chain Transfer Protocol",
    explanation: "Le CCTP permet à l'USDC de circuler de manière native entre plusieurs blockchains sans utiliser de ponts enveloppés (wrapped)."
  },
  {
    question: "Quel stablecoin de l'écosystème Arc (Circle) permet d'obtenir un rendement réglementé basé sur les bons du Trésor américain ?",
    options: ["USDT", "DAI", "USYC", "FRAX"],
    answer: "USYC",
    explanation: "L'USYC représente des parts tokenisées d'un fonds monétaire investi en obligations du Trésor américain à court terme."
  },
  {
    question: "Dans notre code Solidity/Web3, quelle valeur hexadécimale correspond à 1 USDC (soit 1 000 000 d'unités) ?",
    options: ["0x100000", "0xF4240", "0x01", "0x9184E"],
    answer: "0xF4240",
    explanation: "Le chiffre 1 000 000 converti en système hexadécimal donne 0xF4240."
  },
  {
    question: "Quel est le rôle du système 'StableFX' proposé sur le réseau Arc ?",
    options: ["Miner du Bitcoin", "Créer des NFTs", "Un moteur d'échange (FX) de stablecoins", "Stocker des mots de passe"],
    answer: "Un moteur d'échange (FX) de stablecoins",
    explanation: "StableFX est un moteur de change de niveau entreprise combinant des demandes de cotation (RFQ) avec des règlements on-chain."
  },
  {
    question: "Quel contrat commun de l'écosystème Ethereum est utilisé sur Arc pour gérer les approbations de tokens par signature ?",
    options: ["Multicall3", "Permit2", "CREATE2", "UniswapV3"],
    answer: "Permit2",
    explanation: "Permit2 est un contrat universel qui permet de valider des dépenses de jetons via des signatures (off-chain) au lieu de transactions coûteuses."
  },
  {
    question: "Sur Arc Testnet, que se passe-t-il si un transfert de valeur (USDC) est envoyé vers une adresse bannie (blacklistée) ?",
    options: ["Les fonds sont brûlés", "La transaction est annulée (Revert)", "Les fonds sont envoyés à la trésorerie", "La transaction est mise en pause 24h"],
    answer: "La transaction est annulée (Revert)",
    explanation: "Pour des raisons de conformité, tout transfert de valeur impliquant une adresse sous sanction est bloqué au niveau de l'exécution (runtime revert)."
  }
];
