// server/routes/discord.js

import express from 'express';
import { REST, Routes, Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

// ✅ Define slash commands
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'hello',
    description: 'Sends a welcome message from VarsityX.',
  },
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

// ✅ Create and configure the bot client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
  console.log(`🤖 Discord Bot Ready as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  }

  if (commandName === 'hello') {
    await interaction.reply('👋 Hello! Welcome to VarsityX ^^');
  }
});

// ✅ Start the bot
client.login(TOKEN);

// ✅ Express test route
router.get('/', (req, res) => {
  res.send('🤖 Discord Bot is running and connected!');
});

export default router;
