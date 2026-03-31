import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AppLocks,
  CreateUserInput,
  CreateVideoMetaInput,
  UserProfile,
  UserSettings,
  VideoMeta,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useCallerProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ["callerProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoMeta[]>({
    queryKey: ["allVideos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createUser(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useCreateVideoMeta() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateVideoMetaInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createVideoMeta(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allVideos"] });
    },
  });
}

export function useSaveAppLock() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appLocks: AppLocks) => {
      if (!actor || !identity) throw new Error("Not authenticated");
      return actor.saveAppLock(identity.getPrincipal(), appLocks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useSaveBasicSettings() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      if (!actor || !identity) throw new Error("Not authenticated");
      return actor.saveBasicSettings(identity.getPrincipal(), settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

// ── Subscription hooks ──────────────────────────────────────────────────────

export function useMySubscriptions() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Principal[]>({
    queryKey: ["mySubscriptions", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySubscriptions();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useIsSubscribed(creator: Principal | null) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<boolean>({
    queryKey: [
      "isSubscribed",
      creator?.toString(),
      identity?.getPrincipal().toString(),
    ],
    queryFn: async () => {
      if (!actor || !creator) return false;
      return actor.isSubscribed(creator);
    },
    enabled: !!actor && !isFetching && !!creator && !!identity,
  });
}

export function useSubscriberCount(creator: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["subscriberCount", creator?.toString()],
    queryFn: async () => {
      if (!actor || !creator) return 0n;
      return actor.getSubscriberCount(creator);
    },
    enabled: !!actor && !isFetching && !!creator,
  });
}

export function useSubscribeMutation() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (creator: Principal) => {
      if (!actor) throw new Error("Actor not available");
      return actor.subscribe(creator);
    },
    onSuccess: (_data, creator) => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["isSubscribed", creator.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriberCount", creator.toString()],
      });
      // Also invalidate with user context
      queryClient.invalidateQueries({
        queryKey: [
          "isSubscribed",
          creator.toString(),
          identity?.getPrincipal().toString(),
        ],
      });
    },
  });
}

export function useUnsubscribeMutation() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (creator: Principal) => {
      if (!actor) throw new Error("Actor not available");
      return actor.unsubscribe(creator);
    },
    onSuccess: (_data, creator) => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["isSubscribed", creator.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriberCount", creator.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "isSubscribed",
          creator.toString(),
          identity?.getPrincipal().toString(),
        ],
      });
    },
  });
}
