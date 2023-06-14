import { Document } from 'mongoose';

export interface User extends Document{
  name: string;
  surname: string;
  email: string;
  password: string;
  auth: {
    email : {
      valid : boolean,
    },
    facebook: {
      userid: string
    },
    gmail: {
      userid: string
    }
  },settings: {
  },
}