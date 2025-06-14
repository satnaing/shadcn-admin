import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useEditUser } from "../context/edit-context"
import { UserDetailType } from "../data/schema";

export const MiddleSchool = ({ datas }: {datas: UserDetailType['student_middle_schools']}) => {
  const { editingSection } = useEditUser()

  return (
    <div>
    {editingSection === 'middle_school' ? (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>학교명</Label>
          <Input
            // value={editData.middleSchool?.name || ""}
            onChange={() => {}}
            placeholder="중학교명 입력"
          />
        </div>

        <div className="space-y-2">
          <Label>중학내신</Label>
          <Input
            // value={editData.middleSchool?.grades || ""}
            onChange={() => {}}
            placeholder="예: A, B+, C 등"
          />
        </div>

        <div className="space-y-2">
          <Label>입학전형</Label>
          <Input
            // value={editData.middleSchool?.admissionType || ""}
            onChange={() => {}}
            placeholder="예: 일반전형, 특별전형 등"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>1단계</Label>
            <Input
              // value={
              //   editData.middleSchool?.admissionScore?.phase1 || ""
              // }
              onChange={() => {}}
              placeholder="1단계 점수"
            />
          </div>
          <div className="space-y-2">
            <Label>2단계</Label>
            <Input
              // value={
              //   editData.middleSchool?.admissionScore?.phase2 || ""
              // }
              onChange={() => {}}
              placeholder="2단계 점수"
            />
          </div>
        </div>
      </div>
    ) : (
      datas ? (
        <dl className="space-y-2">
          <div className="flex gap-2">
            <dt className="font-medium w-24 flex-shrink-0">학교명:</dt>
            <dd>{datas.middle_schools.middle_school_name ?? "-"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium w-24 flex-shrink-0">중학내신:</dt>
            <dd>{datas.middle_school_score ?? "-"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium w-24 flex-shrink-0">입학점수:</dt>
            <dd>
              1차: {datas["1st_score"] || "-"}점, 2차:{" "}
              {datas["2nd_score"] || "-"}점
            </dd>
          </div>
        </dl>
      ) : (
        <div className="flex justify-center mt-4">학생의 중학교 정보가 존재하지 않습니다.</div>
      )
    )}
  </div>
  )
}