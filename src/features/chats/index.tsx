import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { format } from 'date-fns'
import {
  IconArrowLeft,
  IconDotsVertical,
  IconEdit,
  IconMessages,
  IconPaperclip,
  IconPhone,
  IconPhotoPlus,
  IconPlus,
  IconSearch,
  IconSend,
  IconVideo,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
// Fake Data
import { conversations } from './data/convo.json'

type ChatUser = (typeof conversations)[number]
type Convo = ChatUser['messages'][number]

export default function Chats() {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<ChatUser>(conversations[0])
  const [mobileSelectedUser, setMobileSelectedUser] = useState<ChatUser | null>(
    null
  )

  // Filtered data based on the search query
  const filteredChatList = conversations.filter(({ fullName }) =>
    fullName.toLowerCase().includes(search.trim().toLowerCase())
  )

  const currentMessage = selectedUser.messages.reduce(
    (acc: Record<string, Convo[]>, obj) => {
      const key = format(obj.timestamp, 'd MMM, yyyy')

      // Create an array for the category if it doesn't exist
      if (!acc[key]) {
        acc[key] = []
      }

      // Push the current object to the array
      acc[key].push(obj)

      return acc
    },
    {}
  )

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <section className='flex h-full gap-6'>
          {/* Left Side */}
          <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex gap-2'>
                  <h1 className='text-2xl font-bold'>Inbox</h1>
                  <IconMessages size={20} />
                </div>

                <Button size='icon' variant='ghost' className='rounded-lg'>
                  <IconEdit size={24} className='stroke-muted-foreground' />
                </Button>
              </div>

              <label className='flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring'>
                <IconSearch size={15} className='mr-2 stroke-slate-500' />
                <span className='sr-only'>Search</span>
                <input
                  type='text'
                  className='w-full flex-1 bg-inherit text-sm focus-visible:outline-none'
                  placeholder='Search chat...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <ScrollArea className='-mx-3 h-full p-3'>
              {filteredChatList.map((chatUsr) => {
                const { id, profile, username, messages, fullName } = chatUsr
                const lastConvo = messages[0]
                const lastMsg =
                  lastConvo.sender === 'You'
                    ? `You: ${lastConvo.message}`
                    : lastConvo.message
                return (
                  <Fragment key={id}>
                    <button
                      type='button'
                      className={cn(
                        `-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75`,
                        selectedUser.id === id && 'sm:bg-muted'
                      )}
                      onClick={() => {
                        setSelectedUser(chatUsr)
                        setMobileSelectedUser(chatUsr)
                      }}
                    >
                      <div className='flex gap-2'>
                        <Avatar>
                          <AvatarImage src={profile} alt={username} />
                          <AvatarFallback>{username}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className='col-start-2 row-span-2 font-medium'>
                            {fullName}
                          </span>
                          <span className='col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground'>
                            {lastMsg}
                          </span>
                        </div>
                      </div>
                    </button>
                    <Separator className='my-1' />
                  </Fragment>
                )
              })}
            </ScrollArea>
          </div>

          {/* Right Side */}
          <div
            className={cn(
              'absolute inset-0 hidden left-full z-50 w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
              mobileSelectedUser && 'left-0 flex'
            )}
          >
            {/* Top Part */}
            <div className='mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg'>
              {/* Left */}
              <div className='flex gap-3'>
                <Button
                  size='icon'
                  variant='ghost'
                  className='-ml-2 h-full sm:hidden'
                  onClick={() => setMobileSelectedUser(null)}
                >
                  <IconArrowLeft />
                </Button>
                <div className='flex items-center gap-2 lg:gap-4'>
                  <Avatar className='size-9 lg:size-11'>
                    <AvatarImage
                      src={selectedUser.profile}
                      alt={selectedUser.username}
                    />
                    <AvatarFallback>{selectedUser.username}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                      {selectedUser.fullName}
                    </span>
                    <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                      {selectedUser.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
                <Button
                  size='icon'
                  variant='ghost'
                  className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                >
                  <IconVideo size={22} className='stroke-muted-foreground' />
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                >
                  <IconPhone size={22} className='stroke-muted-foreground' />
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
                >
                  <IconDotsVertical className='stroke-muted-foreground sm:size-5' />
                </Button>
              </div>
            </div>

            {/* Conversation */}
            <div className='flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0'>
              <div className='flex size-full flex-1'>
                <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
                  <div className='chat-flex flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4'>
                    {currentMessage &&
                      Object.keys(currentMessage).map((key) => (
                        <Fragment key={key}>
                          {currentMessage[key].map((msg, index) => (
                            <div
                              key={`${msg.sender}-${msg.timestamp}-${index}`}
                              className={cn(
                                'chat-box max-w-72 break-words px-3 py-2 shadow-lg',
                                msg.sender === 'You'
                                  ? 'self-end rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
                                  : 'self-start rounded-[16px_16px_16px_0] bg-secondary'
                              )}
                            >
                              {msg.message}{' '}
                              <span
                                className={cn(
                                  'mt-1 block text-xs font-light italic text-muted-foreground',
                                  msg.sender === 'You' && 'text-right'
                                )}
                              >
                                {format(msg.timestamp, 'h:mm a')}
                              </span>
                            </div>
                          ))}
                          <div className='text-center text-xs'>{key}</div>
                        </Fragment>
                      ))}
                  </div>
                </div>
              </div>
              <form className='flex w-full flex-none gap-2'>
                <div className='flex flex-1 items-center gap-2 rounded-md border border-input px-2 py-1 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring lg:gap-4'>
                  <div className='space-x-1'>
                    <Button
                      size='icon'
                      type='button'
                      variant='ghost'
                      className='h-8 rounded-md'
                    >
                      <IconPlus size={20} className='stroke-muted-foreground' />
                    </Button>
                    <Button
                      size='icon'
                      type='button'
                      variant='ghost'
                      className='hidden h-8 rounded-md lg:inline-flex'
                    >
                      <IconPhotoPlus
                        size={20}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                    <Button
                      size='icon'
                      type='button'
                      variant='ghost'
                      className='hidden h-8 rounded-md lg:inline-flex'
                    >
                      <IconPaperclip
                        size={20}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                  </div>
                  <label className='flex-1'>
                    <span className='sr-only'>Chat Text Box</span>
                    <input
                      type='text'
                      placeholder='Type your messages...'
                      className='h-8 w-full bg-inherit focus-visible:outline-none'
                    />
                  </label>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='hidden sm:inline-flex'
                  >
                    <IconSend size={20} />
                  </Button>
                </div>
                <Button className='h-full sm:hidden'>
                  <IconSend size={18} /> Send
                </Button>
              </form>
            </div>
          </div>
        </section>
      </Main>
    </>
  )
}
