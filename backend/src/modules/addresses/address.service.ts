import { AddressRepository } from "./address.repository.js";
import type { Address } from "./address.types.js";
import type { CreateAddressDTO, UpdateAddressDTO } from "./address.dto.js";

export class AddressService {
  private addressRepo: AddressRepository;

  constructor(addressRepo?: AddressRepository) {
    this.addressRepo = addressRepo ?? new AddressRepository();
  }

  async getMyAddresses(userId: string): Promise<Address[]> {
    return await this.addressRepo.findByUserId(userId);
  }

  async createAddress(userId: string, data: CreateAddressDTO): Promise<Address> {
    if (data.isDefault) {
      await this.addressRepo.unsetDefaultForUser(userId);
    }
    return await this.addressRepo.create(userId, data);
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: UpdateAddressDTO,
  ): Promise<Address | null> {
    const existing = await this.addressRepo.findById(addressId);
    if (!existing) {
      return null;
    }
    if (existing.userId !== userId) {
      throw new Error("FORBIDDEN");
    }

    if (data.isDefault) {
      await this.addressRepo.unsetDefaultForUser(userId);
    }
    return await this.addressRepo.update(addressId, data);
  }

  async deleteAddress(userId: string, addressId: string): Promise<Address | null> {
    const existing = await this.addressRepo.findById(addressId);
    if (!existing) {
      return null;
    }
    if (existing.userId !== userId) {
      throw new Error("FORBIDDEN");
    }
    return await this.addressRepo.delete(addressId);
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<Address | null> {
    return this.addressRepo.setDefault(userId, addressId);
  }
}
