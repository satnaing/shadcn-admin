import { Button } from '@/components/custom/button'
import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { UserNav } from '@/components/user-nav'
import { useState } from 'react'
import { Note } from './components/note'

export default function Interview() {
  const [candidateName, setCandidateName] = useState('')
  const [isInput, setIsInput] = useState(false)
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body className='md:overflow-visible'>
        <div className='sticky top-0 mb-4 flex items-center justify-between bg-background'>
          <Input className='w-1/3' placeholder='Candidate name'></Input>
          <div className='flex items-center gap-2'>
            <Button>Question List</Button>
            <Note />
            <div className='overflow-hidden rounded-md border'>
              <Button className='rounded-none bg-red-600'>Fail</Button>
              <Button className='rounded-none bg-green-600'>Success</Button>
            </div>
            <Button className='bg-blue-600'>Save</Button>
          </div>
        </div>
        <section className='flex flex-col gap-4'>
          <div className='rounded-md border'>
            <Accordion type='single' collapsible className='p-4'>
              <AccordionItem value='item-1'>
                <AccordionTrigger>Front-End</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardHeader>
                      <CardTitle>Question 1: What is javascript</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type='single' collapsible>
                        <AccordionItem value='item-1'>
                          <AccordionTrigger>Hint: </AccordionTrigger>
                          <AccordionContent>
                            <p>is a script or programing language</p>
                            <p>implement complex feature on web page</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter>
                      <div className='mb-2 flex w-full items-center justify-between'>
                        <Input className='' placeholder='Summary'></Input>
                        <div className='flex items-center'>
                          <Button className='bg-red-600'>X</Button>
                          <Button className='bg-yellow-300'>O</Button>
                          <Button className='bg-green-600'>V</Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className='rounded-md border'>
            <Accordion type='single' collapsible className='p-4'>
              <AccordionItem value='item-1'>
                <AccordionTrigger>Back-End</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardHeader>
                      <CardTitle>Question 1: What is Java</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type='single' collapsible>
                        <AccordionItem value='item-1'>
                          <AccordionTrigger>Hint: </AccordionTrigger>
                          <AccordionContent>
                            <p>is a script or programing language</p>
                            <p>implement complex feature on web page</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter>
                      <div className='mb-2 flex w-full items-center justify-between'>
                        <Input className='' placeholder='Summary'></Input>
                        <div className='flex items-center'>
                          <Button className='bg-red-600'>X</Button>
                          <Button className='bg-yellow-300'>O</Button>
                          <Button className='bg-green-600'>V</Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className='rounded-md border '>
            <Accordion type='single' collapsible className='p-4'>
              <AccordionItem value='item-1'>
                <AccordionTrigger>Database</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardHeader>
                      <CardTitle>Question 1: What is MongoDB</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type='single' collapsible>
                        <AccordionItem value='item-1'>
                          <AccordionTrigger>Hint: </AccordionTrigger>
                          <AccordionContent>
                            <p>is a script or programing language</p>
                            <p>implement complex feature on web page</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter>
                      <div className='mb-2 flex w-full items-center justify-between'>
                        <Input className='' placeholder='Summary'></Input>
                        <div className='flex items-center'>
                          <Button className='bg-red-600'>X</Button>
                          <Button className='bg-yellow-300'>O</Button>
                          <Button className='bg-green-600'>V</Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </Layout.Body>
    </Layout>
  )
}
