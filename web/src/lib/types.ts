// src/lib/types.ts
// schema (กฎตรวจ response body ตอนรัน) + type ที่ได้จาก schema เดียวกัน
// วันเวลาใน JSON เป็น string ISO ไม่ใช่ Date
// ไฟล์อื่นที่ต้องการแค่ type (เช่น Client Component) ให้ใช้ `import type` เพื่อไม่ดึง zod ไปด้วย

import z from "zod";

export const bookingSchema = z.object({
  id: z.number(),
  roomId: z.number(),
  title: z.string(),
  bookerName: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string(),
});

export const roomSchema = z.object({
  id: z.number(),
  name: z.string(),
  capacity: z.number(),
  bookings: z.array(bookingSchema),
});

// type ได้จาก schema อัตโนมัติ ไม่ต้องเขียนซ้ำ
export type Booking = z.infer<typeof bookingSchema>;
export type Room = z.infer<typeof roomSchema>;
