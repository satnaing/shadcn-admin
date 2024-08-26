const SkipToMain = () => {
  return (
    <a
      className={`fixed left-44 z-[999] -translate-y-52 whitespace-nowrap bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-95 shadow transition hover:bg-primary/90 focus:translate-y-3 focus:transform focus-visible:ring-1 focus-visible:ring-ring`}
      href='#content'
    >
      Skip to Main
    </a>
  )
}

export default SkipToMain
