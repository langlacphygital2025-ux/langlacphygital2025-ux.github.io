const messages = {
  intro: [
    {
      audio: 1,
      text: "Xin chào, các bạn nhỏ ơi! Mình là Gạo, người dẫn đường trong hành trình Con Rồng Cháu Tiên!",
    },
    {
      audio: 2,
      text: "Hai đội đã sẵn sàng chưa nào? Chuẩn bị cùng mình khám phá đất nước Việt Nam xinh đẹp nhé!",
    },
  ],
  legend: [
    {
      audio: 3,
      text: "Ngày xưa, Lạc Long Quân và Âu Cơ yêu thương nhau và sinh ra một bọc trăm trứng, nở thành trăm người con Việt Nam. Một nửa theo cha xuống biển, một nửa theo mẹ lên non — từ đó, chúng ta có con cháu Rồng Tiên khắp mọi miền đất nước! Giờ thì, các bạn nhỏ ơi, đã đến lúc hành trình khám phá nước Việt bắt đầu rồi! Cùng xoay vòng quay đầu tiên nào!",
    },
  ],
  turnStart: [
    { audio: 4, text: "Chà, đội nào đi trước vậy nhỉ" },
    { audio: 5, text: "Đến lượt của đội mình rồi đó!" },
    { audio: 6, text: "Xin chào đội Lạc con, các bạn đã sẵn sàng chưa?" },
    {
      audio: 7,
      text: "Nào, xoay vòng quay thôi! Xem Lạc Long Quân và Âu Cơ đi được mấy bước nhé!",
    },
  ],
  challengeInput: [
    { audio: 8, text: "Ôi chao, dừng ở ô đặc biệt rồi kìa!" },
    {
      audio: 9,
      text: "Giờ thì các bạn hãy nhặt một mảnh ghép tỉnh thành bất kỳ nhé!",
    },
    { audio: 10, text: "Trên mảnh có số mấy vậy?" },
    {
      audio: 11,
      text: "Nhập số đó vào điện thoại đi nào để mình bật thử thách lên cho các bạn nha!",
    },
  ],
  challengeShown: [
    { audio: 12, text: "Thử thách đã đến!" },
    { audio: 13, text: "Hãy cùng nhau vượt qua thử thách này nhé!" },
    { audio: 14, text: "Ai sẽ là người trả lời thử thách này nhỉ?" },
    { audio: 15, text: "Bạn hãy suy nghĩ thật kỹ trước khi trả lời nha!" },
    { audio: 16, text: "Cùng nhau cố gắng nào!" },
    { audio: 17, text: "Cố lên, mình tin là các bạn làm được!" },
  ],
  success: [
    { audio: 18, text: "Tuyệt vời luôn! Các bạn giỏi quá trời luôn á!" },
    {
      audio: 19,
      text: "Mình trao ngay cho các bạn mảnh ghép tỉnh thành nhé – ghép lên bản đồ nào!",
    },
    { audio: 20, text: "Một điểm sáng chói cho tinh thần Rồng Tiên! ✨" },
  ],
  failure: [
    {
      audio: 21,
      text: "Ôi chao, thiếu một chút xíu nữa thôi! Nhưng không sao cả, mỗi thử thách đều là bài học mà, phải không nào?",
    },
    {
      audio: 22,
      text: "Tiếc ghê, mình tạm giữ lại một token người Việt Nam nha. Lần sau mình sẽ giành lại thôi, cố lên nhé đội ơi!",
    },
  ],
  hopeSquare: [
    { audio: 23, text: "Ô hô! Các bạn đã đến ô Nón Lá Hy Vọng rồi đó!" },
    {
      audio: 24,
      text: "Đây là cơ hội để hồi sinh một token người Việt Nam đã mất nè!",
    },
    {
      audio: 25,
      text: "Làm tốt thử thách này nhé – biết đâu sẽ lấy lại được sức mạnh Rồng Tiên đó!",
    },
  ],
  idle: [
    { audio: 26, text: "Ê ê, ai hồi hộp như mình không đó" },
    {
      audio: 27,
      text: "Các bạn ơi, bản đồ của mình đẹp lên từng chút rồi kìa!",
    },
    {
      audio: 28,
      text: "Hôm nay Lạc Long Quân và Âu Cơ chắc sẽ tự hào lắm luôn!",
    },
    {
      audio: 29,
      text: "Ui, nghe tiếng xoay vòng mà tim đập thình thịch luôn đó!",
    },
    { audio: 30, text: "Ai mà vừa thông minh vừa may mắn vậy nè~" },
    { audio: 31, text: "Haha, mình đoán đội này đang âm thầm chiến lược đây!" },
    {
      audio: 32,
      text: "Cố lên nào các bạn ơi! Việt Nam mình rộng lớn lắm, cùng nhau đi hết bản đồ nha!",
    },
    {
      audio: 33,
      text: "Mỗi mảnh ghép là một vùng đất, mỗi bước đi là một câu chuyện đấy!",
    },
    { audio: 34, text: "Mình tin các bạn làm được!" },
    {
      audio: 35,
      text: "Một token mất đi không sao hết, vì tinh thần Rồng Tiên thì không bao giờ mất nha!",
    },
    { audio: 36, text: "3… 2… 1… Cùng chinh phục thử thách nào!" },
    { audio: 37, text: "Này này, có ai đang lén xem bài không đó? Haha!" },
    {
      audio: 38,
      text: "Ơ, sao xoay ra số nhỏ vậy, chắc vòng quay hơi ngại rồi~",
    },
    {
      audio: 39,
      text: "Ai mà đoán được tỉnh này nè, mình sẽ tặng thêm một tràng pháo tay nhé! 👏",
    },
    {
      audio: 40,
      text: "Các bạn có nghe thấy tiếng biển gọi hay tiếng núi gọi chưa? Vì mình nghe rồi đó!",
    },
  ],
};

function getMessageByAudioNumber(audioNumber) {
  for (const category of Object.values(messages)) {
    const message = category.find((msg) => msg.audio === audioNumber);
    if (message) return message.text;
  }
  return "";
}

function getMessagesByCategory(category) {
  return messages[category] || [];
}

export { messages, getMessageByAudioNumber, getMessagesByCategory };
