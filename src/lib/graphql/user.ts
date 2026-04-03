"use client";

import { gql } from "@apollo/client/core";
import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";

// ============================================================================
// Types
// ============================================================================

interface SyncUserData {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dni?: string;
  role: string;
}

// ============================================================================
// Mutations
// ============================================================================

const SYNC_USER_MUTATION = gql`
  mutation SyncUser($name: String) {
    syncUser(name: $name) {
      id
      email
      name
      firstName
      lastName
      phone
      dni
      role
    }
  }
`;

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      name
      firstName
      lastName
      phone
      dni
    }
  }
`;

const CREATE_ADDRESS_MUTATION = gql`
  mutation CreateAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      id
      street
      number
      floor
      apartment
      city
      province
      postalCode
    }
  }
`;

// ============================================================================
// Hooks
// ============================================================================

export function useSyncUser() {
  const [syncUserMutation] = useMutation<
    { syncUser: SyncUserData },
    { name?: string }
  >(SYNC_USER_MUTATION);

  const syncUser = useCallback(
    async (name?: string): Promise<SyncUserData | null> => {
      try {
        const result = await syncUserMutation({ variables: { name } });
        return result.data?.syncUser ?? null;
      } catch (error) {
        console.error("[useSyncUser] Error:", error);
        return null;
      }
    },
    [syncUserMutation],
  );

  return { syncUser };
}

export function useUpdateProfile() {
  const [mutate, { loading }] = useMutation<{ updateProfile: unknown }>(
    UPDATE_PROFILE_MUTATION,
  );

  const updateProfile = useCallback(
    async (input: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      dni?: string;
    }) => {
      const result = await mutate({ variables: { input } });
      return result.data?.updateProfile ?? null;
    },
    [mutate],
  );

  return { updateProfile, loading };
}

export function useCreateAddress() {
  const [mutate, { loading }] = useMutation<{ createAddress: unknown }>(
    CREATE_ADDRESS_MUTATION,
  );

  const createAddress = useCallback(
    async (input: {
      street: string;
      number: string;
      floor?: string;
      apartment?: string;
      city: string;
      province: string;
      postalCode: string;
    }) => {
      const result = await mutate({ variables: { input } });
      return result.data?.createAddress ?? null;
    },
    [mutate],
  );

  return { createAddress, loading };
}
