import { Badge } from "@/components/ui/badge";
import { UserDetailType } from "../data/schema";

type StudentActivitiesProps = {
  datas: {
    profile: UserDetailType['profile'],
    competitions: UserDetailType['student_competitions']
  }
}
export const StudentActivities = ({ datas }: StudentActivitiesProps) => {
  
  if (!datas.profile) return (
    <div className="flex justify-center mt-4">학생의 활동 정보가 존재하지 않습니다.</div> 
  )

  return (
    <div>
      <dl className="space-y-4">
        <div>
          <dt className="font-medium mb-2">언어 / 기술스택</dt>
          <dd className="flex flex-wrap gap-1">
            {datas.profile.profile_skills.length > 0 ? 
              datas.profile.profile_skills.map(({ skills }) => (
                  <Badge key={skills.skill_id} variant={"secondary"}>
                    {skills.skill_name}
                  </Badge>
              )) : (
                <div className="flex justify-center mt-3 mb-5">학생의 언어 / 기술스택 정보가 존재하지 않습니다.</div>
              )
            }
          </dd>
        </div>
        <div>
          <dt className="font-medium mb-1">수상경력</dt>
          <dd>
            {datas.competitions.length > 0 ? (
              <ul className="space-y-1">
                {datas.competitions.map(({prize, competitions}, idx) => (
                  <li
                    key={idx}
                    className="text-sm pl-2 border-l-2 border-primary/50"
                  >
                    {competitions.competition_name}{prize}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex justify-center mt-3 mb-5">학생의 수상경력 정보가 존재하지 않습니다.</div>
            )}
          </dd>
        </div>
        <div>
          <dt className="font-medium mb-1">프로젝트 및 경험</dt>
          <dd>
            {datas.profile.project_permissions.length > 0 ? (
              <ul className="space-y-1">
                {datas.profile.project_permissions.map(({projects}) => (
                  <li
                    key={projects.project_id}
                    className="text-sm pl-2 border-l-2 border-primary/50"
                  >
                    {projects.project_name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex justify-center mt-3 mb-5">학생의 프로젝트 정보가 존재하지 않습니다.</div>
            )}
          </dd>
        </div>
      </dl>
    </div>
  )
}