import Discord from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import getOrCreateGuildTimer from '../lib/utils/getOrCreateGuildTimers';
import { TimerDocument } from '../Models/Timer';
import addTimer from '../lib/utils/addTimer';

const startTimer = new Command({
  name: 'start-timer',
  description: 'Starts a 25/5 pomodoro timer in this channel',
  type: CommandType.SLASH,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    if (!message.guildId) return;

    let timer: TimerDocument | null;
    try {
      timer = await getOrCreateGuildTimer(message.guildId);

      if (!timer) throw new Error('Timer is null');
    } catch (err) {
      console.warn(err);
      return message.reply('Unable to add timer');
    }

    if (client.timers.get(message.channelId) || timer.channels.includes(message.channelId)) {
      return message.reply({ content: 'A timer for this channel already exists!', ephemeral: true });
    }

    const channel = message.channel as Discord.TextBasedChannels;

    addTimer(client, channel);
    
    timer.channels.push(channel.id);
    await timer.save();
    return message.reply({ content: 'Timer successfully added!', ephemeral: true });
  },
});

module.exports = startTimer;
