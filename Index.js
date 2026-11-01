// KFD BOT GOD MODE V2 - ONE CODE - Owner: Clausebogonko640@gmail.com
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const P = require('pino');

async function KFD() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }) });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', async (u) => {
    const { connection, qr } = u;
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === 'open') console.log('KFD CONNECTED ✅ Owner: Clausebogonko640@gmail.com');
    if (connection === 'close' && u.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) KFD();
  });
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]; if (!m.message || m.key.fromMe) return;
    const txt = (m.message.conversation || m.message.extendedTextMessage?.text || "").toLowerCase();
    const jid = m.key.remoteJid;
    if (txt === '/alive') await sock.sendMessage(jid, { text: '🔥 KFD BOT GOD MODE V2 ALIVE ✅\n👑 Owner: Clausebogonko640@gmail.com' });
    if (txt === '/menu') await sock.sendMessage(jid, { text: '*KFD MENU*\n/alive\n/owner\n/menu\nOwner: Clausebogonko640@gmail.com' });
    if (txt === '/owner') await sock.sendMessage(jid, { text: '👑 Owner: Clausebogonko640@gmail.com\nBot: KFD GOD MODE V2' });
  });
}
KFD();
