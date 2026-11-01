// ======================================
// KFD BOT GOD MODE V2
// OWNER: Clausebogonko640@gmail.com
// GITHUB: Clause98bogonko
// ======================================
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const OWNER_EMAIL = "Clausebogonko640@gmail.com";
const BOT_NAME = "KFD GOD MODE V2";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
  }
});

let spamTracker = {};
console.log(`Starting ${BOT_NAME}...`);

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
  console.log('SCAN QR NOW - Owner: ' + OWNER_EMAIL);
});

client.on('ready', () => {
  console.log(`${BOT_NAME} CONNECTED ✅ Owner: ${OWNER_EMAIL}`);
});

client.on('message', async msg => {
  try {
    const chat = await msg.getChat();
    if (!chat.isGroup) return;
    const contact = await msg.getContact();
    const senderId = contact.id._serialized;
    const body = msg.body;
    const lower = body.toLowerCase();
    const participant = chat.participants.find(p => p.id._serialized === senderId);
    const isAdmin = participant?.isAdmin || false;
    const isBotAdmin = chat.participants.find(p => p.id._serialized === client.info.wid._serialized)?.isAdmin;

    if ((body.includes('https://') || body.includes('chat.whatsapp.com') || body.includes('http://')) && !isAdmin && !msg.fromMe) {
      if (isBotAdmin) await msg.delete(true);
      await chat.sendMessage(`@${contact.id.user} Links not allowed! - ${BOT_NAME}`, {mentions: [contact]});
      return;
    }

    spamTracker[senderId] = (spamTracker[senderId] || 0) + 1;
    setTimeout(() => { spamTracker[senderId] = 0; }, 10000);
    if (spamTracker[senderId] > 5 && !isAdmin && isBotAdmin) {
      await chat.removeParticipants([senderId]);
      await chat.sendMessage(`@${contact.id.user} Kicked for spam`, {mentions: [contact]});
    }

    if (lower === '/alive') await chat.sendMessage(`🔥 ${BOT_NAME} ALIVE ✅\n👑 Owner: ${OWNER_EMAIL}\n💻 GitHub: Clause98bogonko`);
    if (lower === '/owner') await chat.sendMessage(`👑 *BOT OWNER*\nEmail: ${OWNER_EMAIL}\nBot: ${BOT_NAME}`);
    if (lower === '/menu' || lower === '/help') await chat.sendMessage(`*${BOT_NAME} MENU*\n/alive\n/owner\n/kick @user\n/menu\n👑 Owner: ${OWNER_EMAIL}`);
    if (lower.startsWith('/kick') && isAdmin && isBotAdmin) {
      const mentions = await msg.getMentions();
      if (mentions.length > 0) await chat.removeParticipants(mentions.map(m => m.id._serialized));
    }
  } catch(e){console.log("Error:", e.message);}
});
client.initialize();
