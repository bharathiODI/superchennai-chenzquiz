'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import { render } from '@react-email/render'
import { CheckCircle2, Sparkles, X, UploadCloud, Info } from 'lucide-react'

import SummerFestRegistrationEmail from '@/components/Summer/SummerFestRegistrationEmail'

/* =========================================================
   TYPES
========================================================= */

interface CustomFieldOption {
  id?: string
  label: string
  value: string
}

interface CustomField {
  id?: number | string
  label: string
  name: string
  type: string
  required?: boolean
  placeholder?: string
  description?: string | null
  options?: CustomFieldOption[]
}

type Props = {
  block: any
  eventData: any
}

/* =========================================================
   HELPERS
========================================================= */

const normalizeFieldName = (name?: string) =>
  name
    ?.trim()
    ?.toLowerCase()
    ?.replace(/[^a-z0-9]/g, '_') || ''

const getFieldValue = (formData: Record<string, any>, fieldName: string) =>
  formData[normalizeFieldName(fieldName)]

const setFieldValue = (prev: Record<string, any>, fieldName: string, value: any) => ({
  ...prev,
  [normalizeFieldName(fieldName)]: value,
})

const WaveDecoration = () => (
  <span className="mx-2 inline-block font-serif text-lg tracking-widest text-[#ec265b] opacity-60">
    ~~~
  </span>
)

/* =========================================================
   COMPONENT
========================================================= */

