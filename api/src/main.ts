import { NestFactory } from '@nestjs/core'; // NestFactory คือตัวสร้างแอป Nest
import { AppModule } from './app.module'; // AppModule คือ module หลัก ซึ่ง import module อื่นทั้งหมดไว้
import { Logger, ValidationPipe } from '@nestjs/common'; // Logger คือตัวพิมพ์ log ของ Nest (มีสี มีเวลา มีชื่อที่มา)

//bootstrap แปลว่า "สตาร์ทระบบ" เป็นชื่อที่ใช้กันทั่วไป
async function bootstrap() {
  // NestFactory.create(AppModule) สร้างแอปจาก AppModule ตรงนี้ DI container จะสร้าง instance ของทุก provider และ ConfigModule จะอ่าน .env
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  // app.listen(...) เปิดเซิร์ฟเวอร์รอรับ request
  // process.env.PORT ?? 3000 ใช้ PORT จาก .env ถ้าไม่มี (null/undefined) ให้ใช้ 3000
  await app.listen(process.env.PORT ?? 3000);
}
// bootstrap() เป็น async เลยคืน Promise ถ้าพังระหว่างเริ่มแอป เช่น ต่อ DB ไม่ได้, .env ผิด (Zod โยน error), port ชนกัน Promise จะ reject
// .catch(...) รับ error นั้นไว้ ถ้าไม่มี catch จะได้แค่ error แบบ unhandled rejection อ่านยาก และ ESLint จะเตือน no-floating-promises ด้วย
bootstrap().catch((error) => {
  // new Logger('Bootstrap') สร้าง logger ชื่อ Bootstrap บรรทัด log จะขึ้น [Bootstrap] ให้รู้ว่ามาจากตรงไหน
  const logger = new Logger('Bootstrap');
  // logger.error(...) พิมพ์ข้อความเป็นสีแดงพร้อมรายละเอียด error
  logger.error('Application failed to start', error);
  // process.exit(1) ปิดโปรแกรมด้วย exit code 1 ซึ่งแปลว่า "จบแบบล้มเหลว" (0 = สำเร็จ) Docker หรือระบบ deploy จะรู้ว่าแอปพังแล้วรีสตาร์ตหรือแจ้งเตือนได้ ไม่ใช่ค้างอยู่เฉยๆ
  process.exit(1);
});
