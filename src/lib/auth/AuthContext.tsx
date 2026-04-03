"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
  browserPopupRedirectResolver,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useSyncUser } from "@/lib/graphql/user";

// ============================================================================
// Types
// ============================================================================

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dni?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  loading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

// ============================================================================
// Helpers
// ============================================================================

function isFirebaseError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as AuthError).code === "string"
  );
}

function getFirebaseErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Este email ya está registrado",
    "auth/invalid-email": "Email inválido",
    "auth/invalid-credential": "Credenciales inválidas",
    "auth/user-not-found": "Usuario no encontrado",
    "auth/wrong-password": "Contraseña incorrecta",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
    "auth/too-many-requests": "Demasiados intentos. Intentá más tarde",
    "auth/popup-closed-by-user": "Inicio de sesión cancelado",
    "auth/popup-blocked": "El navegador bloqueó la ventana emergente",
    "auth/network-request-failed": "Error de conexión. Verificá tu internet",
  };
  return messages[code] || "Ocurrió un error. Intentá de nuevo";
}

function normalizeAuthUser(
  userData: AuthUser & { firstName?: string; lastName?: string },
  displayName?: string | null,
): AuthUser {
  const derivedName = displayName?.trim() || "";
  const [derivedFirstName, ...derivedLastNameParts] = derivedName.split(" ");

  return {
    ...userData,
    firstName: userData.firstName || derivedFirstName || undefined,
    lastName:
      userData.lastName ||
      (derivedLastNameParts.length
        ? derivedLastNameParts.join(" ")
        : undefined),
    name:
      userData.name ||
      [userData.firstName, userData.lastName].filter(Boolean).join(" ") ||
      derivedName ||
      undefined,
  };
}

