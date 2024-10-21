import { useFieldArray, useForm } from 'react-hook-form'
import { Interview } from './schema'

export default function useInterviewForm() {
  const method = useForm<Interview>()

  const { control, register, handleSubmit, getValues, setValue } = method

  const { fields: resultFields } = useFieldArray({
    name: 'result',
    control,
  })

  const candidateName = getValues('candidateName')

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })
  return {
    resultFields,
    method,
    candidateName,
    onSubmit,
    setValue,
    register,
  }
}
