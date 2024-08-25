import { Button } from './custom/button'

const SkipToMain = () => {
  return (
    <a
      className={`fixed left-44 z-[999] -translate-y-52 opacity-95 transition-transform focus:translate-y-3 focus:transform focus:outline-none lg:text-xl`}
      href='#content'
    >
      <Button>Skip to Main</Button>
    </a>
  )
}

export default SkipToMain
