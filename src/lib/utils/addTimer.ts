import Discord from 'discord.js';

import Client from '../../Structures/Client';

const addTimer = (client: Client, channel: Discord.TextBasedChannels) => {
  const roleId = '915889536855326720';
  const sender = client.users.cache.find((user) => user.id === `${process.env.CLIENT_ID}`) as Discord.User;
  const embedWork = new Discord.MessageEmbed();
  const embedBreak = new Discord.MessageEmbed();

  //embeded work message reminder
  embedWork
    .setTitle('Study time!')
    .setDescription(
      `I hope you enjoyed your break! But your homework isn't going to do itself <:PandaUWU:908492211820302377>\n
        Let's get that bread <:PandaCapitalist:908492210696224839>\n•\n•\n•
        To be added to the Pomodoro role, react to the pinned message in this channel! <:PandaLove:908492212659191888> <:PandaLove:908492212659191888>`
    )
    .setColor('AQUA')
    .setAuthor(sender.username, <string>sender.defaultAvatarURL, 'https://prepanywhere.com')
    .setThumbnail('https://media.discordapp.net/attachments/802250402074591246/915062747069288478/worktime.png');

  //embeded break message reminder
  embedBreak
    .setTitle('Break time!')
    .setAuthor(sender.username, <string>sender.defaultAvatarURL, 'https://prepanywhere.com')
    .setDescription(
      `Great work so far <:PandaUmaru:908492212386541588> <:PandaUmaru:908492212386541588>\n
        Feel free to stretch your muscles or take a much needed water break!\n
        See you in 5 minutes. <:PandaCuteJuice:908492211967111248>`
    )
    .setColor('ORANGE')
    .setThumbnail('https://media.discordapp.net/attachments/802250402074591246/915062511022252032/breaktime.png');

  const intervalTimer = setInterval(() => {
    const d = new Date();
    const m = d.getMinutes();
    const s = d.getSeconds();

    //return to work at 0th and 30th minute of every hour (once)
    if ((m == 0 || m == 30) && s >= 0 && s <= 9) {
      channel.send({ content: `<@&${roleId}>`, embeds: [embedWork.setTimestamp()] });
    }
    //break at 25th and 55h minutes of every hour (once)
    if ((m == 25 || m == 55) && s >= 0 && s <= 9) {
      //extra 2 seconds compensates for discord / setInterval not syncing exactly
      channel.send({ content: `<@&${roleId}>`, embeds: [embedBreak.setTimestamp()] });
    }
  }, 10000);

  client.timers.set(channel.id, intervalTimer);
};

export default addTimer;
