// Sample questions for Hope Hat (Nón lá hi vọng) modals
// Content matches exactly with Figma designs

import hopehatChallengeImage from "../../assets/hopehat_challenge.png";
import haLongImage from "../../assets/hope_hat/ha_long.png";
import hoiAnImage from "../../assets/hope_hat/hoi_an.png";
import thanhNhaHoImage from "../../assets/hope_hat/thanh_nha_ho.png";
import banhChungImage from "../../assets/hope_hat/banh_chung-152fc4.png";

// Questions for HopeHatChallengeModal (star rating performance challenges)
export const hopeHatChallengeQuestions = [
  {
    id: "hope-challenge-1",
    type: "challenge",
    prompt: "Học bài vè sau trong 2 phút và đọc lại cho đội giám khảo nghe",
    question: `Con gà cục tác lá chanh
Con lợn ủn ỉn mua hành cho tôi
Con chó khóc đứng khóc ngồi
Bà ơi đi chợ mua tôi đồng riềng

(Nguyễn Dư)`,
    image: hopehatChallengeImage,
  },
];

// Questions for HopeHatArrangeModal - uses MatchPairsModal (image-text matching with drag-drop)
export const hopeHatArrangeQuestions = [
  {
    id: "hope-arrange-1",
    type: "arrange",
    prompt:
      "Nối tên và hình ảnh các di sản thế giới được UNESCO công nhận tại Việt Nam",
    question: "Kéo thả từ theo đúng thứ tự hình bên trái",
    leftItems: [
      { label: "Vịnh Hạ Long", image: haLongImage },
      { label: "Phố cổ Hội An", image: hoiAnImage },
      { label: "Thành nhà Hồ", image: thanhNhaHoImage },
    ],
    pairs: [
      { answer: "VỊNH HẠ LONG" },
      { answer: "PHỐ CỔ HỘI AN" },
      { answer: "THÀNH NHÀ HỒ" },
    ],
    correctOrder: ["VỊNH HẠ LONG", "PHỐ CỔ HỘI AN", "THÀNH NHÀ HỒ"],
  },
];

// Questions for HopeHatTypeInModal (text input riddles)
export const hopeHatTypeInQuestions = [
  {
    id: "hope-typein-1",
    type: "typein",
    prompt: "Đây là loại bánh gì?",
    question: `Mặt thì vuông vức chữ điền
Bụng no đậu đỗ lại nghiền thịt heo
Hùng Vương xưa chấm Lang Liêu
Cũng vì tấm bánh quý yêu phân trần`,
    correctAnswer: "bánh chưng",
    image: banhChungImage,
  },
];

// Function to get a random Hope Hat question (returns one of 3 types randomly)
export function getRandomHopeHatQuestion() {
  const allQuestions = [
    ...hopeHatChallengeQuestions.map((q) => ({
      ...q,
      modalType: "HopeHatChallengeModal",
    })),
    ...hopeHatArrangeQuestions.map((q) => ({
      ...q,
      modalType: "MatchPairsModal",
    })),
    ...hopeHatTypeInQuestions.map((q) => ({
      ...q,
      modalType: "EnterTextAsAnswerModal",
    })),
  ];

  const randomIndex = Math.floor(Math.random() * allQuestions.length);
  return allQuestions[randomIndex];
}

// Function to get a random question by modal type
export function getRandomHopeHatQuestionByType(modalType) {
  let questions;
  switch (modalType) {
    case "HopeHatChallengeModal":
      questions = hopeHatChallengeQuestions;
      break;
    case "MatchPairsModal":
      questions = hopeHatArrangeQuestions;
      break;
    case "EnterTextAsAnswerModal":
      questions = hopeHatTypeInQuestions;
      break;
    default:
      questions = hopeHatChallengeQuestions;
  }

  const randomIndex = Math.floor(Math.random() * questions.length);
  return { ...questions[randomIndex], modalType };
}

// Function to get a random modal type
export function getRandomHopeHatModalType() {
  const modalTypes = [
    "HopeHatChallengeModal",
    "MatchPairsModal",
    "EnterTextAsAnswerModal",
  ];
  const randomIndex = Math.floor(Math.random() * modalTypes.length);
  return modalTypes[randomIndex];
}
