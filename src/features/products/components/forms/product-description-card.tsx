import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface DescriptionCardProps {
  description: string
  onDescriptionChange: (v: string) => void
  tags: string
  onTagsChange: (v: string) => void
}

export function ProductDescriptionCard({
  description,
  onDescriptionChange,
  tags,
  onTagsChange,
}: DescriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Məhsul Təsviri və Açar Sözlər</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='p-desc'>Geniş Təsvir / Xüsusiyyətlər</Label>
          <Textarea
            id='p-desc'
            rows={5}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder='Məhsulun texniki parametrləri, komplektasiyası və üstünlükləri...'
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='p-tags'>Teqlər / Açar Sözlər (Vergüllə ayırın)</Label>
          <Input
            id='p-tags'
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder='apple, smartphone, 5g, oled'
          />
          <p className='text-xs text-muted-foreground'>
            Müştərilərin saytda axtarış edərkən bu məhsulu daha asan tapmasına kömək edir
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
