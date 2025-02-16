import TiptapEditor from "@/components/editor";
import { Toolbar } from "@/components/editor/toolbar/Toolbar";
import { TasksDialogs } from "@/features/tasks/components/tasks-dialogs";

export default function NewEducation() {
  return (
    <div className='flex flex-col gap-4'>
      <Toolbar />
      <TiptapEditor />
      <TasksDialogs />
    </div>
  )
}
