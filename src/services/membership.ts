import { apiClient } from '@/lib/api-client'
import { type MembershipProgram } from '@/features/growth/data/loyalty-schema'

// The backend returns a full Promotion object for the membership program
interface MembershipTierDto {
  id?: string
  name: Record<string, string>
  discountPercentage: string | number
  priority?: number
  status?: string
  slug?: string
  minSpendRequirement?: number | string
  [key: string]: unknown
}

interface MembershipProgramDto {
  status: string
  tiers?: MembershipTierDto[]
  updatedAt?: string
  [key: string]: unknown
}

function mapDtoToProgram(dto: MembershipProgramDto): MembershipProgram {
  return {
    isActive: dto.status === 'ACTIVE',
    membershipTiers: (dto.tiers || []).map((t) => ({
      id: t.id,
      name: t.name,
      discountPercentage: Number(t.discountPercentage) || 0,
      priority: t.priority ?? 0,
      status: (t.status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED') || 'DRAFT',
      slug: t.slug,
      minSpendRequirement: Number(t.minSpendRequirement) || 0,
    })),
    lastProductSync: dto.updatedAt,
  }
}

function mapProgramToDto(
  program: MembershipProgram
): Partial<MembershipProgramDto> {
  return {
    status: program.isActive ? 'ACTIVE' : 'INACTIVE',
    tiers: program.membershipTiers.map((t) => ({
      id: t.id,
      name: t.name,
      discountPercentage: t.discountPercentage,
      priority: t.priority || 0,
      status: t.status || 'DRAFT',
      slug: t.slug,
      minSpendRequirement: t.minSpendRequirement ?? 0,
    })),
  }
}

export const getMembershipProgram = async (): Promise<MembershipProgram> => {
  const response = await apiClient.get('/admin/membership-program')
  return mapDtoToProgram(response.data)
}

export const updateMembershipProgram = async (
  data: MembershipProgram
): Promise<MembershipProgram> => {
  const payload = mapProgramToDto(data)
  const response = await apiClient.patch('/admin/membership-program', payload)
  return mapDtoToProgram(response.data)
}
