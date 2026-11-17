// src/app/page.tsx
// หน้าแรก "/" ของเว็บ: ฟอร์มสร้างห้อง, ฟอร์มจองห้อง และรายการห้องพร้อมการจอง

import { BookingForm } from "@/components/BookingForm";
import { CreateRoomForm } from "@/components/CreateRoomForm";
import { getRooms } from "@/lib/api";
import { formatDateTime, formatTime } from "@/lib/format";
import type { Room } from "@/lib/types";
import { Suspense, type ReactNode } from "react";

// ตัวหน้า (default export = Next.js ใช้ไฟล์นี้เป็นหน้า "/")
// ตัวนี้ "ไม่ดึงข้อมูล" จึงแสดงได้ทันที ไม่ต้องรอ backend
export default function Home() {
  return (
    // mx-auto w-full max-w-3xl = อยู่กลางจอและกว้างไม่เกินพอดี (จอคอมไม่ยืดจนอ่านยาก)
    // p-4 sm:p-6 = ขอบมือถือแคบกว่า จอใหญ่กว้างขึ้น
    // space-y-8 = เว้นระยะแนวตั้งระหว่างส่วนต่างๆ ของหน้า
    <main className="mx-auto w-full max-w-3xl space-y-8 p-4 sm:p-6">
      <h1 className="text-2xl font-bold">RoomBook</h1>

      {/* ฟอร์มสร้างห้องไม่ต้องใช้ข้อมูลจาก backend จึงอยู่นอก Suspense แสดงได้ทันที */}
      <Section title="Add room">
        <CreateRoomForm />
      </Section>

      {/* Suspense = ห่อส่วนที่ต้องรอข้อมูล (จำเป็นเพราะเปิด cacheComponents)
          fallback = สิ่งที่แสดงแทนไปก่อน ระหว่างที่ RoomsSection ยังโหลดไม่เสร็จ */}
      <Suspense fallback={<p className="text-sm text-gray-600">Loading...</p>}>
        <RoomsSection />
      </Suspense>
    </main>
  );
}

// ส่วนหัวข้อ + เนื้อหา ที่ใช้ซ้ำหลายจุดในหน้านี้ (กันเขียนสไตล์หัวข้อซ้ำ)
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

// ส่วนที่ต้องใช้ข้อมูลห้อง (เป็น async เพื่อให้ใช้ await ได้)
// ดึงห้อง "ครั้งเดียว" แล้วแบ่งให้ทั้งฟอร์มจอง (ต้องใช้ทำตัวเลือกห้อง) และรายการห้อง
// ดีกว่าให้ต่างคนต่างดึงเอง เพราะไม่ต้องยิง API สองรอบ
// และ BookingForm เป็น Client Component ซึ่งดึงข้อมูลด้วย await แบบนี้ไม่ได้
// ไม่ใช่ default export เพราะไม่ใช่ตัวหน้า แต่ถูก Home เอาไปวางใน Suspense
async function RoomsSection() {
  // ยิงไป backend ผ่าน getRooms() (ฟังก์ชันใน lib/api.ts) แล้วรอผล
  const rooms = await getRooms();

  // <> ... </> = fragment ใช้ห่อหลายชิ้นโดยไม่สร้างแท็กเพิ่มในหน้า
  return (
    <>
      <Section title="Book a room">
        {/* ส่งรายการห้องให้ฟอร์มผ่าน props */}
        <BookingForm rooms={rooms} />
      </Section>

      <Section title="Rooms">
        <RoomList rooms={rooms} />
      </Section>
    </>
  );
}

// แสดงรายการห้องและการจองของแต่ละห้อง
// ไม่ดึงข้อมูลเอง (ไม่ใช่ async) แค่รับ rooms ที่ส่งมาทาง props มาแสดงผล
function RoomList({ rooms }: { rooms: Room[] }) {
  // ยังไม่มีห้องเลย -> บอกผู้ใช้ (conditional rendering: คืนข้อความแทนรายการ)
  if (rooms.length === 0) {
    return <p className="text-sm text-gray-600">No rooms yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {/* วนแสดงทีละห้อง
          key = ค่าที่ไม่ซ้ำกันของแต่ละรายการ ให้ React แยกออกว่าตัวไหนคือตัวไหน (ใช้ id ของห้อง) */}
      {rooms.map((room) => (
        <li key={room.id} className="rounded-lg border border-gray-200 p-4">
          {/* flex-wrap justify-between = ชื่อห้องอยู่ซ้าย ความจุอยู่ขวา ถ้าจอแคบให้ขึ้นบรรทัดใหม่ */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <p className="font-semibold">{room.name}</p>
            <p className="text-sm text-gray-600">Capacity {room.capacity}</p>
          </div>

          {/* ห้องที่ยังไม่มีการจอง bookings เป็น [] -> แสดงข้อความแทน */}
          {room.bookings.length === 0 ? (
            <p className="mt-3 text-sm text-gray-600">No bookings</p>
          ) : (
            // divide-y = เส้นคั่นบางๆ ระหว่างแต่ละการจอง
            <ul className="mt-3 divide-y divide-gray-100 text-sm">
              {/* วนแสดงการจองของห้องนี้
                  key ใช้ id ของ booking ไม่ใช่ของห้อง เพราะห้องเดียวมีหลาย booking */}
              {room.bookings.map((booking) => (
                <li key={booking.id} className="py-2">
                  <p className="font-medium">
                    {booking.title}{" "}
                    <span className="font-normal text-gray-600">
                      by {booking.bookerName}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    {formatDateTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
