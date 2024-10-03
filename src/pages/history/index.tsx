'use client'
import React, { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'

import {
    IconPaperclip,
    IconPhotoPlus,
    IconPlus,
    IconSend,
} from '@tabler/icons-react'

import { Fragment } from 'react/jsx-runtime'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'

import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
// import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Textarea } from '@/components/ui/textarea'
// import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Add this interface for the message structure
interface Message {
    sender: string
    message: string
    timestamp: Date
}

export default function History() {
    // Add state for messages and input
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'AI', message: 'Hello! How can I assist you today?', timestamp: new Date() },
        { sender: 'You', message: 'Hi! I have a question about React.', timestamp: new Date() },
    ])
    const [input, setInput] = useState('')

    // Add function to handle sending messages
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            const newMessage: Message = {
                sender: 'You',
                message: input.trim(),
                timestamp: new Date(),
            }
            setMessages([newMessage, ...messages])
            setInput('')
            setTimeout(() => {
                setMessages([{
                    sender: 'AI',
                    message: 'Hello! How can I assist you today?',
                    timestamp: new Date(),
                }, newMessage, ...messages])
            }, 500);
            // Here you would typically also send the message to your AI backend
            // and then add the AI's response to the messages
        }
    }

    const renderMessageForm = () => (
        <form onSubmit={handleSendMessage} className='flex w-full items-center justify-center shadow-md flex-none gap-2 bg-background'>
            <div className='flex flex-1  w-full max-w-screen-lg items-center gap-2 rounded-3xl  border border-input p-4 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring lg:gap-4'>
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
                    <Input
                        className='flex-1 w-full border-none focus:border-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0'
                        placeholder='Type your messages...'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </label>

                <Button
                    type='submit'
                    variant='ghost'
                    size='icon'
                    className='hidden sm:inline-flex'
                >
                    <IconSend size={20} />
                </Button>
            </div>
            <Button
                type='submit'
                className='h-full sm:hidden'
                rightSection={<IconSend size={18} />}
            >
                Send
            </Button>
        </form>
    );

    return (
        <Layout className='h-screen overflow-hidden'>
            {/* ===== Top Heading ===== */}
            <Layout.Header>
                <h1 className='text-2xl font-bold tracking-tight'>Chat</h1>
                <div className='ml-auto flex items-center space-x-4'>
                    <Search />
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            {/* ===== Main ===== */}
            <Layout.Body className='flex flex-col flex-1 h-full'>
                {/* Main content grid */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 w-full h-full px-4 pb-12 pt-0'>
                    {/* Chat section */}
                    <div className='col-span-1 md:col-span-3 flex items-center justify-center overflow-hidden'>
                        <div className='max-w-screen-lg flex flex-col flex-1 h-full gap-2 rounded-md'>
                            <div className='flex flex-1 overflow-hidden'>
                                <div className='chat-text-container relative flex flex-1 flex-col overflow-hidden'>
                                    <div className='chat-flex flex flex-1 w-full flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4'>
                                        <Fragment>
                                            {messages.map((msg, index) => (
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
                                                        {dayjs(msg.timestamp).format('h:mm a')}
                                                    </span>
                                                </div>
                                            ))}
                                            {/* <div className='text-center text-xs'>{key}</div> */}
                                        </Fragment>
                                    </div>
                                </div>
                            </div>
                            <div className='sticky w-full ml-auto overflow-hidden bottom-0 left-0 right-0 p-2'>
                                {renderMessageForm()}
                            </div>
                        </div>
                    </div>

                    {/* Documents preview section */}
                    <div className='col-span-1 flex flex-col flex-1 h-full gap-2 rounded-md pb-2'>
                        <div className='flex flex-1 overflow-hidden'>
                            <Card className='flex flex-1 flex-col gap-2'>
                                <CardHeader>
                                    <CardTitle>
                                        Document 1
                                    </CardTitle>
                                    <CardDescription>
                                        This is a description of the document.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-sm text-muted-foreground'>
                                        This is the content of the document.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}
