// src/decorators/get-user-id.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.userId;  // Certifique-se de que seu JwtStrategy está configurado para anexar 'userId' ao request.user
  },
);
