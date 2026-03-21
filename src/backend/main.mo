import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Mixins
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type PinSettings = {
    userPIN : Text;
    parentalPIN : Text;
  };

  type AppLockState = {
    isLocked : Bool;
  };

  type AppLocks = {
    instagram : AppLockState;
    youtube : AppLockState;
    tiktok : AppLockState;
    facebook : AppLockState;
  };

  type UserSettings = {
    pinSettings : PinSettings;
    appLocks : AppLocks;
    userRole : AccessControl.UserRole;
    sharedWith : [Principal];
  };

  type UserProfile = {
    username : Text;
    email : Text;
    settings : UserSettings;
  };

  type VideoMeta = {
    id : Text;
    title : Text;
    uploader : Principal;
    blob : Storage.ExternalBlob;
    timestamp : Int;
  };

  module VideoMeta {
    public func compare(video1 : VideoMeta, video2 : VideoMeta) : Order.Order {
      Text.compare(video1.id, video2.id);
    };

    public func compareByTimestamp(video1 : VideoMeta, video2 : VideoMeta) : Order.Order {
      Int.compare(video1.timestamp, video2.timestamp);
    };
  };

  type ProfileView = {
    username : Text;
    email : Text;
    settings : ?UserSettings;
  };

  type CreateUserInput = {
    username : Text;
    email : Text;
    password : Text;
    pinSettings : PinSettings;
  };

  type CreateVideoMetaInput = {
    title : Text;
    blob : Storage.ExternalBlob;
  };

  // Stores
  let userStore = Map.empty<Principal, UserProfile>();
  let videoStore = Map.empty<Text, VideoMeta>();

  public query ({ caller }) func isUserExists(user : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check user existence");
    };
    userStore.containsKey(user);
  };

  public query ({ caller }) func getCallerProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userStore.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userStore.get(user);
  };

  public shared ({ caller }) func createUser(createUserInput : CreateUserInput) : async ProfileView {
    {
      username = createUserInput.username;
      email = createUserInput.email;
      settings = ?{
        pinSettings = createUserInput.pinSettings;
        appLocks = {
          instagram = { isLocked = true };
          youtube = { isLocked = true };
          tiktok = { isLocked = true };
          facebook = { isLocked = true };
        };
        userRole = #user;
        sharedWith = [];
      };
    };
  };

  public shared ({ caller }) func saveBasicSettings(user : Principal, settings : UserSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save settings");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only modify your own settings");
    };

    let currentUser = switch (userStore.get(user)) {
      case (?currentUser) { currentUser };
      case (null) {
        Runtime.trap("User not found");
      };
    };

    let newUser : UserProfile = {
      username = currentUser.username;
      email = currentUser.email;
      settings;
    };
    userStore.add(user, newUser);
  };

  public shared ({ caller }) func saveAppLock(user : Principal, settings : AppLocks) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save app locks");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only modify your own app locks");
    };

    let currentUser = switch (userStore.get(user)) {
      case (?currentUser) { currentUser };
      case (null) {
        Runtime.trap("User not found");
      };
    };

    let newSettings : UserSettings = {
      pinSettings = currentUser.settings.pinSettings;
      appLocks = settings;
      userRole = currentUser.settings.userRole;
      sharedWith = currentUser.settings.sharedWith;
    };

    let newUser : UserProfile = {
      username = currentUser.username;
      email = currentUser.email;
      settings = newSettings;
    };
    userStore.add(user, newUser);
  };

  public shared ({ caller }) func createVideoMeta(input : CreateVideoMetaInput) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload videos");
    };

    let id = input.title.concat(caller.toText());
    let videoMeta : VideoMeta = {
      id;
      title = input.title;
      uploader = caller;
      blob = input.blob;
      timestamp = Time.now();
    };

    videoStore.add(id, videoMeta);
    id;
  };

  public query ({ caller }) func getAllVideos() : async [VideoMeta] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view videos");
    };
    videoStore.values().toArray().sort(VideoMeta.compareByTimestamp);
  };

  public shared ({ caller }) func deleteVideoMeta(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete videos");
    };

    switch (videoStore.get(id)) {
      case (null) { false };
      case (?videoMeta) {
        if (videoMeta.uploader != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own videos");
        };
        videoStore.remove(id);
        true;
      };
    };
  };
};
