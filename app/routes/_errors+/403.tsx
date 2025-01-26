import { Link, useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'

export default function ForbiddenError() {
  const navigate = useNavigate()

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">403</h1>
        <span className="font-medium">Access Forbidden</span>
        <p className="text-muted-foreground text-center">
          You don't have necessary permission <br />
          to view this resource.
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
