// Question data for DoTheChallengeModal
// Videos imported for proper Vite asset handling
import sonLaVideo from "../../assets/do_the_challenge/dieumuaxoethai.mp4";

// Images for question 21 - Downloaded from Figma design
import mysonImage from "../../assets/do_the_challenge_with_image/my_son.png";
import hoianImage from "../../assets/do_the_challenge_with_image/hoi_an.png";
import culaochamImage from "../../assets/do_the_challenge_with_image/cu_lao_cham.png";

export const doChallengeQuestions = {
  // Question 8: Sơn La
  8: {
    id: 8,
    title: "Sơn La",
    prompt: "Xem video và tái hiện",
    question:
      "Xem video và tái hiện điệu múa xòe Thái của truyền thống văn hóa Sơn La trong video",
    video: sonLaVideo,
  },

  // Question 21: TP. Đà Nẵng (Quảng Nam)
  21: {
    id: 21,
    title: "TP. Đà Nẵng",
    prompt: "Thử thách chụp ảnh cùng di sản văn hóa thế giới tại TP. Đà Nẵng",
    question:
      "Đội thực hiện thử thách sẽ đóng vai khách du lịch đến Quảng Nam (Thuộc TP. Đà Nẵng). Đội còn lại đọc tên một địa điểm, các bạn tạo dáng mô phỏng địa điểm",
    images: [
      {
        id: 1,
        title: "Khu đền tháp Mỹ Sơn",
        image: mysonImage,
        pose: "đứng thẳng, chắp tay cao qua đầu tạo dáng như tháp Chăm.",
      },
      {
        id: 2,
        title: "Phố cổ Hội An",
        image: hoianImage,
        pose: "vòng tay tròn lên đầu, tạo dáng chiếc đèn lồng.",
      },
      {
        id: 3,
        title: "Đảo Cù Lao Chàm",
        image: culaochamImage,
        pose: "giả vờ bơi 5 giây như đang ra đảo",
      },
    ],
  },
};
