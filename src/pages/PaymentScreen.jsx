import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import ScholarshipInfoCard from "@/components/payments/ScholarshipInfoCard";
import PendingPaymentList from "@/components/payments/PendingPaymentList";
import WalletCard from "@/components/payments/WalletCard";
import BalanceCard from "@/components/payments/BalanceCard";
import QRPaymentCard from "@/components/payments/QRPaymentCard";
import PaymentHistorySection from "@/components/payments/PaymentHistorySection";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Footer } from "../components/layout/Footer";
import {
  CreditCard,
  Wallet,
  QrCode,
  History,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  mockPaymentMethods as paymentMethods,
  mockPendingPayments as pendingPayments,
  mockPaymentHistory as paymentHistory,
  mockScholarshipInfo as scholarshipInfo,
} from "../mock/paymentMock";

export function PaymentScreen({ user, onNavigate }) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [amount, setAmount] = useState("");

  const handlePayment = (paymentId) => {
    console.log("Processing payment:", paymentId, {
      method: selectedMethod,
      amount,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl space-y-8">
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ScholarshipInfoCard scholarship={scholarshipInfo} />
            <PendingPaymentList
              pendingPayments={pendingPayments}
              scholarshipInfo={scholarshipInfo}
              paymentMethods={paymentMethods}
              selectedMethod={selectedMethod}
              onMethodChange={setSelectedMethod}
              onPay={handlePayment}
            />
          </div>

          <div className="space-y-6">
            <WalletCard
              paymentMethods={paymentMethods}
              amount={amount}
              onAmountChange={setAmount}
            />
            <BalanceCard balance={450000} />
            <QRPaymentCard />
          </div>
        </section>

        <PaymentHistorySection paymentHistory={paymentHistory} />
      </main>

      {/* 🔻 FOOTER */}
      <Footer />
    </div>
  );
}
