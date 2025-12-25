const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let movies = {}; // auto movie list

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // If video uploaded
  if (msg.video && msg.caption) {
    const title = msg.caption;
    movies[title] = msg.video.file_id;

    bot.sendMessage(chatId, `✅ Movie added: ${title}`);
  }

  // User command
  if (msg.text === "/movies") {
    const buttons = Object.keys(movies).map(m => ([{
      text: m,
      callback_data: m
    }]));

    if (buttons.length === 0) {
      bot.sendMessage(chatId, "❌ No movies yet");
    } else {
      bot.sendMessage(chatId, "🎬 Select movie:", {
        reply_markup: { inline_keyboard: buttons }
      });
    }
  }
});

bot.on("callback_query", (q) => {
  const movie = q.data;
  const chatId = q.message.chat.id;

  if (movies[movie]) {
    bot.sendVideo(chatId, movies[movie]);
  }
});
