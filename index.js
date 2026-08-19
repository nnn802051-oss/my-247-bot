const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ใส่ ID เซิร์ฟเวอร์และ ID ห้องเสียงเรียบร้อยแล้ว
const GUILD_ID = '1509521288341885059';
const VOICE_CHANNEL_ID = '1529890741390807191';

client.on('ready', () => {
  console.log(`[ONLINE] บอทเข้าสู่ระบบในชื่อ: ${client.user.tag}`);
  connectToVoice();
});

function connectToVoice() {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('[ERROR] หาเซิร์ฟเวอร์ไม่เจอ! โปรดตรวจสอบว่าดึงบอทเข้าเซิร์ฟเวอร์แล้วหรือยัง');
    return;
  }

  try {
    joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: true,
    });
    console.log('[SUCCESS] บอทเชื่อมต่อคาสายในห้องเสียงเรียบร้อยแล้ว!');
  } catch (error) {
    console.error('[ERROR] ไม่สามารถเข้าห้องเสียงได้:', error);
  }
}

// ระบบเชื่อมต่อใหม่อัตโนมัติหากโดนเตะหลุด
client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState.id === client.user.id && !newState.channelId) {
    console.log('[RECONNECT] บอทหลุดสาย กำลังเชื่อมต่อใหม่ใน 5 วินาที...');
    setTimeout(connectToVoice, 5000);
  }
});

// ตรวจสอบ Token ก่อนรัน
if (!process.env.DISCORD_TOKEN) {
  console.error('[CRITICAL ERROR] ไม่พบ DISCORD_TOKEN ใน Variables ของ Discloud!');
} else {
  client.login(process.env.DISCORD_TOKEN);
}
