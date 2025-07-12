import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './local-auth-guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/user.interface';
import { log } from 'console';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpgradeFromGuestDto } from 'src/patients/dto/create-patient.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
    private rolesService: RolesService,
  ) { }

  @Public()
  @Post('/login')
  @ResponseMessage('Login by user')
  @ApiBody({ type: UserLoginDto, })
  @ApiOperation({ summary: 'Đăng nhập' })
  @UseGuards(LocalAuthGuard)
  login(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(req.user, res);
  }
  @Public()
  @ApiOperation({ summary: 'Đăng ký tài khoản mới (user)' })
  //@ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDTO: RegisterUserDto) {
    return this.usersService.register(registerUserDTO);
  }
  @Public()
  @ApiOperation({ summary: 'Nâng cấp tài khoản từ khách lên người dùng' })
  @ResponseMessage('Upgrade account from guest to user')
  @Post('/upgrade')
  upgradeToUser(@Body() upgradeFromGuestDTO: UpgradeFromGuestDto) {
    return this.usersService.upgradeFromGuest(upgradeFromGuestDTO);
  }
  @Get('/account')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản người dùng' })
  @ResponseMessage('Get user account information')
  async getProfile(@User() user: IUser) {
    const temp = await this.rolesService.findOne(user.role._id) as any;
    user.permissions = temp.permissions;
    return { user };
  }

  @Public()
  @Get('/refresh')
  @ApiOperation({ summary: 'Lấy token mới từ refresh token' })
  @ResponseMessage('Get user refresh token')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_Token'];
    return this.authService.processNewToken(refreshToken, response);
  }
  @Public()
  @Get('/verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Res() res: Response
  ) {
    try {
      await this.authService.verifyEmail(token);
      return res.redirect('http://localhost:5173/verification');
    } catch (error) {
      return res.status(400).send('Token không hợp lệ hoặc đã hết hạn');
    }
  }
  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@gmail.com' },
      },
      required: ['email'],
    },
  })
  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('/reset-password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'jwt-token' },
        newPassword: { type: 'string', example: 'yourNewPassword123' },
      },
      required: ['token', 'newPassword'],
    },
  })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
  @Post('/change-password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string', example: 'oldPassword123' },
        newPassword: { type: 'string', example: 'newPassword456' },
      },
      required: ['oldPassword', 'newPassword'],
    },
  })
  async changePassword(
    @User() user: IUser,
    @Body() body: { oldPassword: string; newPassword: string }
  ) {
    return this.authService.changePassword(user, body.oldPassword, body.newPassword);
  }
  @ResponseMessage('User logout')
  @ApiOperation({ summary: 'Đăng xuất người dùng' })
  @Post('/logout')
  handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(response, user);
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

}
