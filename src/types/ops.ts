import { type Staff } from './api'

export enum ShiftRole {
  MANAGER = 'MANAGER',
  BARISTA = 'BARISTA',
  CASHIER = 'CASHIER',
  KITCHEN = 'KITCHEN',
}

export interface StaffShift {
  id: string
  staffId: string
  shopId: string
  shiftRole: ShiftRole
  startTime: string
  endTime: string | null
  staff?: Staff
}

export interface CashDrawerSession {
  id: string
  shopId: string
  openedBy: string
  closedBy?: string
  openingBalance: number
  closingBalance?: number
  startedAt: string
  endedAt?: string | null
  note?: string
  opener?: Staff
  closer?: Staff
}

export interface StartShiftRequest {
  shopId: string
  shiftRole: ShiftRole
  pin: string
}

export interface EndShiftRequest {
  shopId: string
  pin: string
}

export interface OpenDrawerRequest {
  shopId: string
  openingBalance: number
  note?: string
}

export interface CloseDrawerRequest {
  shopId: string
  closingBalance: number
  note?: string
}

export interface GetShiftsFilters {
  shopId: string
  staffId?: string
  startDate?: string
  endDate?: string
}
