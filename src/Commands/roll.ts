import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import { Character } from '../lib/types';
import getOrCreateUser from '../lib/utils/getOrCreateUser';
import getCharacter, { getCharacters } from '../lib/utils/getCharacter';
import replyCharacter, { replyCharacterScroll } from '../lib/utils/replyCharacter';
import createCharacterObject, { createCharacterObjects } from '../lib/utils/createCharacterObject';

const Roll = new Command({
  name: 'r',
  description: 'Roll for a random waifu or husbando',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    const rollCost = 50;
    const multiQuantity = 10;
    const multiBonus = 2;
    const author = message.author;
    const userObj: GuildMember | undefined = message.guild?.members.cache.find((member) => member.id === author.id);

    if (!userObj) return message.reply(`User does not exist!`);

    const user = await getOrCreateUser(userObj.id);

    if (!user) return message.reply('Unable to roll. Try again later 😴');

    const isMulti = args[1] && args[1] == 'multi';

    if (!isMulti && args[1])
      return message.reply(`Invalid secondary command! Use '$r multi' for a multi roll <:PandaDerp:908492210834661438>`);

    if ((isMulti && user.coins < rollCost * multiQuantity) || user.coins < rollCost)
      return message.reply(
        `Insufficient balance! You need at least ${rollCost} coins to roll a single and
        ${rollCost * multiQuantity} to roll a multi <:PandaCry:908492210717200485>`
      );

    try {
      if (isMulti) {
        const characters = await getCharacters(multiQuantity + multiBonus, null, true);

        if (!characters) throw new Error('Returned undefined while rolling for characters');

        user.coins -= rollCost * multiQuantity;
        user.characters = user.characters.concat(createCharacterObjects(characters));
        await user.save();

        return replyCharacterScroll(message, characters);
      } else {
        const character = await getCharacter(null, '', 0, true);

        if (!character) throw new Error('Returned undefined while rolling for character');

        user.coins -= rollCost;
        user.characters.push(createCharacterObject(character));
        await user.save();

        replyCharacter(message, character);
      }
    } catch (err) {
      console.warn(err);
      return message.reply('😱 Unable to roll! Please try again later');
    }
  },
});

module.exports = Roll;
