import { GuildMember, TextChannel } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import User, { UserDocument } from '../Models/User';

const Give = new Command({
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

    let user: (UserDocument & { _id: any }) | null;
    try {
      user = await User.findOne({ userId: userObj.id });
      if (!user) {
        // creating new user
        user = new User({ userId: userObj.id, goalsStreak: 0, coins: amount });
        await user.save();
      } else {
        // updating user coins
        user.coins += amount;
        await user.save();
      }
      const msg = await message.reply(`Gave ${amount} coins to ${userObj.user.username}`);
    } catch (err) {
      console.log('Unable to get user:', err);
    }
  },
});

module.exports = Give;
