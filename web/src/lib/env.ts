// src/lib/env.ts
// หน้าที่: ตรวจค่าใน .env ตอนแอปเริ่มรัน ถ้าค่าผิดหรือขาด แอปจะไม่ยอมรัน
import z from "zod";

// ขั้น 1: เขียน "กฎ" ว่า .env ต้องมีอะไรบ้าง
// API_URL ต้องเป็น URL ที่ถูกต้อง เช่น http://localhost:8000
const envSchemas = z.object({
  API_URL: z.url(),
});

// ขั้น 2: เอา "ค่าจริง" จาก .env มาตรวจกับกฎ
// safeParse ไม่โยน error ให้เอง แต่คืนผลลัพธ์กลับมา 2 แบบ
//   ผ่าน:   { success: true,  data: { API_URL: "http://localhost:8000" } }
//   ไม่ผ่าน: { success: false, error: ... }
const parsed = envSchemas.safeParse({
  API_URL: process.env.API_URL,
});

// ขั้น 3: ถ้าไม่ผ่าน ให้โยน error ทันที (แอปรันไม่ได้ และบอกว่าผิดตรงไหน)
if (!parsed.success) {
  throw new Error(`Env validation failed\n${z.prettifyError(parsed.error)}`);
}

// ขั้น 4: ส่งออกเฉพาะค่าที่ตรวจผ่านแล้ว ไฟล์อื่นเรียกใช้ด้วย env.API_URL
export const env = parsed.data;
