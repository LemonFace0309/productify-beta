import { Client, Collection, GuildChannel, GuildMember } from 'discord.js';

import Process from '../Structures/Process';
import getOrCreateUser from '../utils/getOrCreateUser';

const waitUntilQuarterHour = async () => {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      const d = new Date();
      const m = d.getMinutes();

      if (!(m == 0 || m == 15 || m == 30 || m == 45)) {
        await waitUntilQuarterHour();
      }
      resolve(true);
    }, 58000)
  );
};

const releaseRewards = (client: Client) => {
  const guilds = client.guilds.cache;

  guilds.forEach((guild) => {
    const channels = guild.channels.cache;
    const studyChannels = channels.filter((channel) => channel.isVoice() && channel instanceof GuildChannel);
    const members = studyChannels
      .map((sc) => sc.members as Collection<string, GuildMember>)
      .reduce((acc, val) => acc.concat(val), new Collection());

    // rewarding each member with 100 coins
    try {
      members.forEach((member) => {
        getOrCreateUser(member.id)
        .then((user) => {
          if (!user) return;
          user.coins += 100;
          user.save();
        });
      });
    } catch (err) {
      console.error('Unable to reward members:', err);
    }
  });
};

const StudyRewards = new Process({
  run: async (client, args) => {
    await waitUntilQuarterHour();
    console.log('Reached quarter hour. Releasing first round of rewards!');

    releaseRewards(client);
    setInterval(() => {
      releaseRewards(client);
    }, 900000); // 15 minutes
  },
});

module.exports = StudyRewards;
