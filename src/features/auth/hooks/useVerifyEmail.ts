import { verifyEmail } from "@/features/auth/services/authService";
import { useState, useEffect, useRef } from "react";

/**
 * useVerifyEmail Hook
 * Handles the logic for calling the verification service and managing states.
 */
export function useVerifyEmail(token: string | null) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Token verifikasi tidak ditemukan.");
      return;
    }

    // CHECK the ref: If it's already true, stop here
    if (hasStarted.current) return;

    async function performVerification() {
      // SET the ref to true immediately to "lock" the process
      hasStarted.current = true;

      try {
        if (typeof token !== "string") return;
        await verifyEmail(token);
        setStatus("success");
      } catch (err: unknown) {
        setStatus("error");
        const message =
          err instanceof Error ? err.message : "Verifikasi gagal.";
        setErrorMsg(message);
      }
    }

    performVerification();
  }, [token]);

  return { status, errorMsg };
}
