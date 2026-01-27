import { Suspense } from "react"

import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-xl">
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
