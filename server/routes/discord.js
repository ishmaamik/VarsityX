// server/routes/discord.js

import express from 'express';
import { REST, Routes, Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

// ✅ Define 10 marketplace-related slash commands
const commands = [
  { name: 'ping', description: 'Replies with Pong!' },
  { name: 'hello', description: 'Welcome message from VarsityX' },
  { name: 'list', description: 'How to list an item or service' },
  { name: 'search', description: 'How to search for listings' },
  { name: 'priceadvisor', description: 'Ask for AI pricing help' },
  { name: 'safeplace', description: 'Suggest safe meetup points on campus' },
  { name: 'verify', description: 'Student identity verification steps' },
  { name: 'report', description: 'Report a user or listing' },
  { name: 'contact', description: 'Contact or support information' },
  { name: 'aihelp', description: 'Info about AI features like price advisor or image search' },
];

// ✅ Register slash commands
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('✅ Registering Discord slash commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('✅ Slash commands registered.');
  } catch (err) {
    console.error('❌ Error registering commands:', err);
  }
})();

// ✅ Setup Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
  console.log(`🤖 Discord Bot Ready as ${client.user.tag}`);
});

// ✅ Slash command logic
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const replies = {
    ping: '🏓 Pong!',
    hello: '👋 Hello! Welcome to VarsityX – your student-driven marketplace!',
    list: '📦 To list an item or service, go to the "Create Listing" page in the app, choose item type, upload a photo, and set a price or rate.',
    search: '🔎 Use our advanced search in the app to filter by category, price, university, and more.',
    priceadvisor: '💰 Use our AI-powered Price Advisor in the app to get a fair suggested price for your listing.',
    safeplace: '🗺️ For meetups, use our campus map to pin a safe and public location — such as a library or cafeteria.',
    verify: '🎓 To verify your student status, register with your official university email like @iut-dhaka.edu.',
    report: '🚨 You can report a user or listing in-app. Go to the profile/listing and click "Report".',
    contact: '📞 Contact support@varsityx.com or visit the Help section in the app.',
    aihelp: '🤖 Use commands like /priceadvisor or try uploading an image to get AI-powered help in the app!',
  };

  const reply = replies[interaction.commandName] || '❓ Command not recognized.';
  await interaction.reply(reply);
});

// ✅ Start the bot
client.login(TOKEN);

// ✅ Express test route
router.get('/', (req, res) => {
  res.send('🤖 Discord Bot is running and connected!');
});

export default router;