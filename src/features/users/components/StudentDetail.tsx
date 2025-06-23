'use client'

import { ReactNode } from '@tanstack/react-router'
import { Pencil, Save, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Loader from '@/components/loader'
import { DetailType, useEditUser } from '../context/edit-context'
import { UserDetailType } from '../data/schema'
import { handleEmployment } from '../services/employment-companies/handleEmployment'
import { handleFieldTraining } from '../services/field-training/handleFieldTraining'
import { useUserDetailQuery } from '../services/selectUser'
import { useUserListQuery } from '../services/seleteUserList'
import { AfterCourses } from './after-courses'
import { Employment } from './employment'
import { FieldTraining } from './field-training'
import { MiddleSchool } from './middle-school'
import { MilitaryService } from './military-service'
import { StudentActivities } from './student-activities'
import { StudentCertificates } from './student-certificates'
import { StudentUniversity } from './student-university'

type ValueItemsType = {
  label: string
  component: (data: UserDetailType) => ReactNode
  canEdit?: boolean
}

const componentsMap: Record<DetailType, ValueItemsType> = {
  after_courses: {
    label: '방과후 수강과정',
    component: (data) => <AfterCourses datas={data.student_after_courses} />,
  },
  certificates: {
    label: '취득 자격증',
    component: (data) => (
      <StudentCertificates datas={data.student_certificates} />
    ),
    canEdit: false,
  },
  activities: {
    label: '활동 내용',
    component: (data) => (
      <StudentActivities
        datas={{
          profile: data.profile,
          competitions: data.student_competitions,
        }}
      />
    ),
    canEdit: false,
  },
  field_training: {
    label: '현장 실습',
    component: (data) => <FieldTraining datas={data.field_training} />,
  },
  employment: {
    label: '취업',
    component: (data) => <Employment datas={data.employment_companies} />,
  },
  university: {
    label: '대학교 진학',
    component: (data) => (
      <StudentUniversity datas={data.student_universities} />
    ),
  },
  military: {
    label: '병역',
    component: (data) => <MilitaryService datas={data.military_services} />,
  },
  middle_school: {
    label: '중학교 정보',
    component: (data) => <MiddleSchool datas={data.student_middle_schools} />,
  },
}

export function StudentDetail({ student_id }: { student_id: string }) {
  const { editingSection, setEditingSection, editData, setEditData } =
    useEditUser()
  const { data, isLoading, refetch, isFetching } =
    useUserDetailQuery(student_id)
  const { refetch: userRefetch } = useUserListQuery()

  const saveEditing = async () => {
    if (!editData) return
    if (editingSection === 'field_training') await handleFieldTraining(editData)
    else if (editingSection === 'employment') await handleEmployment(editData)
    await refetch()
    setEditingSection(null)
    await userRefetch()
    setEditData(null)
  }

  const cancelEditing = () => {
    setEditingSection(null)
    setEditData(null)
  }

  if (isLoading || isFetching)
    return (
      <div className='h-full space-y-6 overflow-auto p-1'>
        <Loader />
      </div>
    )

  return (
    <div className='h-full space-y-6 overflow-auto p-1'>
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl'>{data?.name}</CardTitle>
            <div className='flex items-center gap-2'>
              <Badge variant='outline'>
                {data?.departments.department_name}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-5'>
          {(Object.keys(componentsMap) as DetailType[]).map((key) => {
            return (
              <div key={key}>
                <div className='mb-2 flex items-center justify-between'>
                  <h3 className='font-semibold'>{componentsMap[key].label}</h3>
                  {editingSection === key ? (
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={cancelEditing}
                        className='flex items-center gap-1 text-muted-foreground transition-colors hover:text-destructive'
                      >
                        <X size={14} />
                        <span>취소</span>
                      </Button>
                      <Button
                        size='sm'
                        onClick={saveEditing}
                        className='flex items-center gap-1 bg-gradient-to-r from-primary to-primary/90'
                      >
                        <Save size={14} />
                        <span>저장</span>
                      </Button>
                    </div>
                  ) : componentsMap[key].canEdit !== false ? (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setEditingSection(key)}
                      className='flex items-center gap-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary'
                    >
                      <Pencil size={14} />
                      <span>수정</span>
                    </Button>
                  ) : null}
                </div>

                {data ? (
                  <div className='mb-5'>
                    {componentsMap[key].component(data)}
                  </div>
                ) : (
                  <div>학생 정보가 존재하지 않습니다.</div>
                )}
                <Separator />
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
