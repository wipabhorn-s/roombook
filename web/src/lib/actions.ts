// src/lib/actions.ts
// หน้าที่: Server Action สำหรับ "เขียนข้อมูล" ไปที่ backend (ตอนนี้มี createRoom)
// ฟอร์มในเบราว์เซอร์เรียกฟังก์ชันนี้ได้ แต่ตัวฟังก์ชันรันบน Next server
// แล้ว Next server เป็นคนยิง POST ไป backend (NestJS) เอง
// (ส่วน "อ่านข้อมูล" อยู่ใน api.ts)

// "use server" = เปิดทางให้ฟอร์มในเบราว์เซอร์เรียกฟังก์ชันที่ export จากไฟล์นี้ได้
"use server";

import { env } from "@/lib/env";
import { CreateRoomInput, createRoomSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

// ผลลัพธ์ที่ส่งกลับให้ฟอร์ม
//   สำเร็จ -> { error: null }
//   ล้มเหลว -> { error: "ข้อความที่จะแสดงสีแดง" }
// ใช้ return แทน throw เพื่อให้ฟอร์มแค่แสดงข้อความ ไม่ให้ทั้งหน้าขึ้น error
type ActionResult = { error: string | null };

// สร้างห้อง: ตรวจข้อมูล -> ยิง POST ไป backend -> เช็กผล -> รีเฟรชหน้า
export async function createRoom(
  input: CreateRoomInput,
): Promise<ActionResult> {
  // ขั้น 1: เอา input มาเทียบกับ schema (กฎที่เขียนไว้ใน schemas.ts)
  // ถ้าไม่ผ่านก็จบเลย ไม่ต้องเสียเวลายิงไป backend
  const parsed = createRoomSchema.safeParse(input);
  if (!parsed.success) {
    // issues[0].message = ข้อความของปัญหาแรกที่เราเขียนไว้ใน schema เช่น "Room name is required"
    return { error: parsed.error.issues[0].message };
  }

  // ขั้น 2: ยิง POST ไป backend
  // ประกาศ res ไว้ข้างนอก try ก่อน เพราะตัวแปรที่ประกาศใน { } ของ try
  // จะใช้นอก { } ไม่ได้ (let = ประกาศก่อน กำหนดค่าทีหลังได้, const ทำไม่ได้)
  let res: Response;
  // ครอบ try/catch เฉพาะ fetch เพราะ fetch จะ throw ก็ต่อเมื่อ "ติดต่อ backend ไม่ได้เลย"
  // เช่น API ไม่ได้รัน (ถ้า backend ตอบ 400/409 fetch จะไม่ throw)
  try {
    res = await fetch(`${env.API_URL}/rooms`, {
      method: "POST", // ไม่ระบุจะเป็น GET
      // บอก backend ว่า body เป็น JSON (ถ้าลืม Nest อ่าน body ไม่ออก ตอบ 400)
      headers: { "Content-Type": "application/json" },
      // parsed.data = ข้อมูลที่ผ่านการตรวจและจัดแล้ว (เช่น ชื่อถูกตัดช่องว่าง)
      // ต้องแปลงเป็นข้อความ JSON ก่อนส่ง
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return { error: "Cannot reach the server" };
  }

  // ขั้น 3: เช็กว่า backend ตอบสำเร็จไหม
  // backend ตอบกลับมาเสมอ แม้จะเป็น error (400/404/409) fetch ไม่ throw ให้
  // เราต้องเช็ก res.ok เอง (true = status 200-299)
  if (!res.ok) {
    // เหตุผลที่ล้มเหลวอยู่ใน body ของ response ต้องแปลงเป็น JSON ก่อนถึงอ่านได้
    const body = await res.json();
    // message ที่ Nest ส่งมามี 2 แบบ:
    //   string เช่น "Room name already exists"
    //   array เช่น ["name should not be empty", ...] (มาจาก validation)
    // เช็กด้วย Array.isArray แล้วทำให้เป็นข้อความเดียวเสมอ
    // (a ? b : c คือ if-else แบบสั้น: ถ้า a จริงได้ b ไม่งั้นได้ c)
    const message = Array.isArray(body.message)
      ? body.message.join(", ") // array -> ต่อเป็นข้อความเดียวคั่นด้วย ", "
      : body.message; // string อยู่แล้ว -> ใช้เลย

    return { error: message };
  }

  // ขั้น 4: สำเร็จ -> บอก Next ว่าข้อมูลของหน้า "/" เก่าแล้ว ให้ดึงใหม่
  // หน้าจะแสดงห้องที่เพิ่งเพิ่มโดยผู้ใช้อยู่หน้าเดิม ไม่ได้ถูกพาไปหน้าอื่น
  revalidatePath("/");

  return { error: null };
}
