import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("roles")
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  
  @Post()
  @ApiOperation({ summary: 'Tạo vai trò mới' })
  @ResponseMessage("Create a new role")
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách vai trò' })
  @ResponseMessage("Get all roles")
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy vai trò theo ID' })
  @ResponseMessage("Get role by ID")
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật vai trò theo ID' })
  @ResponseMessage("Update role by ID")
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa vai trò theo ID' })
  @ResponseMessage("Delete role by ID")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
