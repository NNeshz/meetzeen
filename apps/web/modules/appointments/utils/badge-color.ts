import { AppointmentStatus, APPOINTMENT_STATUS } from "../constants/appointment-status";
import { PaymentStatus, PAYMENT_STATUS } from "../constants/payment-status";
import { PaymentMethod, PAYMENT_METHOD } from "../constants/payment-method";

/**
 * Returns Tailwind CSS classes for appointment status badges
 */
export function getAppointmentStatusBadgeColor(
  status: AppointmentStatus | string
): string {
  switch (status) {
    case APPOINTMENT_STATUS.SCHEDULED:
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800";
    case APPOINTMENT_STATUS.CONFIRMED:
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800";
    case APPOINTMENT_STATUS.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800";
    case APPOINTMENT_STATUS.COMPLETED:
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-800";
    case APPOINTMENT_STATUS.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800";
    case APPOINTMENT_STATUS.NO_SHOW:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800";
  }
}

/**
 * Returns Tailwind CSS classes for payment status badges
 */
export function getPaymentStatusBadgeColor(
  status: PaymentStatus | string
): string {
  switch (status) {
    case PAYMENT_STATUS.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800";
    case PAYMENT_STATUS.PAID:
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800";
    case PAYMENT_STATUS.REFUNDED:
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800";
  }
}

/**
 * Returns Tailwind CSS classes for payment method badges
 */
export function getPaymentMethodBadgeColor(
  method: PaymentMethod | string
): string {
  switch (method) {
    case PAYMENT_METHOD.CASH:
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-800";
    case PAYMENT_METHOD.CARD:
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800";
    case PAYMENT_METHOD.BANK_TRANSFER:
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800";
    case PAYMENT_METHOD.OTHER:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800";
  }
}

