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
import { useFormContext } from 'react-hook-form'
import { Rate } from './rate'

type Props = {
  categoryName: string
  questionList: {
    questionName: string
    questionHint: string[]
  }[]
}

export function Category({ categoryName, questionList }: Props) {
  const { register } = useFormContext()
  return (
    <div className='rounded-md border'>
      <Accordion type='single' collapsible className='p-4'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>{categoryName}</AccordionTrigger>
          <AccordionContent>
            {questionList.map((question, index) => (
              <Card key={`questionName_${index}`}>
                <CardHeader>
                  <CardTitle>{question.questionName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type='single' collapsible>
                    <AccordionItem value='item-1'>
                      <AccordionTrigger>Hint: </AccordionTrigger>
                      <AccordionContent>
                        {question.questionHint.map((hint, index) => (
                          <p key={`${question.questionName}_${index}`}>
                            {hint}
                          </p>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <div className='mb-2 flex w-full items-center justify-between'>
                    <Input className='' placeholder='Summary'></Input>
                    <div className='flex items-center'>
                      <Rate />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
