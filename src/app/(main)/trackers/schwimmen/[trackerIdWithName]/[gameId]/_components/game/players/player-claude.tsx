"use client"

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Typdefinitionen
interface PlayerState {
  background: string;
  border: string;
  text: string;
}

interface PlayerStateStyles {
  active: PlayerState;
  eliminated: PlayerState;
  swimming: PlayerState;
  swimmerEliminated: PlayerState;
  winner: PlayerState;
}

interface HeartLifeProps {
  alive: boolean;
  onAnimationComplete?: () => void;
}

interface PlayerLivesProps {
  lives: number;
  maxLives?: number;
}

// interface SwimmingEffectProps {
//   // Optional props könnten hier hinzugefügt werden
// }

interface PlayerProps {
  id: string | number;
  name: string;
  lives: number;
  isSwimming: boolean;
  wasSwimming?: boolean;
  isEliminated: boolean;
  isActive: boolean;
  isWinner?: boolean;
  onAnimationComplete?: () => void;
}

interface RoundNavigationProps {
  currentRound: number;
  totalRounds: number;
  onNavigate: (round: number) => void;
}

// Farbschemata für verschiedene Spielerzustände
const playerStateStyles: PlayerStateStyles = {
  active: {
    background: "bg-white", 
    border: "border-emerald-400",
    text: "text-slate-900"
  },
  eliminated: {
    background: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-500"
  },
  swimming: {
    background: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-700"
  },
  swimmerEliminated: {
    background: "bg-slate-100",
    border: "border-blue-300 border-dashed",
    text: "text-slate-500"
  },
  winner: {
    background: "bg-amber-50",
    border: "border-amber-400",
    text: "text-amber-700"
  }
};

// Animierte Herz-Komponente für Leben
const HeartLife: React.FC<HeartLifeProps> = ({ alive, onAnimationComplete }) => {
  const [breaking, setBreaking] = useState<boolean>(false);
  
  useEffect(() => {
    // Start breaking animation when life is lost
    if (!alive) {
      setBreaking(true);
    }
  }, [alive]);

  // Zwei Hälften für den Bruch-Effekt
  const leftPathVariants = {
    whole: { x: 0, opacity: 1 },
    broken: { x: -10, opacity: 0, transition: { duration: 0.5 } }
  };
  
  const rightPathVariants = {
    whole: { x: 0, opacity: 1 },
    broken: { x: 10, opacity: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className={`w-8 h-8 flex items-center justify-center 
        ${alive ? 'text-red-500' : 'text-gray-300'}`}
      animate={{ 
        scale: alive ? [1, 1.2, 1] : 1,
      }}
      transition={{ 
        scale: { duration: 0.5 }, 
      }}
    >
      {!breaking ? (
        <motion.div
          initial={{ scale: alive ? 1 : 0.8, opacity: alive ? 1 : 0.6 }}
          animate={{ scale: alive ? 1 : 0.8, opacity: alive ? 1 : 0.6 }}
          className="text-xl"
        >
          ❤️
        </motion.div>
      ) : (
        <div className="relative">
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            initial="whole"
            animate="broken"
            onAnimationComplete={() => {
              setBreaking(false);
              if (onAnimationComplete) onAnimationComplete();
            }}
          >
            {/* Linke Herzhälfte */}
            <motion.path
              d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08"
              fill="currentColor"
              variants={leftPathVariants}
            />
            {/* Rechte Herzhälfte */}
            <motion.path
              d="M12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3C14.76,3 13.09,3.81 12,5.08"
              fill="currentColor"
              variants={rightPathVariants}
            />
          </motion.svg>
        </div>
      )}
    </motion.div>
  );
};

// Spieler-Leben Anzeige
const PlayerLives: React.FC<PlayerLivesProps> = ({ lives, maxLives = 3 }) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: maxLives }).map((_, i) => (
        <HeartLife key={i} alive={i < lives} />
      ))}
    </div>
  );
};

