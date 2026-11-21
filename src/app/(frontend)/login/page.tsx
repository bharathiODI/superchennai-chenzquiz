import { getQuizSiteSettings } from '@/globals/QuizSiteSettings/getQuizSiteSettings'
import LoginForm from './LoginForm'

// Text and options come from CMS > Globals > Quiz Site Settings (saving there refreshes this page)
export const revalidate = 600

export default async function LoginPage() {
  const { login } = await getQuizSiteSettings()
  return <LoginForm settings={login} />
}
