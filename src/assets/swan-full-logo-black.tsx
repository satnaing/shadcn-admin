import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function SwanFullLogoBlack({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role='img'
      viewBox='0 0 408 108'
      width='408'
      height='108'
      className={cn('[&>*]:fill-current', className)}
      fill='currentColor'
      {...props}
    >
      <title>Swan Full Logo Black</title>
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
      <g id='swan-full-logo-black' stroke='none' fill='none' fillRule='evenodd'>
        <g id='swan-symbol-black' transform='translate(-16, -27)'>
          <polygon
            id='Path'
            fill='#0C0B10'
            points='55 117 23 85 55 85 55 53 87 85 87 37 103 37 119 53 97.6724824 53 119 85 119 117'
          ></polygon>
          <polygon
            id='Path'
            fill='url(#linearGradient-1)'
            opacity='0.300000012'
            points='87 37 87 85 119 117 119 85'
          ></polygon>
          <polygon
            id='Path'
            fill='url(#linearGradient-2)'
            opacity='0.300000012'
            points='119 117 55 53 55 117'
          ></polygon>
        </g>
        <g id='swan-wordmark' transform='translate(113, 11)' fill='#0C0B10'>
          <path
            d='M42,14 C51.3333333,14 59.3333333,17 66,23 L56,33 C52,29.6666667 47.3333333,28 42,28 L41.4342309,28.0043257 C36.6297615,28.0783197 32,29.1132075 32,32 C32,34.6666667 35,36.5 41,37.5 L41.5290856,37.5970462 C57.8430285,40.6458239 66,47.4468085 66,58 C66,70 54,76 40,76 C30.6666667,76 22.6666667,73 16,67 L26,57 C30,60.3333333 34.6666667,62 40,62 L40.5657691,61.9956743 C45.3702385,61.9216803 50,60.8867925 50,58 C50,55.3333333 47,53.5 41,52.5 L40.4709144,52.4029538 C24.1569715,49.3541761 16,42.5531915 16,32 C16,20 28,14 42,14 Z M192,50 L192,48 L191.003857,48.1378273 C176.777806,50.1792703 172,54.0674157 172,57 C172,60 175,62 180,62 C185,62 192,58 192,50 Z M192,67 C188,73 183,76 177,76 C166,76 156,70 156,58 C156,45 167,38 192,35 L192,34 C192,31 188,28 183,28 C177.666667,28 173,29.6666667 169,33 L159,23 C165.666667,17 173.666667,14 183,14 C197,14 208,22 208,34 L208,75 L192,75 L192,67 Z M86,75 L99,75 L112,38 L125,75 L138,75 L154,15 L138,15 L130,50 L119,15 L105,15 L94,50 L86,15 L70,15 L86,75 Z M255.982372,43.000813 C255.994251,42.5770811 256,42.1526415 256,41.7285714 C256,33.1681578 252.5,28 245.833333,28 C239.166667,28 235,33.6110149 235,42.1714286 C235,42.448143 235.003144,42.7245521 235.009494,43.0003863 L235,75 L219,75 L219,15 L235,15 L234.999782,20.4957315 C238.839135,16.3694834 244.18806,14 250.87234,14 C265.510638,14 272,25.3638499 272,41.65625 C272,42.1054643 271.995994,42.5537352 271.98787,43.0007731 L272,43 L272,75 L256,75 L256,43 L255.982372,43.000813 Z'
            id='Shape'
          ></path>
        </g>
      </g>
    </svg>
  )
}
