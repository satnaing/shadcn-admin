import { useState } from 'react';
import { FaUsers, FaMedal, FaTrophy } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Analytics } from './components/analytics';



export function Dashboard() {
  const leaderboardData = [
    { team: 'Team A', gold: 5, silver: 3, bronze: 2, total: 10 },
    { team: 'Team B', gold: 3, silver: 4, bronze: 3, total: 10 },
    { team: 'Team C', gold: 2, silver: 2, bronze: 5, total: 9 },
    { team: 'Team D', gold: 1, silver: 3, bronze: 4, total: 8 },
    { team: 'Team E', gold: 0, silver: 1, bronze: 2, total: 3 },
  ]
  const [search, setSearch] = useState('')
  const filteredData = leaderboardData.filter((row) =>
    row.team.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* ===== Top Header (ONLY ONCE) ===== */}
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
        </div>
      </Header>

      {/* ===== Main Layout (ONLY ONCE) ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>Leaderboards</h1>
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overall</TabsTrigger>
              <TabsTrigger value='analytics'>Elementary</TabsTrigger>
              <TabsTrigger value='secondary'>Secondary</TabsTrigger>
              <TabsTrigger value='paragames'>Paragames</TabsTrigger>
            </TabsList>
          </div>

          {/* ===== OVERVIEW TAB ===== */}
          <TabsContent value='overview' className='space-y-6' forceMount>
            {/* ===== Stats Cards ===== */}
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Participating Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>5</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Events Recorded
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>200</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Medals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>500</div>
                </CardContent>
              </Card>
            </div>

            {/* ===== TASKS SECTION (CORRECT) ===== */}
            <Card>
              <CardHeader className='flex items-center justify-between gap-4'>
                {/* Left: Title and last updated */}
                <div className='flex flex-col'>
                  <CardTitle>Official Result Tally Board</CardTitle>
                  <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                    Last updated: 7 Jan 2026, 14:30
                  </p>
                </div>

                {/* Right: Search input */}
                <input
                  type='text'
                  placeholder='Search teams...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='w-48 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-800'
                />
              </CardHeader>
              <CardContent className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-2/5'>
                        <div className='flex items-center space-x-1'>
                          <FaUsers className='text-gray-500 dark:text-gray-400' />
                          <span>Team</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className='flex items-center justify-center space-x-1'>
                          <FaTrophy className='text-yellow-400' />
                          <span>Gold</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className='flex items-center justify-center space-x-1'>
                          <FaTrophy className='text-gray-400' />
                          <span>Silver</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className='flex items-center justify-center space-x-1'>
                          <FaTrophy className='text-orange-600' />
                          <span>Bronze</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className='flex items-center justify-center space-x-1'>
                          <FaMedal className='text-purple-500' />
                          <span>Total</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row, index) => (
                      <TableRow
                        key={row.team}
                        className={`${
                          index % 2 === 0
                            ? 'bg-white dark:bg-gray-900'
                            : 'bg-gray-50 dark:bg-gray-800'
                        } hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        <TableCell>{row.team}</TableCell>
                        <TableCell className="text-center">{row.gold}</TableCell>
                        <TableCell className="text-center">{row.silver}</TableCell>
                        <TableCell className="text-center">{row.bronze}</TableCell>
                        <TableCell className="text-center">{row.total}</TableCell>
                      </TableRow>
                    ))}

                    {filteredData.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className='text-center text-gray-500'
                        >
                          No teams found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== ANALYTICS TAB ===== */}
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
