import { Client, Collection, GuildChannel, GuildMember, TextChannel, MessageEmbed } from 'discord.js';

import Process from '../Structures/Process';
import getOrCreateUser from '../lib/utils/getOrCreateUser';
import paginationEmbed from '../lib/utils/paginationEmbed';

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

const releaseRewards = async (client: Client, reward: number) => {
  const guilds = client.guilds.cache;
  let allMembers: Collection<string, GuildMember> = new Collection();

  await Promise.all(
    guilds.map(async (guild) => {
      try {
        const channels = await guild.channels.fetch(undefined, { force: true });
        const studyChannels = channels.filter((channel) => channel.isVoice() && channel instanceof GuildChannel);
        const members = studyChannels
          .map((sc) => sc.members as Collection<string, GuildMember>)
          .reduce((acc, val) => acc.concat(val), new Collection());
        allMembers = allMembers.concat(members);

        // rewarding each member with coins
        members.forEach((member) => {
          getOrCreateUser(member.id).then((user) => {
            if (!user) return;
            user.coins += reward;
            user.save();
          });
        });
      } catch (err) {
        console.warn('Unable to reward members:', err);
      }
    })
  );
  const allMembersArr: GuildMember[] = [];
  allMembers.each((member) => allMembersArr.push(member));
  return allMembersArr;
};

const notifyGuild = async (client: Client, reward: number, recipients: GuildMember[]) => {
  const channel = client.channels.cache.find((ch) => ch.id == process.env.ROLLS_CHANNEL_ID) as TextChannel | undefined;

  if (!channel) return;

  const pages: MessageEmbed[] = [];
  const perPage = 15;
  const numPages = Math.ceil(recipients.length / perPage) || 1;
  let isFirstPage = true;
  for (let i = 0; i < numPages; ++i) {
    const embed = new MessageEmbed();
    let description = '';

    for (let j = 0; j < 15; ++j) {
      if (isFirstPage) {
        embed.setTitle(`Releasing ${reward} coins to these users! <:PandaCapitalist:908492210696224839>`);
        embed.setAuthor(`Study for 15 minutes in a voice channel or lofi radio to be rewarded!`);
        isFirstPage = false;
      }

      const idx = i * 15 + j;
      const member = recipients[idx];

      if (!member) break;

      description += member.displayName;
    }
    embed.setDescription(description);
    pages.push(embed);
  }

  try {
    await paginationEmbed(channel, pages);
  } catch (err) {
    console.warn(err);
  }
};

const StudyRewards = new Process({
  run: async (client, args) => {
    const reward = 100; // coins

    await waitUntilQuarterHour();
    console.log('Reached quarter hour. Releasing first round of rewards!');

    const recipients = await releaseRewards(client, reward);
    await notifyGuild(client, reward, recipients);
    setInterval(async () => {
      const recipients = await releaseRewards(client, reward);
      notifyGuild(client, reward, recipients);
    }, 900000); // 15 minutes = 900000ms
  },
});

module.exports = StudyRewards;
