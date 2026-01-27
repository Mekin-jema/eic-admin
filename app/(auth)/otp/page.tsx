import { Suspense } from "react"

import { OtpForm } from "@/components/otp-form"

export default function OtpPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-xl">
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
          <OtpForm />
        </Suspense>
      </div>
    </div>
  )
}
