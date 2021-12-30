import { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import getOrCreateUser from '../lib/utils/getOrCreateUser'; 

const GiveCoins = new Command({
  name: 'give',
  description: 'Gives someone coins',
  type: CommandType.SLASH,
  slashCommandOptions: [
    {
      name: 'member',
      description: 'Gives coins to this person',
      type: 'USER',
      required: true,
    },
    {
      name: 'amount',
      description: 'The amount of coins given',
      type: 'INTEGER',
      required: true,
    },
  ],
  permission: 'MANAGE_MESSAGES',
  run: async (message, args, client) => {
    const userId = args[1];
    const amount = parseInt(args[2]);

    if (!amount || isNaN(amount)) {
      return message.reply(`${args[1]} is not a valid number!`);
    }

    if (amount > 1000000) return message.reply('You cannot give someone more than 1000000 coins!');

    const userObj : GuildMember | undefined = message.guild?.members.cache.find((member) => member.id === userId);

    if (!userObj) return message.reply(`User does not exist!`);

    try {
      const user = await getOrCreateUser(userObj.id);

      if (!user) return message.reply(`Unable to remove coins from ${userObj.user.username}`);

      user.coins += amount;
      await user.save();
      const msg = await message.reply(`Success!💸 Gave ${amount} coins to ${userObj.user.username}`);
    } catch (err) {
      console.log('Unable to remove coins from user:', err);
    }
  },
});

module.exports = GiveCoins;
