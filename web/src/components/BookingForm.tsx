// src/components/BookingForm.tsx
// หน้าที่: ฟอร์มจองห้อง (เลือกห้อง, หัวข้อ, ชื่อผู้จอง, เวลาเริ่ม, เวลาจบ)
// ตอนนี้เป็นขั้น 6: เพิ่มตัวจัดการตอนกดส่ง (ตรวจข้อมูล -> เรียก createBooking -> แสดงผล)

// 'use client' = ให้ component นี้รันในเบราว์เซอร์ (เพราะฟอร์มต้องโต้ตอบกับผู้ใช้)
"use client";

import { Field, inputClass } from "@/components/Field";
import { FormError } from "@/components/FormError";
import { SubmitButton } from "@/components/SubmitButton";
import { createBooking } from "@/lib/actions";
import { createBookingSchema } from "@/lib/schemas";
import type { Room } from "@/lib/types";
import { useState, type SubmitEvent } from "react";

// แปลงค่าจากช่อง datetime-local (เช่น "2026-11-20T10:00") เป็นข้อความ ISO ที่ backend ต้องการ
// (เช่น "2026-11-20T03:00:00.000Z" ซึ่งเป็นเวลา UTC ตรงกับเวลา 10:00 ของไทย)
// ถ้าช่องว่างต้องคืนข้อความว่าง ไม่งั้น new Date("") จะเป็น Invalid Date แล้ว toISOString() พัง
// (ข้อความว่างจะไม่ผ่าน schema แล้วผู้ใช้เห็น "Start time is required")
function toIso(value: string): string {
  return value ? new Date(value).toISOString() : "";
}

