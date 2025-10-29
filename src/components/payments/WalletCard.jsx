import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function WalletCard({ paymentMethods, amount, onAmountChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-[#0388B4]" />
          <span>Nạp tiền</span>
        </CardTitle>
        <CardDescription>
          Nạp tiền vào tài khoản để thanh toán nhanh
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Số tiền nạp</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
            />
          </div>
          <div>
            <Label>Phương thức</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center space-x-2">
                      <img
                        src={method.icon}
                        alt={method.name}
                        className="w-5 h-5 object-contain rounded-sm"
                      />
                      <span>{method.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full bg-[#0388B4] hover:bg-[#2851b4] text-white">
            Nạp tiền
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
