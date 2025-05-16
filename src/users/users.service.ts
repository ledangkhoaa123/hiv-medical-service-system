import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(

    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ){}
 async create(createUserDto: CreateUserDto) {
  const isExist = await this.userModel.findOne({email: createUserDto.email});
  if(isExist){
    throw new BadRequestException("Email đã tồn tại!")
  }
   const user = await this.userModel.create(createUserDto);
    return {
      user: {
        _id: user._id,
        _name: user.name
      }
    }
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async findByEmail(email: string){
    return await this.userModel.findOne({email: email});
  }
}
