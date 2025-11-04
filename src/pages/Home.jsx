import { useState } from "react";
import "./Home.css";
import backgroundPattern from "../assets/background-pattern.png";
import radialBlur from "../assets/radial-blur.png";
import dragonIllustration from "../assets/dragon-illustration.png";
import logo from "../assets/logo-438b93.png";
import BottomSheet from "../components/BottomSheet";
import GamePlayModal from "../components/GamePlayModal";
import { GameProvider, useGame } from "../components/GameProvider";
import * as Modals from "../components/modals";
import { getReadAndChooseQuestion } from "../components/modals/readAndChooseQuestions";
import { readAndChooseWithImageQuestions } from "../components/modals/readAndChooseWithImageQuestions";
import { watchVideoAndChooseQuestions } from "../components/modals/watchVideoAndChooseQuestions";
import { listenToSoundQuestions } from "../components/modals/listenToSoundQuestions";
import { doChallengeQuestions } from "../components/modals/doChallengeQuestions";
import { getEnterTextAsAnswerQuestion } from "../components/modals/enterTextAsAnswerQuestions";

function HomeInner() {
  const { teamScores, currentTeam, answerQuestion, setCurrentTeam } = useGame();

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [currentTeamState, setCurrentTeamState] = useState({
    teamNames: {},
    currentTeam: "team1",
  });
  const [bottomSheetSelectedTeam, setBottomSheetSelectedTeam] =
    useState("team1");

  const [questionOpen, setQuestionOpen] = useState(false);
  const [activeModalKey, setActiveModalKey] = useState(null);
  const [activeQuestionData, setActiveQuestionData] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [failureOpen, setFailureOpen] = useState(false);
  const [resultInfo, setResultInfo] = useState({ added: 0, total: 0 });

  // mapping 1..9 to modal keys
  const mapping = [
    "ReadAndChooseModal",
    "ReadAndChooseAnswerWithImageModal",
    "PickRightAnswerWithPicturesModal",
    "WatchVideoAndChooseRightAnswerModal",
    "ListenToSoundPickRightAnswerModal",
    "MemorizeInLimitedTimeAndChooseAnswerModal",
    "TypeInAnswerModal",
    "DoTheChallengeModal",
    "MatchPairsModal",
  ];

  const handleStartClick = () => {
    setBottomSheetOpen(true);
  };

  const handleOpenGameModal = ({ teamNames, currentTeam }) => {
    // parent handler called after BottomSheet fade-out
    setCurrentTeamState({ teamNames, currentTeam });
    // sync provider current team so turns are tracked centrally
    if (setCurrentTeam) setCurrentTeam(currentTeam);
    setGameModalOpen(true);
  };

  const handleCloseGameModal = () => {
    setGameModalOpen(false);
  };

  function handleSubmitNumber(val) {
    const n = parseInt(val, 10);

    // first check if this number corresponds to a WatchVideoAndChooseRightAnswerModal question
    const videoQ = watchVideoAndChooseQuestions[n];
    if (videoQ) {
      setActiveModalKey("WatchVideoAndChooseRightAnswerModal");
      setActiveQuestionData(videoQ);
      setGameModalOpen(false);
      setQuestionOpen(true);
      return;
    }

    // then check if this number corresponds to a ListenToSoundPickRightAnswerModal question
    const soundQ = listenToSoundQuestions[n];
    if (soundQ) {
      setActiveModalKey("ListenToSoundPickRightAnswerModal");
      setActiveQuestionData(soundQ);
      setGameModalOpen(false);
      setQuestionOpen(true);
      return;
    }

    // then check if this number corresponds to a DoTheChallengeModal question
    const doQ = doChallengeQuestions[n];
    if (doQ) {
      setActiveModalKey("DoTheChallengeModal");
      setActiveQuestionData(doQ);
      setGameModalOpen(false);
      setQuestionOpen(true);
      return;
    }

    // then check if this number corresponds to an EnterTextAsAnswerModal question
    const textQ = getEnterTextAsAnswerQuestion(n);
    if (textQ) {
      setActiveModalKey("EnterTextAsAnswerModal");
      setActiveQuestionData(textQ);
      setGameModalOpen(false);
      setQuestionOpen(true);
      return;
    }

    // then check if this number corresponds to a ReadAndChooseAnswerWithImageModal question
    const imageQ = readAndChooseWithImageQuestions[n];
    if (imageQ) {
      setActiveModalKey("ReadAndChooseAnswerWithImageModal");
      setActiveQuestionData(imageQ);
      setGameModalOpen(false);
      setQuestionOpen(true);
      return;
    }

    // then check if this number corresponds to a ReadAndChoose question
    const readQ = getReadAndChooseQuestion(n);
    if (readQ) {
      setActiveModalKey("ReadAndChooseModal");
      setActiveQuestionData(readQ);
      setGameModalOpen(false);
      setQuestionOpen(true);
      return;
    }

    const idx = isNaN(n) ? 0 : Math.max(0, Math.min(8, n - 1));
    const key = mapping[idx];
    setActiveModalKey(key);
    setActiveQuestionData(null);
    setGameModalOpen(false);
    setQuestionOpen(true);
  }

  function handleQuestionResult(result, extraData = {}) {
    // calculate totals based on current known scores so modal can display the updated value
    const prev = teamScores[currentTeam] || 0;
    let newTotal = prev;
    let added = 0;

    if (result === "success") {
      // if extraData contains points (from DoTheChallengeModal), use those
      if (extraData.points !== undefined) {
        added = extraData.points;
        newTotal = prev + added;
      } else {
        added = 1;
        newTotal = prev + 1;
      }
    } else if (result === "failure") {
      added = -3;
      newTotal = Math.max(0, prev - 3);
    }

    // update central state
    answerQuestion(result);

    // hide question modal and show appropriate feedback modal
    setQuestionOpen(false);
    setResultInfo({ added, total: newTotal });
    if (result === "success") setSuccessOpen(true);
    else setFailureOpen(true);
  }

  const ActiveModal = activeModalKey ? Modals[activeModalKey] : null;

  return (
    <div
      className={`home-page ${bottomSheetOpen ? "bottom-sheet-open" : ""} ${
        gameModalOpen || questionOpen ? "game-modal-open" : ""
      } ${successOpen || failureOpen ? "feedback-open" : ""}`}
    >
      <div className="hero-container">
        <div className="background-effects">
          <img src={radialBlur} alt="" className="radial-blur" />
          <div className="glow-circle"></div>
        </div>

        <div className="header-content">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="welcome-text">CHÀO MỪNG ĐẾN VỚI</h1>
        </div>

        {/* turn indicator shown when gameplay or question modal open */}
        {(gameModalOpen || questionOpen) && !successOpen && !failureOpen && (
          <div className="turn-indicator">
            <div className="turn-text">Lượt chơi của</div>
            <div className="turn-team">
              {currentTeamState.teamNames &&
              currentTeamState.teamNames[currentTeam]
                ? currentTeamState.teamNames[currentTeam]
                : currentTeam === "team1"
                ? "ĐỘI 1"
                : "ĐỘI 2"}
            </div>
          </div>
        )}

        <p className="subtitle-text">Trò chơi tương tác công nghệ</p>

        <div className="main-illustration">
          <img
            src={dragonIllustration}
            alt="Con Rồng Châu Tiên"
            className="dragon-text-image"
          />
        </div>

        <button className="start-button" onClick={handleStartClick}>
          Bắt đầu
        </button>

        <div className="bottom-decoration">
          <img src={backgroundPattern} alt="" className="background-pattern" />
        </div>
      </div>

      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        onStartGame={handleOpenGameModal}
        onTeamChange={(team) => setBottomSheetSelectedTeam(team)}
      />

      <GamePlayModal
        isOpen={gameModalOpen}
        onClose={handleCloseGameModal}
        currentTeamName={currentTeamState.teamNames?.[currentTeam]}
        onSubmit={handleSubmitNumber}
      />

      {ActiveModal && (
        <ActiveModal
          isOpen={questionOpen}
          onClose={() => setQuestionOpen(false)}
          onResult={handleQuestionResult}
          questionData={activeQuestionData}
        />
      )}

      <Modals.SuccessModal
        isOpen={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          // reopen gameplay modal for next team
          setTimeout(() => setGameModalOpen(true), 320);
        }}
        teamName={currentTeamState.teamNames?.[currentTeam]}
        addedPoints={resultInfo.added > 0 ? resultInfo.added : 0}
        totalPoints={resultInfo.total}
      />

      <Modals.FailedModal
        isOpen={failureOpen}
        onClose={() => {
          setFailureOpen(false);
          setTimeout(() => setGameModalOpen(true), 320);
        }}
        teamName={currentTeamState.teamNames?.[currentTeam]}
        totalPoints={resultInfo.total}
      />
    </div>
  );
}

function Home() {
  return (
    <GameProvider>
      <HomeInner />
    </GameProvider>
  );
}

export default Home;
