const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

let movies = [];

// Detect movie uploads in channel
bot.on("channel_post", (msg) => {
  if (msg.video) {
    movies.push({
      title: msg.caption || `Movie ${movies.length + 1}`,
      file_id: msg.video.file_id
    });
    console.log("Movie auto added");
  }
});

// Show movies
bot.onText(/\/movies/, (msg) => {
  const chatId = msg.chat.id;

  if (!movies.length) {
    bot.sendMessage(chatId, "❌ No movies yet");
    return;
  }

  movies.forEach((movie, i) => {
    bot.sendMessage(chatId, movie.title, {
      reply_markup: {
        inline_keyboard: [[
          { text: "▶ Watch", callback_data: i.toString() }
        ]]
      }
    });
  });
});

// Send movie
bot.on("callback_query", (q) => {
  const movie = movies[q.data];
  bot.sendVideo(q.message.chat.id, movie.file_id);
});
