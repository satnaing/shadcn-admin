import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const interviewSchema = z.object({
  candidateName: z.string(),
  note: z.string(),
  questionListId: z.string().nullable(),
  isPass: z.boolean(),
  result: z.array(
    z.object({
      questionId: z.string(),
      categoryId: z.string(),
      summary: z.string(),
      rate: z.string(),
    })
  ),
})

export type Interview = z.infer<typeof interviewSchema>
