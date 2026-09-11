/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import { render } from '@react-email/render'
import { CheckCircle2, Sparkles, X } from 'lucide-react'

import SummerFestRegistrationEmail from './SummerFestRegistrationEmail'
import LexicalRenderer from '../lexical/LexicalRenderer'

/* =========================================================
   TYPES
========================================================= */

interface Media {
  id?: number
  url?: string
  alt?: string | null
}

interface CustomFieldOption {
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
  options?: CustomFieldOption[]
}

interface SummerFestDetailsProps {
  data: any
}

/* =========================================================
   HELPERS
========================================================= */

const normalizeFieldName = (name?: string) => name?.trim()?.toLowerCase() || ''

const getFieldValue = (formData: Record<string, any>, fieldName: string) =>
  formData[normalizeFieldName(fieldName)]

const setFieldValue = (prev: Record<string, any>, fieldName: string, value: any) => ({
  ...prev,
  [normalizeFieldName(fieldName)]: value,
})

/* =========================================================
   COMPONENT
========================================================= */

const SummerFestDetails: React.FC<SummerFestDetailsProps> = ({ data }) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  if (!data) return null

  /* =========================================================
     EVENT DATA
  ========================================================= */

  const eventFields = data?.eventFields || {}
  const registrationSettings = data?.formSettings?.regSettings || data?.regSettings || {}

  const customFields: CustomField[] = Array.isArray(data?.formSettings?.customFields)
    ? data.formSettings.customFields
    : Array.isArray(data?.customFields)
      ? data.customFields
      : []

  // Registration status check
  // const isRegistrationOpen = registrationSettings?.isRegistrationOpen ?? true

  const title = eventFields?.title || data?.title || 'Event'
  const mobileImage: Media = data?.mobileImage
  const heroImage: Media = data?.heroImage

  const isRegistrationOpen = registrationSettings?.isRegistrationOpen ?? false
  const enableOTP = registrationSettings?.enableOTP ?? false
  const thankYouMessage = registrationSettings?.thankYouMessage || ''

  /* =========================================================
     FORM HANDLING
  ========================================================= */

  const handleChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => setFieldValue(prev, fieldName, value))
  }, [])

  const validateForm = () => {
    for (const field of customFields) {
      const value = getFieldValue(formData, field.name)

      if (field.required && (!value || value === '')) {
        toast.error(`${field.label} is required`)
        return false
      }

      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          toast.error('Enter valid email')
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
        toast.error('Mobile field not found')
        return
      }

      const mobile = getFieldValue(formData, mobileField.name)
      if (!mobile) {
        toast.error('Enter mobile number')
        return
      }

      if (String(mobile).length < 10) {
        toast.error('Enter valid mobile number')
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
     SUBMIT
  ========================================================= */

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (loading || !validateForm()) return

    if (enableOTP && !otpVerified) {
      toast.error('Please verify OTP')
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
      payload.append('eventId', String(data?.id))
      payload.append('slug', String(data?.slug))
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
     FIELD RENDER
  ========================================================= */

  const renderField = (field: CustomField) => {
    const fieldName = normalizeFieldName(field.name)
    const commonClass =
      'w-full rounded-[5px] border border-gray-300 bg-white px-5 py-4 outline-none transition-all focus:border-orange-500 mt-2 inputttssss'

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={fieldName}
            placeholder={field.placeholder || `Enter ${field.label}`}
            required={field.required}
            rows={5}
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
            className={commonClass}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'email':
        return (
          <input
            type="email"
            name={fieldName}
            placeholder={field.placeholder || 'Enter your Email Id'}
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
            placeholder={field.placeholder || 'Enter your Mobile Number'}
            required={field.required}
            value={getFieldValue(formData, field.name) || ''}
            onChange={(e) => handleChange(field.name, e.target.value.replace(/\D/g, ''))}
            className={commonClass}
          />
        )

      case 'file':
        return (
          <input
            type="file"
            name={fieldName}
            required={field.required}
            onChange={(e) => handleChange(field.name, e.target.files?.[0] || null)}
            className={commonClass}
          />
        )

      default:
        return (
          <input
            type="text"
            name={fieldName}
            placeholder={field.placeholder || 'Enter your Name'}
            required={field.required}
            value={getFieldValue(formData, field.name) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={commonClass}
          />
        )
    }
  }

  return (
    <>
      <ToastContainer position="top-center" />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden headerrrheeight1">
        <div className="relative w-full">
          {/* DESKTOP IMAGE */}
          {heroImage?.url && (
            <Image
              src={heroImage.url}
              alt={heroImage.alt || title}
              width={1920}
              height={1080}
              priority
              className="hidden md:block w-full h-auto object-contain"
            />
          )}

          {/* MOBILE IMAGE */}
          {mobileImage?.url && (
            <Image
              src={mobileImage.url}
              alt={title}
              width={800}
              height={1200}
              priority
              className="block md:hidden w-full h-auto object-contain mt-20"
            />
          )}
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="bg-white">
        <div className="prose prose-lg max-w-none py-20 max-[600px]:pt-[50px] pb-0">
          <LexicalRenderer content={data?.content} eventData={data} />
        </div>
      </section>

      {/* CLOSED REGISTRATION SECTION */}
      {!isRegistrationOpen && (
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="rounded-[32px] border border-red-200 bg-red-50 p-12 text-center">
              <h2 className="text-4xl font-black text-red-600">Registration Closed</h2>
              <p className="mt-4 text-gray-600">Registration currently closed.</p>
            </div>
          </div>
        </section>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[35px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] max-w-xl w-full p-10 text-center"
          >
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-all hover:bg-gray-200"
            >
              <X className="h-5 w-5 text-black" />
            </button>

            <div className="absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-orange-200 blur-3xl opacity-40" />

            <div className="relative z-10 mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-300 shadow-2xl">
              <CheckCircle2 className="h-14 w-14 text-white" />
            </div>

            <div className="relative z-10 mt-8">
              <div className="mb-3 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-bold uppercase tracking-[4px] text-orange-500">
                  Registration Successful
                </span>
              </div>

              <h2 className="text-4xl font-black leading-tight text-[#061E43]">Thank You!</h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Your registration for <span className="font-bold text-orange-500">{title}</span> has
                been successfully submitted.
              </p>

              <p className="mt-3 text-sm text-gray-500">
                We’ll contact you soon with event details and confirmation.
              </p>
            </div>

            <div className="relative z-10 mt-10">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 px-10 py-4 text-sm font-bold uppercase tracking-[2px] text-white shadow-xl transition-all hover:scale-105"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default SummerFestDetails
