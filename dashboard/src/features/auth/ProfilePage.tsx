import { useEffect, useState, type FormEvent } from "react";
import { authService } from "./services/authService";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/features/users/types/user.types";

export function ProfilePage() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [profile, setProfile] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const me = await authService.getMe();
        if (cancelled) return;
        setProfile(me);
        setName(me.name);
        setPhone(me.phone ?? "");
      } catch {
        if (!cancelled) setError("Failed to load profile");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await authService.updateMe({
        name,
        phone: phone || undefined,
      });
      setProfile(updated);
      setAuth(updated, accessToken);
      setSuccess("Profile updated");
    } catch {
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading profile…</p>;
  }

  if (!profile) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">{error ?? "Profile unavailable"}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500">Update your account details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            value={profile.email}
            disabled
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
