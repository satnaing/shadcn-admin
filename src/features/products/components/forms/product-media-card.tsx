import { Image, Video } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface MediaCardProps {
  thumbnail: string
  onThumbnailChange: (v: string) => void
  galleryImages: string
  onGalleryChange: (v: string) => void
  videoLink: string
  onVideoLinkChange: (v: string) => void
}

export function ProductMediaCard({
  thumbnail,
  onThumbnailChange,
  galleryImages,
  onGalleryChange,
  videoLink,
  onVideoLinkChange,
}: MediaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base flex items-center gap-2'>
          <Image className='size-4 text-primary' />
          Məhsul Qrafikası və Video
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='p-thumb'>Əsas Şəkil (Thumbnail URL) *</Label>
            <Input
              id='p-thumb'
              value={thumbnail}
              onChange={(e) => onThumbnailChange(e.target.value)}
              placeholder='https://...'
            />
            {thumbnail ? (
              <div className='mt-2 flex items-center gap-3 rounded-lg border p-2'>
                <img src={thumbnail} alt='Preview' className='size-14 rounded object-cover' />
                <span className='text-xs text-muted-foreground truncate'>{thumbnail}</span>
              </div>
            ) : (
              <div className='mt-2 flex h-14 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground'>
                Şəkil URL-i daxil edin
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='p-gallery'>Qalereya Şəkilləri (Vergüllə ayrılmış URL-lər)</Label>
            <Input
              id='p-gallery'
              value={galleryImages}
              onChange={(e) => onGalleryChange(e.target.value)}
              placeholder='https://image1.jpg, https://image2.jpg'
            />
            <p className='text-xs text-muted-foreground'>
              Məhsul səhifəsindəki şəkil karuseli üçün əlavə fotolar
            </p>
          </div>
        </div>

        <div className='space-y-2 border-t pt-3'>
          <Label htmlFor='p-video' className='flex items-center gap-1.5'>
            <Video className='size-3.5' />
            Video Linki (YouTube / Vimeo)
          </Label>
          <Input
            id='p-video'
            value={videoLink}
            onChange={(e) => onVideoLinkChange(e.target.value)}
            placeholder='https://www.youtube.com/watch?v=...'
          />
        </div>
      </CardContent>
    </Card>
  )
}
