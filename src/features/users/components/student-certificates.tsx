import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

import { useEditUser } from "../context/edit-context";
import { UserDetailType } from "../data/schema";


export const StudentCertificates = ({datas}: {datas: UserDetailType['student_certificates']}) => {
  const { editingSection }= useEditUser()

  const certificatesGroup = [
    {title: '전공', items: datas.filter(data => data.certificates.is_software), is_software: true},
    {title: '전공 외', items: datas.filter(data => !data.certificates.is_software), is_software: false}
  ]
  
  return (
      <div>
        {editingSection === 'certificates' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>전공 자격증</Label>
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="전공 자격증 추가"
                  // value={editData.newMajorCert || ""}
                  onChange={() => {}}
                />
                <Button
                  size="sm"
                  onClick={() => {}}
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {/* {editData.certifications?.major?.map((cert, idx) => (
                  <Badge key={idx} className="flex items-center gap-1">
                    {cert}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => {}}
                    >
                      <CircleX size={12} />
                    </Button>
                  </Badge>
                ))} */}
              </div>
            </div>

            <div className="space-y-2">
              <Label>전공 외 자격증</Label>
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="전공 외 자격증 추가"
                  // value={}
                  onChange={() => {}}
                />
                <Button
                  size="sm"
                  onClick={() => {}}
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {/* {editData.certifications?.nonMajor?.map((cert, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {cert}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() =>
                        removeArrayItem("certifications.nonMajor", idx)
                      }
                    >
                      <CircleX size={12} />
                    </Button>
                  </Badge>
                ))} */}
              </div>
            </div>
          </div>
        ) : (
          <dl className="space-y-2">
            {certificatesGroup.map(({ title, items, is_software}) => (
              <div className="flex gap-2">
                <dt className="font-medium w-24 flex-shrink-0">{title}:</dt>
                <dd className="flex flex-wrap gap-1">
                  {items.length > 0 ? (items.map(item => (
                    <Badge key={item.certificates.certificate_id} variant={
                      is_software ? "default" : "outline"
                    }>
                      {item.certificates.certificate_name ?? '-'}
                    </Badge>
                  ))):(
                    '-'
                  )
                  }
                </dd>
              </div>
            ))}
          </dl>
        )}
    </div>
  )
}