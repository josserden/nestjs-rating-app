import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';

import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { AuthModel } from './auth.model/auth.model';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthModel.name)
    private readonly authModel: Model<AuthModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.authModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    });

    return await newUser.save();
  }

  async findUser(email: string) {
    return await this.authModel.findOne({ email }).exec();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<AuthModel, 'email'>> {
    const user = await this.findUser(email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = await compare(password, user.passwordHash);

    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return {
      email: user.email,
    };
  }

  async login(email: string) {
    const payload = { email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
