// Question data for ClassifyWordsModal
// Questions that require classifying words into categories

export const classifyWordsQuestions = {
  // Question 2: Cao Bằng
  2: {
    id: 2,
    title: "Cao Bằng",
    prompt: "Xếp loại các từ được đánh số trong đoạn văn sau",
    question:
      "<p>Đến Cao Bằng, về các bản làng, nhất là dịp mùa xuân <u>(1)</u>, ngày hội, ngày chợ phiên, du khách sẽ không khỏi <u>ngỡ ngàng</u> <u>(2)</u> và <u>thích thú</u> <u>(3)</u> khi được hòa vào <u>vườn hoa</u> <u>(4)</u> đầy màu sắc. Các <u>trang phục</u> <u>(5)</u> của người Cao Bằng phổ biến nhất là sắc chàm, <u>tự dệt</u> <u>(6)</u>, <u>tự nhuộm</u> <u>(7)</u>, nhưng đa sắc màu nhất lại là của người Dao, người Mông.</p><p style='margin-top: 16px; font-weight: 600; color: #404040;'>Nhập số vào dúng loại từ</p>",
    categories: ["Tính từ", "Danh từ", "Động từ"],
    correctAnswers: {
      category1: "2, 3, 5",
      category2: "1, 4",
      category3: "6, 7",
    },
  },
};

export function getClassifyWordsQuestion(id) {
  const n = Number(id);
  return classifyWordsQuestions[n] || null;
}
