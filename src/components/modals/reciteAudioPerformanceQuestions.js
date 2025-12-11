// Question data for ReciteAudioPerformanceModal
// Audio imported for proper Vite asset handling
import quangTriAudio from "../../assets/hatruquangtri_1.mp3";

export const reciteAudioPerformanceQuestions = {
  // Question 19: Quảng Trị - Lullaby recitation performance
  19: {
    id: 19,
    audio: quangTriAudio,
    instructions:
      "Nghe khúc ru ở tỉnh Quảng Trị và hát lại theo đúng âm điệu trong đoạn âm thanh sau",
    lyrics: `À ơi
Ru con, con théc cho muồi (1)
Chớ để mẹ đi chợ mua vôi ăn trầu
Mua vôi chợ Quán, chợ Cầu
Mua cau Đơn Duệ(2), mua trầu chợ Dơn(3)
À ơi...`,
    explanation: `Giải nghĩa từ

(1) " théc cho muồi " là giấc ngủ sâu say sưa, nhìn em bé mềm mại

Có thể bạn chưa biết

(2)Đơn Duệ tên riêng làng cau ngon nổi tiếng

(3)Dơn là chợ bán trầu nổi tiếng đủ loại têm cánh Phượng hoặc không`,
  },
};

export function getReciteAudioPerformanceQuestion(id) {
  const n = Number(id);
  return reciteAudioPerformanceQuestions[n] || null;
}

export default reciteAudioPerformanceQuestions;
