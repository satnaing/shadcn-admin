// import { forwardRef } from 'react'
// import { format } from 'date-fns'
// import { type Order } from '@/types/api'
// import { Facebook, Instagram } from 'lucide-react'
// import { Logo } from '@/assets/logo'

// interface ReceiptProps {
//   order: Order
// }

// export const ReceiptPrintTemplate = forwardRef<HTMLDivElement, ReceiptProps>(
//   ({ order }, ref) => {
//     // Determine a locker number if available, else mock 'B6' for the template design
//     const lockerNumber = 'B6'

//     // The design has 'YOK-' prefixed to the order code if it's just numbers,
//     // but we'll use the provided invoice code.
//     const orderCode = order.invoiceCode.startsWith('YOK')
//       ? order.invoiceCode
//       : `YOK-${order.invoiceCode}`

//     return (
//       <div className='absolute top-0 -left-[9999px]'>
//         <div
//           ref={ref}
//           className='w-[380px] p-6 tracking-tight'
//           // Use inline exact-hex colors to bypass Tailwind v4's OKLCH CSS variables,
//           // which currently crashes the html2canvas parser.
//           style={{
//             fontFamily: "'Inter', sans-serif",
//             backgroundColor: '#ffffff',
//             color: '#000000',
//           }}
//         >
//           {/* Header / Logo */}
//           <div className='flex flex-col items-center pt-4 pb-8 text-center'>
//             <Logo style={{ height: '80px', width: 'auto', color: '#000000' }} />
//           </div>
//           <div
//             className='flex items-center justify-between pb-4'
//             style={{ color: '#000000' }}
//           >
//             <div
//               className='rounded-full px-5 py-1.5 text-xl font-bold'
//               style={{ backgroundColor: '#000000', color: '#ffffff' }}
//             >
//               Locker : {lockerNumber}
//             </div>
//             <div className='text-right'>
//               <div className='text-base font-bold'>ORDER : {orderCode}</div>
//               <div className='text-xs font-medium' style={{ color: '#333333' }}>
//                 {format(new Date(order.createdAt), 'E - dd/MM/yyyy _ hh:mma')}
//               </div>
//             </div>
//           </div>
//           <div
//             className='mb-6 border-b border-dashed'
//             style={{ borderColor: '#000000' }}
//           />
//           {/* Items */}
//           <div className='space-y-6 pb-6'>
//             {order.items.map((item: any, idx: number) => (
//               <div
//                 key={item.id || idx}
//                 className='flex items-end justify-between'
//               >
//                 <div
//                   className='border-l-4 pl-3 leading-tight'
//                   style={{ borderColor: '#000000' }}
//                 >
//                   <div className='text-lg font-bold uppercase'>
//                     {item.name} {item.variant}
//                   </div>
//                   <div
//                     className='text-sm font-medium'
//                     style={{ color: '#333333' }}
//                   >
//                     USD {item.price.toFixed(1)} x {item.quantity} pcs
//                   </div>
//                 </div>
//                 <div
//                   className='text-xl font-extrabold italic'
//                   style={{ color: '#000000' }}
//                 >
//                   USD {(item.price * item.quantity).toFixed(1)}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div
//             className='mb-6 border-b border-dashed'
//             style={{ borderColor: '#000000' }}
//           />
//           {/* TOTAL PRICE */}
//           <div className='flex items-center justify-between pt-2 pb-6'>
//             <div
//               className='text-xl font-extrabold tracking-widest uppercase'
//               style={{ color: '#000000' }}
//             >
//               Total Price
//             </div>
//             <div
//               className='rounded-full px-6 py-2.5 text-2xl font-extrabold tracking-tight'
//               style={{ backgroundColor: '#000000', color: '#ffffff' }}
//             >
//               USD {(order.pricing?.grandTotal || 0).toFixed(2)}
//             </div>
//           </div>
//           <div
//             className='mb-8 border-b border-dashed'
//             style={{ borderColor: '#000000' }}
//           />
//           {/* Footer - Social Media */}
//           <div className='text-center'>
//             <div className='mb-5 text-base font-bold'>
//               Follow YOK's Social Media
//             </div>
//             <div className='flex items-center justify-center gap-6'>
//               {/* QR Code 1 - Facebook */}
//               <div className='flex flex-col items-center gap-1.5'>
//                 <QrCodePlaceholder />
//                 <div className='flex items-center gap-1.5 text-xs font-bold'>
//                   <Facebook className='filled size-4 fill-black' /> YOK Cafe
//                 </div>
//               </div>

