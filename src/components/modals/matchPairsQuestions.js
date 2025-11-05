import banhChung from "../../assets/match_pair/thai_nguyen/banh_chung.png";
import nemChua from "../../assets/match_pair/thai_nguyen/nem_chua.png";
import traMocCau from "../../assets/match_pair/thai_nguyen/tra_moc_cau.png";
import hoaBan from "../../assets/match_pair/dien_bien/hoa_ban.png";
import hoaDao from "../../assets/match_pair/dien_bien/hoa_dao.png";
import hoaPhuong from "../../assets/match_pair/dien_bien/hoa_phuong.png";

export const matchPairsQuestions = {
  // Question 5: Thái Nguyên
  5: {
    id: 5,
    title: "Thái Nguyên",
    prompt: "Nối hình và tên gọi của các đặc sản tỉnh Thái Nguyên",
    question: "",
    leftItems: [
      { image: banhChung, label: "Bánh Chưng" },
      { image: traMocCau, label: "Trà Móc Câu" },
      { image: nemChua, label: "Nem chua" },
    ],
    pairs: [
      { answer: "Bờ Đậu", id: 1 },
      { answer: "Thái Nguyên", id: 2 },
      { answer: "Đại Từ", id: 3 },
    ],
    correctOrder: ["Bờ Đậu", "Thái Nguyên", "Đại Từ"],
  },

  // Question 6: Điện Biên
  6: {
    id: 6,
    title: "Điện Biên",
    prompt: "Nối tên gọi và màu sắc của các loài hoa cảnh quan tại Điện Biên",
    question:
      "Vào mùa xuân, nhiều du khách chọn đến Điện Biên để du lịch, khi thời tiết dễ chịu, không mưa, nhiều loài hoa nở rộ tô điểm cảnh quan.",
    leftItems: [
      { image: hoaDao, label: "Hoa đào" },
      { image: hoaBan, label: "Hoa ban" },
      { image: hoaPhuong, label: "Hoa phượng" },
    ],
    pairs: [
      { answer: "Màu hồng", id: 1 },
      { answer: "Màu trắng", id: 2 },
      { answer: "Màu đỏ", id: 3 },
    ],
    correctOrder: ["Màu hồng", "Màu trắng", "Màu đỏ"],
  },
};

export function getMatchPairsQuestion(id) {
  const n = Number(id);
  return matchPairsQuestions[n] || null;
}
