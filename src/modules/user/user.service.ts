import { env } from '../../config/env';

import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Role } from './schemas/roles.enum';
import { generateActivationUrl } from '../../lib/jwt';
import { MailTemplates } from '../../lib/mail-templates';
import { sendMail } from '../../lib/smtp';
import { Context } from '../../context';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createDto: any, verified = false): Promise<UserDocument> {
    const createdUser = new this.userModel(createDto);
    createdUser.hash = await bcrypt.hash(createDto.password, env.SALT_ROUNDS);
    createdUser.salt = env.SALT_ROUNDS;
    await createdUser.save();

    if (verified) {
      await this.updateRole(createdUser?._id?.toHexString(), Role.USER);
    } else {
      await this.resendVerification(createdUser.id);
    }

    delete createdUser.hash;
    delete createdUser.salt;
    return createdUser;
  }

  async changePassword(id: any, password: string) {
    const user = await this.userModel
      .findOne({ _id: new ObjectId(id), _deletedAt: null })
      .exec();
    user.hash = await bcrypt.hash(password, env.SALT_ROUNDS);
    user.salt = env.SALT_ROUNDS;
    await this.userModel
      .updateOne({ _id: new ObjectId(id) }, { $set: user })
      .exec();
  }

  async findAll(keepHash = false): Promise<User[]> {
    const docs = await this.userModel.find({ _deletedAt: null }).exec();

    if (keepHash) {
      return docs;
    }

    return docs.map((doc) => {
      delete doc.hash;
      delete doc.salt;
      return doc;
    });
  }

  async findOneByUsernameOrEmail(
    value: string,
    keepHash = false,
  ): Promise<UserDocument> {
    const obj = await this.userModel
      .findOne({
        $or: [{ username: value }, { email: value }],
        _deletedAt: null,
      })
      .exec();

    if (!keepHash) {
      delete obj.hash;
      delete obj.salt;
    }
    return obj;
  }

  async findOneById(id: string, keepHash = false): Promise<UserDocument> {
    const obj = await this.userModel
      .findOne({ _id: new ObjectId(id), _deletedAt: null })
      .exec();

    if (obj && !keepHash) {
      delete obj.hash;
      delete obj.salt;
    }
    return obj;
  }

  async update(id: string, data: any) {
    return await this.userModel
      .updateOne({ _id: new ObjectId(id), _deletedAt: null }, { $set: data })
      .exec();
  }

  async updateRole(id: string, role: string) {
    const r = Role[role];
    if (r) {
      const user = await this.userModel
        .findOne({ _id: new ObjectId(id), _deletedAt: null })
        .exec();
      user.role = r;
      await this.userModel
        .updateOne({ _id: new ObjectId(id), _deletedAt: null }, { $set: user })
        .exec();

      return user;
    }
    throw new BadRequestException('Invalid role');
  }

  async resendVerification(id: any) {
    const user = await this.findOneById(id);

    const data = {
      username: user.username,
      url: generateActivationUrl((user as any)._id.toHexString(), user.email),
    };
    const template = MailTemplates.getTemplate('email-verification');
    await sendMail({
      from: `Pesmomat <${env.MAIL_ADDRESS}>`,
      to: user.email,
      subject: 'Registracija v Pesmomat',
      html: template(data),
    });
  }

  async deleteUser(context: Context, _id: any) {
    await this.userModel
      .updateOne({ _id }, { $set: { _deletedAt: new Date() } })
      .exec();
  }
}
