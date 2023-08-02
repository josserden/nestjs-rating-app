import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './users.model/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async getByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create({ email, password }: { email: string; password: string }) {
    const user = new this.userModel({ email, password });
    return user.save();
  }
}
