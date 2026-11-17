// src/lib/format.ts
// หน้าที่: แปลงวันเวลาจาก backend (ข้อความ ISO แบบ UTC) ให้เป็นเวลาไทยที่คนอ่านรู้เรื่อง
// ตัวอย่าง: "2026-11-18T02:00:00.000Z"  ->  "18 Nov 2026, 09:00"

// ตัวจัดรูปแบบวันเวลา (Intl.DateTimeFormat เป็นเครื่องมือที่มีใน JS อยู่แล้ว ไม่ต้องลงเพิ่ม)
// สร้างไว้ "นอกฟังก์ชัน" ครั้งเดียว แล้วใช้ซ้ำทุกครั้งที่เรียก ไม่ต้องสร้างใหม่ทุกรอบ
const formatter = new Intl.DateTimeFormat("en-GB", {
  // "en-GB" = เรียงแบบ วัน เดือน ปี (เช่น 18 Nov 2026)

  // ล็อกให้เป็นเวลาไทยเสมอ ถ้าไม่ระบุ JS จะใช้ timezone ของเครื่องที่รันโค้ด
  // ซึ่ง server อาจเป็น UTC ทำให้เวลาเพี้ยน 7 ชั่วโมงโดยไม่รู้ตัว
  timeZone: "Asia/Bangkok",
  dateStyle: "medium", // วันที่แบบย่อ เช่น 18 Nov 2026
  timeStyle: "short", // เวลาแบบสั้น เช่น 09:00
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Bangkok",
  timeStyle: "short",
  // ไม่ใส่ dateStyle = ไม่แสดงวันที่
});

// รับข้อความวันเวลา (iso) แล้วคืนข้อความที่จัดรูปแบบแล้ว
export function formatDateTime(iso: string): string {
  // format() ต้องการ Date ไม่ใช่ string จึงแปลงด้วย new Date(iso) ก่อน
  return formatter.format(new Date(iso));
}

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}
