import { AddressDAO } from "./address.dao.js";
import type { Address } from "./address.types.js";
import type { CreateAddressDTO, UpdateAddressDTO } from "./address.dto.js";

export class AddressRepository {
  private addressDAO: AddressDAO;

  constructor(addressDAO?: AddressDAO) {
    this.addressDAO = addressDAO ?? new AddressDAO();
  }

  async findByUserId(userId: string): Promise<Address[]> {
    return await this.addressDAO.findByUserId(userId);
  }

  async findById(id: string): Promise<Address | null> {
    return await this.addressDAO.findById(id);
  }

  async create(userId: string, data: CreateAddressDTO): Promise<Address> {
    return await this.addressDAO.create(userId, data);
  }

  async update(id: string, data: UpdateAddressDTO): Promise<Address | null> {
    return await this.addressDAO.update(id, data);
  }

  async delete(id: string): Promise<Address | null> {
    return await this.addressDAO.delete(id);
  }

  async unsetDefaultForUser(userId: string): Promise<void> {
    await this.addressDAO.unsetDefaultForUser(userId);
  }

  async setDefault(userId: string, id: string): Promise<Address | null> {
    return this.addressDAO.setDefault(userId, id);
  }
}
