// Question data for PerformanceChallengeModal
// Images imported for proper Vite asset handling
import dongThapchallengeImage from "../../assets/dong_thap.png";

export const performanceChallengeQuestions = {
  // Question 30: Đồng Tháp - Poetry Performance Challenge
  30: {
    id: 30,
    title: "Đồng Tháp",
    prompt: `Tháp Mười đẹp nhứt bông sen
Việt Nam đẹp nhứt có tên Cụ Hồ
Bông sen dành để lễ chùa
Cụ Hồ mãi mãi tôn thờ trong tâm

(Nguyên gốc - Nhà thơ Bảo Định Giang)`,
    image: dongThapchallengeImage,
    instructions:
      "Hãy đọc thuộc bài thơ và đọc lại bài thơ trên cho đội giám khảo nghe, trong tư thế khép tay trước ngực (tạo dáng nụ sen)",
    maxRating: 3,
  },
};

export function getPerformanceChallengeQuestion(id) {
  const n = Number(id);
  return performanceChallengeQuestions[n] || null;
}

export default performanceChallengeQuestions;
