"use client";

import { useEffect, useState } from "react";
import {
  Camera,
  Loader2,
  Save,
  UserRound,
  ShieldCheck,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { useSession, authClient } from "@/lib/auth-client";
import { uploadMenuItemImage } from "@/lib/api/vendor/add-menu-api";
import { getMyProfile } from "@/lib/api/profile";

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  role: string;
  subscriptionPlan: string;
  emailVerified?: boolean;
}

const ProfilePage = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch actual user information from MongoDB.
  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();

      setProfile(data);
      setName(data.name || "");
      setImageUrl(data.image || "");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load profile.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else if (!isPending) {
      setProfileLoading(false);
    }
  }, [user, isPending]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to update your profile.");
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = profile?.image || "";
      const newImageUrl = imageUrl.trim();
      const oldImageUrl = profile?.image || "";

      // Upload changed image to ImgBB.
      if (newImageUrl !== oldImageUrl && newImageUrl) {
        let parsedUrl: URL;

        try {
          parsedUrl = new URL(newImageUrl);
        } catch {
          throw new Error("Please enter a valid image URL.");
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Image URL must use HTTP or HTTPS.");
        }

        finalImageUrl = await uploadMenuItemImage(newImageUrl);
      }

      // Update only editable fields.
      const result = await authClient.updateUser({
        name: name.trim(),
        ...(newImageUrl !== oldImageUrl
          ? { image: finalImageUrl || null }
          : {}),
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to update profile.");
      }

      // Refresh actual database profile.
      await fetchProfile();

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending || profileLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  const subscriptionPlan = profile?.subscriptionPlan || "free";
  const role = profile?.role || "customer";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Profile Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and profile picture.
        </p>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-7">
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4 border-b border-border pb-6 sm:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-10 w-10 text-muted-foreground" />
            )}
          </div>

          <div className="w-full flex-1">
            <h2 className="text-center font-semibold text-foreground sm:text-left">
              Profile Picture
            </h2>

            <p className="mt-1 text-center text-xs text-muted-foreground sm:text-left">
              Enter an image URL. A changed image will be uploaded to ImgBB
              before saving.
            </p>

            <div className="relative mt-3">
              <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/profile.jpg"
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="profileName"
            className="text-sm font-medium text-foreground">
            Full Name
          </label>

          <input
            id="profileName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="profileEmail"
            className="text-sm font-medium text-foreground">
            Email Address
          </label>

          <input
            id="profileEmail"
            type="email"
            value={profile?.email || user.email || ""}
            disabled
            className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-muted px-3 text-sm text-muted-foreground"
          />
        </div>

        {/* Role and Subscription */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="profileRole"
              className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              Account Role
            </label>

            <input
              id="profileRole"
              value={role}
              disabled
              className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-muted px-3 text-sm capitalize text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profilePlan"
              className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Crown className="h-4 w-4 text-muted-foreground" />
              Subscription Plan
            </label>

            <input
              id="profilePlan"
              value={subscriptionPlan}
              disabled
              className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-muted px-3 text-sm capitalize text-muted-foreground"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end border-t border-border pt-5">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