function createBasicAuthUser(firebaseUser: User): AuthUser {
  const displayName = firebaseUser.displayName || "";
  const [firstName, ...lastNameParts] = displayName.split(" ");

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: displayName || undefined,
    firstName: firstName || undefined,
    lastName: lastNameParts.join(" ") || undefined,
    role: "CUSTOMER",
  };
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { syncUser } = useSyncUser();

  const syncInProgress = useRef(false);
  const manualLoginHandled = useRef(false);
  const syncUserRef = useRef(syncUser);
  syncUserRef.current = syncUser;
  const authInitialized = useRef(false);
  const lastSyncedUid = useRef<string | null>(null);

  const handleUserSync = useCallback(
    async (firebaseUser: User): Promise<AuthUser | null> => {
      if (lastSyncedUid.current === firebaseUser.uid) return null;
      if (syncInProgress.current) return null;

      syncInProgress.current = true;

      try {
        await firebaseUser.getIdToken(true);
        await new Promise((resolve) => setTimeout(resolve, 50));

        const userData = await syncUserRef.current(
          firebaseUser.displayName || undefined,
        );

        if (!userData) return null;

        lastSyncedUid.current = firebaseUser.uid;
        return normalizeAuthUser(userData, firebaseUser.displayName);
      } catch (error) {
        console.error("[Auth] Sync error:", error);
        return null;
      } finally {
        syncInProgress.current = false;
      }
    },
    [],
  );

  useEffect(() => {
    if (authInitialized.current) return;
    authInitialized.current = true;

    const authInstance = auth;
    if (!authInstance) {
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const isPendingRedirect =
          typeof window !== "undefined" &&
          sessionStorage.getItem("google_auth_pending") === "true";

        if (isPendingRedirect) {
          sessionStorage.removeItem("google_auth_pending");

          const result = await getRedirectResult(
            authInstance,
            browserPopupRedirectResolver,
          );

          if (result?.user && isMounted) {
            manualLoginHandled.current = true;
            lastSyncedUid.current = result.user.uid;
            const syncedUser = await handleUserSync(result.user);

            setUser(result.user);
            setAuthUser(syncedUser || createBasicAuthUser(result.user));
            setLoading(false);
            setIsInitialized(true);

            if (syncedUser) toast.success("¡Bienvenido!");
            return () => {};
          }
        }
      } catch (error) {
        console.error("[Auth] Redirect handling error:", error);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("google_auth_pending");
        }
      }

      const unsubscribe = onAuthStateChanged(
        authInstance,
        async (firebaseUser) => {
          if (!isMounted) return;

          if (manualLoginHandled.current) {
            manualLoginHandled.current = false;
            setLoading(false);
            setIsInitialized(true);
            return;
          }

          setUser(firebaseUser);

          if (firebaseUser) {
            if (lastSyncedUid.current !== firebaseUser.uid) {
              const syncedUser = await handleUserSync(firebaseUser);
              if (isMounted) {
                setAuthUser(syncedUser || createBasicAuthUser(firebaseUser));
              }
            }
          } else {
            lastSyncedUid.current = null;
            setAuthUser(null);
          }

          if (isMounted) {
            setLoading(false);
            setIsInitialized(true);
          }
        },
      );

      return unsubscribe;
    };

    const unsubscribePromise = initializeAuth();

    return () => {
      isMounted = false;
      unsubscribePromise.then((unsubscribe) => unsubscribe?.());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      toast.error("Servicio de autenticación no disponible");
      throw new Error("Firebase auth not initialized");
    }

    try {
      manualLoginHandled.current = true;
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const userData = await syncUserRef.current(
        firebaseUser.displayName || undefined,
      );

      if (!userData) {
        manualLoginHandled.current = false;
        throw new Error("Auth sync failed");
      }

      setUser(firebaseUser);
      setAuthUser(normalizeAuthUser(userData, firebaseUser.displayName));
      toast.success("¡Bienvenido!");
    } catch (error: unknown) {
      manualLoginHandled.current = false;
      const code = isFirebaseError(error) ? error.code : "unknown";
      toast.error(getFirebaseErrorMessage(code));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) {
      toast.error("Servicio de autenticación no disponible");
      throw new Error("Firebase auth not initialized");
    }

    try {
      manualLoginHandled.current = true;
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(firebaseUser, { displayName: name });

      syncInProgress.current = false;
      const syncedUser = await handleUserSync(firebaseUser);

      setUser(firebaseUser);
      setAuthUser(
        syncedUser || {
          id: firebaseUser.uid,
          email: firebaseUser.email || email,
          name,
          firstName: name.split(" ")[0],
          lastName: name.split(" ").slice(1).join(" ") || undefined,
          role: "CUSTOMER",
        },
      );

      setLoading(false);
      setIsInitialized(true);
      toast.success("¡Cuenta creada exitosamente!");
    } catch (error: unknown) {
      manualLoginHandled.current = false;
      const code = isFirebaseError(error) ? error.code : "unknown";
      toast.error(getFirebaseErrorMessage(code));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      toast.error("Servicio de autenticación no disponible");
      throw new Error("Firebase auth not initialized");
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      manualLoginHandled.current = true;
      const result = await signInWithPopup(
        auth,
        provider,
        browserPopupRedirectResolver,
      );

      if (result.user) {
        syncInProgress.current = false;
        const syncedUser = await handleUserSync(result.user);

        setUser(result.user);
        setAuthUser(syncedUser || createBasicAuthUser(result.user));
        setLoading(false);
        setIsInitialized(true);

        if (syncedUser) toast.success("¡Bienvenido!");
        return;
      }
    } catch (popupError) {
      const code = isFirebaseError(popupError) ? popupError.code : "unknown";

      if (
        code === "auth/popup-blocked" ||
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        manualLoginHandled.current = false;

        if (typeof window !== "undefined") {
          sessionStorage.setItem("google_auth_pending", "true");
        }

        await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
        return;
      }

      manualLoginHandled.current = false;
      toast.error(getFirebaseErrorMessage(code));
      throw popupError;
    }
  };

  const signOut = async () => {
    if (!auth) {
      toast.error("Servicio de autenticación no disponible");
      throw new Error("Firebase auth not initialized");
    }

    try {
      await firebaseSignOut(auth);
      lastSyncedUid.current = null;
      setUser(null);
      setAuthUser(null);
      toast.success("Sesión cerrada");
    } catch {
      toast.error("Error al cerrar sesión");
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      toast.error("Servicio de autenticación no disponible");
      throw new Error("Firebase auth not initialized");
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Te enviamos un email para restablecer tu contraseña");
    } catch (error: unknown) {
      const code = isFirebaseError(error) ? error.code : "unknown";
      toast.error(getFirebaseErrorMessage(code));
      throw error;
    }
  };

  const isAdmin =
    authUser?.role === "ADMIN" ||
    authUser?.role === "SUPER_ADMIN" ||
    authUser?.role === "OPERATOR";

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser,
        loading,
        isInitialized,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    return {
      user: null,
      authUser: null,
      loading: false,
      isInitialized: false,
      signIn: async () => {},
      signUp: async () => {},
      signInWithGoogle: async () => {},
      signOut: async () => {},
      resetPassword: async () => {},
      isAdmin: false,
    };
  }

  return context;
}
