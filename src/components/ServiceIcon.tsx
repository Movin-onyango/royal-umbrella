import { Briefcase, KeyRound, Map, Plane, Sparkles, type LucideIcon } from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  plane: Plane,
  briefcase: Briefcase,
  sparkles: Sparkles,
  map: Map,
  key: KeyRound,
}

export default function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Briefcase
  return <Icon className={className} aria-hidden="true" />
}