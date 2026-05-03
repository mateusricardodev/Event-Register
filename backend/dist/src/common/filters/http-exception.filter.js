var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Catch, HttpException, HttpStatus, } from '@nestjs/common';
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException
            ? exception.getResponse()
            : 'Erro interno do servidor';
        response.status(status).json({
            statusCode: status,
            ...(typeof message === 'string' ? { message } : message),
            timestamp: new Date().toISOString(),
        });
    }
};
HttpExceptionFilter = __decorate([
    Catch()
], HttpExceptionFilter);
export { HttpExceptionFilter };
//# sourceMappingURL=http-exception.filter.js.map