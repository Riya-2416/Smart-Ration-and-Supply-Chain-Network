'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Edit, Trash2, Plus, PackageOpen, AlertTriangle, RefreshCcw, BarChart3 } from 'lucide-react'

type InventoryItem = {
  id: string
  name: string
  category: string
  available: number
  minThreshold: number
  lastUpdated: string
  expiryDate?: string
}

const initialItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Rice',
    category: 'Grains',
    available: 1200,
    minThreshold: 500,
    lastUpdated: '2025-10-02',
  },
  {
    id: '2',
    name: 'Wheat',
    category: 'Grains',
    available: 300,
    minThreshold: 400,
    lastUpdated: '2025-10-02',
  },
  {
    id: '3',
    name: 'Pulses',
    category: 'Legumes',
    available: 90,
    minThreshold: 120,
    lastUpdated: '2025-09-30',
  },
  {
    id: '4',
    name: 'Edible Oil',
    category: 'Oils',
    available: 60,
    minThreshold: 80,
    lastUpdated: '2025-09-28',
  },
]

const categories = ['All', 'Grains', 'Legumes', 'Oils']

export default function InventoryDashboard() {
  const [items, setItems] = React.useState<InventoryItem[]>(initialItems)
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState('All')
  const [stockLevel, setStockLevel] = React.useState<'all' | 'low' | 'ok'>('all')
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<InventoryItem | null>(null)

  const filtered = React.useMemo(() => {
    return items.filter((it) => {
      const matchQuery = it.name.toLowerCase().includes(query.toLowerCase())
      const matchCategory = category === 'All' ? true : it.category === category
      const isLow = it.available <= it.minThreshold
      const matchStock =
        stockLevel === 'all' ? true : stockLevel === 'low' ? isLow : !isLow
      return matchQuery && matchCategory && matchStock
    })
  }, [items, query, category, stockLevel])

  const totalStock = items.reduce((sum, it) => sum + it.available, 0)
  const lowStockCount = items.filter((it) => it.available <= it.minThreshold).length
  const issuedItems = 2450 // placeholder for demo
  const incomingSupply = 600 // placeholder for demo

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(item: InventoryItem) {
    setEditing(item)
    setModalOpen(true)
  }

  function handleSave(form: FormData) {
    const id = (form.get('id') as string) || crypto.randomUUID()
    const name = (form.get('name') as string).trim()
    const category = (form.get('category') as string)
    const qty = Number(form.get('quantity')) || 0
    const minThreshold = Number(form.get('minThreshold')) || 0
    const expiryDate = (form.get('expiryDate') as string) || undefined

    setItems((prev) => {
      const exists = prev.some((i) => i.id === id)
      const now = new Date().toISOString().slice(0, 10)
      const next: InventoryItem = {
        id,
        name,
        category,
        available: qty,
        minThreshold,
        lastUpdated: now,
        expiryDate,
      }
      if (exists) {
        return prev.map((i) => (i.id === id ? next : i))
      }
      return [next, ...prev]
    })
    setModalOpen(false)
  }

  return (
    <div className="flex min-h-[calc(100dvh-2rem)] flex-col gap-6 p-4 sm:p-6">
      {/* Top navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="size-5 text-primary" />
          <h1 className="text-xl font-semibold sm:text-2xl">Inventory Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost">Dashboard</Button>
          <Button variant="secondary">Inventory</Button>
          <Button variant="ghost">Distribution</Button>
          <Button variant="ghost">Reports</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          icon={<PackageOpen className="size-5" />}
        />
        <SummaryCard
          title="Low Stock Alerts"
          value={lowStockCount}
          icon={<AlertTriangle className="size-5" />}
          highlight
        />
        <SummaryCard
          title="Issued Items"
          value={issuedItems.toLocaleString()}
          icon={<RefreshCcw className="size-5" />}
        />
        <SummaryCard
          title="Incoming Supply"
          value={incomingSupply.toLocaleString()}
          icon={<Plus className="size-5" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex items-center justify-between gap-4 sm:flex-row">
          <div>
            <CardTitle className="text-base sm:text-lg">Inventory</CardTitle>
            <CardDescription>Search and manage ration items</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate}>
                  <Plus />
                  Add Item
                </Button>
              </DialogTrigger>
              <StockDialog
                open={modalOpen}
                onOpenChange={setModalOpen}
                item={editing}
                onSubmit={handleSave}
              />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Search by item name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockLevel} onValueChange={(v) => setStockLevel(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Stock Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="ok">OK</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="w-full" onClick={() => {
                setQuery('')
                setCategory('All')
                setStockLevel('all')
              }}>Reset</Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Available Stock</TableHead>
                  <TableHead>Minimum Threshold</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence initial={false}>
                  {filtered.map((it) => {
                    const isLow = it.available <= it.minThreshold
                    return (
                      <motion.tr
                        key={it.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className={cn(
                          'border-b',
                          isLow && 'bg-destructive/5'
                        )}
                      >
                        <TableCell className="font-medium">{it.name}</TableCell>
                        <TableCell>{it.category}</TableCell>
                        <TableCell className={cn(isLow && 'text-destructive font-semibold')}>
                          {it.available}
                        </TableCell>
                        <TableCell>{it.minThreshold}</TableCell>
                        <TableCell>{it.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(it)}>
                              <Edit /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(it.id)}>
                              <Trash2 /> Delete
                            </Button>
                            <Button size="sm" onClick={() => openEdit(it)}>
                              <RefreshCcw /> Update Stock
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </TableBody>
              {filtered.length === 0 && (
                <TableCaption>No items match your filters.</TableCaption>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon,
  highlight,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card className={cn(highlight && 'border-destructive/40')}> 
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
          <div className={cn('rounded-md p-2', highlight ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary')}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function StockDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  item: InventoryItem | null
  onSubmit: (form: FormData) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0" showCloseButton>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>{item ? 'Edit Item' : 'Add Item'}</DialogTitle>
              <DialogDescription>Update stock details for ration items.</DialogDescription>
            </DialogHeader>
            <form
              className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
              action={(formData) => onSubmit(formData)}
            >
              {item && <input type="hidden" name="id" defaultValue={item.id} />}

              <div className="col-span-1 sm:col-span-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" name="name" required defaultValue={item?.name ?? ''} />
              </div>

              <div>
                <Label>Category</Label>
                <Select name="category" defaultValue={item?.category ?? 'Grains'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min={0} required defaultValue={item?.available ?? 0} />
              </div>

              <div>
                <Label htmlFor="minThreshold">Minimum Threshold</Label>
                <Input id="minThreshold" name="minThreshold" type="number" min={0} required defaultValue={item?.minThreshold ?? 0} />
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" name="expiryDate" type="date" defaultValue={item?.expiryDate ?? ''} />
              </div>

              <DialogFooter className="col-span-1 sm:col-span-2 mt-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}


