/**
 * Domain enums — must match Postgres native enums exactly.
 * Defined here so core/ logic can reference them without a DB call.
 */
export type Role =
  | 'CLIENT'
  | 'DESIGNER'
  | 'QC'
  | 'SALES'
  | 'OPS'
  | 'FINANCE'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export type OrderStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'QUOTED'
  | 'PAYMENT_HELD'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'DESIGNER_SUBMITTED'
  | 'QC_REVIEW'
  | 'REVISION_REQUESTED'
  | 'CLIENT_PREVIEW'
  | 'APPROVED'
  | 'DELIVERED'
  | 'CLOSED'
  | 'PAYOUT_RELEASED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'REFUNDED';
