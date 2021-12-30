import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import getOrCreateUser from '../lib/utils/getOrCreateUser';
import { replyCharacterList } from '../lib/utils/replyCharacter'
import { CharacterDocument } from '../Models/Character';

const Inventory = new Command({
  name: 'inv',
  description: 'Get all your characters',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    let authorId = message.author.id;
    if (args.length > 1) {
      const startingIndex = args[1][2] == '!' ? 3 : 2;
      authorId = args[1].slice(startingIndex, -1);
    }

    const userObj: GuildMember | undefined = message.guild?.members.cache.find((member) => member.id === authorId);

    if (!userObj) return message.reply(`User does not exist!`);

    const user = await getOrCreateUser(userObj.id);

    if (!user) return message.reply('Unable to check your inventory');

    const characters: CharacterDocument[] = user.characters.sort((c1, c2) => c1.sukoa > c2.sukoa ? -1 : 1);
    const quantity = characters.length;

    if (quantity === 0) return message.reply(`${userObj.displayName} does not have any characters yet!`);

    try {
      await replyCharacterList(
        message,
        characters,
        `Inventory: ${quantity} characters owned <:Panda:908492210264211457>`
      );
    } catch (err) {
      console.log(err);
      message.reply(`Unable to collect your inventory!`);
    }
  },
});

module.exports = Inventory;
