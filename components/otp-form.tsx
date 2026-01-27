"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RefreshCwIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { verifyOtp } from "@/lib/authClient"
import { otpFormSchema, type OtpFormValues } from "@/lib/validation-schemas"

export function OtpForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    mode: "onChange",
    defaultValues: { code: "" },
  })

  const onSubmit = async (values: OtpFormValues) => {
    try {
      setPending(true)
      const ok = await verifyOtp(values.code)
      if (ok) {
        toast.success("Code verified")
        router.replace("/admin")
      } else {
        toast.error("Invalid code. Please try again.")
      }
    } catch (error: any) {
      console.error("Failed to verify OTP", error)
      toast.error("Could not verify the code", {
        description: error?.message || "Please try again shortly",
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Verify your login</CardTitle>
          <CardDescription>
            Enter the verification code we sent to your email address:{" "}
            <span className="font-medium">m@example.com</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>
              <Button type="button" variant="outline" size="xs">
                <RefreshCwIcon />
                Resend Code
              </Button>
            </div>

            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <InputOTP
                  id="otp-verification"
                  maxLength={6}
                  required
                  value={field.value}
                  onChange={(value) => {
                    const numericValue = value.replace(/\D/g, "")
                    field.onChange(numericValue.slice(0, 6))
                  }}
                >
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator className="mx-2" />
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

            {errors.code?.message && (
              <p className="text-destructive mt-2 text-sm">{errors.code.message}</p>
            )}

            <FieldDescription>
              <a href="#">I no longer have access to this email address.</a>
            </FieldDescription>
          </Field>
        </CardContent>
        <CardFooter>
          <Field>
            <Button type="submit" className="w-full" disabled={!isValid || pending}>
              {pending ? "Verifying..." : "Verify"}
            </Button>
            <div className="text-muted-foreground text-sm">
              Having trouble signing in?{" "}
              <a
                href="#"
                className="underline underline-offset-4 transition-colors hover:text-primary"
              >
                Contact support
              </a>
            </div>
          </Field>
        </CardFooter>
      </Card>
    </form>
  )
}
