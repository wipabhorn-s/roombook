// src/components/SubmitButton.tsx
// หน้าที่: ปุ่มส่งฟอร์มที่ใช้ซ้ำในทุกฟอร์ม
// ตอนกำลังส่ง (pending) ปุ่มจะกดซ้ำไม่ได้และเปลี่ยนข้อความ กันผู้ใช้กดส่งซ้ำหลายรอบ

export function SubmitButton({
  pending,
  label,
  pendingLabel,
}: {
  pending: boolean; // true = กำลังส่งข้อมูลไป server
  label: string; // ข้อความปกติ เช่น "Add room"
  pendingLabel: string; // ข้อความระหว่างส่ง เช่น "Saving..."
}) {
  return (
    // disabled={pending} = ระหว่างส่ง ปุ่มกดซ้ำไม่ได้
    // w-full sm:w-auto = มือถือกดง่ายเพราะปุ่มเต็มความกว้าง, จอใหญ่ขึ้นไปให้กว้างพอดีข้อความ
    // hover:... = เมาส์ชี้แล้วสีเข้มขึ้น, disabled:... = ตอนปิดปุ่มให้จางลงและเมาส์ไม่ขึ้นรูปมือ
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {/* Conditional rendering แบบ ? : เลือกแสดงข้อความอย่างใดอย่างหนึ่งตามสถานะ pending */}
      {pending ? pendingLabel : label}
    </button>
  );
}
