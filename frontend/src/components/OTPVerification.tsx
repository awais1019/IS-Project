import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
import { useNavigate } from 'react-router'

export default function OTPVerification() {
  const user = useAuthStore((state) => state.user)
  const email = user?.email
   const navigate = useNavigate();
  const [otp, setOtp] = useState('')
  const [resendDisabled, setResendDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (email) {
      handleSendOTP()
    }
  }, [email])

  const handleSendOTP = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP')

      setError('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
     
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid OTP')
      useAuthStore.getState().updateUser({ verify: true });
      navigate("/dashboard")
      setSuccess(true)
      setError('')
    } catch (err: any) {
      setError(err.message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = () => {
    if (!resendDisabled) {
      handleSendOTP()
      setResendDisabled(true)
      setTimeout(() => setResendDisabled(false), 30000) 
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center overflow-y-auto md:items-center">
      <form
        onSubmit={handleVerifyOTP}
        className="flex flex-col w-screen h-screen p-[clamp(24px,2vw,36px)] gap-[clamp(12px,2vw,24px)] md:bg-white md:opacity-[90%] md:border-gray-300 md:border justify-center md:w-[clamp(500px,3vw,900px)] md:h-[clamp(430px,2vh,800px)] md:rounded-[6px] font-primary"
      >
        <div>
          <h1 className="font-bold font-primary text-[24px] text-blue text-center">
            Verify Your Email
          </h1>
          <p className="text-center text-sm text-gray-500 mt-2">
            OTP sent to <strong>{email}</strong>
          </p>
        </div>

        <div className="flex flex-col w-full gap-1">
          <label htmlFor="otp" className="font-primary font-medium">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="p-2 text-[16px] border border-gray-300 rounded-md font-medium font-primary"
            placeholder="Enter your OTP"
          />
        </div>

        <input
          type="submit"
          value={loading ? 'Verifying...' : 'Verify OTP'}
          disabled={loading}
          className="w-full bg-blue p-2 rounded-[10px] text-[16px] font-primary font-semibold text-white"
        />

        <button
          type="button"
          onClick={handleResend}
          disabled={loading || resendDisabled}
          className="w-full border border-blue text-blue p-2 rounded-[10px] text-[16px] font-primary font-semibold"
        >
          {resendDisabled ? 'Resend Disabled' : 'Resend OTP'}
        </button>

        {error && (
          <p className="text-red-800 font-primary font-medium text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-700 font-primary font-medium text-center">
            OTP Verified Successfully!
          </p>
        )}
      </form>
    </div>
  )
}
