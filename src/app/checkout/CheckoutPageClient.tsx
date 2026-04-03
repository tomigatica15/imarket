"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar, Footer } from "@/components/layout";
import {
  useCart,
  useAuth,
  useCheckoutConfig,
  useCreateOrder,
  useCreatePayment,
} from "@/hooks";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  User,
  MapPin,
  CreditCard,
  Truck,
  Store,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// ============================================================================
// Validation helpers
// ============================================================================

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string) => {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return cleaned.length >= 8 && /^\+?\d+$/.test(cleaned);
};

const validateDNI = (dni: string) => {
  const cleaned = dni.replace(/\D/g, "");
  return cleaned.length >= 7 && cleaned.length <= 8;
};

const NAME_REGEX = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;

const validatePostalCode = (cp: string) =>
  /^\d{4}$/.test(cp) || /^[A-Z]\d{4}[A-Z]{3}$/i.test(cp);

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Payment method icons
const paymentIcons: Record<string, { Icon: typeof CreditCard; color: string }> =
  {
    MERCADO_PAGO: { Icon: CreditCard, color: "text-sky-500" },
    BANK_TRANSFER: { Icon: Store, color: "text-orange-500" },
    CASH_ON_DELIVERY: { Icon: Store, color: "text-green-600" },
  };

