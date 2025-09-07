import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function SwanSymbolBlack({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role='img'
      viewBox='0 0 122 122'
      version='1.1'
      width='122'
      height='122'
      className={cn('[&>*]:fill-current', className)}
      fill='currentColor'
      {...props}
    >
      <title>Swan Symbol Black</title>
      <defs>
        <linearGradient
          x1='0%'
          y1='80.0817871%'
          x2='0%'
          y2='-6.10622664e-14%'
          id='linearGradient-1'
        >
          <stop stopColor='#FFFFFF' stopOpacity='0' offset='0%'></stop>
          <stop stopColor='#FFFFFF' offset='100%'></stop>
        </linearGradient>
        <linearGradient x1='0%' y1='27.243042%' x2='0%' y2='100%' id='linearGradient-2'>
          <stop stopColor='#FFFFFF' stopOpacity='0' offset='0%'></stop>
          <stop stopColor='#FFFFFF' offset='100%'></stop>
        </linearGradient>
      </defs>
      <g id='swan-symbol-black' stroke='none' fill='none' fillRule='evenodd'>
        <g transform='translate(-19, -19)' id='Path'>
          <polygon
            fill='#0C0B10'
            points='55 117 23 85 55 85 55 53 87 85 87 37 103 37 119 53 97.6724824 53 119 85 119 117'
          ></polygon>
          <polygon
            fill='url(#linearGradient-1)'
            opacity='0.300000012'
            points='87 37 87 85 119 117 119 85'
          ></polygon>
          <polygon
            fill='url(#linearGradient-2)'
            opacity='0.300000012'
            points='119 117 55 53 55 117'
          ></polygon>
        </g>
      </g>
    </svg>
  )
}
