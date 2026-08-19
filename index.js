const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ใส่ ID ของห้องเสียง และ ID ของเซิร์ฟเวอร์ที่คุณต้องการให้บอทไปคาสาย
const VOICE_CHANNEL_ID = '1529890741390807191';
const GUILD_ID = '1509521288341885059';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  // สั่งให้บอทเข้าห้องเสียงทันทีที่ออนไลน์
  connectToVoice();
});

function connectToVoice() {
  try {
    const connection = joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: client.guilds.cache.get(GUILD_ID).voiceAdapterCreator,
      selfDeaf: true, // ปิดเสียงหูฟังบอทเพื่อลดการใช้แบนด์วิธ
      selfMute: true, // ปิดไมค์บอท
    });

    console.log('Bot is staying in the voice channel 24/7!');
  } catch (error) {
    console.error('Error connecting to voice:', error);
  }
}

// ป้องกันบอทหลุดสายเมื่อโดนรีเซ็ตเน็ตเวิร์ก
client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState.id === client.user.id && !newState.channelId) {
    console.log('Bot was disconnected, reconnecting...');
    setTimeout(connectToVoice, 5000);
  }
});

client.login(process.env.DISCORD_TOKEN);
