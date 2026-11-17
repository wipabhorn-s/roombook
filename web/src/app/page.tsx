// src/app/page.tsx
// หน้าแรก "/" ของเว็บ: แสดงรายการห้องและการจองของแต่ละห้อง

import { CreateRoomForm } from "@/components/CreateRoomForm";
import { getRooms } from "@/lib/api";
import { formatDateTime, formatTime } from "@/lib/format";
import { Suspense } from "react";

// ตัวหน้า (default export = Next.js ใช้ไฟล์นี้เป็นหน้า "/")
// ตัวนี้ "ไม่ดึงข้อมูล" จึงแสดงได้ทันที ไม่ต้องรอ backend
export default function Home() {
  return (
    <main>
      <h1>RoomBook</h1>
      <CreateRoomForm />

      {/* Suspense = ห่อส่วนที่ต้องรอข้อมูล (จำเป็นเพราะเปิด cacheComponents)
          fallback = สิ่งที่แสดงแทนไปก่อน ระหว่างที่ RoomList ยังโหลดไม่เสร็จ */}
      <Suspense fallback={<p>Loading...</p>}>
        <RoomList />
      </Suspense>
    </main>
  );
}

// component ที่ดึงข้อมูลห้อง (เป็น async เพื่อให้ใช้ await ได้)
// ไม่ใช่ default export เพราะไม่ใช่ตัวหน้า แต่ถูก Home เอาไปวางใน Suspense
async function RoomList() {
  // ยิงไป backend ผ่าน getRooms() (ฟังก์ชันใน lib/api.ts) แล้วรอผล
  const rooms = await getRooms();

  return (
    <ul>
      {/* วนแสดงทีละห้อง
          key = ค่าที่ไม่ซ้ำกันของแต่ละรายการ ให้ React แยกออกว่าตัวไหนคือตัวไหน (ใช้ id ของห้อง) */}
      {rooms.map((room) => (
        <li key={room.id}>
          <p>
            Name: {room.name} Capacity: {room.capacity}
          </p>

          {/* วนแสดงการจองของห้องนี้ (ห้องที่ยังไม่มีการจอง bookings เป็น [] จึงไม่แสดงอะไร)
              key ใช้ id ของ booking ไม่ใช่ของห้อง เพราะห้องเดียวมีหลาย booking */}
          {room.bookings.map((booking) => (
            <p key={booking.id}>
              {booking.title}: {formatDateTime(booking.startTime)} -{" "}
              {formatTime(booking.endTime)}
            </p>
          ))}
        </li>
      ))}
    </ul>
  );
}
