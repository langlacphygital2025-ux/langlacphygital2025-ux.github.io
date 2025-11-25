const messages = {
  intro: [
    "Xin chào, các bạn nhỏ ơi! Mình là Gạo, người dẫn đường trong hành trình Con Rồng Cháu Tiên!",
    "Hai đội đã sẵn sàng chưa nào? Chuẩn bị cùng mình khám phá đất nước Việt Nam xinh đẹp nhé!",
  ],
  turnStart: [
    "Chà, đội nào đi trước vậy nhỉ",
    "Đến lượt của đội mình rồi đó!",
    "Xin chào đội [tên đội], các bạn đã sẵn sàng chưa?",
    "Nào, xoay vòng quay thôi! Xem Lạc Long Quân và Âu Cơ đi được mấy bước nhé!",
  ],
  challengeInput: [
    "Ôi chao, dừng ở ô đặc biệt rồi kìa!",
    "Giờ thì các bạn hãy nhặt một mảnh ghép tỉnh thành bất kỳ nhé!",
    "Trên mảnh có số mấy vậy?",
    "Nhập số đó vào điện thoại đi nào để mình bật thử thách lên cho các bạn nha!",
  ],
  challengeShown: [
    "Thử thách đã đến!",
    "Hãy cùng nhau vượt qua thử thách này nhé!",
    "Ai sẽ là người trả lời thử thách này nhỉ?",
    "Bạn hãy suy nghĩ thật kỹ trước khi trả lời nha!",
    "Cùng nhau cố gắng nào!",
    "Cố lên, mình tin là các bạn làm được!",
  ],
  success: [
    "Tuyệt vời luôn! Các bạn giỏi quá t rời luôn á!",
    "Mình trao ngay cho các bạn mảnh ghép tỉnh thành nhé – ghép lên bản đồ nào!",
    "Một điểm sáng chói cho tinh thần Rồng Tiên! ✨",
  ],
  failure: [
    "Ôi chao, thiếu một chút xíu nữa thôi! Nhưng không sao cả, mỗi thử thách đều là bài học mà, phải không nào?",
    "Tiếc ghê, mình tạm giữ lại một token người Việt Nam nha. Lần sau mình sẽ giành lại thôi, cố lên nhé đội ơi!",
  ],
  hopeSquare: [
    "Ô hô! Các bạn đã đến ô Nón Lá Hy Vọng rồi đó!",
    "Đây là cơ hội để hồi sinh một token người Việt Nam đã mất nè!",
    "Làm tốt thử thách này nhé – biết đâu sẽ lấy lại được sức mạnh Rồng Tiên đó!",
  ],
  idle: [
    "Ê ê, ai hồi hộp như mình không đó",
    "Các bạn ơi, bản đồ của mình đẹp lên từng chút rồi kìa!",
    "Hôm nay Lạc Long Quân và Âu Cơ chắc sẽ tự hào lắm luôn!",
    "Ui, nghe tiếng xoay vòng mà tim đập thình thịch luôn đó!",
    "Ai mà vừa thông minh vừa may mắn vậy nè~",
    "Haha, mình đoán đội này đang âm thầm chiến lược đây!",
    "Cố lên nào các bạn ơi! Việt Nam mình rộng lớn lắm, cùng nhau đi hết bản đồ nha!",
    "Mỗi mảnh ghép là một vùng đất, mỗi bước đi là một câu chuyện đấy!",
    "Mình tin các bạn làm được!",
    "Một token mất đi không sao hết, vì tinh thần Rồng Tiên thì không bao giờ mất nha!",
    "3… 2… 1… Cùng chinh phục thử thách nào!",
    "Này này, có ai đang lén xem bài không đó? Haha!",
    "Ơ, sao xoay ra số nhỏ vậy, chắc vòng quay hơi ngại rồi~",
    "Ai mà đoán được tỉnh này nè, mình sẽ tặng thêm một tràng pháo tay nhé! 👏",
    "Các bạn có nghe thấy tiếng biển gọi hay tiếng núi gọi chưa? Vì mình nghe rồi đó!",
  ],
};

function getRandomMessage(category) {
  if (!messages[category]) return "Cố lên nào!";
  const categoryMessages = messages[category];
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
}

function getSequentialMessages(category) {
  if (!messages[category]) return [];
  return messages[category];
}

export { getRandomMessage, getSequentialMessages, messages };
