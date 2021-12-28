import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import { Character } from '../lib/types';
import getOrCreateUser from '../lib/utils/getOrCreateUser';
import getCharacter from '../lib/utils/getCharacter';
import replyCharacter from '../lib/utils/replyCharacter';
import createCharacterObject from '../lib/utils/createCharacterObject';

const Roll = new Command({
  name: 'r',
  description: 'Roll for a random waifu or husbando',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    const rollCost = 50;
    const author = message.author;
    const userObj: GuildMember | undefined = message.guild?.members.cache.find((member) => member.id === author.id);

    if (!userObj) return message.reply(`User does not exist!`);

    const user = await getOrCreateUser(userObj.id);

    if (!user) return message.reply('Unable to roll. Try again later 😴');

    if (user.coins < rollCost)
      return message.reply(`Insufficient balance! You need at least ${rollCost} coins to roll <PandaCry:908492210717200485>`);

    let character: Character | undefined;
    try {
      character = await getCharacter(null, '', true);

      if (!character) throw new Error('Returned undefined while rolling for character');

      user.coins -= rollCost;
      // @ts-ignore
      user.characters.push(createCharacterObject(character));
      await user.save();
    } catch (err) {
      console.warn(err);
      return message.reply('😱 Unable to roll! Please try again later');
    }

    replyCharacter(message, character);
  },
});

module.exports = Roll;
