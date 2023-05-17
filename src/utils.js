import { unlink } from 'fs/promises';
import { openai } from './openai.js'
export async function removeFile(path) {
    try {
        await unlink(path);
    } catch (e) {
        console.log('Error while removing file', e.message);
    }
}
export const INITIAL_SESSION = {
    messages: [],
}
export async function initCommand(ctx) {
    ctx.session = INITIAL_SESSION;
    console.log('Clear session', ctx.message);
    await ctx.reply('Waiting for your voice or text message');
}
export async function processTextToChat(ctx, content) {
    try {
        // push user's messages into the session (context)
        ctx.session.messages.push({ role: openai.roles.USER, content })
        // push bot messages into the session (context)
        const response = await openai.chat(ctx.session.messages)
        ctx.session.messages.push({role: openai.roles.ASSISTANT, content: response.content});
        await ctx.reply(response.content);
    } catch (e) {
        console.log('Error while processing text to GPT', e.message);
    }
}