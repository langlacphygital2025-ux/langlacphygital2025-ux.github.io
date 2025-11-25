import videoUrl from "../../assets/video_quiz_and_four_image_option/trangphucnguoitay.mp4";
import thaiImage from "../../assets/video_quiz_and_four_image_option/thai.png";
import nungImage from "../../assets/video_quiz_and_four_image_option/nung.png";
import tayImage from "../../assets/video_quiz_and_four_image_option/tay.png";
import banaImage from "../../assets/video_quiz_and_four_image_option/bana.png";

export const vidQuizAndFourImageQuestions = [
  {
    id: 11,
    title: "Quảng Ninh",
    question:
      "Hãy xem đoạn video sau và cho biết trang phục truyền thống mà người dân mặc thuộc về dân tộc nào?",
    video: videoUrl,
    choices: [
      { text: "Người Thái", image: thaiImage },
      { text: "Người Nùng", image: nungImage },
      { text: "Người Tày", image: tayImage },
      { text: "Người Bana", image: banaImage },
    ],
    correctIndex: 2, // Người Tày
  },
];
