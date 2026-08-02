"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";
import { Space_Grotesk } from "next/font/google";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  //  ZOD implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setisCheckingUsername(true);

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          -
          setUsernameMessage(response.data.message);
        } catch (error) {
          // console.error("ERROR CHECKING USERNAME UNIQUENESS",error)
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setisCheckingUsername(false);
        }
      }
    };
    checkUsernameUniqueness();
  }, [username]);

  const OnSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success("Success", {
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
      setisSubmitting(false);
    } catch (error) {
      console.error("Error Signing-Up the user ");
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Sign-Up failed", {
        description:
          axiosError.response?.data.message ?? "Something went wrong",
      });
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8  bg-white rounded-lg shadow-lg">
        {/* <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6" >
            Join Messonimous 
          </h1>
          <p className="text-lg mb-4">Sign-up to start your annoymous adventure</p>
      </div>   */}
        <div className="text-center space-y-3">
          <h1 className="font-[space_grotesk] text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Join{" "}
            <span className="bg-linear-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              Messonimous
            </span>
          </h1>

          <p className="font-[geist] mx-auto max-w-sm text-base leading-5 text-slate-500">
            Create your account and start receiving honest anonymous messages
            from anyone.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-6">
          <div className="relative">
            <Label className="text-md font-[geist]" htmlFor="username">
              Username
            </Label>

            <Input
              className="
    h-11
    rounded-xl
    border-slate-300
    transition-all
    focus-visible:shadow-sm
    focus-visible:shadow-gray 
    font-[geist] "
              id="username"
              {...form.register("username")}
              onChange={(e) => {
                form.register("username").onChange(e);
                debounced(e.target.value);
              }}
            />
            {isCheckingUsername && (
              <Loader2Icon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-800" />
            )} 
            <p className={`text-sm font-[geist] ${usernameMessage === "Username is available" ? "text-green-500":"text-red-600"}`}>
              {usernameMessage}
            </p>

            {form.formState.errors.username && (
              <p className="font-[geist]text-md text-red-500 mt-1">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-md font-[geist]" htmlFor="email">
              Email
            </Label>

            <Input
              className="mt-2
    h-11
    rounded-xl
    border-slate-300
    transition-all
    focus-visible:shadow-sm
    focus-visible:shadow-gray 
    font-[geist]"
              id="email"
              type="email"
              {...form.register("email")}
            />

            {form.formState.errors.email && (
              <p className="font-[geist]text-md text-red-500 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-md font-[geist]" htmlFor="password">
              Password
            </Label>

            <Input
              className="mt-2
    h-11
    rounded-xl
    border-slate-300
    transition-all
    focus-visible:shadow-sm
    focus-visible:shadow-gray 
    font-[geist]"
              id="password"
              type="password"
              {...form.register("password")}
            />

            {form.formState.errors.password && (
              <p className="font-[geist]text-md text-red-500 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="
    w-full
    rounded-xl
    bg-linear-to-r
    from-violet-600
    via-indigo-600
    to-blue-600
    py-6
    text-white
    cursor-pointer
    font-semibold
    transition-all
    duration-300
    hover:scale-[1.02]
    hover:shadow-xl
    hover:shadow-indigo-500/30
    active:scale-95
    disabled:opacity-50
    disabled:cursor-not-allowed
    font-[space_grotesk]
    text-md
  "
          >
            {isSubmitting ? <> 
              <Loader2Icon className="mr-2 h-6 w-6 animate-spin" />
              Creating Account
            </>: "Create account"}
          </Button>
        </form>

        <div className="text-center mt-4 text-lg">
          <p className="font-[geist]  ">
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="text-blue-500  hover:text-blue-700"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
