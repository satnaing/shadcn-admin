import { Button } from '@/components/custom/button'
import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import { UserNav } from '@/components/user-nav'
import { FormProvider } from 'react-hook-form'
import { Category } from './components/category'
import { Note } from './components/note'
import { questionList } from './data/data'
import useInterviewForm from './hooks/use-interview-form'

export default function Interview() {
  const { method, candidateName, onSubmit, setValue, resultFields } =
    useInterviewForm()
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
        <FormProvider {...method}>
          <form onSubmit={onSubmit}>
            <div className='sticky top-0 mb-4 flex items-center justify-between bg-background'>
              <Input className='w-1/3' placeholder='Candidate name'></Input>
              <div className='flex items-center gap-2'>
                <Button>Question List</Button>
                <Note />
                <div className='overflow-hidden rounded-md border'>
                  <Button
                    type='button'
                    className='rounded-none bg-red-600'
                    onClick={() => setValue('isPass', false)}
                  >
                    Fail
                  </Button>
                  <Button
                    type='button'
                    className='rounded-none bg-green-600'
                    onClick={() => setValue('isPass', true)}
                  >
                    Success
                  </Button>
                </div>
                <Button className='bg-blue-600'>Save</Button>
              </div>
            </div>

            <section className='flex flex-col gap-4'>
              {questionList.map((category, index) => (
                <Category {...category} key={`result_${index}`}></Category>
              ))}
            </section>
          </form>
        </FormProvider>
      </Layout.Body>
    </Layout>
  )
}
