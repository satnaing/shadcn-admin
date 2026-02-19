import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Severity = 'Normal' | 'Warning' | 'Critical'

const severityClass: Record<Severity, string> = {
  Normal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Critical: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
}

const networkSummary = [
  { label: 'Network Health Score', value: '82 / 100' },
  { label: 'Cells with active violations', value: '1,342 (6.8%)' },
  { label: 'Regions degraded', value: '2 / 8' },
  { label: 'Automated CM changes (24h)', value: '417' },
  { label: 'Decisions pending approval', value: '19' },
]

const kpiTrendData = [
  { time: '00:00', dropRate: 0.62, throughput: 109, latency: 22 },
  { time: '04:00', dropRate: 0.66, throughput: 103, latency: 23 },
  { time: '08:00', dropRate: 0.74, throughput: 97, latency: 25 },
  { time: '12:00', dropRate: 0.82, throughput: 94, latency: 27 },
  { time: '16:00', dropRate: 0.86, throughput: 90, latency: 29 },
  { time: '20:00', dropRate: 0.79, throughput: 96, latency: 26 },
]

const violationTrendData = [
  { time: '00:00', critical: 518, warning: 574 },
  { time: '04:00', critical: 538, warning: 593 },
  { time: '08:00', critical: 566, warning: 620 },
  { time: '12:00', critical: 611, warning: 645 },
  { time: '16:00', critical: 633, warning: 662 },
  { time: '20:00', critical: 602, warning: 643 },
]

const kpiStatusRows = [
  ['Drop Rate', 'Network', '0.82%', '0.60%', '+0.22', 'Warning'],
  ['Throughput', 'Network', '94 Mbps', '110 Mbps', '-16', 'Warning'],
  ['Latency', 'Network', '27 ms', '22 ms', '+5', 'Warning'],
  ['Call Setup SR', 'Network', '99.1%', '99.4%', '-0.3', 'Normal'],
  ['Handover SR', 'Network', '98.6%', '99.0%', '-0.4', 'Normal'],
  ['Drop Rate', 'Region Helsinki', '0.95%', '0.60%', '+0.35', 'Warning'],
  ['Throughput', 'Region Helsinki', '78 Mbps', '105 Mbps', '-27', 'Critical'],
  ['Latency', 'Region Helsinki', '31 ms', '22 ms', '+9', 'Critical'],
  ['Call Setup SR', 'Region Helsinki', '98.9%', '99.3%', '-0.4', 'Warning'],
  ['Handover SR', 'Region Helsinki', '98.1%', '98.9%', '-0.8', 'Warning'],
  ['Drop Rate', 'Region Tampere', '0.88%', '0.60%', '+0.28', 'Warning'],
  ['Throughput', 'Region Tampere', '86 Mbps', '102 Mbps', '-16', 'Warning'],
  ['Latency', 'Region Tampere', '28 ms', '22 ms', '+6', 'Warning'],
  ['Drop Rate', 'Region Turku', '0.79%', '0.60%', '+0.19', 'Warning'],
  ['Throughput', 'Region Turku', '91 Mbps', '100 Mbps', '-9', 'Normal'],
]

const guardrailRows = [
  ['Nokia', 'Cell', 'MaxUE', 'Average', 'avg(14d)', '+15%', 'Region Helsinki'],
  ['Ericsson', 'Cell', 'DLBW2', 'Average', 'avg(30d)', '±10%', 'All'],
  ['Nokia', 'Cell', 'HO_Threshold', 'Manual', '-95', '±5', 'All'],
  ['Ericsson', 'Cell', 'Qoffset', 'Average', 'avg(30d)', '±10%', 'All'],
  ['Nokia', 'Cell', 'TxPower', 'Average', 'avg(14d)', '±8%', 'Region Tampere'],
  ['Ericsson', 'Cell', 'RSRP_Min', 'Manual', '-110', '±5', 'All'],
  ['Nokia', 'Cell', 'HO_Hysteresis', 'Average', 'avg(14d)', '±12%', 'Region Helsinki'],
  ['Ericsson', 'Cell', 'SINR_Offset', 'Average', 'avg(7d)', '±10%', 'All'],
  ['Nokia', 'Cell', 'LoadLimit', 'Average', 'avg(30d)', '±15%', 'Region Turku'],
  ['Ericsson', 'Cell', 'DLBW1', 'Average', 'avg(14d)', '±8%', 'All'],
]

