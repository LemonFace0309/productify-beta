import Discord from 'discord.js';

const paginationEmbed = async (
  msg: Discord.Message,
  pages: Discord.MessageEmbed[],
  emojiList = ['⏪', '⏩'],
  timeout = 120000
) => {
  if (emojiList.length !== 2) throw new Error('Need two emojis.');
  let page = 0;

  const curPage = await msg.channel.send({
    embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
  });

  for (const emoji of emojiList) await curPage.react(emoji);
  const reactionCollector = curPage.createReactionCollector({
    filter: (reaction, user) => emojiList.includes(<string>reaction.emoji.name) && !user.bot,
    time: timeout
  });

  reactionCollector.on('collect', (reaction) => {
    reaction.users.remove(msg.author);
    switch (reaction.emoji.name) {
      case emojiList[0]:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case emojiList[1]:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      default:
        break;
    }
  
    curPage.edit({
      embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)]
    });
  });
  reactionCollector.on('end', () => {
    if (!curPage.deleted) {
      curPage.reactions.removeAll();
    }
  });
  return curPage;
};

export default paginationEmbed;
