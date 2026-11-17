import { Logger } from '@nestjs/common';
import z from 'zod';

const envSchemas = z.object({
  // z.coerce = แปลง
  PORT: z.coerce.number().int().max(65535).min(0),
});

export function validate(config: Record<string, any>) {
  // safeParse = ไม่โยน error ให้ขึ้น fail แทน
  const parsed = envSchemas.safeParse(config);
  if (!parsed.success) {
    const logger = new Logger('EnvValidation');
    logger.error('Env validation failed', z.prettifyError(parsed.error));
    throw new Error('Env validation failed');
  }
  return parsed.data;
}

// z.inner คืออนุมาน type ใน envSchemas ให้เลย
export type EnvValidation = z.infer<typeof envSchemas>;
