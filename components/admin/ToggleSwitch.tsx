/** ToggleSwitch.tsx — 노출 여부 토글 스위치
 *
 *  용도: 서비스/후기/팝업 등의 노출/비노출 전환
 */
"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      {/* 토글 트랙 + 핸들 */}
      <div
        onClick={onChange}
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
        style={{ height: "22px" }}
      >
        <div
          className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
          style={{ width: "18px", height: "18px" }}
        />
      </div>
      {/* 라벨 텍스트 */}
      {label && <span className="text-sm text-slate-600">{label}</span>}
    </label>
  );
}