const violationRows = [
  ['KFI-HEL-221', 'Nokia', 'MaxUE', 'avg', '+22%', '+22%', 'Critical'],
  ['KFI-HEL-305', 'Ericsson', 'DLBW2', 'avg', '-18%', '-18%', 'Warning'],
  ['KFI-TKU-114', 'Nokia', 'HO_Threshold', '-95', '-89', '+6', 'Warning'],
  ['KFI-HEL-402', 'Ericsson', 'Qoffset', 'avg', '+14%', '+14%', 'Warning'],
  ['KFI-TMP-087', 'Nokia', 'TxPower', 'avg', '-12%', '-12%', 'Critical'],
  ['KFI-HEL-512', 'Nokia', 'LoadLimit', 'avg', '+19%', '+19%', 'Critical'],
  ['KFI-TMP-233', 'Ericsson', 'SINR_Offset', 'avg', '-11%', '-11%', 'Warning'],
  ['KFI-TKU-341', 'Nokia', 'MaxUE', 'avg', '+16%', '+16%', 'Critical'],
  ['KFI-OUL-118', 'Ericsson', 'DLBW1', 'avg', '-9%', '-9%', 'Warning'],
  ['KFI-JYV-204', 'Nokia', 'TxPower', 'avg', '-7%', '-7%', 'Warning'],
  ['KFI-HEL-619', 'Ericsson', 'HO_Time', 'avg', '+18%', '+18%', 'Critical'],
  ['KFI-TKU-188', 'Nokia', 'RSRP_Min', '-108', '-101', '+7', 'Warning'],
]

const cmTimelineRows = [
  ['09:10', 'Script', 'Auto-optimizer triggered'],
  ['09:14', 'CM', 'MaxUE +18%'],
  ['09:18', 'CM', 'DLBW2 -10%'],
  ['09:25', 'Log', 'Load imbalance detected'],
  ['09:32', 'CM', 'HO_Threshold -95 → -89'],
]

const beforeAfterRows = [
  ['Drop Rate', '0.58%', '0.96%'],
  ['Throughput', '108 Mbps', '79 Mbps'],
  ['Latency', '22 ms', '31 ms'],
  ['Handover SR', '99.1%', '98.4%'],
]

const decisionRows = [
  ['KFI-HEL-221', 'MaxUE overload', 'Restore avg baseline', '0.84'],
  ['KFI-HEL-305', 'Bandwidth drift', 'Rollback DLBW2', '0.79'],
  ['KFI-TKU-114', 'HO threshold shift', 'Restore baseline', '0.72'],
  ['KFI-TMP-087', 'TxPower imbalance', 'Normalize to avg', '0.81'],
]

const reportingRows = [
  ['2026-02-18T09:14:00Z', 'CM', 'Cell', 'MaxUE', '109', '127', 'System'],
  ['2026-02-18T09:18:00Z', 'CM', 'Cell', 'DLBW2', '20MHz', '18MHz', 'Decision Engine'],
  ['2026-02-18T09:25:00Z', 'PM', 'Region', 'Throughput', '108 Mbps', '79 Mbps', 'System'],
  ['2026-02-18T09:32:00Z', 'Auto-Optimizer', 'Cell', 'HO_Threshold', '-95', '-89', 'System'],
]

const mainNavItems = ['Overview', 'Guardrails (Baselines)', 'Violations', 'Investigation', 'Decisions', 'Reporting']

