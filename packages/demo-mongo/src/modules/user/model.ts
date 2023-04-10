import { Schema, model } from 'mongoose';

const userSchema = new Schema<IUserScheme>({
  name: { type: String, required: true },
  phone: { type: String, required: false }
});

const User = model<IUserScheme>('User', userSchema);

export function saveUser(data: Partial<IUserScheme>) {
  const user = new User(data);
  return user.save();
}

export function findUserList(page: number, pageSize: number) {
  return User.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize);
}
