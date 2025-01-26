import { Link, useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'

export default function UnauthorisedError() {
  const navigate = useNavigate()
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">401</h1>
        <span className="font-medium">Unauthorized Access</span>
        <p className="text-muted-foreground text-center">
          Please log in with the appropriate credentials <br /> to access this
          resource.
        </p>
        <div className="mt-6 flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
