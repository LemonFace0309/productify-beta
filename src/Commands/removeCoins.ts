import { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import getOrCreateUser from '../lib/utils/getOrCreateUser'; 

const Give = new Command({
  name: 'remove',
  description: 'Remove coins from someone',
  type: CommandType.SLASH,
  slashCommandOptions: [
    {
      name: 'member',
      description: 'Removes coins from this person',
      type: 'USER',
      required: true,
    },
    {
      name: 'amount',
      description: 'The amount of coins removed',
      type: 'INTEGER',
      required: true,
    },
  ],
  permission: 'MANAGE_MESSAGES',
  run: async (message, args, client) => {
    const userId = args[1];
    const amount = parseInt(args[2]);
    let coinsRemoved = 0;

    if (!amount || isNaN(amount)) {
      return message.reply(`${args[1]} is not a valid number!`);
    }

    const userObj: GuildMember | undefined = message.guild?.members.cache.find((member) => member.id === userId);

    if (!userObj) return message.reply(`User does not exist!`);

    try {
      const user = await getOrCreateUser(userObj.id);

      if (!user) return message.reply(`Unable to remove coins from ${userObj.user.username}`);

      coinsRemoved = Math.min(user.coins, amount);
      user.coins -= coinsRemoved;
      await user.save();
      const msg = await message.reply(`Success! 📉 Removed ${coinsRemoved} coins from ${userObj.user.username}`);
    } catch(err) {
      console.log('Unable to remove coins from user:', err);
    }
  },
});

module.exports = Give;
