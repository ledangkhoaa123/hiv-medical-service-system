import { profile } from 'console';

export interface IUser {
  _id: string;
  email: string;
  name: string;
  gender: string;
  address: string;
  avatarURL: string;
  role: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: string;
    name: string;
    apiPath: string;
    module: string;
  }[];
}
