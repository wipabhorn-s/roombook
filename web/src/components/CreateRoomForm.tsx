// src/components/CreateRoomForm.tsx
// หน้าที่: ฟอร์มสร้างห้อง (ชื่อ + ความจุ)
// ตอนนี้เป็นขั้น 3: เพิ่มตัวจัดการตอนกดส่ง (ตรวจข้อมูล -> เรียก createRoom -> แสดงผล)

// 'use client' = ให้ component นี้รันในเบราว์เซอร์ (เพราะฟอร์มต้องโต้ตอบกับผู้ใช้)
"use client";

import { Field, inputClass } from "@/components/Field";
import { FormError } from "@/components/FormError";
import { SubmitButton } from "@/components/SubmitButton";
import { createRoom } from "@/lib/actions";
import { createRoomSchema } from "@/lib/schemas";
import { SubmitEvent, useState } from "react";

// component ไม่ต้องรับข้อมูลเข้ามา (ไม่มีวงเล็บพารามิเตอร์) เพราะฟอร์มเก็บค่าที่ผู้ใช้พิมพ์เอง
export function CreateRoomForm() {
  // useState = ตัวแปรที่ "จำค่าไว้" และเมื่อค่าเปลี่ยน หน้าจะวาดใหม่ให้เอง
  // รูปแบบ: const [ค่า, ฟังก์ชันเปลี่ยนค่า] = useState(ค่าเริ่มต้น)

  // error = ข้อความสีแดงที่จะแสดง (null = ไม่มี error)
  const [error, setError] = useState<string | null>(null);

  // pending = กำลังส่งข้อมูลไป server อยู่หรือไม่ (เริ่มต้น = ยังไม่ส่ง)
  const [pending, setPending] = useState(false);

  // ฟังก์ชันที่ทำงานตอนผู้ใช้กดปุ่มส่ง
  // FormEvent<HTMLFormElement> = ชนิดของ "เหตุการณ์ส่งฟอร์ม" ที่ React ส่งเข้ามาให้ (ตัวแปร e)
  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    // ปกติเบราว์เซอร์จะโหลดหน้าใหม่ตอนส่งฟอร์ม เราจัดการเองจึงต้องห้ามไว้
    e.preventDefault();

    // เก็บตัวฟอร์มไว้ในตัวแปรก่อน เพราะหลังจากมี await แล้ว e.currentTarget จะใช้ไม่ได้
    const form = e.currentTarget;

    // ดึงค่าทุกช่องในฟอร์ม โดยเรียกตามชื่อ name ของช่องกรอก (name="name", name="capacity")
    // ค่าที่ได้จากฟอร์มเป็นข้อความ (string) เสมอ
    const data = new FormData(form);

    // เอาค่ามาเทียบกับ schema (กฎเดียวกับที่ action ใช้)
    // String(...) แปลงเป็นข้อความ, Number(...) แปลง capacity เป็นตัวเลข เพราะ schema ต้องการตัวเลข
    const parsed = createRoomSchema.safeParse({
      name: String(data.get("name")),
      capacity: Number(data.get("capacity")),
    });

    // ไม่ผ่าน -> แสดงข้อความแรกที่เราเขียนไว้ใน schema แล้วหยุด (ไม่ต้องส่งไป server)
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    // ผ่านแล้ว: ล้าง error เก่า และบอกว่ากำลังส่ง (ปุ่มจะถูกปิดและขึ้น Saving...)
    setError(null);
    setPending(true);

    try {
      // เรียก Server Action (รันบน server แล้วยิง POST ไป backend ให้)
      // parsed.data = ข้อมูลที่ตรวจและจัดแล้ว (เช่น ชื่อถูกตัดช่องว่าง)
      const result = await createRoom(parsed.data);

      // backend ปฏิเสธ (เช่น ชื่อห้องซ้ำ) -> แสดงข้อความสีแดงแล้วหยุด
      if (result.error) {
        setError(result.error);
        return;
      }

      // สำเร็จ -> ล้างช่องกรอกให้ว่าง (รายการห้องจะอัปเดตเองจาก revalidatePath ใน action)
      form.reset();
    } finally {
      // finally ทำงานเสมอ ไม่ว่าสำเร็จ พลาด หรือ return ไปก่อน
      // ต้องปลดสถานะกำลังส่งทุกกรณี ไม่งั้นปุ่มจะค้างปิดอยู่
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
      {/* grid-cols-1 = มือถือเรียง 1 คอลัมน์, sm:grid-cols-2 = จอตั้งแต่ขนาดกลางขึ้นไปวางข้างกัน 2 คอลัมน์ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Field = ป้ายชื่อ + ช่องกรอก (htmlFor ต้องตรงกับ id ของช่องกรอก) */}
        <Field label="Room name" htmlFor="room-name">
          {/* name ต้องตรงกับที่ดึงด้วย data.get("name") ใน handleSubmit */}
          <input
            id="room-name"
            name="name"
            type="text"
            className={inputClass}
          />
        </Field>

        <Field label="Capacity" htmlFor="room-capacity">
          <input
            id="room-capacity"
            name="capacity"
            type="number"
            className={inputClass}
          />
        </Field>
      </div>

      {/* FormError = ข้อความ error สีแดง (conditional rendering: ถ้า error เป็น null ไม่แสดงอะไร) */}
      <FormError message={error} />

      {/* SubmitButton = ปุ่มส่ง ระหว่างส่ง (pending) จะกดซ้ำไม่ได้และเปลี่ยนเป็น "Saving..." */}
      <SubmitButton
        pending={pending}
        label="Add room"
        pendingLabel="Saving..."
      />
    </form>
  );
}
