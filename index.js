const { Telegraf, Markup  } = require('telegraf'); // Markup у контексті Telegram-ботів (особливо в бібліотеці Telegraf) — це утиліта для створення клавіатур та розмітки повідомлень
require("dotenv").config(); // для роботи ".env" , npm install dotenv  для встановлення dotenv 
/*
dotenv — це маленька бібліотека для Node.js, яка допомагає зберігати секретні дані (наприклад токени, паролі, ключі) у файлі .env, а не прямо в коді.
*/



const axios = require('axios'); // Axios —  бібліотека для роботи з API та зовнішніми сервісами



const bot = new Telegraf(process.env.BOT_TOKEN) // тут захований токен бота через process.env.

  

bot.start((ctx) => {
   const name = ctx.from.first_name ? ctx.from.first_name : 'Друже'; // беремо ім’я користувача ,якщо імені немає буде "Друже"
    ctx.reply(`Привіт, ${name} 😊! Хочеш дізнатися який день тебе сьогодні чекає ? 😺`); // команда старт із персональним звертанням 
  
    setTimeout(() => {
      const username = ctx.from.username ? '@' + ctx.from.username : 'Друже'; // якщо немає ніку в телеграмі звертатиметься "Друже"
      ctx.reply(
        `${username}, обери відповідь:`, // звернення по нікнейму , в обернених лапках
        Markup.inlineKeyboard([   // кнопки через Markup
          Markup.callbackButton('😺 Хочу', 'yes'),
          Markup.callbackButton('🙀 Не хочу', 'no')
        ], {columns: 1}).extra()
      );
    }, 1000); //затримка 1 секунда
  });


// Обробка "Хочу"
const dailyFortunes = require('./fortunes'); // підключаємо список прогнозів

bot.action('yes', async (ctx) => {
  try {
    const res = await axios.get('https://api.thecatapi.com/v1/images/search');
    const imageUrl = res.data[0].url;

    const randomFortune = dailyFortunes[Math.floor(Math.random() * dailyFortunes.length)];

    await ctx.replyWithPhoto(imageUrl, { caption: randomFortune });
  } catch (err) {
    console.error(err);
    ctx.reply("Не вдалося знайти котика 😿");
  }
});




// Обробка кнопки "🙀 Не хочу"

const fs = require('fs');
const path = require('path'); 
bot.action('no', (ctx) => {
  // шлях до папки SadCat
  const folderPath = path.join(__dirname, 'SadCat');

  // читаємо всі файли з папки
  const files = fs.readdirSync(folderPath);

  // вибираємо випадковий файл
  const randomFile = files[Math.floor(Math.random() * files.length)];

  // формуємо повний шлях
  const filePath = path.join(folderPath, randomFile);

  // відправляємо фото з підписом
  ctx.replyWithPhoto({ source: filePath }, { caption: 'Злюка 😾' });
});











bot.launch().then(() => {
    console.log('бот працює')
})   // конструкція , щоб при запуску бота писало "бот працює".запуск бота "nodemon index.js"