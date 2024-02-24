import "./Timer.css";
import "./Timer.css";
import { useState, useRef, useEffect } from "react";
import finishedSession from "./audio/wobble-synth-keys-wet-dynamic-loop_130bpm_A_minor.wav";

function Timer() {
	const SESSION = "Session";
	const BREAK = "Break";
	const START = "Start";
	const STOP = "Stop";

	const [state, setState] = useState({
		session: 25,
		sessionLength: 25,
		break: 5,
		breakLength: 5,
		timerRunning: false,
		seconds: 0,
		mode: SESSION
	});

	const startBtn = useRef(null);
	const audioRef = useRef("");
	let firstClick = useRef(true);

	const intervalRef = useRef(0);

	useEffect(() => {
		// useEffect runs on every render when a state changes
		if (startBtn.current) {
			startBtn.current.addEventListener("click", () => {
				setState(state => {
					if (firstClick.current && !state.timerRunning) {
						intervalRef.current = setInterval(decrementSeconds, 1000);
						firstClick.current = false;
						return Object.assign({}, state, { timerRunning: !state.timerRunning });
					}

					if (state.timerRunning) {
						clearInterval(intervalRef.current);
						firstClick.current = true;
					} else {
						intervalRef.current = setInterval(decrementSeconds, 1000);
					}
					return Object.assign({}, state, { timerRunning: !state.timerRunning });
				});
			});
		}
	}, []);

	function decrementSeconds() {
		setState(state => {
			switch (state.mode) {
				case SESSION:
					if (state.seconds <= 0) {
						decrementSession();
						return Object.assign({}, state, { seconds: 59 });
					}
					break;
				case BREAK:
					if (state.seconds <= 0) {
						decrementBreak();
						return Object.assign({}.state, { seconds: 59 });
					}
					break;
				default:
					break;
			}
			return Object.assign({}, state, { seconds: state.seconds - 1 });
		});
	}
	function decrementSession() {
		if (state.session <= 0) {
			audioRef.current.play();
			setState(state => Object.assign({}, state, { mode: BREAK, session: state.sessionLength }));
			return;
		}
		setState(state => Object.assign({}, state, { session: state.session - 1 }));
	}

	function decrementBreak() {
		if (state.break <= 0) {
			setState(state => Object.assign({}, state, { mode: SESSION, break: state.breakLength }));
			return;
		}
		setState(state => Object.assign({}, state, { break: state.break - 1 }));
	}
	function increaseBreakLength() {
		setState(state => {
			if (state.breakLength >= 60) {
				return Object.assign({}, state, { breakLength: 60 });
			}
			return Object.assign({}, state, { breakLength: state.breakLength + 1, break: state.break + 1 });
		});
	}
	function decreaseBreakLength() {
		setState(state => {
			if (state.breakLength <= 0) {
				return Object.assign({}, state, { breakLength: 0 });
			}
			return Object.assign({}, state, { breakLength: state.breakLength - 1, break: state.break - 1 });
		});
	}

	function increaseSessionLength() {
		setState(state => {
			if (state.sessionLength >= 60) {
				return Object.assign({}, state, { sessionLength: 60 });
			}
			return Object.assign({}, state, { sessionLength: state.sessionLength + 1, session: state.session + 1 });
		});
	}
	function decreaseSessionLength() {
		setState(state => {
			if (state.sessionLength <= 0) {
				return Object.assign({}, state, { sessionLength: 0 });
			}
			return Object.assign({}, state, { sessionLength: state.sessionLength - 1, session: state.session - 1 });
		});
	}

	function reset() {
		setState(state =>
			Object.assign({}, state, {
				session: state.sessionLength,
				break: state.breakLength,
				seconds: 0,
				timerRunning: false
			})
		);
		firstClick.current = true;
		clearInterval(intervalRef.current);
	}

	return (
		<div className="Timer">
			<h1>Timer</h1>
			<div className="labels">
				<div className="break-labels">
					<p id="break-label">Break Length</p>
					<button id="break-increment" onClick={increaseBreakLength}>
						<i className="fa-solid fa-arrow-up"></i>
					</button>
					<p id="break-length">{state.breakLength}</p>
					<button id="break-decrement" onClick={decreaseBreakLength}>
						<i className="fa-solid fa-arrow-down"></i>
					</button>
				</div>
				<div className="session-labels">
					<p id="session-label">Session Length</p>
					<button id="session-increment" onClick={increaseSessionLength}>
						<i className="fa-solid fa-arrow-up"></i>
					</button>
					<p id="break-length">{state.sessionLength}</p>
					<button id="session-decrement" onClick={decreaseSessionLength}>
						<i className="fa-solid fa-arrow-down"></i>
					</button>
				</div>
			</div>

			<div className="timer">
				<p id="timer-label">{state.mode === SESSION ? "Session has begun" : "Break Time"}</p>
				<h1 id="timer-left">{state.mode === SESSION ? state.session + " : " + state.seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 }) : state.break + " : " + state.seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 })}</h1>
			</div>

			<div className="buttons">
				<button id="start_stop" ref={startBtn}>
					{state.timerRunning ? STOP : START}
				</button>

				<button id="reset" onClick={reset}>
					Reset
				</button>
			</div>
			<audio src={finishedSession} hidden ref={audioRef}></audio>
		</div>
	);
}

export default Timer;
