// Question data for ListenToSoundPickRightAnswerModal
// Audio imported for proper Vite asset handling
import haTinhAudio from "../../assets/listen_to_sound_and_pick/baithotiengquang_1.mp3";

export const listenToSoundQuestions = {
  // Question 18: Hà Tĩnh
  18: {
    id: 18,
    title: "Hà Tĩnh",
    prompt: "Nghe đoạn âm thanh sau và trả lời câu hỏi",
    question: "Cá quả được người Hà Tĩnh gọi là?",
    audio: haTinhAudio,
    choices: ["Cá lóc", "Cá chuối", "Cá tràu", "Cá đô"],
    correctIndex: 2, // "Cá đô" ✅
  },
};
