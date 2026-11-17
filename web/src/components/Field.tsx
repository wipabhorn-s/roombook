// src/components/Field.tsx
// หน้าที่: กล่อง "ป้ายชื่อ + ช่องกรอก" ที่ใช้ซ้ำในทุกฟอร์ม (ไม่ต้องเขียน label และสไตล์ซ้ำ)

import type { ReactNode } from "react";

// สไตล์ของช่องกรอก (input / select) ให้หน้าตาเหมือนกันทุกช่อง
//   w-full = เต็มความกว้างของกล่อง (ใช้ได้ทั้งจอมือถือและจอคอม)
//   rounded border border-gray-300 = ขอบมนสีเทา, px-3 py-2 = เว้นระยะใน
//   text-base = ตัวอักษร 16px (ถ้าเล็กกว่านี้ มือถือบางรุ่นจะซูมหน้าเองตอนแตะช่องกรอก)
//   focus:... = ตอนกดเลือกช่อง ให้มีกรอบสีน้ำเงินชัดๆ (ช่วยให้รู้ว่าอยู่ช่องไหน)
export const inputClass =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

// label = ข้อความป้ายชื่อ, htmlFor = id ของช่องกรอก (กดที่ป้ายแล้วเลือกช่องนั้นได้)
// children = ช่องกรอกที่ใส่เข้ามาข้างใน, className = คลาสเพิ่มเติมของกล่อง (เช่น ให้กว้าง 2 คอลัมน์)
export function Field({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    // flex flex-col gap-1 = เรียงป้ายชื่อไว้บน ช่องกรอกไว้ล่าง เว้นระยะเล็กน้อย
    // min-w-0 = กันช่องวันเวลาบนมือถือดันกล่องจนล้นจอ
    <div className={`flex min-w-0 flex-col gap-1 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
