import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentMethodSelector({ value, onChange }) {
  const methods = [
    { id: "momo", name: "Ví MoMo" },
    { id: "vnpay", name: "VNPAY" },
    { id: "bank", name: "Chuyển khoản ngân hàng" },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Chọn phương thức" />
      </SelectTrigger>
      <SelectContent>
        {methods.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
