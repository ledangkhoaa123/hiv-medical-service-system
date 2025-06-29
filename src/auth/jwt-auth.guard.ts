import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err || new UnauthorizedException('Token không hợp lệ || không có token')
      );
    }
    //check permission
    // const targetMethod = request.method;
    // const targetEndPoint = request.route?.path as string;

    // const permissions = user?.permissions ?? [];

    // let isExist = permissions.find(
    //   (permission) =>
    //     targetEndPoint === permission.apiPath &&
    //     targetMethod === permission.method,
    // );
    // if(targetEndPoint.startsWith('/auth')) isExist = true;
    //Tạm tắt Permission

    const isPublicPermission = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_PERMISSION,
      [context.getHandler(), context.getClass()],
    );
    //  if (!isExist && !isPublicPermission) {
    //   throw new ForbiddenException(
    //     'Bạn không có quyền để truy cập EndPoint này',
    //   );
    // }
    return user;
  }
}
