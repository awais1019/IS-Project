import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues } from "react-hook-form";
import { z } from "zod";



import { useState } from "react";

import { emailSchema, passwordSchema } from "../../schema";

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type FormData = z.infer<typeof loginSchema>;

export default function Login() {


  const [error, setError] = useState("");
  const onSubmit = async (data: FieldValues) => {
    setError("make login endpoint in backend")
    console.log(data)
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  return (
    <div className="w-screen h-screen flex justify-center overflow-y-auto md:items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-screen h-screen p-[clamp(24px,2vw,36px)] gap-[clamp(12px,2vw,24px)] md:bg-white md:opacity-[90%] md:border-gray-300 md:border justify-center md:w-[clamp(500px,3vw,900px)] md:h-[clamp(430px,2vh,800px)] md:rounded-[6px] font-primary"
      >
        <div>
          <h1 className="font-bold font-primary text-[24px] text-blue">
            Welcome Back
          </h1>
        </div>

        <div className="flex flex-col w-full gap-1">
          <label htmlFor="email" className="font-primary font-medium">
            Email
          </label>
          <input
            {...register("email")}
            type="text"
            id="email"
            className="p-2 text-[16px] border border-gray-300 rounded-md font-medium font-primay"
            placeholder="mhawais@gmail.com"
          />
          {errors.email && (
            <p className="text-red-800 font-primary font-medium">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="password" className="font-primary font-medium">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            id="password"
            className="p-2 text-[16px] border border-gray-300 rounded-md font-medium font-primary"
            placeholder="1233445"
          />
          {errors.password && (
            <p className="text-red-800 font-primary font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <input
          type="submit"
          value={"Login"}
          className="w-full bg-blue p-2 rounded-[10px] text-[16px] font-primary font-semibold text-white"
        />
        {error && (
          <p className="text-red-800 font-primary font-medium">{error}</p>
        )}
        <div className="flex justify-center mt-4">
          <p className="text-sm text-gray-600 font-primary font-medium">
            Don't have an account?&nbsp;
            <a
              href="/register"
              className="text-blue hover:underline font-medium font-primary"
            >
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
