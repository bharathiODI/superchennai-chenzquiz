export { BuilderField } from './BuilderField'
export { DynamicForm, type DynamicFormProps } from './forms/DynamicForm'
export { SubmissionFilesCell, SubmissionFilesField } from './forms/SubmissionFiles'
/* Client-safe pieces of the form system (no payload/server imports). */
export {
  countryDigitCount,
  countryName,
  DEFAULT_MESSAGES,
  validateAll,
  validateField,
  type FieldError,
  type ValidationMessages,
} from '../forms/validation'
export type {
  FormContext,
  FormFieldSpec,
  FormSpec,
  SubmitPayload,
  SubmitResponse,
} from '../forms/types'
