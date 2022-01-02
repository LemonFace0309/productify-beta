import Timer, { TimerDocument } from '../../Models/Timer';

const getOrCreateGuildTimer = async (guildId: string) => {
  // let user: UserDocument & { _id: any } | null = null;
  let timer: TimerDocument | null = null;
  try {
    timer = await Timer.findOne({ guildId });
    if (!timer) {
      // creating new timer
      timer = new Timer({ guildId, channels: [] });
      await timer.save();
    }
  } catch (err) {
    console.log('Unable to get or create timer:', err);
  }

  return timer;
};

export default getOrCreateGuildTimer;
