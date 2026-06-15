import { Controller, Get, Param } from '@nestjs/common';
import { PublicService } from './public.service.js';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('events/:slug')
  findEvent(@Param('slug') slug: string) {
    return this.publicService.findEventBySlug(slug);
  }
}
