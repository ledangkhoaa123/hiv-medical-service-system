import { profile } from 'console';
export interface IUser {
  _id: string;

  email: string;
<<<<<<< HEAD

  name: string;

=======
  name: string;
>>>>>>> bc4e70c9f9a66ad30225c1718175f7cbc834679d
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
