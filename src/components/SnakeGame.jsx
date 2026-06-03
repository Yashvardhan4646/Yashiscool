import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

const GRID_SIZE = 20;
const INITIAL_SPEED = 140; // ms per tick

export default function SnakeGame() {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 0, y: -1 }); // Moving UP initially
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem("snake_high_score")) || 0;
    } catch {
      return 0;
    }
  });
  const [mute, setMute] = useState(false);

  const directionRef = useRef(dir);
  directionRef.current = dir;

  // Synthesize custom 8-bit sound effects using the Web Audio API
  const playSound = useCallback((type) => {
    if (mute) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "eat") {
        // Double pitch blip
        osc.type = "square";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === "gameover") {
        // Buzz descending
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.35); // Low rumble
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "move") {
        // Subtle click
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
      }
    } catch {
      // Ignore context blocks
    }
  }, [mute]);

  // Spawn food at a random coordinate not occupied by the snake
  const spawnFood = useCallback((currentSnake) => {
    let newFood;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    setFood(newFood);
  }, []);

  // Handle movements safely
  const changeDirection = useCallback((newDir) => {
    if (isPaused || isGameOver) return;
    const currentDir = directionRef.current;
    // Prevent 180 degree instant turns
    if (newDir.x !== 0 && currentDir.x !== 0) return;
    if (newDir.y !== 0 && currentDir.y !== 0) return;
    setDir(newDir);
    playSound("move");
  }, [isPaused, isGameOver, playSound]);

  // Listen to keyboard arrow and WASD events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        // Prevent window scrolling while playing
        e.preventDefault();
      }

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          changeDirection({ x: 0, y: -1 });
          break;
        case "KeyS":
        case "ArrowDown":
          changeDirection({ x: 0, y: 1 });
          break;
        case "KeyA":
        case "ArrowLeft":
          changeDirection({ x: -1, y: 0 });
          break;
        case "KeyD":
        case "ArrowRight":
          changeDirection({ x: 1, y: 0 });
          break;
        case "Space":
          if (isGameOver) {
            resetGame();
          } else {
            setIsPaused((p) => !p);
            setHasStarted(true);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection, isGameOver]);

  // Main Game Loop
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const gameTick = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const nextHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Wall collision check
        if (
          nextHead.x < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y < 0 ||
          nextHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          playSound("gameover");
          return prevSnake;
        }

        // Self collision check (excluding the tail if we don't grow)
        const selfCollision = prevSnake.some(
          (segment, idx) => idx !== prevSnake.length - 1 && segment.x === nextHead.x && segment.y === nextHead.y
        );
        if (selfCollision) {
          setIsGameOver(true);
          playSound("gameover");
          return prevSnake;
        }

        const newSnake = [nextHead, ...prevSnake];

        // Food eating check
        if (nextHead.x === food.x && nextHead.y === food.y) {
          playSound("eat");
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              try {
                localStorage.setItem("snake_high_score", String(nextScore));
              } catch {
                // Ignore storage blocks
              }
            }
            return nextScore;
          });
          spawnFood(newSnake);
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    const interval = setInterval(gameTick, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [isPaused, isGameOver, food, highScore, playSound, spawnFood]);

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setFood({ x: 5, y: 5 });
    setDir({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
  };

  return (
    <div className="snake-app-wrapper">
      {/* Game Header Panel */}
      <div className="snake-game-header">
        <div className="snake-score-display">
          <span className="snake-score-label">SCORE</span>
          <span className="snake-score-val">{String(score).padStart(4, "0")}</span>
        </div>
        <div className="snake-score-display">
          <span className="snake-score-label">HI-SCORE</span>
          <span className="snake-score-val">{String(highScore).padStart(4, "0")}</span>
        </div>
        <button
          className="snake-mute-btn"
          onClick={() => setMute(!mute)}
          title={mute ? "Unmute Sound" : "Mute Sound"}
        >
          {mute ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Game Board Container */}
      <div className="snake-board-frame">
        <div className="snake-board-grid">
          {/* Render background grid elements */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);

            const isSnake = snake.some((seg) => seg.x === x && seg.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            let cellClass = "snake-cell-empty";
            if (isHead) {
              cellClass = "snake-cell-head";
            } else if (isSnake) {
              cellClass = "snake-cell-body";
            } else if (isFood) {
              cellClass = "snake-cell-food";
            }

            return <div key={i} className={`snake-grid-cell ${cellClass}`} />;
          })}
        </div>

        {/* Overlay screens */}
        {isGameOver && (
          <div className="snake-overlay-screen game-over-overlay">
            <h2 className="snake-overlay-title text-blink">GAME OVER</h2>
            <p className="snake-overlay-sub">SCORE: {score}</p>
            <button className="btn btn-primary neo-btn snake-action-btn" onClick={resetGame}>
              <RotateCcw size={16} />
              <span>INSERT COIN</span>
            </button>
          </div>
        )}

        {!hasStarted && isPaused && !isGameOver && (
          <div className="snake-overlay-screen start-overlay">
            <h2 className="snake-overlay-title">SNAKE.EXE</h2>
            <p className="snake-overlay-sub">CHIP-8 ARCADE CLASSIC</p>
            <button
              className="btn btn-primary neo-btn snake-action-btn"
              onClick={() => {
                setIsPaused(false);
                setHasStarted(true);
              }}
            >
              <Play size={16} />
              <span>START GAME</span>
            </button>
          </div>
        )}

        {hasStarted && isPaused && !isGameOver && (
          <div className="snake-overlay-screen pause-overlay">
            <h2 className="snake-overlay-title">PAUSED</h2>
            <p className="snake-overlay-sub">PRESS SPACE OR CLICK RESUME</p>
            <button
              className="btn btn-primary neo-btn snake-action-btn"
              onClick={() => setIsPaused(false)}
            >
              <Play size={16} />
              <span>RESUME</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Panel: Start/Pause + Virtual D-pad */}
      <div className="snake-controller-section">
        <div className="snake-menu-controls">
          {hasStarted && !isGameOver && (
            <button
              className="btn btn-secondary neo-btn snake-menu-btn"
              onClick={() => setIsPaused((p) => !p)}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              <span>{isPaused ? "RESUME" : "PAUSE"}</span>
            </button>
          )}
          <button className="btn btn-secondary neo-btn snake-menu-btn" onClick={resetGame}>
            <RotateCcw size={14} />
            <span>RESTART</span>
          </button>
        </div>

        {/* Retro Gamepad D-pad */}
        <div className="snake-dpad-container">
          <div className="dpad-row">
            <button
              className="dpad-btn dpad-up"
              onClick={() => changeDirection({ x: 0, y: -1 })}
              aria-label="Move Up"
            >
              ▲
            </button>
          </div>
          <div className="dpad-row">
            <button
              className="dpad-btn dpad-left"
              onClick={() => changeDirection({ x: -1, y: 0 })}
              aria-label="Move Left"
            >
              ◀
            </button>
            <div className="dpad-center" />
            <button
              className="dpad-btn dpad-right"
              onClick={() => changeDirection({ x: 1, y: 0 })}
              aria-label="Move Right"
            >
              ▶
            </button>
          </div>
          <div className="dpad-row">
            <button
              className="dpad-btn dpad-down"
              onClick={() => changeDirection({ x: 0, y: 1 })}
              aria-label="Move Down"
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
