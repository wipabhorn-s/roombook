import { EnvValidation } from '@/config/env.validation';
import { PrismaClient } from '@/database/generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable() // บอก Nest ว่าคลาสนี้เป็น provider ให้ DI container สร้างและฉีดให้ที่อื่นได้
export class PrismaService extends PrismaClient {
  constructor(
    private readonly configService: ConfigService<EnvValidation, true>,
  ) {
    const adapter = new PrismaPg({
      connectionString: configService.get('DATABASE_URL', { infer: true }),
    });
    super({ adapter });
  }
}
