"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"

export default function Login() {
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/chat");
    }
  }, [status, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (isLogin) {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res?.ok && !res.error) {
        router.push("/chat");
      } else {
        setMessage("Wrong email or password");
      }
    } else {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result?.error) {
        setMessage(result.error);
        return;
      }

      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res?.ok && !res.error) {
        router.push("/chat");
      }
    }
  };

  return (
    <section className="flex w-full h-full">
      <div className="w-full h-full sm:h-auto sm:w-[460] flex flex-col justify-center sm:self-center mx-auto sm:rounded-xl bg-primary-gray p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          <h1 className="text-3xl text-center sm:mb-4">{isLogin ? "Login" : "Sign up"}</h1>

          <div className="flex flex-col h-full sm:justify-center">
            <div className="flex flex-col gap-5">
              {!isLogin && (
                <div className="flex flex-col gap-1.5">
                  <span>Name</span>
                  <input {...register("name", { required: true })} id="Name" type="text" placeholder="Name" className="outline-none border-secondary-gray border rounded p-1" />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <span>Email</span>
                <input {...register("email", { required: true })} id="Email" type="email" placeholder="Email" className="outline-none border-secondary-gray border rounded p-1" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span>Password</span>
                <input {...register("password", { required: true, minLength: 8 })} id="Password" type="password" placeholder="Password" className="outline-none border-secondary-gray border rounded p-1" />
              </div>
            </div>

            <button type="submit" className="bg-button-yellow text-black rounded p-1 mt-4 cursor-pointer">{isLogin ? "Login" : "Sign Up"}</button>
          </div>
        </form>

        <button onClick={() => signIn("google")} className="flex justify-center items-center text-primary-white bg-gray-600 rounded p-1 mt-4 mb-2 cursor-pointer gap-2"><FcGoogle/>Continue with Google</button>

        <div className="text-center">
          <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
          <span className="underline text-button-yellow cursor-pointer" onClick={() => setIsLogin(!isLogin)}>{!isLogin ? "Login" : "Sign up"}</span>
        </div>

        {message && <p className="mx-auto text-center text-red-500">{message}</p>}
      </div>
    </section>
  )
}