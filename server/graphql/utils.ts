import { Context } from 'config/apolloServer';
import User from 'models/user';

export const permitAdmin = async (ctx: Context): Promise<User> => {
  const user = await User.query().findById(ctx.user?.id);
  if (user?.roleId >= 3) throw new Error('Not permitted');
  return user;
};
