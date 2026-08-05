"use client";

import Link from "next/link";
import {  useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from 'next-auth/react';

const signInPage = () => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof signInSchema>
  ) => {
    setIsSubmitting(true)

      try {
        const result = await signIn('credentials',{
          redirect:false,
          identifier:data.identifier,
          password:data.password
        })
        console.log("RESULT OF SIGN_IN CREDENTIALS",  result) 
  
        if(result?.error){
          toast.error("Login Failed",{
            description:result?.error || "Incorrect Credentials"
          })
        }
  
        if(result?.url){
           router.replace(`/dashboard`)
        }
      } finally {
          setIsSubmitting(false)
      }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-2 space-y-3 text-center">
          <h1 className="font-(family-name:--font-heading) text-4xl font-black tracking-tight md:text-5xl">
            Join{" "}
            <span className="bg-linear-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              Messonimous
            </span>
          </h1>

          <p className="font-sans text-slate-500">
           Sign in and start receiving anonymous
            messages from anyone.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
        

        {/* Username Or Email */}

          <Controller
            name="identifier"
            control={form.control}
            render={({ field, fieldState }) => {

              return (
                <Field
                  data-invalid={fieldState.invalid}
                  className="space-y-2"
                >
                  <FieldLabel htmlFor={field.name}>
                    Username / Email
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      placeholder="TonyStark"
                      className="h-11 rounded-xl border-slate-300 pr-10 transition-all focus-visible:ring-2 focus-visible:ring-violet-500"
                      onChange={(e) => {
                        field.onChange(e);
                        
                      }}
                    />
                  </div>

                  {/* Validation / API Status */}

                </Field>
              );
            }}
          />

          {/* Password */}

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="space-y-2"
              >
                <FieldLabel htmlFor={field.name}>
                  Password
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-slate-300 transition-all focus-visible:ring-2 focus-visible:ring-violet-500"
                />

                {fieldState.error &&(
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white cursor-pointer font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Logging your account...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-md text-slate-600">
         Don't have an Account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-violet-600 transition-colors hover:text-violet-700"
          >
            Register
          </Link>
        </div>
      </div>
      </div>
  );
};

export default signInPage;