"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Chrome } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { useAuth } from "@/lib/auth/AuthContext";

type AuthMode = "login" | "register" | "forgot";

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password: string) => ({
  minLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /\d/.test(password),
});

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const {
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    loading,
    isInitialized,
    user,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && user) {
      router.replace(redirect);
    }
  }, [isInitialized, user, redirect, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Ingresá un email válido");
      return;
    }
    if (!password) {
      toast.error("Ingresá tu contraseña");
      return;
    }
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("¡Bienvenido!");
      router.replace(redirect);
    } catch (err: any) {
      const code = err?.code;
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        toast.error("Email o contraseña incorrectos");
      } else if (code === "auth/too-many-requests") {
        toast.error("Demasiados intentos. Intenta más tarde");
      } else {
        toast.error("Error al iniciar sesión");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Completá tu nombre y apellido");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Ingresá un email válido");
      return;
    }
    const passCheck = validatePassword(password);
    if (
      !passCheck.minLength ||
      !passCheck.hasUppercase ||
      !passCheck.hasNumber
    ) {
      toast.error(
        "La contraseña debe tener mín. 8 caracteres, una mayúscula y un número",
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp(email, password, `${firstName} ${lastName}`.trim());
      toast.success("¡Cuenta creada exitosamente!");
      router.replace(redirect);
    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use") {
        toast.error("Este email ya está registrado");
      } else {
        toast.error("Error al crear la cuenta");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      toast.success("¡Bienvenido!");
      router.replace(redirect);
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        toast.error("Error al iniciar sesión con Google");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Ingresá un email válido");
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      toast.success("Te enviamos un email para recuperar tu contraseña");
      setMode("login");
    } catch {
      toast.error("Error al enviar el email de recuperación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center px-4 pt-6 pb-2 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <button onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-6">
          {mode === "login"
            ? "Iniciar Sesión"
            : mode === "register"
              ? "Crear Cuenta"
              : "Recuperar Contraseña"}
        </h2>
      </div>

      <main className="max-w-md mx-auto px-4 pt-4 md:pt-24">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 814 1000"
              className="w-8 h-8 fill-on-surface"
              aria-hidden="true"
            >
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-43.6-150.3-109.2c-52.9-77.7-96.7-198.8-96.7-314.5 0-208.8 136.3-319.1 270.8-319.1 67.2 0 123.1 44.3 164.7 44.3 39.5 0 101.1-47 176.3-47 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
            </svg>
            <h1 className="text-2xl font-bold font-headline">iMarket</h1>
          </div>
          <p className="text-on-surface-variant text-sm">
            {mode === "login"
              ? "Ingresá a tu cuenta"
              : mode === "register"
                ? "Creá tu cuenta en iMarket"
                : "Recuperá tu contraseña"}
          </p>
        </div>

        {/* Google Sign In */}
        {mode !== "forgot" && (
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-outline/20 bg-white hover:bg-gray-50 transition-colors font-semibold text-on-surface disabled:opacity-50 mb-6"
          >
            <Chrome className="w-5 h-5" />
            Continuar con Google
          </button>
        )}

        {/* Divider */}
        {mode !== "forgot" && (
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-outline/20" />
            <span className="text-xs text-on-surface-variant font-semibold uppercase">
              o con email
            </span>
            <div className="flex-1 h-px bg-outline/20" />
          </div>
        )}

        {/* Login Form */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-11 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-sm text-primary font-semibold hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="mx-auto h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                  disabled={isLoading}
                />
              </div>
              <input
                type="text"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-11 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {password && (
              <div className="flex gap-2 text-xs">
                <span
                  className={
                    validatePassword(password).minLength
                      ? "text-emerald-500"
                      : "text-on-surface-variant"
                  }
                >
                  8+ caracteres
                </span>
                <span
                  className={
                    validatePassword(password).hasUppercase
                      ? "text-emerald-500"
                      : "text-on-surface-variant"
                  }
                >
                  1 mayúscula
                </span>
                <span
                  className={
                    validatePassword(password).hasNumber
                      ? "text-emerald-500"
                      : "text-on-surface-variant"
                  }
                >
                  1 número
                </span>
              </div>
            )}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="mx-auto h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-sm text-on-surface-variant mb-2">
              Ingresá tu email y te enviaremos un enlace para restablecer tu
              contraseña.
            </p>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="mx-auto h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Enviar enlace"
              )}
            </button>
          </form>
        )}

        {/* Mode Switch */}
        <div className="text-center mt-6">
          {mode === "login" ? (
            <p className="text-sm text-on-surface-variant">
              ¿No tenés cuenta?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-primary font-semibold hover:underline"
              >
                Crear cuenta
              </button>
            </p>
          ) : mode === "register" ? (
            <p className="text-sm text-on-surface-variant">
              ¿Ya tenés cuenta?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-primary font-semibold hover:underline"
              >
                Iniciar sesión
              </button>
            </p>
          ) : (
            <button
              onClick={() => setMode("login")}
              className="text-sm text-primary font-semibold hover:underline"
            >
              Volver a iniciar sesión
            </button>
          )}
        </div>
      </main>

      {/* Desktop Footer */}
      <div className="hidden md:block mt-12">
        <Footer />
      </div>
    </div>
  );
}

export default function LoginPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-on-surface-variant">
            Cargando...
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
