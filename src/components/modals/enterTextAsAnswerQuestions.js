// Question data for EnterTextAsAnswerModal
// Questions that require text-based answers

export const enterTextAsAnswerQuestions = {
  // Question 4: Lào Cai
  4: {
    id: 4,
    title: "Lào Cai",
    prompt: "Đọc đoạn văn dưới đây",
    question:
      "<p><strong>_ào _ai</strong> sở hữu Sa Pa – một trong những thị trấn du lịch nổi tiếng nhất Việt Nam, duy nhất lọt top 16 thị trấn đẹp nhất thế giới do tạp chí Time Out (Anh) bình chọn.</p><p style='margin-top: 16px; font-weight: 600; color: #404040;'>Điền tên tỉnh thành khuyết chữ cái trong đoạn văn trên</p>",
    correctAnswer: "Lào Cai",
  },

  // Question 15: Ninh Bình
  15: {
    id: 15,
    title: "Ninh Bình",
    prompt: "Đọc đoạn trích sau",
    question:
      "<p>Tỉnh Ninh Bình có thành phố <strong>____</strong>, nằm ở trung tâm tỉnh và là nơi nối liền đồng bằng sông Hồng với nhiều vùng khác của miền Bắc Việt Nam.</p><p style='margin-top: 16px; font-weight: 600; color: #404040;'>Sắp xếp cụm từ sau để có tên chính xác:</p><p style='font-size: 20px; letter-spacing: 12px; font-weight: 700; color: #404040; margin-top: 12px;'>O H A Ư L</p>",
    correctAnswer: "HOA LƯ",
  },

  // Question 27: Đồng Nai
  27: {
    id: 27,
    title: "Đồng Nai",
    prompt: "Điền câu trả lời",
    question:
      "<p><strong>THỬ THÁCH</strong></p><p style='margin-top: 12px;'>Loại trái cây nào nổi tiếng của tỉnh Đồng Nai có tên gọi là hai chữ lặp lại bắt đầu bằng chữ C?</p>",
    correctAnswer: "Cacao",
  },

  // Question 34: Cà Mau
  34: {
    id: 34,
    title: "Cà Mau",
    prompt: "Điền câu trả lời",
    question:
      "<p><strong>THỬ THÁCH</strong></p><p style='margin-top: 12px;'>Ở Cà Mau có vườn quốc gia dự trữ sinh quyển của thế giới được UNESCO công nhận với tên gọi đọc ngược là <strong>Ha Minh Ụ</strong>. Tên gọi của vườn quốc gia đó là?</p>",
    correctAnswer: "Ụ Minh Hạ",
  },
};

export function getEnterTextAsAnswerQuestion(id) {
  const n = Number(id);
  return enterTextAsAnswerQuestions[n] || null;
}
