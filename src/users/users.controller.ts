import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUser } from './user.interface';

@ApiTags("users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Đăng ký tài khoản mới (admin)' })
  @ResponseMessage("Create a new user account")
  create(@Body() createUserDto: CreateUserDto,  @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ResponseMessage("Get all users")
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ResponseMessage("Get user by ID")
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

 @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của người dùng cần cập nhật' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
  
  @ResponseMessage("Update user by ID")
  update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto, 
    @User() user: IUser
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng theo ID' })
  @ResponseMessage("Delete user by ID")
  remove(@Param('id') id: string,  @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
