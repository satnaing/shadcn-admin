import TiptapEditor from "@/components/editor";
import { Toolbar } from "@/components/editor/toolbar/Toolbar";

export default function NewEducation() {
  return (
    <div className='flex flex-col gap-4'>
      <Toolbar />
      <TiptapEditor />
    </div>
  )
}
