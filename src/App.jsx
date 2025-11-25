import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { ChatbotProvider } from "./context/ChatbotContext";
import { AudioProvider } from "./context/AudioContext";
import { VideoTutorialProvider } from "./context/VideoTutorialContext";
import AIChatbot from "./components/AIChatbot";
import AudioControl from "./components/AudioControl";
import VideoTutorialModal from "./components/VideoTutorialModal";
import AudioDelayWrapper from "./components/AudioDelayWrapper";

function App() {
  return (
    <VideoTutorialProvider>
      <AudioProvider>
        <ChatbotProvider>
          <BrowserRouter>
            <VideoTutorialModal />
            <AudioDelayWrapper />
            <AIChatbot />
            <AudioControl />
            <AppRouter />
          </BrowserRouter>
        </ChatbotProvider>
      </AudioProvider>
    </VideoTutorialProvider>
  );
}

export default App;
