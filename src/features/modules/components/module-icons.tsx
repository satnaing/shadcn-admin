import {
  Boxes, CalendarClock, ClipboardList, Coins, CreditCard, Gavel, Image, KeyRound, Layers, Map,
  Megaphone, Package, Palette, Puzzle, QrCode, RotateCcw, Settings, Share2, ShoppingCart,
  Smartphone, Sparkles, Store, Ticket, Truck, Users, Wallet,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Boxes, CalendarClock, ClipboardList, Coins, CreditCard, Gavel, Image, KeyRound, Layers, Map,
  Megaphone, Package, Palette, Puzzle, QrCode, RotateCcw, Settings, Share2, ShoppingCart,
  Smartphone, Sparkles, Store, Ticket, Truck, Users, Wallet,
}

export function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon: LucideIcon = ICONS[name] ?? Puzzle
  return <Icon className={className} />
}
