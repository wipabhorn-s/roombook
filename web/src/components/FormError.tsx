// src/components/FormError.tsx
// หน้าที่: แสดงข้อความ error สีแดงใต้ฟอร์ม (ใช้ซ้ำในทุกฟอร์ม)

export function FormError({ message }: { message: string | null }) {
  // ไม่มี error (null) -> ไม่แสดงอะไรเลย (conditional rendering: คืน null = ไม่วาดอะไร)
  if (!message) {
    return null;
  }

  // role="alert" ให้โปรแกรมอ่านหน้าจออ่านข้อความนี้ทันทีเมื่อปรากฏ
  // เพิ่มกรอบพื้นแดงอ่อนให้เห็นชัดขึ้น (bg-red-50 border-red-200) ยังคงตัวหนังสือสีแดง
  return (
    <p
      role="alert"
      className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
    >
      {message}
    </p>
  );
}
