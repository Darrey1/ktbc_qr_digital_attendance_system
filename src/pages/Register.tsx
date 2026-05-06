import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  fullName: z.string().min(3, 'Please enter your full name'),
  dob: z.string().nonempty('Date of birth is required'),
  gender: z.string().nonempty('Please select a gender'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email'),
  category: z.string().nonempty('Please select a category'),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  consent: z.boolean().optional(),
})

export default function Register() {
  const [step, setStep] = React.useState(1)
  const [age, setAge] = React.useState<number | null>(null)
  const [consentVerified, setConsentVerified] = React.useState(false)
  const [underageError, setUnderageError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm({ resolver: zodResolver(schema) })
  const { register, handleSubmit, trigger, getValues, formState: { errors } } = form

  const calcAge = (dob: string) => {
    if (!dob) return null
    return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
  }

  // Step 1 → Next: manually trigger only step 1 fields
  const handleStep1Next = async () => {
    const valid = await trigger(['fullName', 'dob', 'gender', 'phone', 'email', 'category'])
    if (!valid) return

    const dob = getValues('dob')
    const years = calcAge(dob)
    setAge(years)
    setStep(2)
  }

  // Step 2 → Next
  const handleStep2Next = () => {
    setUnderageError('')

    if (age !== null && age < 18) {
      const parentName = getValues('parentName')
      const parentPhone = getValues('parentPhone')
      const consent = getValues('consent')

      if (!parentName || parentName.length < 2) {
        setUnderageError('Please enter the parent or guardian full name.')
        return
      }
      if (!parentPhone || parentPhone.length < 7) {
        setUnderageError('Please enter a valid parent phone number.')
        return
      }
      if (!consent) {
        setUnderageError('Parent or guardian must agree to the terms before proceeding.')
        return
      }
      if (!consentVerified) {
        setUnderageError('Please verify consent via OTP before continuing.')
        return
      }
    }

    setStep(3)
  }

  const onFinalSubmit = (data: any) => {
    setIsSubmitting(true)
    // Simulate a network request
    setTimeout(() => {
      console.log('Final submit', data)
      // handle submission here
      setIsSubmitting(false)
    }, 2000)

  }

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <div className="glass-card p-6 rounded-xl shadow-lg">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-display text-center">
            Register for KTBC 2026
          </h2>
          <p className="text-sm text-muted mt-2 text-center leading-relaxed">
            Join thousands of young leaders across Africa. Fill in your details
            below to secure your spot and receive your QR pass.
          </p>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10"
              >
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: step >= s ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted">
            Step {step} of 3 —{" "}
            {step === 1 ? "Your Info" : step === 2 ? "Consent" : "Review"}
          </div>
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/80 backdrop-blur-sm">
            <div className="relative w-16 h-16">
              {/* Spinning ring */}
              <svg
                className="w-16 h-16 animate-spin"
                viewBox="0 0 64 64"
                fill="none"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-white/10"
                />
                <path
                  d="M32 4 a28 28 0 0 1 28 28"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-primary"
                />
              </svg>
              {/* KTBC text in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-display font-bold text-primary tracking-wider">
                  KTBC
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted animate-pulse">
              Submitting your registration...
            </p>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                {...register("fullName")}
                placeholder="e.g. Dare Adeyemi"
                className="w-full h-10 border bg-bg/30 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fullName.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dob")}
                className="w-full h-10 border bg-bg/30 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary box-border appearance-none"
              />
              {errors.dob && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.dob.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                {...register("gender")}
                className="w-full h-10 border bg-bg/30 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.gender.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                {...register("phone")}
                placeholder="+234 800 000 0000"
                className="w-full h-10 border bg-bg/30 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                {...register("email")}
                placeholder="you@example.com"
                className="w-full h-10 border bg-bg/30 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                {...register("category")}
                className="w-full h-10 border bg-bg/30 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select category</option>
                <option value="delegate">Delegate</option>
                <option value="volunteer">Volunteer</option>
                <option value="speaker">Speaker</option>
                <option value="staff">Staff</option>
                <option value="guest">Guest</option>
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.category.message as string}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            {age !== null && age >= 18 && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-500">
                ✓ No parental consent required — you are {age} years old.
              </div>
            )}

            {age !== null && age < 18 && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-500">
                  ⚠ You are under 18. Parental consent is required to continue.
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Parent / Guardian Full Name
                  </label>
                  <input
                    {...register("parentName")}
                    placeholder="e.g. Mr. John Adeyemi"
                    className="w-full h-10 border bg-bg/30 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Parent Phone Number
                  </label>
                  <input
                    {...register("parentPhone")}
                    placeholder="+234 800 000 0000"
                    className="w-full h-10 border bg-bg/30 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("consent")}
                    className="mt-0.5 accent-primary"
                  />
                  <span className="text-muted leading-relaxed">
                    I confirm that a parent or guardian has agreed to the terms
                    and conditions on behalf of this attendee.
                  </span>
                </label>

                {!consentVerified ? (
                  <div className="flex gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => setConsentVerified(true)}
                      className="ktbc-btn-primary px-4 py-2 rounded-lg text-sm"
                    >
                      Send OTP to Parent
                    </button>
                    <span className="text-xs text-muted">
                      OTP will be sent to parent's number
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-500">
                    ✓ Consent confirmed via OTP
                  </div>
                )}
              </div>
            )}

            {/* Underage error */}
            {underageError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
                ⚠ {underageError}
              </div>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Review your details</h3>
            {[
              { label: "Full Name", value: getValues("fullName") },
              { label: "Date of Birth", value: getValues("dob") },
              { label: "Gender", value: getValues("gender") },
              { label: "Phone", value: getValues("phone") },
              { label: "Email", value: getValues("email") },
              { label: "Category", value: getValues("category") },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between text-sm border-b border-white/10 pb-2"
              >
                <span className="text-muted">{label}</span>
                <span className="font-medium capitalize">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-lg border border-white/10 text-sm hover:bg-white/5 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 1 && (
            <button
              type="button"
              onClick={handleStep1Next}
              className="ktbc-btn-primary px-6 py-2 rounded-lg text-sm"
            >
              Next
            </button>
          )}
          {step === 2 && (
            <button
              type="button"
              onClick={handleStep2Next}
              className="ktbc-btn-primary px-6 py-2 rounded-lg text-sm"
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              onClick={handleSubmit(onFinalSubmit)}
              className="ktbc-btn-primary px-6 py-2 rounded-lg text-sm"
            >
              Submit Registration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}