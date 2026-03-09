import { type Table, type Row } from '@tanstack/react-table'
import { type ShopProduct, type OptionChoice } from '@/types/api'
import { ChevronDown, ChevronRight, CornerDownRight } from 'lucide-react'
import {
  useUpdateShopProduct,
  useUpdateShopOptionChoice,
} from '@/hooks/queries/use-catalog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable, type CustomColumnDef } from '@/components/custom/data-table'
import { type Badge as MarketingBadge } from '@/features/menu/data/badge-schema'
import { PriceCell, AvailabilityCell, BadgeCell } from './shop-menu-cells'

type ShopMenuRow =
  | (ShopProduct & { _type: 'product'; subRows?: ShopMenuRow[] })
  | (OptionChoice & { _type: 'choice'; subRows?: ShopMenuRow[] })

const ProductPriceCell = ({
  item,
  shopId,
}: {
  item: ShopProduct
  shopId: string
}) => {
  const { mutate: updateProduct } = useUpdateShopProduct()
  return (
    <PriceCell
      price={item.price || ''}
      placeholder={item.product?.price?.choices?.[0]?.price?.toString() || '0'}
      onUpdate={(price) =>
        updateProduct({
          shopId,
          productId: item.productId,
          data: { price },
        })
      }
    />
  )
}

const ProductAvailabilityCell = ({
  item,
  shopId,
}: {
  item: ShopProduct
  shopId: string
}) => {
  const { mutate: updateProduct, isPending } = useUpdateShopProduct()
  return (
    <AvailabilityCell
      isAvailable={item.isAvailable}
      isPending={isPending}
      onUpdate={(checked) =>
        updateProduct({
          shopId,
          productId: item.productId,
          data: { isAvailable: checked },
        })
      }
    />
  )
}

const ProductBadgeCell = ({
  item,
  shopId,
}: {
  item: ShopProduct
  shopId: string
}) => {
  const { mutate: updateProduct, isPending } = useUpdateShopProduct()
  return (
    <BadgeCell
      selectedBadgeIds={item.badgeIds || item.badges?.map((b) => b.id) || []}
      selectedBadges={item.badges as unknown as MarketingBadge[]}
      isPending={isPending}
      onUpdate={(badgeIds) =>
        updateProduct({
          shopId,
          productId: item.productId,
          data: { badgeIds },
        })
      }
    />
  )
}

const OptionPriceCell = ({
  choice,
  shopId,
}: {
  choice: OptionChoice
  shopId: string
}) => {
  const { mutate: updateOption } = useUpdateShopOptionChoice()
  const shopChoice = choice.shopOptionChoices?.find(
    (sc) => sc.shopId === shopId
  )

  return (
    <PriceCell
      price={shopChoice?.price || choice.price || '0'}
      placeholder={
        typeof choice.price === 'number'
          ? choice.price.toString()
          : choice.price
      }
      onUpdate={(price) =>
        updateOption({
          shopId,
          choiceId: choice.id,
          data: { price },
        })
      }
    />
  )
}

const OptionAvailabilityCell = ({
  choice,
  shopId,
}: {
  choice: OptionChoice
  shopId: string
}) => {
  const { mutate: updateOption, isPending } = useUpdateShopOptionChoice()
  const shopChoice = choice.shopOptionChoices?.find(
    (sc) => sc.shopId === shopId
  )

  return (
    <AvailabilityCell
      isAvailable={shopChoice ? shopChoice.isAvailable : true}
      isPending={isPending}
      onUpdate={(checked) =>
        updateOption({
          shopId,
          choiceId: choice.id,
          data: { isAvailable: checked },
        })
      }
    />
  )
}

const OptionBadgeCell = ({
  choice,
  shopId,
}: {
  choice: OptionChoice
  shopId: string
}) => {
  const { mutate: updateOption, isPending } = useUpdateShopOptionChoice()
  const shopChoice = choice.shopOptionChoices?.find(
    (sc) => sc.shopId === shopId
  )

  return (
    <BadgeCell
      selectedBadgeIds={shopChoice?.badges?.map((b) => b.id) || []}
      selectedBadges={shopChoice?.badges as unknown as MarketingBadge[]}
      isPending={isPending}
      onUpdate={(badgeIds) =>
        updateOption({
          shopId,
          choiceId: choice.id,
          data: { badgeIds },
        })
      }
    />
  )
}

