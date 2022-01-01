import { quote } from '@discordjs/builders';
import axios from 'axios';

import Event from '../Structures/Event';
import User, { UserDocument } from '../Models/User';
import getOrCreateUser from '../lib/utils/getOrCreateUser';
import dotenv from 'dotenv';
dotenv.config();

interface quote {
  q: string;
  a: string;
  h: string;
}

const getQuote = async () => {
  const quoteArr: quote[] = (await axios.get('https://zenquotes.io/api/random')).data;
  const quote = quoteArr[0];
  return quote;
};

const rewardUser = (user: UserDocument) => {
  const award = 100; // awarded coins

  user.goalsStreak++;
  user.coins += award;
  user.goalsUpdatedAt = new Date();
};

const Goals = new Event('messageCreate', async (client, message) => {
  if (message.author.bot) return;
  if (message.channelId != process.env.GOALS_CHANNEL_ID) return; // goals channel
  // if (message.channelId != '908105673831768084') return; // moderators channel

  const authorId = message.author.id;

  let user: UserDocument | null;
  try {
    user = await User.findOne({ userId: authorId });
    if (!user) {
      // creating new user
      user = (await getOrCreateUser(authorId)) as UserDocument;
      rewardUser(user);
      await user.save();
    } else {
      // updating user streak
      const now = new Date();
      const diffInMilliSeconds = now.getTime() - user.goalsUpdatedAt.getTime();
      const hours = Math.floor(diffInMilliSeconds / 36e5);
      if (hours >= 20) {
        rewardUser(user);
        await user.save();
      }
    }
  } catch (err) {
    console.log('Unable to get user:', err);
  }

  getQuote()
    .then((res: quote) => {
      const motivationChannel = client.channels.cache.find((c) => c.id == process.env.MOTIVATION_CHANNEL_ID);
      if (motivationChannel && motivationChannel.isText()) {
        motivationChannel.send(`<@${authorId}> You're on a ${user?.goalsStreak} day streak 🔥\n${res.q} -${res.a}`);
      } else {
        console.log('Unable to send message to user in motivation channel');
      }
    })
    .catch((err: string) => {
      console.log('Unable to retreive quote:', err);
    });

  try {
    await message.react('💯');
    await message.react('908492212139094027');
    await message.react('908492210679455786');
  } catch (error) {
    console.warn('One of the emojis failed to react:', error);
  }
});

module.exports = Goals;