// Wellen-Animation für Schwimmer
const SwimmingEffect: React.FC = () => {
  return (
    <div className="bottom-0 absolute inset-x-0 h-12 overflow-hidden">
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Erste Welle */}
        <motion.svg
          className="bottom-0 left-0 absolute w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,96L48,101.3C96,107,192,117,288,106.7C384,96,480,64,576,58.7C672,53,768,75,864,80C960,85,1056,75,1152,74.7C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="rgba(59, 130, 246, 0.2)"
            animate={{
              d: [
                "M0,96L48,101.3C96,107,192,117,288,106.7C384,96,480,64,576,58.7C672,53,768,75,864,80C960,85,1056,75,1152,74.7C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z",
                "M0,64L48,74.7C96,85,192,107,288,112C384,117,480,107,576,90.7C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              ]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 4,
              ease: "easeInOut"
            }}
          />
        </motion.svg>
        
        {/* Zweite Welle (versetzt) */}
        <motion.svg
          className="bottom-0 left-0 absolute w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,96L60,80C120,64,240,32,360,26.7C480,21,600,43,720,80C840,117,960,171,1080,170.7C1200,171,1320,117,1380,90.7L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            fill="rgba(59, 130, 246, 0.3)"
            animate={{
              d: [
                "M0,96L60,80C120,64,240,32,360,26.7C480,21,600,43,720,80C840,117,960,171,1080,170.7C1200,171,1320,117,1380,90.7L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z",
                "M0,64L60,69.3C120,75,240,85,360,90.7C480,96,600,96,720,90.7C840,85,960,75,1080,69.3C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
              ]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 3,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.svg>
        
        {/* Schwimmer-Icon */}
        <motion.div 
          className="right-4 bottom-2 absolute"
          animate={{
            y: [0, -4, 0],
            x: [-2, 2, -2]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <span className="text-xl">🏊</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Animationen für normales Ausscheiden
const NormalEliminationEffect: React.FC = () => {
  return (
    <motion.div
      className="z-10 absolute inset-0 flex justify-center items-center bg-slate-900 bg-opacity-50 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{ type: "spring", delay: 0.3 }}
        className="bg-black bg-opacity-70 px-4 py-2 rounded-lg text-white"
      >
        Ausgeschieden
      </motion.div>
    </motion.div>
  );
};

// Ertrinken/Untertauchen Animation für Schwimmer
const SwimmerEliminationEffect: React.FC = () => {
  return (
    <motion.div
      className="z-10 absolute inset-0 rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ansteigendes Wasser-Overlay */}
      <motion.div
        className="absolute inset-x-0 bg-blue-500 bg-opacity-60"
        initial={{ height: "20%", bottom: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        {/* Luftblasen-Effekt */}
        <div className="relative w-full h-full">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-200 bg-opacity-70 rounded-full"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                width: `${Math.random() * 15 + 5}px`,
                height: `${Math.random() * 15 + 5}px`,
              }}
              initial={{ bottom: 0, opacity: 0.7 }}
              animate={{ 
                bottom: "100%", 
                opacity: 0,
                transition: {
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* "Ertrunken" Text */}
      <motion.div
        className="top-1/2 left-1/2 z-20 absolute transform -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="bg-blue-900 bg-opacity-80 px-4 py-2 rounded-lg font-medium text-white">
          Ertrunken
        </div>
      </motion.div>
    </motion.div>
  );
};

// Komponente für Rundennavigation
const RoundNavigation: React.FC<RoundNavigationProps> = ({ 
  currentRound, 
  totalRounds, 
  onNavigate 
}) => {
  return (
    <motion.div 
      className="flex justify-center items-center space-x-4 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-white disabled:opacity-50 shadow-sm p-2 border border-slate-200 rounded-full"
        onClick={() => onNavigate(currentRound - 1)}
        disabled={currentRound <= 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      
      <div className="bg-white shadow-sm px-4 py-2 border border-slate-200 rounded-full">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentRound}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-medium"
          >
            Runde {currentRound}/{totalRounds}
          </motion.span>
        </AnimatePresence>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-white disabled:opacity-50 shadow-sm p-2 border border-slate-200 rounded-full"
        onClick={() => onNavigate(currentRound + 1)}
        disabled={currentRound >= totalRounds}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

// Vollständige Player-Komponente
const Player: React.FC<PlayerProps> = ({ 
  name, 
  lives, 
  isSwimming, 
  wasSwimming = false, 
  isEliminated, 
  isActive,
  isWinner = false,
  onAnimationComplete
}) => {
  const [showEliminationEffect, setShowEliminationEffect] = useState<boolean>(false);
  
  useEffect(() => {
    if (isEliminated) {
      setShowEliminationEffect(true);
      
      // Nach der Animation zurücksetzen
      const timer = setTimeout(() => {
        setShowEliminationEffect(false);
        if (onAnimationComplete) onAnimationComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isEliminated, onAnimationComplete]);
  
  // Je nach Status ein anderes Styling anwenden
  let stateStyle: PlayerState;
  
  if (isWinner) {
    stateStyle = playerStateStyles.winner;
  } else if (isEliminated && wasSwimming) {
    stateStyle = playerStateStyles.swimmerEliminated;
  } else if (isEliminated) {
    stateStyle = playerStateStyles.eliminated;
  } else if (isSwimming) {
    stateStyle = playerStateStyles.swimming;
  } else {
    stateStyle = playerStateStyles.active; // Default
  }
  
  return (
    <motion.div
      layout
      className={`relative rounded-lg p-4 shadow-md overflow-hidden
        ${stateStyle.background} ${stateStyle.border} border-2 ${stateStyle.text}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isEliminated ? 0.8 : 1, 
        y: 0,
        scale: isActive && !isEliminated ? 1.02 : 1,
      }}
      transition={{ type: "spring" }}
    >
      {/* Spieler-Inhalte hier */}
      <h3 className="font-medium text-lg">{name}</h3>
      <div className="mt-2">
        <PlayerLives lives={lives} maxLives={3} />
      </div>
      
      {/* Status-Badges */}
      <div className="flex flex-wrap gap-2 mt-2">
        {isSwimming && (
          <motion.span 
            className="inline-flex items-center bg-blue-100 px-2 py-1 rounded-full font-medium text-blue-700 text-xs"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Schwimmt
          </motion.span>
        )}
        
        {isWinner && (
          <motion.span 
            className="inline-flex items-center bg-amber-100 px-2 py-1 rounded-full font-medium text-amber-700 text-xs"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            Sieger
          </motion.span>
        )}
      </div>
      
      {/* Schwimm-Effekt */}
      {isSwimming && <SwimmingEffect />}
      
      {/* Eliminierungs-Effekte */}
      <AnimatePresence>
        {showEliminationEffect && (
          wasSwimming ? <SwimmerEliminationEffect /> : <NormalEliminationEffect />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Demo-Komponente, die alle Elemente zusammen zeigt
interface GameRoundsProps {
  initialRound?: number;
}

interface GameRound {
  id: number;
  players: PlayerProps[];
}

// Beispiel für ein vollständiges Spiel mit Rundennavigation
const GameRounds: React.FC<GameRoundsProps> = ({ initialRound = 1 }) => {
  const [currentRound, setCurrentRound] = useState<number>(initialRound);
  
  // Beispiel-Runden für die Demo
  const rounds: GameRound[] = [
    {
      id: 1,
      players: [
        { id: 1, name: "Anna", lives: 3, isSwimming: false, isActive: true, isEliminated: false },
        { id: 2, name: "Ben", lives: 3, isSwimming: false, isActive: false, isEliminated: false },
        { id: 3, name: "Clara", lives: 3, isSwimming: false, isActive: false, isEliminated: false },
        { id: 4, name: "David", lives: 3, isSwimming: false, isActive: false, isEliminated: false },
      ]
    },
    {
      id: 2,
      players: [
        { id: 1, name: "Anna", lives: 3, isSwimming: false, isActive: false, isEliminated: false },
        { id: 2, name: "Ben", lives: 2, isSwimming: false, isActive: true, isEliminated: false },
        { id: 3, name: "Clara", lives: 3, isSwimming: false, isActive: false, isEliminated: false },
        { id: 4, name: "David", lives: 3, isSwimming: false, isActive: false, isEliminated: false },
      ]
    },
    {
      id: 3,
      players: [
        { id: 1, name: "Anna", lives: 3, isSwimming: false, isActive: false, isEliminated: false },
        { id: 2, name: "Ben", lives: 2, isSwimming: false, isActive: false, isEliminated: false },
        { id: 3, name: "Clara", lives: 2, isSwimming: false, isActive: true, isEliminated: false },
        { id: 4, name: "David", lives: 3, isSwimming: false, isActive: false, isEliminated: false },
      ]
    },
    {
      id: 4,
      players: [
        { id: 1, name: "Anna", lives: 3, isSwimming: false, isActive: false, isEliminated: false },
        { id: 2, name: "Ben", lives: 1, isSwimming: true, isActive: false, isEliminated: false },
        { id: 3, name: "Clara", lives: 2, isSwimming: false, isActive: false, isEliminated: false },
        { id: 4, name: "David", lives: 2, isSwimming: false, isActive: true, isEliminated: false },
      ]
    },
    {
      id: 5,
      players: [
        { id: 1, name: "Anna", lives: 3, isSwimming: false, isActive: true, isEliminated: false },
        { id: 2, name: "Ben", lives: 0, wasSwimming: true, isSwimming: false, isActive: false, isEliminated: true },
        { id: 3, name: "Clara", lives: 2, isSwimming: false, isActive: false, isEliminated: false },
        { id: 4, name: "David", lives: 1, isSwimming: false, isActive: false, isEliminated: false },
      ]
    },
    {
      id: 6,
      players: [
        { id: 1, name: "Anna", lives: 2, isSwimming: false, isActive: false, isEliminated: false, isWinner: true },
        { id: 2, name: "Ben", lives: 0, wasSwimming: true, isSwimming: false, isActive: false, isEliminated: true },
        { id: 3, name: "Clara", lives: 0, isSwimming: false, isActive: false, isEliminated: true },
        { id: 4, name: "David", lives: 0, isSwimming: false, isActive: false, isEliminated: true },
      ]
    },
  ];
  
  const handleNavigate = (newRound: number) => {
    if (newRound >= 1 && newRound <= rounds.length) {
      setCurrentRound(newRound);
    }
  };
  
  // Die Richtung bestimmen (für Animation)
  const getAnimationDirection = (targetRound: number): number => {
    return targetRound > currentRound ? 1 : -1;
  };
  
  const currentRoundData = rounds[currentRound - 1];
  
  return (
    <div className="mx-auto p-4 max-w-4xl">
      <h1 className="mb-6 font-bold text-2xl text-center">Schwimmen - Das Kartenspiel</h1>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRound}
          initial={{ opacity: 0, x: 50 * getAnimationDirection(currentRound) }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 * getAnimationDirection(currentRound) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="gap-4 grid grid-cols-1 md:grid-cols-2"
        >
          {currentRoundData.players.map(player => (
            <Player 
              key={player.id} 
              {...player}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      
      <RoundNavigation 
        currentRound={currentRound} 
        totalRounds={rounds.length} 
        onNavigate={handleNavigate} 
      />
    </div>
  );
};

export { 
  HeartLife, 
  PlayerLives, 
  SwimmingEffect, 
  NormalEliminationEffect,
  SwimmerEliminationEffect,
  Player,
  RoundNavigation,
  GameRounds
};

export default GameRounds;
