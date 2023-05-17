import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format';
import config from 'config';
import { ogg } from './ogg.js'
import { openai } from './openai.js';
import { removeFile, initCommand, processTextToChat, INITIAL_SESSION } from './utils.js';

const bot = new Telegraf(config.get('TELEGRAM_BOT'))
bot.use(session()); // tell bot to use the session

// the bot registers a new context when new and start commands are invoked:
bot.command('new', initCommand);
bot.command('start', initCommand);

bot.on(message('voice'), async (ctx) => {
    // if the session is undefined, create a new one
    ctx.session ??= INITIAL_SESSION;
    try {
        await ctx.reply(code('Message received. Waiting for the service reply...'));
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
        const userId = String(ctx.message.from.id);
        const oggPath = await ogg.create(link.href, userId);
        const mp3Path = await ogg.toMp3(oggPath, userId);
        await removeFile(oggPath);
        const text = await openai.transcription(mp3Path);
        await ctx.reply(code(`Your request: ${text}`));
        await processTextToChat(ctx, text);
    } catch (e) {
        console.error(`Error while processing voice message`, e.message);
    }
});

bot.on(message('text'), async (ctx) => {
    ctx.session ??= INITIAL_SESSION
    try {
        await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'))
        await processTextToChat(ctx, ctx.message.text)
    } catch (e) {
        console.log(`Error while voice message`, e.message)
    }
});