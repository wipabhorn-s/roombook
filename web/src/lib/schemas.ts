// src/lib/schemas.ts

import z from "zod";

// การสร้าง
export const createRoomSchema = z.object({
  name: z.string().trim().min(1, "Room name is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

// การจอง
export const createBookingSchema = z
  .object({
    // roomId มาจาก <select> ถ้ายังไม่เลือกห้องจะได้ 0 -> ไม่ผ่าน min(1)
    roomId: z.number().int().min(1, "Please select a room"),
    // ข้อความที่ไม่ว่าง (trim = ตัดช่องว่างหน้าหลังก่อนตรวจ เหมือน name ของห้อง)
    title: z.string().trim().min(1, "Title is required"),
    bookerName: z.string().trim().min(1, "Booker name is required"),
    // เวลาต้องเป็นข้อความ ISO เช่น "2026-11-20T03:00:00.000Z"
    // (ฟอร์มจะแปลงจาก datetime-local ให้ ถ้าช่องว่างจะส่งข้อความว่างมา -> ไม่ผ่าน)
    startTime: z.iso.datetime({ error: "Start time is required" }),
    endTime: z.iso.datetime({ error: "End time is required" }),
  })
  // refine = กฎที่ต้องดูหลายช่องพร้อมกัน: เวลาจบต้องหลังเวลาเริ่ม
  // ฟังก์ชันคืน true = ผ่าน, false = ไม่ผ่าน (แล้วแสดงข้อความ error ที่ช่อง endTime ตาม path)
  // refine ทำงานเมื่อทุกช่องข้างบนผ่านแล้วเท่านั้น จึงแปลงเป็น Date ได้อย่างปลอดภัย
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    error: "End time must be after start time",
    path: ["endTime"],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
