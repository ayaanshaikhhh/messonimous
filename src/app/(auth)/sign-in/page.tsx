'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link" 
import { use, useEffect, useState } from "react"
import { useForm , SubmitHandler} from "react-hook-form"
import * as z from "zod"
import {useDebounceValue} from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios';
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"

const page = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)
  const [debouncedUsername, setDebouncedUsername] = useDebounceValue<string>(username,1000)
   const router = useRouter()

  //  ZOD implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:"",
      email:"",
      password:""
    }
  })


  useEffect(()=>{
    const checkUsernameUniqueness = async()=>{
      if(debouncedUsername){
        setisCheckingUsername(true)
        setUsernameMessage("")

        try {
          const response =  await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
            // console.error("ERROR CHECKING USERNAME UNIQUENESS",error)
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(
              axiosError.response?.data.message ?? "Error checking username"
            )
        }
        finally{
          setisCheckingUsername(false);
        }

      }
    }
    checkUsernameUniqueness()
  },[debouncedUsername])
  

  const OnSubmit = async (data:z.infer<typeof signUpSchema>)=>{
    setisSubmitting(true) 

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up",data)
      toast.success("Success",{
        description:response.data.message
      })
      
      router.replace(`/verify/${username}`)
      setisSubmitting(false)
    }
    
    catch(error){
      console.error("Error Signing-Up the user ")
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Sign-Up failed",{
        description:axiosError.response?.data.message ?? "Something went wrong"
      })
    }
    finally{
      setisSubmitting(false)
    }
  }


  return (
    <div>page</div>
  )
}

export default page 