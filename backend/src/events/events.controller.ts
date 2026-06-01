import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { extname, join } from 'path';
import { readFileSync, unlinkSync } from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtGuard)
  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.eventsService.findAll(user.id);
  }

  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateEventDto,
  ) {
    return this.eventsService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.eventsService.remove(id, user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':id/payment-methods')
  getPaymentMethods(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.eventsService.getPaymentMethods(id, user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/payment-methods')
  addPaymentMethod(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.eventsService.addPaymentMethod(id, user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/banner')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif|webp)/)) {
          return cb(new BadRequestException('Apenas imagens são permitidas'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadBanner(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');

    const buffer = readFileSync(file.path);
    const detected = await fileTypeFromBuffer(buffer);
    if (!detected || !ALLOWED_IMAGE_TYPES.has(detected.mime)) {
      unlinkSync(file.path);
      throw new BadRequestException('Arquivo não é uma imagem válida');
    }

    return this.eventsService.uploadBanner(id, user.id, file.filename);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/payment-methods/:methodId')
  removePaymentMethod(
    @Param('id') id: string,
    @Param('methodId') methodId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.eventsService.removePaymentMethod(id, methodId, user.id);
  }
}
