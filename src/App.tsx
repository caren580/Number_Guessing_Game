import { useReducer } from "react";
import './App.css';

interface GameState {
  newGameBtnDisabled: boolean;
  inputReadOnly: boolean;
  guessBtnDisabled: boolean;
  feedback: string | null;
  numTrials: number;
  secretNumber: number | null;
  playerGuess: string;
}
type GameAction =
  | { type: "Update_Player_Guess"; payload: string }
  | { type: "New_Game" }
  | { type: "Player_Guess"; payload: string };

function generateSecretNumber(): number {
  return Math.trunc(Math.random() * 100);
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "Update_Player_Guess") {
    return {
      ...state,
      playerGuess: action.payload,
    };
  }

  if (action.type === "New_Game") {
    return {
      ...state,
      newGameBtnDisabled: true,
      inputReadOnly: false,
      guessBtnDisabled: false,
      feedback: "Secret Number Generated. Good luck guessing it!",
      numTrials: 10,
      secretNumber: generateSecretNumber(),
      playerGuess: "",
    };
  }

  if (action.type === "Player_Guess") {
    const guess = Number(action.payload);
    const numTrialsLeft = state.numTrials - 1;

    if (guess === state.secretNumber) {
      return {
        ...state,
        newGameBtnDisabled: false,
        inputReadOnly: true,
        guessBtnDisabled: true,
        feedback: `You Win! Your score is ${state.numTrials * 10}%`,
      };
    }

    if (numTrialsLeft === 0) {
      return {
        ...state,
        newGameBtnDisabled: false,
        inputReadOnly: true,
        guessBtnDisabled: true,
        feedback: `You Lost. The secret number was ${state.secretNumber}`,
        numTrials: 10,
      };
    }

    return {
      ...state,
      feedback:
        guess > (state.secretNumber ?? 0)
          ? `${guess} is too high`
          : `${guess} is too low`,
      numTrials: numTrialsLeft,
    };
  }

  return state;
}

const Game: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, {
    newGameBtnDisabled: false,
    inputReadOnly: true,
    guessBtnDisabled: true,
    feedback: null,
    numTrials: 0,
    secretNumber: null,
    playerGuess: "",
  });

  return (
    <div className="num-game-container">
      <header className="num-game-header">
        <h2 className="num-game-title">
          GUESS A NUMBER BETWEEN 0 AND 100
        </h2>
        <button
          disabled={state.newGameBtnDisabled}
          onClick={() => dispatch({ type: "New_Game" })}
        >
          NEW GAME
        </button>
      </header>

      <form
        className="num-game-form"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "Player_Guess", payload: state.playerGuess });
        }}
      >
        <h2 className="num-game-trials">
          {state.numTrials} TRIALS REMAINING
        </h2>

        <input
          type="number"
          placeholder="00"
          value={state.playerGuess}
          onChange={(e) =>
            dispatch({
              type: "Update_Player_Guess",
              payload: e.target.value,
            })
          }
          readOnly={state.inputReadOnly}
        />

        <h2 className="num-game-feedback">{state.feedback}</h2>

        <button disabled={state.guessBtnDisabled}>GUESS</button>
      </form>
    </div>
  );
};

export default Game;
