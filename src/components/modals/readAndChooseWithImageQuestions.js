// Question data for ReadAndChooseAnswerWithImageModal
// Images imported for proper Vite asset handling
import dakLak24 from "../../assets/read_and_choose_image_modal/dak_lak_24.png";
import khanhHoa25 from "../../assets/read_and_choose_image_modal/khanh_hoa_25.png";
import tayNinh28 from "../../assets/read_and_choose_image_modal/tay_ninh_28.png";
import hoChiMinh29 from "../../assets/read_and_choose_image_modal/ho_chi_minh_29.png";

// Question 26: Lâm Đồng - Images for choices A, B, C, D
import lamDongA from "../../assets/lam_dong/A.png";
import lamDongB from "../../assets/lam_dong/B.png";
import lamDongC from "../../assets/lam_dong/C.png";
import lamDongD from "../../assets/lam_dong/D.png";

export const readAndChooseWithImageQuestions = {
  // Question 24: Đắk Lắk
  24: {
    id: 24,
    title: "Đắk Lắk (Phú Yên)",
    prompt: "Xem các hình ảnh về tỉnh thành và nêu cảm nghĩ",
    question:
      "Đâu là các tính từ mô tả về cảnh quan ở Phú Yên (Tỉnh Đắk Lắk mới)?",
    image: dakLak24,
    choices: [
      "Chật hẹp, oi ả",
      "Hối hả, sầm uất",
      "Hùng vĩ, bạt ngàn",
      "Cổ kính, tấp nập",
    ],
    correctIndex: 2, // "Hùng vĩ, bạt ngàn" ✅
  },

  // Question 25: Khánh Hòa
  25: {
    id: 25,
    title: "Khánh Hòa (Ninh Thuận)",
    prompt: "Xem hình ảnh và trả lời",
    question: "Đây là loại trái cây gì?",
    image: khanhHoa25,
    choices: [
      "Bưởi Phúc Trạch (Tỉnh Hà Tĩnh)",
      "Mận Hà Nội",
      "Nho xanh Ninh Thuận (Tỉnh Khánh Hòa mới)",
      "Xoài Cát Chu (Tỉnh Đồng Tháp)",
    ],
    correctIndex: 2, // "Nho xanh Ninh Thuận (Tỉnh Khánh Hòa mới)" ✅
  },

  // Question 28: Tây Ninh
  28: {
    id: 28,
    title: "Tây Ninh",
    prompt: "Xem hình ảnh núi Bà",
    question: "Ở tỉnh Tây Ninh có một ngọn núi không trắng là ngọn núi Bà___?",
    image: tayNinh28,
    choices: ["Vàng", "Cam", "Đen", "Đỏ"],
    correctIndex: 2, // "Đen" (Núi Bà Đen)
  },

  // Question 29: TP. HCM
  29: {
    id: 29,
    title: "TP. Hồ Chí Minh",
    prompt: "Về tên gọi của Thành phố Hồ Chí Minh",
    question:
      "Sau khi đất nước thống nhất, vì sao Sài Gòn được đổi tên thành Thành phố Hồ Chí Minh?",
    image: hoChiMinh29,
    choices: [
      "Chính sách thay đổi",
      "Tưởng nhớ Bác Hồ – vị lãnh tụ kính yêu của dân tộc Việt Nam",
      "Vì muốn tên thành phố dài hơn và khác biệt hơn",
      "Để dễ phân biệt với các tỉnh khác ở miền Nam",
    ],
    correctIndex: 1, // "Tưởng nhớ Bác Hồ..." ✅
  },

  // Question 26: Lâm Đồng - Image-based choices
  26: {
    id: 26,
    title: "Lâm Đồng",
    prompt:
      "Đà Lạt nằm trên cao nguyên Lâm Viên (còn gọi là cao nguyên Lang Biang) thuộc tỉnh Lâm Đồng, vùng Tây Nguyên, với độ cao trung bình 1.500 m so với mực nước biển.",
    question:
      "Các bạn nghĩ đâu không phải là hình ảnh của Đà Lạt (Thuộc tỉnh Lâm Đồng)?",
    imageChoices: [lamDongA, lamDongB, lamDongC, lamDongD],
    choiceLabels: ["A", "B", "C", "D"],
    correctIndex: 3, // Choice D (Nha Trang/Khánh Hòa) is NOT Da Lat ✅
  },
};
