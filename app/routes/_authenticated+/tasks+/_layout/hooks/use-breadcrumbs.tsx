import React from 'react'
import { href, Link, useMatches } from 'react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'

interface MatchedBreadcrumbItem {
  label: string
  to?: string
  isCurrentPage?: boolean
}

function isBreadcrumbHandle(
  handle: unknown,
): handle is { breadcrumb: (params: unknown) => object } {
  return (
    typeof handle === 'object' &&
    !!handle &&
    'breadcrumb' in handle &&
    typeof handle.breadcrumb === 'function'
  )
}

export const useBreadcrumbs = () => {
  const matches = useMatches()
  const breadcrumbMatches = matches.filter((match) =>
    isBreadcrumbHandle(match.handle),
  )

  const breadcrumbItems = breadcrumbMatches.map((match, idx) => {
    if (!isBreadcrumbHandle(match.handle)) {
      return null
    }
    return {
      ...match.handle.breadcrumb(match.data),
      isCurrentPage: idx === breadcrumbMatches.length - 1,
    }
  }) as MatchedBreadcrumbItem[]

  const Breadcrumbs = () => {
    return (
      <Breadcrumb>
        <BreadcrumbList className="px-4">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={href('/')}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbItems.map((item, idx) => {
            return (
              <React.Fragment key={idx}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {item.to ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.to}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return { Breadcrumbs }
}
