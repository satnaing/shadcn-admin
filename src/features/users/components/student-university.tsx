import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { useEditUser } from "../context/edit-context"
import { UserDetailType } from "../data/schema";

export const StudentUniversity = ({ datas }: {datas: UserDetailType['student_universities']}) => {
  const { editingSection } = useEditUser()

  return (
    <div>
    {editingSection === 'university' ? (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label
            htmlFor="higherEducation"
            className="flex items-center gap-2"
          >
            <Checkbox
              id="higherEducation"
              // checked={editData.education?.higherEducation}
              onCheckedChange={() => {}}
            />
            진학여부
          </Label>
        </div>

        {datas && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>학교명</Label>
              <Input
                // value={editData.education?.schoolName || ""}
                onChange={() => {}}
                placeholder="학교명 입력"
              />
            </div>
            <div className="space-y-2">
              <Label>학과명</Label>
              <Input
                // value={editData.education?.majorName || ""}
                onChange={() => {}}
                placeholder="학과명 입력"
              />
            </div>
          </div>
        )}
      </div>
    ) : (
      <dl className="space-y-2">
        <div className="flex gap-2">
          {datas.length > 0 ? (<></>):
          (
            <>
              <dt className="font-medium w-24 flex-shrink-0">진학여부:</dt>
              <dd>아니오</dd>
            </>
          )}
        </div>
        {datas.map(({universities}) => (
          <>
            <div className="flex gap-2">
              <dt className="font-medium w-24 flex-shrink-0">
                학교명:
              </dt>
              <dd>{universities.university_name ?? "-"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium w-24 flex-shrink-0">
                학과명:
              </dt>
              <dd>{universities.university_department ?? "-"}</dd>
            </div>
          </>
        ))}
      </dl>
    )}
  </div>
  )
}