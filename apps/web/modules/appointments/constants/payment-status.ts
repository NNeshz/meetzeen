export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PAYMENT_STATUS.PENDING]: "Pendiente",
  [PAYMENT_STATUS.PAID]: "Pagado",
  [PAYMENT_STATUS.REFUNDED]: "Reembolsado",
};

export const PAYMENT_STATUS_OPTIONS = [
  { value: PAYMENT_STATUS.PENDING, label: PAYMENT_STATUS_LABELS[PAYMENT_STATUS.PENDING] },
  { value: PAYMENT_STATUS.PAID, label: PAYMENT_STATUS_LABELS[PAYMENT_STATUS.PAID] },
  { value: PAYMENT_STATUS.REFUNDED, label: PAYMENT_STATUS_LABELS[PAYMENT_STATUS.REFUNDED] },
] as const;

