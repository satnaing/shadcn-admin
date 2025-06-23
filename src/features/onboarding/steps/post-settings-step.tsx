"use client"

import { useState } from "react"
import {
  Users,
  ShoppingCart,
  Megaphone,
  Lightbulb,
  Package,
  Palette,
  Code,
  DollarSign,
  Settings,
  Headphones,
  UserCheck,
  MessageSquare,
  Scale,
  GraduationCap,
  BookOpen,
  Info,
} from "lucide-react"
import { OnboardingCard } from "../onboarding-card"
import { OnboardingNavigation } from "../onboarding-navigation"

export function PostSettingsStep() {
  const [selectedRole, setSelectedRole] = useState("Marketing")

  const roles = [
    { id: "Leadership", label: "Leadership", icon: Users },
    { id: "Sales", label: "Sales", icon: ShoppingCart },
    { id: "Marketing", label: "Marketing", icon: Megaphone },
    { id: "Consulting", label: "Consulting", icon: Lightbulb },
    { id: "Product", label: "Product", icon: Package },
    { id: "Design", label: "Design", icon: Palette },
    { id: "Engineering", label: "Engineering", icon: Code },
    { id: "Finance", label: "Finance", icon: DollarSign },
    { id: "Operations", label: "Operations", icon: Settings },
    { id: "Support", label: "Support", icon: Headphones },
    { id: "HR", label: "HR", icon: UserCheck },
    { id: "Communications", label: "Communications", icon: MessageSquare },
    { id: "Legal", label: "Legal", icon: Scale },
    { id: "Teacher", label: "Teacher", icon: GraduationCap },
    { id: "Student", label: "Student", icon: BookOpen },
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
  }

  return (
    <OnboardingCard
      title="Choose Targeted Keywords"
      description="This help us to understand on which post you want to comment"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-foreground font-semibold">Select your keywords</span>
          <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center">
            <Info className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-3">
          {/* Row 1 */}
          <div className="flex flex-wrap gap-3">
            {roles.slice(0, 4).map((role) => {
              const IconComponent = role.icon
              const isSelected = selectedRole === role.id

              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{role.label}</span>
                </button>
              )
            })}
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap gap-3">
            {roles.slice(4, 8).map((role) => {
              const IconComponent = role.icon
              const isSelected = selectedRole === role.id

              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{role.label}</span>
                </button>
              )
            })}
          </div>

          {/* Row 3 */}
          <div className="flex flex-wrap gap-3">
            {roles.slice(8, 12).map((role) => {
              const IconComponent = role.icon
              const isSelected = selectedRole === role.id

              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{role.label}</span>
                </button>
              )
            })}
          </div>

          {/* Row 4 */}
          <div className="flex flex-wrap gap-3">
            {roles.slice(12).map((role) => {
              const IconComponent = role.icon
              const isSelected = selectedRole === role.id

              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{role.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">Your selection helps us tailor your dashboard experience</p>
      </div>

      <OnboardingNavigation nextStep="/onboarding/comment-settings" />
    </OnboardingCard>
  )
}