export default function CheckoutPageClient() {
  const router = useRouter();
  const { authUser } = useAuth();
  const { items, subtotal, shipping, total, clearCart, couponCode } = useCart();
  const {
    paymentMethods,
    shippingMethods,
    loading: configLoading,
  } = useCheckoutConfig();
  const { createOrder, loading: creatingOrder } = useCreateOrder();
  const { createPayment, loading: creatingPayment } = useCreatePayment();

  // Form state
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");

  // Customer info
  const [customerForm, setCustomerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dni: "",
  });

  // Address form
  const [addressForm, setAddressForm] = useState({
    street: "",
    number: "",
    floor: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    notes: "",
  });

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effective shipping methods - if no Andreani/branch pickup, show "acordar entrega"
  const hasShippingMethods = shippingMethods.length > 0;

  // Default shipping selection
  const shippingOptions = useMemo(() => {
    if (hasShippingMethods) return shippingMethods;
    // Fallback: no shipping methods configured
    return [
      {
        id: "SELLER_ARRANGEMENT",
        name: "Acordar entrega con el vendedor",
        description: "Coordiná el envío directamente con nosotros",
        enabled: true,
      },
    ];
  }, [hasShippingMethods, shippingMethods]);

  // Initialize form with user data
  useEffect(() => {
    if (authUser) {
      setCustomerForm((prev) => ({
        ...prev,
        email: authUser.email || "",
        firstName: authUser.firstName || prev.firstName,
        lastName: authUser.lastName || prev.lastName,
        phone: authUser.phone || prev.phone,
        dni: authUser.dni || prev.dni,
      }));
    }
  }, [authUser]);

  // Set default selections
  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPayment) {
      setSelectedPayment(paymentMethods[0].id);
    }
    if (shippingOptions.length > 0 && !selectedShipping) {
      setSelectedShipping(shippingOptions[0].id);
    }
  }, [paymentMethods, shippingOptions, selectedPayment, selectedShipping]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = useCallback(
    (field: string) => {
      const newErrors: Record<string, string> = {};

      switch (field) {
        case "firstName":
          if (!customerForm.firstName.trim())
            newErrors.firstName = "El nombre es obligatorio";
          else if (!NAME_REGEX.test(customerForm.firstName.trim()))
            newErrors.firstName = "Solo puede contener letras";
          break;
        case "lastName":
          if (!customerForm.lastName.trim())
            newErrors.lastName = "El apellido es obligatorio";
          else if (!NAME_REGEX.test(customerForm.lastName.trim()))
            newErrors.lastName = "Solo puede contener letras";
          break;
        case "email":
          if (!customerForm.email.trim())
            newErrors.email = "El email es obligatorio";
          else if (!validateEmail(customerForm.email))
            newErrors.email = "Ingresá un email válido";
          break;
        case "phone":
          if (!customerForm.phone.trim())
            newErrors.phone = "El teléfono es obligatorio";
          else if (!validatePhone(customerForm.phone))
            newErrors.phone = "Ingresá un teléfono válido";
          break;
        case "dni":
          if (!customerForm.dni.trim()) newErrors.dni = "El DNI es obligatorio";
          else if (!validateDNI(customerForm.dni))
            newErrors.dni = "DNI inválido (7-8 dígitos)";
          break;
        case "street":
          if (needsAddress && !addressForm.street.trim())
            newErrors.street = "La calle es obligatoria";
          break;
        case "number":
          if (needsAddress && !addressForm.number.trim())
            newErrors.number = "El número es obligatorio";
          break;
        case "city":
          if (needsAddress && !addressForm.city.trim())
            newErrors.city = "La ciudad es obligatoria";
          break;
        case "province":
          if (needsAddress && !addressForm.province.trim())
            newErrors.province = "La provincia es obligatoria";
          break;
        case "postalCode":
          if (needsAddress) {
            if (!addressForm.postalCode.trim())
              newErrors.postalCode = "El código postal es obligatorio";
            else if (!validatePostalCode(addressForm.postalCode))
              newErrors.postalCode = "CP inválido (ej: 1414)";
          }
          break;
      }

      setErrors((prev) => {
        const updated = { ...prev };
        if (newErrors[field]) updated[field] = newErrors[field];
        else delete updated[field];
        return updated;
      });

      return !newErrors[field];
    },
    [customerForm, addressForm],
  );

  // Does selected shipping require an address?
  const needsAddress =
    selectedShipping === "HOME_DELIVERY" ||
    selectedShipping === "SELLER_ARRANGEMENT";

  // Validate all
  const validateAllFields = () => {
    const fields = ["firstName", "lastName", "email", "phone", "dni"];
    if (needsAddress) {
      fields.push("street", "number", "city", "province", "postalCode");
    }

    const newTouched: Record<string, boolean> = {};
    fields.forEach((f) => (newTouched[f] = true));
    setTouched(newTouched);

    let valid = true;
    fields.forEach((f) => {
      if (!validateField(f)) valid = false;
    });
    return valid;
  };

  const isFormValid = useMemo(() => {
    const { firstName, lastName, email, phone, dni } = customerForm;
    if (!firstName || !lastName || !email || !phone || !dni) return false;
    if (!validateEmail(email) || !validatePhone(phone) || !validateDNI(dni))
      return false;
    if (needsAddress) {
      const { street, number, city, province, postalCode } = addressForm;
      if (!street || !number || !city || !province || !postalCode) return false;
      if (!validatePostalCode(postalCode)) return false;
    }
    if (!selectedPayment) return false;
    return true;
  }, [customerForm, addressForm, needsAddress, selectedPayment]);

  // Handle checkout
  const handleCheckout = async () => {
    if (isSubmitting) return;

    if (!validateAllFields()) {
      toast.error("Por favor corregí los errores en el formulario");
      return;
    }

    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build shipping address
      const shippingAddress =
        selectedShipping === "STORE_PICKUP"
          ? {
              street: "Retiro en local",
              number: "-",
              city: "-",
              province: "-",
              postalCode: "-",
              notes: "Retiro en local",
            }
          : {
              street: addressForm.street,
              number: addressForm.number,
              floor: addressForm.floor || undefined,
              apartment: addressForm.apartment || undefined,
              city: addressForm.city,
              province: addressForm.province,
              postalCode: addressForm.postalCode,
              notes: addressForm.notes || undefined,
            };

      const shippingType =
        selectedShipping === "SELLER_ARRANGEMENT"
          ? "HOME_DELIVERY"
          : selectedShipping;

      const order = await createOrder({
        customer: {
          firstName: customerForm.firstName,
          lastName: customerForm.lastName,
          email: customerForm.email,
          phone: customerForm.phone,
          dni: customerForm.dni || undefined,
        },
        shippingAddress,
        shipping: { type: shippingType },
        couponCode: couponCode || undefined,
      });

      if (!order) throw new Error("No se pudo crear la orden");

      // Map payment to provider
      const providerMap: Record<string, string> = {
        MERCADO_PAGO: "MERCADO_PAGO",
        BANK_TRANSFER: "TRANSFER",
        CASH_ON_DELIVERY: "CASH",
      };

      const provider = providerMap[selectedPayment] || "MERCADO_PAGO";

      const session = await createPayment(order.id, provider);

      if (provider === "MERCADO_PAGO") {
        if (session?.initPoint) {
          clearCart();
          window.location.href = session.initPoint;
        } else {
          throw new Error("No se pudo obtener el enlace de pago");
        }
      } else if (provider === "TRANSFER") {
        clearCart();
        router.push(
          `/checkout/confirmacion?orderNumber=${order.orderNumber}&method=transfer`,
        );
      } else {
        clearCart();
        router.push(
          `/checkout/confirmacion?orderNumber=${order.orderNumber}&method=cash`,
        );
      }
    } catch (error: any) {
      const message =
        error?.message || "Error al procesar el pago. Intenta nuevamente.";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const isLoading =
    configLoading || creatingOrder || creatingPayment || isSubmitting;

  // Empty cart redirect
  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <ShoppingCart className="w-20 h-20 text-outline/20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Tu carrito está vacío</h3>
          <p className="text-on-surface-variant mb-6">
            Agregá productos antes de continuar
          </p>
          <Link
            href="/"
            className="h-12 px-8 bg-primary text-white font-bold rounded-xl flex items-center justify-center"
          >
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pb-0">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center px-4 pt-6 pb-2 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <button onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-6 font-headline">
          Checkout
        </h2>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-4 md:pt-8">
        <h1 className="hidden md:block text-3xl font-extrabold mb-8 font-headline">
          Finalizar Compra
        </h1>

        <div className="md:grid md:grid-cols-5 md:gap-8">
          {/* Left: Forms */}
          <div className="md:col-span-3 space-y-6">
            {/* Customer Info */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-outline/10">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 font-headline">
                <User className="w-5 h-5 text-primary" />
                Datos de Contacto
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Nombre *"
                    value={customerForm.firstName}
                    onChange={(e) =>
                      setCustomerForm((p) => ({
                        ...p,
                        firstName: e.target.value,
                      }))
                    }
                    onBlur={() => handleBlur("firstName")}
                    className={`w-full h-12 px-4 rounded-xl border-2 bg-surface focus:outline-none focus:border-primary transition-colors ${
                      touched.firstName && errors.firstName
                        ? "border-error"
                        : "border-outline/20"
                    }`}
                    disabled={isLoading}
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="text-error text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Apellido *"
                    value={customerForm.lastName}
                    onChange={(e) =>
                      setCustomerForm((p) => ({
                        ...p,
                        lastName: e.target.value,
                      }))
                    }
                    onBlur={() => handleBlur("lastName")}
                    className={`w-full h-12 px-4 rounded-xl border-2 bg-surface focus:outline-none focus:border-primary transition-colors ${
                      touched.lastName && errors.lastName
                        ? "border-error"
                        : "border-outline/20"
                    }`}
                    disabled={isLoading}
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="text-error text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <input
                  type="email"
                  placeholder="Email *"
                  value={customerForm.email}
                  onChange={(e) =>
                    setCustomerForm((p) => ({ ...p, email: e.target.value }))
                  }
                  onBlur={() => handleBlur("email")}
                  className={`w-full h-12 px-4 rounded-xl border-2 bg-surface focus:outline-none focus:border-primary transition-colors ${
                    touched.email && errors.email
                      ? "border-error"
                      : "border-outline/20"
                  }`}
                  autoComplete="email"
                  disabled={isLoading}
                />
                {touched.email && errors.email && (
                  <p className="text-error text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <input
                    type="tel"
                    placeholder="Teléfono *"
                    value={customerForm.phone}
                    onChange={(e) =>
                      setCustomerForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    onBlur={() => handleBlur("phone")}
                    className={`w-full h-12 px-4 rounded-xl border-2 bg-surface focus:outline-none focus:border-primary transition-colors ${
                      touched.phone && errors.phone
                        ? "border-error"
                        : "border-outline/20"
                    }`}
                    disabled={isLoading}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-error text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="DNI *"
                    value={customerForm.dni}
                    onChange={(e) =>
                      setCustomerForm((p) => ({
                        ...p,
                        dni: e.target.value.replace(/\D/g, "").slice(0, 8),
                      }))
                    }
                    onBlur={() => handleBlur("dni")}
                    className={`w-full h-12 px-4 rounded-xl border-2 bg-surface focus:outline-none focus:border-primary transition-colors ${
                      touched.dni && errors.dni
                        ? "border-error"
                        : "border-outline/20"
                    }`}
                    disabled={isLoading}
                  />
                  {touched.dni && errors.dni && (
                    <p className="text-error text-xs mt-1">{errors.dni}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-outline/10">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 font-headline">
                <Truck className="w-5 h-5 text-primary" />
                Método de Envío
              </h2>
              <div className="space-y-3">
                {shippingOptions.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedShipping === method.id
                        ? "border-primary bg-primary/5"
                        : "border-outline/10 hover:border-outline/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={selectedShipping === method.id}
                      onChange={() => setSelectedShipping(method.id)}
                      className="accent-primary"
                      disabled={isLoading}
                    />
                    <div className="flex-1">
                      <p className="font-bold">{method.name}</p>
                      <p className="text-on-surface-variant text-sm">
                        {method.description}
                      </p>
                    </div>
                    {method.id === "STORE_PICKUP" && (
                      <Store className="w-5 h-5 text-green-500" />
                    )}
                    {method.id === "HOME_DELIVERY" && (
                      <Truck className="w-5 h-5 text-primary" />
                    )}
                    {method.id === "SELLER_ARRANGEMENT" && (
                      <Truck className="w-5 h-5 text-orange-500" />
                    )}
                  </label>
                ))}
              </div>
            </section>

            {/* Address (conditional) */}
            {needsAddress && (
              <section className="bg-white rounded-xl p-5 shadow-sm border border-outline/10">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 font-headline">
                  <MapPin className="w-5 h-5 text-primary" />
                  Dirección de Envío
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Calle *"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm((p) => ({
                          ...p,
                          street: e.target.value,
                        }))
                      }
                      onBlur={() => handleBlur("street")}
                      className={`w-full h-12 px-4 rounded-xl border-2 bg-surface focus:outline-none focus:border-primary transition-colors ${
                        touched.street && errors.street
                          ? "border-error"
                          : "border-outline/20"
                      }`}
                      disabled={isLoading}
                    />
                    {touched.street && errors.street && (
                      <p className="text-error text-xs mt-1">{errors.street}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Número *"
                      value={addressForm.number}
                      onChange={(e) =>
                        setAddressForm((p) => ({
                          ...p,
                          number: e.target.value,
                        }))
                      }
                      onBlur={() => handleBlur("number")}
                      className={`w-full h-12 px-4 rounded-xl border-2 bg-surface focus:outline-none focus:border-primary transition-colors ${
                        touched.number && errors.number
                          ? "border-error"
                          : "border-outline/20"
                      }`}
                      disabled={isLoading}
                    />
                    {touched.number && errors.number && (
                      <p className="text-error text-xs mt-1">{errors.number}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <input
                    type="text"
                    placeholder="Piso (opcional)"
                    value={addressForm.floor}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, floor: e.target.value }))
                    }
                    className="w-full h-12 px-4 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    placeholder="Depto (opcional)"
                    value={addressForm.apartment}
                    onChange={(e) =>
                      setAddressForm((p) => ({
                        ...p,
                        apartment: e.target.value,
                      }))
                    }
                    className="w-full h-12 px-4 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Ciudad *"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm((p) => ({ ...p, city: e.target.value }))
                      }
                      onBlur={() => handleBlur("city")}
                      className={`w-full h-12 px-4 rounded-xl border-2 bg-surface focus:outline-none focus:border-primary transition-colors ${
                        touched.city && errors.city
                          ? "border-error"
                          : "border-outline/20"
                      }`}
                      disabled={isLoading}
                    />
                    {touched.city && errors.city && (
                      <p className="text-error text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Provincia *"
                      value={addressForm.province}
                      onChange={(e) =>
                        setAddressForm((p) => ({
                          ...p,
                          province: e.target.value,
                        }))
                      }
                      onBlur={() => handleBlur("province")}
                      className={`w-full h-12 px-4 rounded-xl border-2 bg-surface focus:outline-none focus:border-primary transition-colors ${
                        touched.province && errors.province
                          ? "border-error"
                          : "border-outline/20"
                      }`}
                      disabled={isLoading}
                    />
                    {touched.province && errors.province && (
                      <p className="text-error text-xs mt-1">
                        {errors.province}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="CP *"
                      value={addressForm.postalCode}
                      onChange={(e) =>
                        setAddressForm((p) => ({
                          ...p,
                          postalCode: e.target.value,
                        }))
                      }
                      onBlur={() => handleBlur("postalCode")}
                      className={`w-full h-12 px-4 rounded-xl border-2 bg-surface focus:outline-none focus:border-primary transition-colors ${
                        touched.postalCode && errors.postalCode
                          ? "border-error"
                          : "border-outline/20"
                      }`}
                      disabled={isLoading}
                    />
                    {touched.postalCode && errors.postalCode && (
                      <p className="text-error text-xs mt-1">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Notas (opcional)"
                    value={addressForm.notes}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    className="w-full h-12 px-4 rounded-xl border-2 border-outline/20 bg-surface focus:outline-none focus:border-primary transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </section>
            )}

            {/* Payment Method */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-outline/10">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 font-headline">
                <CreditCard className="w-5 h-5 text-primary" />
                Método de Pago
              </h2>
              {paymentMethods.length === 0 && !configLoading ? (
                <p className="text-on-surface-variant text-sm">
                  Los métodos de pago se configurarán próximamente. Coordiná el
                  pago con el vendedor.
                </p>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const { Icon, color } = paymentIcons[method.id] || {
                      Icon: CreditCard,
                      color: "text-primary",
                    };
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? "border-primary bg-primary/5"
                            : "border-outline/10 hover:border-outline/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={() => setSelectedPayment(method.id)}
                          className="accent-primary"
                          disabled={isLoading}
                        />
                        <Icon className={`w-5 h-5 ${color}`} />
                        <div className="flex-1">
                          <p className="font-bold">{method.name}</p>
                          <p className="text-on-surface-variant text-sm">
                            {method.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="md:col-span-2 mt-6 md:mt-0">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-outline/10 sticky top-24">
              <h2 className="text-lg font-bold mb-4 font-headline">
                Resumen del Pedido
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-background shrink-0">
                      {item.product.image && (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-outline/10 my-3" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Envío</span>
                  <span className="font-bold">
                    {shipping === 0 ? "A confirmar" : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-outline/10 my-3" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-extrabold">Total</span>
                <span className="text-2xl font-black text-primary">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Desktop Button */}
              <div className="hidden md:block mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || !isFormValid}
                  className="w-full h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirmar Pedido
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Desktop Footer */}
      <div className="hidden md:block mt-12">
        <Footer />
      </div>

      {/* Mobile Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-outline/10 md:hidden z-10">
        <button
          onClick={handleCheckout}
          disabled={isLoading || !isFormValid}
          className="w-full h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 text-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Confirmar Pedido
              <CheckCircle className="w-5 h-5" />
            </>
          )}
        </button>
        <div className="h-4" />
      </div>
    </div>
  );
}
