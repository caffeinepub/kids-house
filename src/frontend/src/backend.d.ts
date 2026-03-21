import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface AppLocks {
    tiktok: AppLockState;
    instagram: AppLockState;
    facebook: AppLockState;
    youtube: AppLockState;
}
export interface AppLockState {
    isLocked: boolean;
}
export interface VideoMeta {
    id: string;
    title: string;
    blob: ExternalBlob;
    timestamp: bigint;
    uploader: Principal;
}
export interface PinSettings {
    parentalPIN: string;
    userPIN: string;
}
export interface CreateUserInput {
    username: string;
    pinSettings: PinSettings;
    password: string;
    email: string;
}
export interface ProfileView {
    username: string;
    email: string;
    settings?: UserSettings;
}
export interface CreateVideoMetaInput {
    title: string;
    blob: ExternalBlob;
}
export interface UserSettings {
    userRole: UserRole;
    pinSettings: PinSettings;
    sharedWith: Array<Principal>;
    appLocks: AppLocks;
}
export interface UserProfile {
    username: string;
    email: string;
    settings: UserSettings;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createUser(createUserInput: CreateUserInput): Promise<ProfileView>;
    createVideoMeta(input: CreateVideoMetaInput): Promise<string>;
    deleteVideoMeta(id: string): Promise<boolean>;
    getAllVideos(): Promise<Array<VideoMeta>>;
    getCallerProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isUserExists(user: Principal): Promise<boolean>;
    saveAppLock(user: Principal, settings: AppLocks): Promise<void>;
    saveBasicSettings(user: Principal, settings: UserSettings): Promise<void>;
}
