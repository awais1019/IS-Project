import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router";
import { verifyOtp } from "../services/authService";

export default function VerifyAccount() {
  const [otp, setOtp] = useState<string>(''); 
  const user = useAuthStore((state) => state.user); 
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!user?.email) {
      return;
    }
    await verifyOtp({ email: user.email, otp });
    setAuth(useAuthStore.getState().token, { ...user, verify: true });
    navigate('/dashboard');
  };

  return (
    <div>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}