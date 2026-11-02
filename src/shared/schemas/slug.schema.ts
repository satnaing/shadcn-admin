import { z } from 'zod'
import i18next from 'i18next'

/** Slug lives on the translation row, so every locale tab owns one. */
export const translationSlugSchema = z
  .string()
  .trim()
  .min(1, i18next.t('common:validation.slugRequired'))
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, i18next.t('common:validation.slugKebab'))
