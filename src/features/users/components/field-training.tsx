import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";

import { useEditUser } from "../context/edit-context";
import { UserDetailType } from "../data/schema";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompanyListQuery } from "@/features/companies/services/selectCompanyList";
import { useJobListQuery } from "../services/field-training/selectJobList";

export const FieldTraining = ({ datas }: {datas: UserDetailType['field_training']}) => {
  const { editingSection } = useEditUser()
  const { data: companies = [] } = useCompanyListQuery()
  const { data: jobs = [] } = useJobListQuery()
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 3),
  });

  return (
    <div>
    {editingSection === 'filed_training' ? (
      <div className="space-y-4">
        {/* 현장실습 목록 */}
        <div className="space-y-4">
          {datas.length > 0 &&
            datas.map((data, idx) => (
              <div key={idx} className="border rounded-md p-3 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={() => {}}
                >
                  <CircleX size={16} />
                </Button>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <span className="font-medium">실습 기간</span>
                    <div className="flex justify-center">
                      <Calendar
                        mode="range"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-lg border border-border p-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="font-medium">실습 직무</span>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder='실습 직무를 선택하세요.' />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map(job => (
                          <SelectItem value={String(job.job_id)}>{job.job_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <span className="font-medium">회사명</span>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder='회사명을 선택하세요.' />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map(company => (
                          <SelectItem value={String(company.company_id)}>{company.company_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* 새 현장실습 추가 폼 */}
        <div className="border border-dashed rounded-md p-3">
          <h4 className="font-medium mb-3">새 현장실습 추가</h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <Label>실습 기간</Label>
            </div>
            <div className="space-y-2">
              <Label>실습 직무</Label>
            </div>
            <div className="space-y-2">
              <Label>회사명</Label>
            </div>
            <div className="space-y-2">
              <Label>근무 기간</Label>
            </div>
            <Button
              className="mt-2"
              onClick={() => {}}
            >
              현장실습 추가
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <div>
        {datas.length > 0 ? (
          <div className="space-y-4">
            {datas.map((data, idx) => (
              <div key={idx} className="border rounded-md p-3">
                <dl className="space-y-2">
                  <div className="flex gap-2">
                    <dt className="font-medium w-24 flex-shrink-0">
                      실습 기간:
                    </dt>
                    <dd>{data.start_date ?? '-'}</dd> ~ <dd>{data.end_date ?? '-'}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium w-24 flex-shrink-0">
                      실습 직무:
                    </dt>
                    <dd>{data.jobs.job_name ?? "-"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium w-24 flex-shrink-0">
                      회사명:
                    </dt>
                    <dd>{data.companies.company_name ?? "-"}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center mt-4">
            학생의 현장 실습 정보가 존재하지 않습니다.
          </div>
        )}
      </div>
    )}
  </div>
  )
}