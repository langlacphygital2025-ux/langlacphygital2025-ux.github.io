import haGiang from "../../assets/memorize_in_limited_time/ha_giang.png";
import hoChiMinh from "../../assets/memorize_in_limited_time/hochiminh.png";
import leHongPhong from "../../assets/memorize_in_limited_time/lehongphong.png";
import phanBoiChau from "../../assets/memorize_in_limited_time/phanboichau.png";
import phanDinhPhung from "../../assets/memorize_in_limited_time/phandinhphung.png";
import mysteryFrame from "../../assets/memorize_in_limited_time/mystery_question_frame.png";

export const memorizeInLimitedTimeQuestions = {
  // Question 1: Tuyên Quang (Quiz-based)
  1: {
    id: 1,
    title: "Tuyên Quang",
    type: "quiz", // quiz or dragdrop
    mysteryFrame: mysteryFrame,
    memorizationTime: 10, // seconds
    prompt:
      "Đội thực hiện thử thách có 10 giây để nhớ tên của các món ẩm thực đặc trưng mang mạch nguồn văn hóa đồng bào các dân tộc thiểu số trên địa bàn tỉnh Hà Giang, nay thuộc tỉnh Tuyên Quang mới:",
    memorizationContent: {
      image: haGiang,
      items: [
        "Thắng cố",
        "mèn mén",
        "xôi ngũ sắc",
        "thịt treo",
        "lợn cắp nách",
        "chè Shan tuyết cổ thụ",
      ],
      displayName: "THẮNG CỐ",
    },
    question: "Đâu KHÔNG PHẢI là món ẩm thực đặc trưng của Hà Giang?",
    choices: ["Thắng cố", "Thịt treo", "Lẩu gà lá é", "Lợn cắp nách"],
    correctIndex: 2, // "Lẩu gà lá é"
  },

  // Question 17: Nghệ An (Drag-drop based)
  17: {
    id: 17,
    title: "Nghệ An",
    type: "dragdrop", // quiz or dragdrop
    mysteryFrame: mysteryFrame,
    memorizationTime: 15, // seconds
    prompt:
      'Người chơi có 15s để nhớ ảnh của các danh nhân ở vùng "địa linh nhân kiệt - Tỉnh Nghệ An" sau:',
    memorizationContent: {
      items: [
        { name: "Chủ tịch Hồ Chí Minh", image: hoChiMinh },
        { name: "Phan Bội Châu", image: phanBoiChau },
        { name: "Phan Đình Phùng", image: phanDinhPhung },
        { name: "Lê Hồng Phong", image: leHongPhong },
      ],
    },
    question: "Hãy nối ảnh và tên của các danh nhân:",
    leftItems: [
      { image: hoChiMinh, label: "Hồ Chí Minh" },
      { image: phanBoiChau, label: "Phan Bội Châu" },
      { image: phanDinhPhung, label: "Phan Đình Phùng" },
      { image: leHongPhong, label: "Lê Hồng Phong" },
    ],
    pairs: [
      { answer: "HỒ CHÍ MINH", id: 1 },
      { answer: "PHAN BỘI CHÂU", id: 2 },
      { answer: "PHAN ĐÌNH PHÙNG", id: 3 },
      { answer: "LÊ HỒNG PHONG", id: 4 },
    ],
    correctOrder: [
      "HỒ CHÍ MINH",
      "PHAN BỘI CHÂU",
      "PHAN ĐÌNH PHÙNG",
      "LÊ HỒNG PHONG",
    ],
  },
};

export function getMemorizeInLimitedTimeQuestion(id) {
  const n = Number(id);
  return memorizeInLimitedTimeQuestions[n] || null;
}
