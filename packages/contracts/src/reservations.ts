export const RESERVATION_PERMISSIONS = {
  VIEW: "reservations:view",
  CREATE: "reservations:create",
  UPDATE: "reservations:update",
  CANCEL: "reservations:cancel",
  MOVE: "reservations:move",
  OVERBOOK: "reservations:overbook",
  GROUP_CREATE: "reservations:group:create",
  WAITLIST_MANAGE: "reservations:waitlist:manage"
} as const;

export type ReservationPermission =
  (typeof RESERVATION_PERMISSIONS)[keyof typeof RESERVATION_PERMISSIONS];

export const ReservationStatus = {
  Draft: "draft",
  Confirmed: "confirmed",
  Guaranteed: "guaranteed",
  CheckedIn: "checked_in",
  CheckedOut: "checked_out",
  Cancelled: "cancelled",
  NoShow: "no_show",
  Waitlisted: "waitlisted"
} as const;

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus];

export const RoomOperationalStatus = {
  Free: "free",
  Occupied: "occupied",
  Reserved: "reserved",
  Cleaning: "cleaning",
  Inspected: "inspected",
  Maintenance: "maintenance",
  Blocked: "blocked",
  OutOfOrder: "out_of_order"
} as const;

export type RoomOperationalStatus = (typeof RoomOperationalStatus)[keyof typeof RoomOperationalStatus];

export const ReservationOrigin = {
  Direct: "direct",
  Phone: "phone",
  WhatsApp: "whatsapp",
  Website: "website",
  BookingEngine: "booking_engine",
  OTA: "ota",
  Corporate: "corporate",
  Event: "event",
  WalkIn: "walk_in"
} as const;

export type ReservationOrigin = (typeof ReservationOrigin)[keyof typeof ReservationOrigin];

export const RatePlanType = {
  Flexible: "flexible",
  NonRefundable: "non_refundable",
  Corporate: "corporate",
  Event: "event",
  Package: "package",
  Dynamic: "dynamic"
} as const;

export type RatePlanType = (typeof RatePlanType)[keyof typeof RatePlanType];

export interface AvailabilitySlot {
  roomId: string;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  date: string;
  status: RoomOperationalStatus;
  reservationId?: string;
  guestName?: string;
}

export interface ReservationSummary {
  id: string;
  tenantId: string;
  code: string;
  guestName: string;
  roomTypeName: string;
  roomNumber?: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  status: ReservationStatus;
  origin: ReservationOrigin;
  totalAmount: number;
}
