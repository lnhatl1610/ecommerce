import { useEffect, useState, type FormEvent } from "react";
import { addressService } from "./services/addressService";
import type { Address } from "./types/address.types";

const emptyForm = {
  recipientName: "",
  phone: "",
  province: "",
  district: "",
  ward: "",
  detail: "",
  isDefault: false,
};

export function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await addressService.getMyAddresses();
      setAddresses(data);
    } catch {
      setError("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAddresses();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await addressService.createAddress(form);
      setForm(emptyForm);
      await loadAddresses();
    } catch {
      setError("Failed to create address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await addressService.deleteAddress(id);
      await loadAddresses();
    } catch {
      setError("Failed to delete address");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Address Book</h1>
        <p className="text-sm text-slate-500">Manage shipping addresses for your account.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 max-w-3xl">
        {(
          [
            ["recipientName", "Recipient name"],
            ["phone", "Phone"],
            ["province", "Province"],
            ["district", "District"],
            ["ward", "Ward"],
            ["detail", "Detail"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className={key === "detail" ? "md:col-span-2 space-y-1.5" : "space-y-1.5"}>
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <input
              required
              value={form[key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>
        ))}

        <label className="flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
          />
          Set as default address
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="md:col-span-2 w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isSaving ? "Adding…" : "Add address"}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-slate-900">Saved addresses</h2>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-slate-500">No addresses yet.</p>
        ) : (
          <ul className="space-y-3">
            {addresses.map((address) => (
              <li
                key={address.id}
                className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="text-sm text-slate-700">
                  <p className="font-medium text-slate-900">
                    {address.recipientName}
                    {address.isDefault && (
                      <span className="ml-2 rounded bg-slate-900 px-1.5 py-0.5 text-xs text-white">
                        Default
                      </span>
                    )}
                  </p>
                  <p>{address.phone}</p>
                  <p>
                    {address.detail}, {address.ward}, {address.district}, {address.province}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(address.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