// rooms = รายการห้องที่ page.tsx (Server Component) ดึงมาแล้วส่งเข้ามาทาง props
// ใช้ import type เพราะที่นี่ต้องการแค่ "ชนิดของข้อมูล" ไม่ได้ใช้ schema ตรวจ
export function BookingForm({ rooms }: { rooms: Room[] }) {
  // error = ข้อความสีแดงที่จะแสดง (null = ไม่มี error)
  const [error, setError] = useState<string | null>(null);

  // pending = กำลังส่งข้อมูลไป server อยู่หรือไม่
  const [pending, setPending] = useState(false);

  // ฟังก์ชันที่ทำงานตอนผู้ใช้กดปุ่มส่ง
  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    // ไม่ให้เบราว์เซอร์โหลดหน้าใหม่ตอนส่งฟอร์ม (เราจัดการเอง)
    e.preventDefault();

    // เก็บตัวฟอร์มไว้ก่อน เพราะหลังจากมี await แล้ว e.currentTarget จะใช้ไม่ได้
    const form = e.currentTarget;

    // ดึงค่าทุกช่องตามชื่อ name (ได้เป็นข้อความเสมอ ต้องแปลงให้ตรงกับที่ schema ต้องการ)
    const data = new FormData(form);
    const parsed = createBookingSchema.safeParse({
      // ยังไม่เลือกห้อง ค่าเป็น "" -> Number("") = 0 -> ไม่ผ่านกฎ min(1) ("Please select a room")
      roomId: Number(data.get("roomId")),
      title: String(data.get("title")),
      bookerName: String(data.get("bookerName")),
      // แปลงเป็น ISO ก่อนส่งให้ schema ตรวจ
      startTime: toIso(String(data.get("startTime"))),
      endTime: toIso(String(data.get("endTime"))),
    });

    // ไม่ผ่าน -> แสดงข้อความแรกที่เราเขียนไว้ใน schema แล้วหยุด (รวมกฎ "เวลาจบต้องหลังเวลาเริ่ม")
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    // ผ่านแล้ว: ล้าง error เก่า และบอกว่ากำลังส่ง (ปุ่มจะถูกปิดและขึ้น Booking...)
    setError(null);
    setPending(true);

    try {
      // เรียก Server Action (รันบน server แล้วยิง POST /bookings ไป backend ให้)
      const result = await createBooking(parsed.data);

      // backend ปฏิเสธ (เช่น เวลาทับกับการจองเดิม, ไม่พบห้อง) -> แสดงข้อความสีแดงแล้วหยุด
      if (result.error) {
        setError(result.error);
        return;
      }

      // สำเร็จ -> ล้างช่องกรอก (รายการจองจะอัปเดตเองจาก revalidatePath ใน action)
      form.reset();
    } finally {
      // ไม่ว่าสำเร็จหรือพลาด ต้องปลดสถานะกำลังส่งเสมอ ไม่งั้นปุ่มจะค้าง
      setPending(false);
    }
  }

  return (
    // onSubmit = เมื่อกดส่ง ให้เรียก handleSubmit
    // noValidate = ปิดข้อความเตือนของเบราว์เซอร์ เพื่อให้ข้อความสีแดงของเราแสดงแทน
    // space-y-4 = เว้นระยะแนวตั้งระหว่างส่วนต่างๆ, rounded-lg border p-4 = ทำเป็นกล่องมีกรอบ
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-lg border border-gray-200 p-4"
    >
      {/* มือถือเรียง 1 คอลัมน์, จอตั้งแต่ขนาดกลางขึ้นไปวาง 2 คอลัมน์ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* sm:col-span-2 = ช่องเลือกห้องกว้างเต็ม 2 คอลัมน์ (ช่องอื่นแบ่งครึ่งแถว) */}
        <Field label="Room" htmlFor="booking-room" className="sm:col-span-2">
          {/* <select> = ช่องเลือกจากรายการ, name="roomId" ตรงกับ field roomId ใน createBookingSchema
              defaultValue="" = เริ่มต้นเลือกตัวเลือกแรก (ที่ยังไม่ได้เลือกห้อง) */}
          <select
            id="booking-room"
            name="roomId"
            defaultValue=""
            className={inputClass}
          >
            {/* ตัวเลือกแรก value เป็นข้อความว่าง = ยังไม่ได้เลือกห้อง */}
            <option value="">Select a room</option>
            {/* วนสร้างตัวเลือกจากรายการห้อง
                value = id ของห้อง (จะถูกส่งไปเป็น roomId), ข้อความที่ผู้ใช้เห็นคือชื่อห้อง
                key = ค่าที่ไม่ซ้ำกันของแต่ละรายการ (ใช้ id ของห้อง) */}
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (capacity {room.capacity})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Title" htmlFor="booking-title">
          <input
            id="booking-title"
            name="title"
            type="text"
            className={inputClass}
          />
        </Field>

        <Field label="Booker name" htmlFor="booking-booker">
          <input
            id="booking-booker"
            name="bookerName"
            type="text"
            className={inputClass}
          />
        </Field>

        <Field label="Start time" htmlFor="booking-start">
          {/* type="datetime-local" = ช่องเลือกวันและเวลา (ค่าที่ได้เป็นข้อความ เช่น "2026-11-20T10:00")
              ตอนกดส่งจะแปลงเป็น ISO ด้วย toIso() ก่อนส่งไป backend */}
          <input
            id="booking-start"
            name="startTime"
            type="datetime-local"
            className={inputClass}
          />
        </Field>

        <Field label="End time" htmlFor="booking-end">
          <input
            id="booking-end"
            name="endTime"
            type="datetime-local"
            className={inputClass}
          />
        </Field>
      </div>

      {/* FormError = ข้อความ error สีแดง (ถ้า error เป็น null ไม่แสดงอะไร) */}
      <FormError message={error} />

      {/* SubmitButton = ปุ่มส่ง ระหว่างส่ง (pending) จะกดซ้ำไม่ได้และเปลี่ยนเป็น "Booking..." */}
      <SubmitButton
        pending={pending}
        label="Book room"
        pendingLabel="Booking..."
      />
    </form>
  );
}
