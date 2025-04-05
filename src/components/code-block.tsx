export default function CodeBlock({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.HTMLProps<HTMLPreElement>) {
  return (
    <pre
      className={`mt-2 w-full max-w-full overflow-x-auto rounded-md bg-slate-950 p-4 ${className}`}
      {...props}
    >
      <code className='whitespace-pre-wrap text-white'>{children}</code>
    </pre>
  )
}