const getColumns = (
  shopId: string
): CustomColumnDef<ShopMenuRow, unknown>[] => [
  {
    id: 'select',
    header: ({ table }: { table: Table<ShopMenuRow> }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }: { row: Row<ShopMenuRow> }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    // Add sticky classes
    headerClassName: 'sticky left-0 z-20 bg-background w-12 min-w-12',
    cellClassName: 'sticky left-0 z-20 bg-background w-12 min-w-12',
  },
  {
    id: 'name',
    accessorFn: (row: ShopMenuRow) =>
      row._type === 'product' ? row.product?.name?.en : row.name?.en,
    header: 'Product / Choice',
    cell: ({ row }: { row: Row<ShopMenuRow> }) => {
      const item = row.original
      if (item._type === 'product') {
        const hasOptions = (item.subRows?.length || 0) > 0
        return (
          <div className='flex items-center gap-2 font-bold'>
            <div className='flex h-5 w-5 items-center justify-center'>
              {hasOptions ? (
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-5 w-5'
                  onClick={(e) => {
                    e.stopPropagation()
                    row.toggleExpanded()
                  }}
                >
                  {row.getIsExpanded() ? (
                    <ChevronDown className='h-3 w-3' />
                  ) : (
                    <ChevronRight className='h-3 w-3' />
                  )}
                </Button>
              ) : null}
            </div>
            <span className='text-sm'>{item.product?.name?.en}</span>
          </div>
        )
      } else {
        return (
          <div className='flex items-center gap-2 py-0.5'>
            <div className='flex h-5 w-5 items-center justify-center pl-2'>
              <CornerDownRight className='h-3 w-3 text-muted-foreground/50' />
            </div>
            <span className='text-xs font-semibold text-foreground/70'>
              {item.name?.en}
            </span>
          </div>
        )
      }
    },
    // Add sticky classes
    headerClassName:
      'sticky left-12 z-20 bg-background min-w-[250px] border-r shadow-[rgba(0,0,0,0.05)_2px_0px_0px]',
    cellClassName:
      'sticky left-12 z-20 bg-background min-w-[250px] border-r shadow-[rgba(0,0,0,0.05)_2px_0px_0px]',
  },
  {
    id: 'categoryId',
    accessorFn: (row: ShopMenuRow) =>
      row._type === 'product' ? row.product?.categoryId : undefined,
    header: 'Category',
    cell: ({ row }: { row: Row<ShopMenuRow> }) => {
      const item = row.original
      if (item._type === 'product') {
        const categoryName = item.product?.category?.name?.en || 'Uncategorized'
        return (
          <span className='text-xs text-muted-foreground'>{categoryName}</span>
        )
      }
      return null
    },
    filterFn: 'arrIncludesSome', // Important for multi-select faceted filters
  },
  {
    id: 'isAvailable',
    accessorFn: (row: ShopMenuRow) =>
      row._type === 'product'
        ? row.isAvailable
        : (row.shopOptionChoices?.find(
            (sc: { shopId: string; isAvailable: boolean }) =>
              sc.shopId === shopId
          )?.isAvailable ?? true),
    header: 'Availability',
    cell: ({ row }: { row: Row<ShopMenuRow> }) => {
      const item = row.original
      if (item._type === 'product') {
        return <ProductAvailabilityCell item={item} shopId={shopId} />
      } else {
        return <OptionAvailabilityCell choice={item} shopId={shopId} />
      }
    },
  },
  {
    id: 'price',
    accessorFn: (row: ShopMenuRow) =>
      row._type === 'product'
        ? row.price
        : (row.shopOptionChoices?.find(
            (sc: { shopId: string; price?: string | number }) =>
              sc.shopId === shopId
          )?.price ?? row.price),
    header: 'Price Override',
    cell: ({ row }: { row: Row<ShopMenuRow> }) => {
      const item = row.original
      if (item._type === 'product') {
        return <ProductPriceCell item={item} shopId={shopId} />
      } else {
        return <OptionPriceCell choice={item} shopId={shopId} />
      }
    },
  },
  {
    id: 'badgeIds',
    header: 'Marketing Badges',
    cell: ({ row }: { row: Row<ShopMenuRow> }) => {
      const item = row.original
      if (item._type === 'product') {
        return <ProductBadgeCell item={item} shopId={shopId} />
      } else {
        return <OptionBadgeCell choice={item} shopId={shopId} />
      }
    },
  },
]

interface ShopMenuTableProps {
  shopId: string
  data: ShopProduct[]
  categories?: { data?: any[] } | any[]
}

export function ShopMenuTable({
  shopId,
  data,
  categories,
}: ShopMenuTableProps) {
  // Transform flat data to Tanstack sub-row structure
  const tableData: ShopMenuRow[] = data.map((item) => {
    const choices: ShopMenuRow[] = []
    item.product?.optionGroups?.forEach((group) => {
      group.choices?.forEach((choice) => {
        choices.push({
          ...choice,
          _type: 'choice',
        })
      })
    })

    return {
      ...item,
      _type: 'product',
      subRows: choices.length > 0 ? choices : undefined,
    }
  })

  const categoriesArray = Array.isArray(categories)
    ? categories
    : categories?.data || []

  const categoryFilters = categoriesArray.map(
    (c: { id: string; name?: { en?: string } }) => ({
      label: c.name?.en || 'Unknown Category',
      value: c.id,
    })
  )

  return (
    <div className='flex flex-col space-y-4'>
      <DataTable
        columns={getColumns(shopId)}
        data={tableData}
        searchKey='name'
        searchPlaceholder='Filter products/choices...'
        getSubRows={(row) => row.subRows}
        filters={[
          {
            columnId: 'categoryId',
            title: 'Category',
            options: categoryFilters,
          },
        ]}
      />
    </div>
  )
}
