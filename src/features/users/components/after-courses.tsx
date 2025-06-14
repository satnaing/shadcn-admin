import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleX } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useEditUser } from "../context/edit-context";
import { UserDetailType } from "../data/schema";
import { useAfterCourses } from "@/features/users/services/after-courses/selectAfterCourses"

export const AfterCourses = ({ datas }: {datas: UserDetailType['student_after_courses']}) => {
  const { editingSection, editData, setEditData } = useEditUser()
  const { data: afterCoursesDatas = []} = useAfterCourses()

  const grades: number[] = [1, 2, 3]
  const gradeGroup = grades.map(grade => {
    const filtered = datas.filter(item => item.grade === grade)
    const courses = filtered.map(item => ({
      id: item.after_courses.after_course_id,
      name: item.after_courses.after_course_name
    }))

    return {
      grade,
      course_ids: courses.map(course => course.id),
      course_names: courses.map(courses => courses.name)
    }
  })

  return (
    <div>
      <div className="flex flex-col gap-1">
        {gradeGroup.map(data => (
          <div key={data.grade}>
            <span className="font-medium">{data.grade}학년: </span>
            {editingSection === 'after_courses' ? (
              <div className="mt-0.5 mb-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='방과후 선택'></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {afterCoursesDatas.map(afterCourse => (
                      <SelectItem 
                        value={String(afterCourse.after_course_id)}
                      >
                        {afterCourse.after_course_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.course_names.map((name, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="flex items-center gap-2 w-fit"
                        >
                        {name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-2 w-2 rounded-full"
                        >
                          <CircleX 
                            size={12}
                          />
                        </Button>
                        </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <span>{data.course_names.length > 0 ? (
                data.course_names.join(', ')
              ): (
                <span className="ml-3">-</span>
              )}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}