const EventRegistrationBlockComponent: React.FC<Props> = ({ block, eventData }) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const showImage = Boolean(block?.showImage && block?.sideImage?.url)
  const sideImage = block?.sideImage
  const imagePosition = block?.imagePosition || 'left'

  /* =========================================================
     EVENT DATA & SETTINGS
  ========================================================= */

  const registrationSettings = eventData?.regSettings || eventData?.formSettings?.regSettings || {}

  const customFields: CustomField[] = Array.isArray(eventData?.customFields)
    ? eventData.customFields
    : Array.isArray(eventData?.formSettings?.customFields)
      ? eventData.formSettings.customFields
      : []

  const title = eventData?.eventFields?.title || eventData?.title || 'Event'
  const isRegistrationOpen = registrationSettings?.isRegistrationOpen ?? true
  const enableOTP = registrationSettings?.enableOTP ?? false
  const thankYouMessage = registrationSettings?.thankYouMessage || ''

  /* =========================================================
     FORM HANDLING
  ========================================================= */

  const handleChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => setFieldValue(prev, fieldName, value))
  }, [])

  const validateForm = (): boolean => {
    for (const field of customFields) {
      const value = getFieldValue(formData, field.name)

      if (
        field.required &&
        (value === undefined || value === null || value === '' || value === false)
      ) {
        toast.error(`${field.label.replace('*', '').trim()} is required`)
        return false
      }

      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          toast.error('Enter a valid email address')
          return false
        }
      }
    }
    return true
  }

  /* =========================================================
     OTP LOGIC
  ========================================================= */

  const mobileField = customFields.find(
    (field) =>
      field.type === 'number' ||
      normalizeFieldName(field.name).includes('mobile') ||
      normalizeFieldName(field.name).includes('phone'),
  )

  const sendOtpToMobile = async () => {
    try {
      if (!mobileField) {
        toast.error('Mobile number field is required for OTP verification')
        return
      }

      const mobile = getFieldValue(formData, mobileField.name)
      if (!mobile || String(mobile).length < 10) {
        toast.error('Enter a valid 10-digit mobile number')
        return
      }

      setSendingOtp(true)
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(newOtp)

      await axios.post('/api/send-otp', { mobile, otp: newOtp })
      toast.success('OTP sent successfully')
    } catch {
      toast.error('Failed to send OTP')
    } finally {
      setSendingOtp(false)
    }
  }

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true)
      toast.success('OTP verified successfully')
    } else {
      toast.error('Invalid OTP')
    }
  }

  /* =========================================================
     SUBMIT HANDLER
  ========================================================= */

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (loading || !validateForm()) return

    if (enableOTP && !otpVerified) {
      toast.error('Please verify your OTP before submitting')
      return
    }

    try {
      setLoading(true)

      const emailHtml = await render(
        <SummerFestRegistrationEmail
          title={title}
          values={formData}
          thankYouMessage={thankYouMessage}
        />,
      )

      const payload = new FormData()
      payload.append('eventId', String(eventData?.id))
      payload.append('slug', String(eventData?.slug))
      payload.append('emailTemplate', emailHtml)

      const serializedValues: Record<string, any> = {}

      customFields.forEach((field) => {
        const value = getFieldValue(formData, field.name)
        if (field.type === 'file') {
          if (value instanceof File) {
            payload.append(normalizeFieldName(field.name), value)
          }
        } else {
          serializedValues[normalizeFieldName(field.name)] = value
        }
      })

      payload.append('values', JSON.stringify(serializedValues))

      await axios.post('/api/summer-registration', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Registration submitted successfully')
      setShowSuccessModal(true)

      setFormData({})
      setOtp('')
      setGeneratedOtp('')
      setOtpVerified(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  /* =========================================================
     FIELD RENDERER WITH CHECKBOX AND HELPER TEXT
  ========================================================= */

  const renderField = (field: CustomField) => {
    const fieldName = normalizeFieldName(field.name)
    const commonClass =
      'w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10 mt-1.5'

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={fieldName}
            placeholder={field.placeholder || `Enter ${field.label}`}
            required={field.required}
            rows={10}
            value={getFieldValue(formData, field.name) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={commonClass}
          />
        )

      case 'select':
        return (
          <select
            name={fieldName}
            required={field.required}
            value={getFieldValue(formData, field.name) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`${commonClass} cursor-pointer`}
          >
            <option value="">Select {field.placeholder || field.label}</option>
            {field.options?.map((option, index) => (
              <option key={option.id || index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="mt-2 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4 transition-all hover:bg-white">
            <input
              type="checkbox"
              id={fieldName}
              name={fieldName}
              required={field.required}
              checked={Boolean(getFieldValue(formData, field.name))}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
            />
            <label
              htmlFor={fieldName}
              className="text-xs text-gray-700 leading-relaxed cursor-pointer"
            >
              <span className="font-semibold text-gray-900">{field.label}</span>
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.description && (
                <p className="mt-1 text-[11px] text-gray-500">{field.description}</p>
              )}
            </label>
          </div>
        )

      case 'file':
        const currentFile = getFieldValue(formData, field.name)
        return (
          <div className="mt-1.5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-4 transition-all hover:border-orange-400 hover:bg-orange-50/30">
            <UploadCloud className="h-6 w-6 text-gray-400 mb-1" />
            <p className="text-xs text-gray-600 font-medium">
              {currentFile ? currentFile.name : field.placeholder || 'Click to upload or drag file'}
            </p>
            <input
              type="file"
              name={fieldName}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.files?.[0] || null)}
              className="mt-2 text-xs text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-orange-600 cursor-pointer"
            />
          </div>
        )

      case 'email':
        return (
          <input
            type="email"
            name={fieldName}
            placeholder={field.placeholder || 'Enter your Email'}
            required={field.required}
            value={getFieldValue(formData, field.name) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={commonClass}
          />
        )

      case 'number':
        return (
          <input
            type="tel"
            inputMode="numeric"
            name={fieldName}
            placeholder={field.placeholder || 'Enter Mobile Number'}
            required={field.required}
            value={getFieldValue(formData, field.name) || ''}
            onChange={(e) => handleChange(field.name, e.target.value.replace(/\D/g, ''))}
            className={commonClass}
          />
        )

      default:
        return (
          <input
            type="text"
            name={fieldName}
            placeholder={field.placeholder || `Enter ${field.label}`}
            required={field.required}
            value={getFieldValue(formData, field.name) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={commonClass}
          />
        )
    }
  }

  if (!isRegistrationOpen || block?.showForm === false) return null

  return (
    <>
      <ToastContainer position="top-center" />

      <section className="relative overflow-hidden bg-pink-50/50 py-16">
        <div className="relative z-10">
          {/* HEADING HEADER */}
          <div className="mb-12 text-center">
            <h2 className="festmainheadingsss mb-0 mt-0 flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-widest text-[#ec265b]">
              <WaveDecoration />
              {block?.mainsectionTitle || 'Register'}
              <WaveDecoration />
            </h2>

            <div className="mt-3 flex items-center justify-center">
              <div className="h-1 w-20 rounded bg-[#ffabb1cc]" />
            </div>
          </div>

          {/* MAIN CONTAINER */}
          <div className="container mx-auto px-4 max-w-6xl">
            <div
              className={`overflow-hidden rounded-[30px] border border-gray-100 bg-white shadow-2xl ${
                showImage ? 'grid items-stretch lg:grid-cols-12' : ''
              }`}
            >
              {/* LEFT IMAGE */}
              {showImage && imagePosition === 'left' && (
                <div className="relative h-[300px] lg:h-full lg:col-span-5">
                  <Image
                    src={sideImage.url}
                    alt={sideImage.alt || title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )}

              {/* FORM SECTION (SPAN 12 IF NO IMAGE, SPAN 7 IF IMAGE EXISTS) */}
              <div className={`p-6 sm:p-10 lg:p-12 ${showImage ? 'lg:col-span-7' : 'w-full'}`}>
                {block?.sectionSubTitle && (
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ec265b]">
                    {block.sectionSubTitle}
                  </span>
                )}

                <h3 className="mt-1 text-2xl font-black text-gray-900 tracking-tight">
                  {block?.sectionTitle || 'Register Now'}
                </h3>

                {block?.sectionDescrption && (
                  <p className="mt-2 lg:text-[16px] lg:w-[80%]  text-sm text-gray-600 leading-relaxed">
                    {block.sectionDescrption}
                  </p>
                )}

                {/* RESPONSIVE 2-COLUMN GRID LAYOUT */}
                <form onSubmit={submitForm} className="mt-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                    {customFields.map((field, idx) => {
                      const isFullWidth =
                        field.type === 'textarea' ||
                        field.type === 'checkbox' ||
                        field.type === 'file' ||
                        field.label.length > 35

                      return (
                        <div
                          key={field.id || idx}
                          className={isFullWidth ? 'md:col-span-2' : 'md:col-span-1'}
                        >
                          {field.type !== 'checkbox' && (
                            <label className="block lg:text-[15px] text-xs font-bold uppercase tracking-wider text-gray-700 ">
                              {field.label}{' '}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>
                          )}

                          {renderField(field)}

                          {field.description && field.type !== 'checkbox' && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                              <Info className="h-3 w-3 text-orange-500 shrink-0" />
                              {field.description}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* OTP SECTION */}
                  {enableOTP && (
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={sendOtpToMobile}
                          disabled={sendingOtp || otpVerified}
                          className="rounded-xl bg-[#6d4399] px-5 py-3 text-xs font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-50"
                        >
                          {sendingOtp ? 'Sending...' : otpVerified ? 'OTP Verified' : 'Send OTP'}
                        </button>
                      </div>

                      {generatedOtp && !otpVerified && (
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={verifyOtp}
                            className="rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-orange-600"
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-[#6d4399]  py-4 text-sm font-extrabold uppercase tracking-widest text-white shadow-xl  transition-all hover:scale-[1.01] hover:shadow-[#01236a]-500/30 active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Complete Sharing'}
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT IMAGE */}
              {showImage && imagePosition === 'right' && (
                <div className="relative h-[300px] lg:h-full lg:col-span-5">
                  <Image
                    src={sideImage.url}
                    alt={sideImage.alt || title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative overflow-hidden rounded-[35px] bg-white p-10 text-center max-w-xl w-full shadow-2xl"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
              >
                <X className="h-5 w-5 text-black" />
              </button>

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 text-white shadow-xl">
                <CheckCircle2 className="h-12 w-12" />
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                    Registration Successful
                  </span>
                </div>
                <h2 className="text-3xl font-black text-gray-900">Thank You!</h2>
                <p className="mt-4 text-sm text-gray-600">
                  Your registration for <span className="font-bold text-orange-500">{title}</span>{' '}
                  has been received.
                </p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-8 rounded-full bg-orange-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-orange-600"
              >
                Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default EventRegistrationBlockComponent
