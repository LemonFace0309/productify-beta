import User, { UserDocument } from '../../Models/User';

const getOrCreateUser = async (userId: string) => {
  // let user: UserDocument & { _id: any } | null = null;
  let user: UserDocument | null = null;
  try {
    user = await User.findOne({ userId: userId });
    if (!user) {
      // creating new user
      user = new User({ userId: userId, goalsStreak: 0, coins: 100 });
      await user.save();
    }
  } catch (err) {
    console.log('Unable to get user:', err);
  }

  return user;
};

export default getOrCreateUser;
