import { createParamDecorator } from '@nestjs/common';
export const CurrentUser = createParamDecorator((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
//# sourceMappingURL=current-user.decorator.js.map