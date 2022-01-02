import { TextBasedChannels } from 'discord.js';
import Process from '../Structures/Process';

import Timer from '../Models/Timer';
import addTimer from '../lib/utils/addTimer';

const Timers = new Process({
  run: async (client, args) => {
    const timers = await Timer.find({});

    timers.forEach((t) => {
      t.channels.forEach((c) => {
        const channel = client.channels.cache.find((ch) => ch.id == c) as TextBasedChannels | undefined;
        
        if (!channel) return;
        
        addTimer(client, channel);
      });
    });
  },
});

module.exports = Timers;