export function Dashboard() {
  return (
    <>
      <Header>
        <div className='text-sm font-semibold tracking-wide text-muted-foreground'>ARVIX Finland Network Simulation</div>
        <div className='ms-auto flex items-center gap-3'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-4 rounded-lg border bg-card p-4'>
          <div className='mb-3 text-sm font-medium'>Global Context Bar</div>
          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            <Select defaultValue='ericsson'>
              <SelectTrigger>
                <SelectValue placeholder='Vendor selector' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ericsson'>Ericsson</SelectItem>
                <SelectItem value='nokia'>Nokia</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue='network'>
              <SelectTrigger>
                <SelectValue placeholder='Scope selector' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='network'>Network</SelectItem>
                <SelectItem value='region'>Region</SelectItem>
                <SelectItem value='cell'>Cell</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue='24h'>
              <SelectTrigger>
                <SelectValue placeholder='Time window' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='24h'>Last 24h</SelectItem>
                <SelectItem value='7d'>Last 7d</SelectItem>
                <SelectItem value='custom'>Custom</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder='Search: Cell ID / Region' />
          </div>
        </div>

        <Tabs defaultValue='overview' className='space-y-4'>
          <div className='w-full overflow-x-auto'>
            <TabsList>
              {mainNavItems.map((item) => (
                <TabsTrigger key={item} value={item.toLowerCase().split(' ')[0]}>{item}</TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
              {networkSummary.map((metric) => (
                <Card key={metric.label}>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium text-muted-foreground'>{metric.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className='grid gap-4 lg:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Network KPIs over time (24h / 7d)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={280}>
                    <LineChart data={kpiTrendData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='time' />
                      <YAxis yAxisId='left' />
                      <YAxis yAxisId='right' orientation='right' />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId='left' type='monotone' dataKey='dropRate' name='Drop Rate (%)' stroke='#ef4444' />
                      <Line yAxisId='right' type='monotone' dataKey='throughput' name='Throughput (Mbps)' stroke='#2563eb' />
                      <Line yAxisId='right' type='monotone' dataKey='latency' name='Latency (ms)' stroke='#10b981' />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Violations Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={280}>
                    <AreaChart data={violationTrendData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='time' />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type='monotone' dataKey='critical' stackId='1' stroke='#f43f5e' fill='#f43f5e' name='Critical' />
                      <Area type='monotone' dataKey='warning' stackId='1' stroke='#f59e0b' fill='#f59e0b' name='Warning' />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className='grid gap-4 lg:grid-cols-3'>
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Impact Split</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={240}>
                    <BarChart data={[{ vendor: 'Nokia', share: 52 }, { vendor: 'Ericsson', share: 48 }]}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='vendor' />
                      <YAxis unit='%' />
                      <Tooltip />
                      <Bar dataKey='share' fill='#6366f1' radius={6} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className='lg:col-span-2'>
                <CardHeader>
                  <CardTitle>Top Degraded Regions</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    headers={['Region', 'Affected Cells', 'Max Severity']}
                    rows={[
                      ['Helsinki Metro', '412', 'Critical'],
                      ['Tampere', '188', 'Warning'],
                      ['Turku', '91', 'Warning'],
                    ]}
                    severityColumnIndex={2}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>KPI Status (Network & Regions)</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  headers={['KPI', 'Scope', 'Current', 'Baseline', 'Delta', 'Status']}
                  rows={kpiStatusRows}
                  severityColumnIndex={5}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='guardrails'>
            <Card>
              <CardHeader>
                <CardTitle>Guardrails – Baseline Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  headers={['Vendor', 'Entity', 'Parameter', 'Method', 'Expected', 'Tolerance', 'Scope']}
                  rows={guardrailRows}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='violations'>
            <Card>
              <CardHeader>
                <CardTitle>Violations – Baseline Violations</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  headers={['Cell', 'Vendor', 'Parameter', 'Expected', 'Current', 'Deviation', 'Severity']}
                  rows={violationRows}
                  severityColumnIndex={6}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='investigation' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>CM Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable headers={['Time', 'Source', 'Change']} rows={cmTimelineRows} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>KPI Before / After</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable headers={['KPI', 'Before', 'After']} rows={beforeAfterRows} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='decisions'>
            <Card>
              <CardHeader>
                <CardTitle>Decision Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable headers={['Cell', 'Issue', 'Suggested Action', 'Confidence']} rows={decisionRows} />
                <p className='mt-4 text-sm text-muted-foreground'>
                  Confidence logic (MVP): rule-based + historical similarity + recency weighting.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='reporting' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Reporting Filters</CardTitle>
              </CardHeader>
              <CardContent className='grid gap-3 md:grid-cols-3'>
                <Select defaultValue='24h'><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value='24h'>Last 24h</SelectItem><SelectItem value='7d'>7d</SelectItem><SelectItem value='30d'>30d</SelectItem><SelectItem value='custom'>Custom</SelectItem></SelectContent></Select>
                <Select defaultValue='cm'><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value='cm'>CM</SelectItem><SelectItem value='pm'>PM</SelectItem><SelectItem value='userlog'>UserLog</SelectItem><SelectItem value='system'>System</SelectItem><SelectItem value='auto'>Auto-Optimizer</SelectItem></SelectContent></Select>
                <Input placeholder='Vendor / Region / Cell / User / Action Type' />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unified Event History (Read-only)</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  headers={['Time', 'Source', 'Entity', 'Parameter / KPI', 'Old Value', 'New Value', 'Actor']}
                  rows={reportingRows}
                />
                <p className='mt-4 text-sm text-muted-foreground'>Export formats: CSV, JSON • CM/PM retention: 12–24 months • Logs/decisions retention: 24+ months.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

function DataTable({
  headers,
  rows,
  severityColumnIndex,
}: {
  headers: string[]
  rows: string[][]
  severityColumnIndex?: number
}) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[720px] text-left text-sm'>
        <thead>
          <tr className='border-b'>
            {headers.map((header) => (
              <th key={header} className='px-3 py-2 font-semibold'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`} className='border-b'>
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className='px-3 py-2'>
                  {cellIndex === severityColumnIndex && ['Normal', 'Warning', 'Critical'].includes(cell) ? (
                    <Badge variant='secondary' className={severityClass[cell as Severity]}>
                      {cell}
                    </Badge>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
