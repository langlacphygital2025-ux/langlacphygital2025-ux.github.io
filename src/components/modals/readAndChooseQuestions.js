// Mapping of ReadAndChoose question IDs to question objects
// shape: { id, title?, prompt?, question, choices: [], correctIndex }

const questions = {
  3: {
    id: 3,
    title: "Lai Châu",
    prompt:
      "<b>Đọc to bài thơ sau cho mọi người cùng nghe:</b><br><br>Noọng ơi gà gáy rồi<br>Trời ửng hồng quấn núi<br>Tiếng Mông Dao í ới<br>Tíu tít vang tiếng cười<br>…<br>Lai Châu xứ thần tiên<br>Chợ rợp màu thổ cẩm<br>Mường Than ruộng xanh mướt<br>Ngát hương chè Than Uyên<br><br>Trích bài thơ Nồng nàn Lai Châu (tác giả Hiền Xuân)",
    question: "<b>Đâu là các danh từ riêng có trong đoạn thơ trên?</b>",
    choices: [
      "Mông Dao, hoa ban",
      "Mường Than, Mông Dao",
      "San Lùng, chợ phiên",
      "Gió trăng, Lai Châu",
    ],
    correctIndex: 1,
  },

  7: {
    id: 7,
    title: "Lạng Sơn",
    prompt:
      "Lạn Sơn nằm ở cửa ngõ phía Bắc Tổ quốc, là một địa phương tiêu biểu thuộc vùng văn hóa Đông Bắc Việt Nam, nơi sở hữu kho tàng văn hóa đa dạng, giàu bản sắc, chứa đựng nhiều nét độc đáo.",
    question: "<b>Từ nào ở trên sai chính tả?</b>",
    choices: ["Địa phương", "Đông Bắc", "Kho tàng", "Lạn Sơn"],
    correctIndex: 3,
  },

  9: {
    id: 9,
    title: "Phú Thọ",
    question:
      "Dựa vào câu chuyện của mẹ Âu Cơ trên nắp hộp nhân vật, hãy cho biết mẹ đã dạy muôn dân trồng lúa nước, nuôi tằm, dệt vải, hái lượm tại vùng đất nào ở Phú Thọ?",
    choices: ["Đền Hùng", "Phù Đức", "Hiền Lương", "An Thái"],
    correctIndex: 2,
  },

  12: {
    id: 12,
    title: "TP. Hà Nội",
    prompt:
      "<b>Đọc to bài thơ sau cho mọi người cùng nghe</b><br><br>Hà Nội có chong chóng<br>Cứ tự quay trong nhà<br>Không cần trời thổi gió<br>Không cần bạn chạy xa.<br>…<br>_____ có Hồ Gươm<br>Nước xanh như pha mực<br>Bên hồ ngọn Tháp Bút<br>Viết thơ lên trời cao.<br><br>(Trần Đăng Khoa)",
    question: "<b>Tên địa danh thích hợp ở chỗ trống là?</b>",
    choices: ["Vĩnh Long", "Hà Nội", "Ninh Thuận", "Long Khánh"],
    correctIndex: 1,
  },

  13: {
    id: 13,
    title: "TP. Hải Phòng",
    question:
      'Ở Hải Phòng, hoa phượng đỏ được trồng rộng rãi. Vào những ngày hè tháng 5-6, khắp con đường, ngõ phố của đô thị này đều ngập trong sắc hoa. Vì thế Hải Phòng được biết đến với tên gọi "Thành phố ______".',
    choices: ["Hoa anh đào", "Hoa phượng đỏ", "Hoa hồng", "Hoa cẩm tú cầu"],
    correctIndex: 1,
  },

  14: {
    id: 14,
    title: "Hưng Yên",
    question:
      "Tính từ chỉ màu sắc có trong đoạn văn về mùa nhãn ở tỉnh Hưng Yên là?",
    choices: ["Vàng nhạt", "Lộc lá", "Miên man", "Li ti"],
    correctIndex: 0,
  },

  16: {
    id: 16,
    title: "Thanh Hóa",
    question: "Bảo tàng Thanh Hóa hiện thuộc phường nào?",
    choices: ["Lam Xơn", "Sơn Lam", "Lam Sơn", "Sam Lơn"],
    correctIndex: 2,
  },

  22: {
    id: 22,
    title: "Quảng Ngãi",
    question:
      "Làng nghề Mỹ Thiện ở Quảng Ngãi làm đồ vật từ đất sét là làng nghề gì?",
    choices: ["Đan mây", "Gốm", "Nước mắm", "Chổi đót"],
    correctIndex: 1,
  },

  31: {
    id: 31,
    title: "An Giang",
    question: "Hai con sông lớn nào chảy qua An Giang từ Trước ra Sau?",
    choices: [
      "Sông Hồng và sông Đà",
      "Sông Mã và sông Lam",
      "Sông Tiền và sông Hậu",
      "Sông Gianh và sông Nhật Lệ",
    ],
    correctIndex: 2,
  },

  32: {
    id: 32,
    title: "Vĩnh Long",
    question:
      "Trong các làng nghề sau, làng nghề nào không được nhắc đến trong thông tin trên?",
    choices: ["Làm gạch", "Dệt chiếu", "Đan thảm lục bình", "Làm bánh tráng"],
    correctIndex: 3,
  },

  33: {
    id: 33,
    title: "TP. Cần Thơ",
    question:
      "Người dân ở chợ nổi Cái Răng thường dùng phương tiện gì để đi lại và buôn bán?",
    choices: ["Xe đạp", "Ô tô", "Ghe, xuồng", "Máy bay"],
    correctIndex: 2,
  },
};

export function getReadAndChooseQuestion(id) {
  const n = Number(id);
  return questions[n] || null;
}

export default questions;