//               {/* QR Code 2 - Instagram */}
//               <div className='flex flex-col items-center gap-1.5'>
//                 <QrCodePlaceholder />
//                 <div className='flex items-center gap-1.5 text-xs font-bold'>
//                   <Instagram className='size-4' /> YOK_Cafe
//                 </div>
//               </div>

//               {/* QR Code 3 - TikTok (Music icon) */}
//               <div className='flex flex-col items-center gap-1.5'>
//                 <QrCodePlaceholder />
//                 <div className='flex items-center gap-1.5 text-xs font-bold'>
//                   <svg
//                     xmlns='http://www.w3.org/2000/svg'
//                     width='16'
//                     height='16'
//                     viewBox='0 0 24 24'
//                     fill='none'
//                     stroke='currentColor'
//                     strokeWidth='2'
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     className='size-4'
//                   >
//                     <path d='M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5' />
//                   </svg>
//                   YOK_Cafe
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className='h-8'></div> {/* Bottom padding for cut */}
//         </div>
//       </div>
//     )
//   }
// )

// ReceiptPrintTemplate.displayName = 'ReceiptPrintTemplate'

// // Simple SVG generator that visually mimics a QR code pattern without external imports
// function QrCodePlaceholder() {
//   return (
//     <svg
//       width='84'
//       height='84'
//       viewBox='0 0 64 64'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'
//     >
//       <rect width='64' height='64' fill='#ffffff' />
//       <rect
//         x='4'
//         y='4'
//         width='20'
//         height='20'
//         rx='2'
//         stroke='#000000'
//         strokeWidth='4'
//       />
//       <rect x='10' y='10' width='8' height='8' fill='#000000' />
//       <rect
//         x='40'
//         y='4'
//         width='20'
//         height='20'
//         rx='2'
//         stroke='#000000'
//         strokeWidth='4'
//       />
//       <rect x='46' y='10' width='8' height='8' fill='#000000' />
//       <rect
//         x='4'
//         y='40'
//         width='20'
//         height='20'
//         rx='2'
//         stroke='#000000'
//         strokeWidth='4'
//       />
//       <rect x='10' y='46' width='8' height='8' fill='#000000' />

//       {/* Pattern details */}
//       <path d='M28 8H36V12H28V8Z' fill='#000000' />
//       <path d='M28 16H32V20H28V16Z' fill='#000000' />
//       <path d='M36 16H40V24H36V16Z' fill='#000000' />
//       <path d='M28 24H32V28H28V24Z' fill='#000000' />
//       <path d='M8 28H16V32H8V28Z' fill='#000000' />
//       <path d='M20 28H28V36H20V28Z' fill='#000000' />
//       <path d='M32 32H36V40H32V32Z' fill='#000000' />
//       <path d='M40 28H48V36H40V28Z' fill='#000000' />
//       <path d='M52 28H60V32H52V28Z' fill='#000000' />
//       <path d='M52 36H56V44H52V36Z' fill='#000000' />
//       <path d='M52 48H60V52H52V48Z' fill='#000000' />
//       <path d='M44 40H48V48H44V40Z' fill='#000000' />
//       <path d='M40 52H48V60H40V52Z' fill='#000000' />
//       <path d='M32 44H40V48H32V44Z' fill='#000000' />
//       <path d='M28 48H36V60H28V48Z' fill='#000000' />
//       <path d='M48 16H52V20H48V16Z' fill='#000000' />
//       <path d='M20 44H24V48H20V44Z' fill='#000000' />
//       <path d='M44 56H48V60H44V56Z' fill='#000000' />
//       <path d='M16 52H20V56H16V52Z' fill='#000000' />
//       <path d='M8 56H12V60H8V56Z' fill='#000000' />
//       <path d='M56 16H60V20H56V16Z' fill='#000000' />
//     </svg>
//   )
// }
