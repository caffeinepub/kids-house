import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
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
    userRole : { #admin; #user; #guest };
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

  type OldActor = {
    userStore : Map.Map<Principal, UserProfile>;
    videoStore : Map.Map<Text, VideoMeta>;
  };

  type NewActor = {
    userStore : Map.Map<Principal, UserProfile>;
    videoStore : Map.Map<Text, VideoMeta>;
    subscriptionsStore : Map.Map<Principal, [Principal]>;
  };

  public func run(old : OldActor) : NewActor {
    {
      userStore = old.userStore;
      videoStore = old.videoStore;
      subscriptionsStore = Map.empty<Principal, [Principal]>();
    };
  };
};
