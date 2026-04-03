"use client";

import { gql } from "@apollo/client/core";
import { useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";

// ============================================================================
// Types
// ============================================================================

interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dni?: string;
}

interface CheckoutAddress {
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface ShippingMethodOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface CheckoutConfig {
  paymentMethods: PaymentMethodOption[];
  shippingMethods: ShippingMethodOption[];
  contact?: {
    whatsappNumber?: string;
    contactPhone?: string;
  };
}

interface CheckoutSessionResponse {
  orderId: string;
  orderNumber: string;
  provider: string;
  preferenceId?: string;
  initPoint?: string;
  publicKey?: string;
  transferInfo?: {
    bankName?: string;
    accountHolder?: string;
    cbu?: string;
    alias?: string;
    cuit?: string;
  };
  amount: number;
}

interface CreateOrderResponse {
  createOrder: {
    id: string;
    orderNumber: string;
    status: string;
    subtotal: string;
    discount: string;
    shippingCost: string;
    total: string;
    paymentStatus?: string;
    shippingType?: string;
  };
}

// ============================================================================
// GraphQL Operations
// ============================================================================

const CHECKOUT_CONFIG_QUERY = gql`
  query CheckoutConfig {
    checkoutConfig {
      paymentMethods {
        id
        name
        description
        enabled
      }
      shippingMethods {
        id
        name
        description
        enabled
      }
      contact {
        whatsappNumber
        contactPhone
      }
    }
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNumber
      status
      subtotal
      discount
      shippingCost
      total
      paymentStatus
      shippingType
    }
  }
`;

const GET_CHECKOUT_SESSION_MUTATION = gql`
  mutation GetCheckoutSession($orderId: ID!, $provider: PaymentProvider!) {
    getCheckoutSession(orderId: $orderId, provider: $provider) {
      orderId
      orderNumber
      provider
      preferenceId
      initPoint
      publicKey
      transferInfo
      amount
    }
  }
`;

// ============================================================================
// Hooks
// ============================================================================

export function useCheckoutConfig() {
  const { data, loading, error, refetch } = useQuery<{
    checkoutConfig: CheckoutConfig;
  }>(CHECKOUT_CONFIG_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  return {
    config: data?.checkoutConfig,
    paymentMethods:
      data?.checkoutConfig?.paymentMethods?.filter((m) => m.enabled) || [],
    shippingMethods:
      data?.checkoutConfig?.shippingMethods?.filter((m) => m.enabled) || [],
    contact: data?.checkoutConfig?.contact || null,
    loading,
    error,
    refetch,
  };
}

export function useCreateOrder() {
  const [createOrderMutation, { loading, error, data }] = useMutation<
    CreateOrderResponse,
    {
      input: {
        customer: CheckoutCustomer;
        shippingAddress: CheckoutAddress;
        shipping: { type: string };
        couponCode?: string;
      };
    }
  >(CREATE_ORDER_MUTATION);

  const createOrder = async (input: {
    customer: CheckoutCustomer;
    shippingAddress: CheckoutAddress;
    shipping: { type: string };
    couponCode?: string;
  }) => {
    try {
      const result = await createOrderMutation({
        variables: { input },
        refetchQueries: ["Cart"],
      });
      return result.data?.createOrder;
    } catch (err) {
      toast.error("Error al crear la orden");
      throw err;
    }
  };

  return {
    createOrder,
    loading,
    error,
    order: data?.createOrder,
  };
}

export function useCreatePayment() {
  const [createPaymentMutation, { loading, error, data }] = useMutation<
    { getCheckoutSession: CheckoutSessionResponse },
    { orderId: string; provider: string }
  >(GET_CHECKOUT_SESSION_MUTATION);

  const createPayment = async (orderId: string, provider: string) => {
    try {
      const result = await createPaymentMutation({
        variables: { orderId, provider },
      });
      return result.data?.getCheckoutSession;
    } catch (err) {
      toast.error("Error al procesar el pago");
      throw err;
    }
  };

  return {
    createPayment,
    loading,
    error,
    payment: data?.getCheckoutSession,
  };
}
