// src/mock/paymentMock.js
// 🧩 Mock data cho trang Thanh toán (PaymentScreen)

export const mockPaymentMethods = [
  { id: "vnpay", name: "VNPay", icon: "/icons/vnpay.png" },
  { id: "momo", name: "MoMo", icon: "/icons/momo.png" },
  { id: "zalopay", name: "ZaloPay", icon: "/icons/zalopay.png" },
  { id: "banking", name: "Chuyển khoản ngân hàng", icon: "/icons/banking.png" },
];

export const mockPendingPayments = [
  {
    id: "1",
    tutor: "TS. Nguyễn Văn Minh",
    subject: "Toán cao cấp",
    sessions: 4,
    amount: 600000,
    dueDate: "2025-01-10",
    status: "pending",
  },
  {
    id: "2",
    tutor: "ThS. Trần Thị Lan",
    subject: "Lập trình C++",
    sessions: 2,
    amount: 240000,
    dueDate: "2025-01-12",
    status: "pending",
  },
];

export const mockPaymentHistory = [
  {
    id: "1",
    tutor: "TS. Nguyễn Văn Minh",
    subject: "Toán cao cấp",
    amount: 300000,
    date: "2025-01-05",
    method: "VNPay",
    status: "completed",
    transactionId: "TXN123456789",
  },
  {
    id: "2",
    tutor: "PGS. Lê Hoàng Nam",
    subject: "Vật lý đại cương",
    amount: 400000,
    date: "2025-01-03",
    method: "MoMo",
    status: "completed",
    transactionId: "TXN123456788",
  },
  {
    id: "3",
    tutor: "ThS. Trần Thị Lan",
    subject: "Lập trình C++",
    amount: 240000,
    date: "2024-12-28",
    method: "Chuyển khoản",
    status: "failed",
    transactionId: "TXN123456787",
  },
];

export const mockScholarshipInfo = {
  available: true,
  discount: 30,
  remainingAmount: 2000000,
  eligibleSubjects: ["Toán cao cấp", "Vật lý đại cương"],
};
