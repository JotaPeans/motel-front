"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { login } from "@/app/api/auth/login";
import InputField from "@/components/InputField";
import { buttonVariants } from "@/components/ui/button";
import SubmitButton from "@/components/SubmitButton";

export default function LoginPage() {
  const router = useRouter();

  async function handleAction(form: FormData) {
    const { data, error } = await login({
        email: form.get("email") as string,
        password: form.get("password") as string,
    });

    if (data) {
      router.push("/dashboard");
    }

    if (error) {
      toast(error.message, {
        duration: 1000
      });
    }
  }

  return (
    <main className="flex-1 relative flex bg-light_minus_1">
      <motion.div
        className="flex-1 bg-principal hidden lg:flex p-28"
        initial={{ x: 400 }}
        animate={{ x: 0 }}
      >
        <motion.h3
          className="w-96 text-wrap text-6xl font-bricolage text-white font-semibold mt-auto"
          initial={{ y: -100, scale: 0, opacity: 0 }}
          animate={{
            y: 0,
            scale: 1,
            opacity: 1,
            transition: { delay: 0.3, duration: 0.5, type: "spring" },
          }}
        >
          Bem-Vindo <span className="text-5xl">de volta!</span>
        </motion.h3>
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            delay: 0.5,
            duration: 0.6,
          },
        }}
        className="flex flex-col items-center justify-center gap-10 flex-1 max-w-[725px] px-4 py-10"
      >
        <Image
          src="/MotelHub.svg"
          alt="MotelHub"
          width={174}
          height={93}
        />

        <form action={handleAction} className="flex flex-col gap-2">
          <h5 className="text-start font-semibold text-xl">Login</h5>
          <p className="text-principal">
            Bem vindo de volta! Faça login para acessar sua conta.
          </p>

          <div className="flex flex-col gap-4 mt-4">
            <InputField
              label="Email"
              name="email"
              type="email"
              required
              classNames={{
                labelClassName: "text-principal",
              }}
            />
            <InputField
              label="Senha"
              name="password"
              type="password"
              required
              classNames={{
                labelClassName: "text-principal",
              }}
            />

            <SubmitButton size="lg">Entrar</SubmitButton>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
