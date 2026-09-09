import type { Request, Response } from "express";
import { AddressService } from "./address.service.js";
import type { CreateAddressDTO, UpdateAddressDTO } from "./address.dto.js";
import { sendSuccess, sendError } from "../../lib/response.js";

export class AddressController {
  private addressService: AddressService;

  constructor(addressService?: AddressService) {
    this.addressService = addressService ?? new AddressService();
  }

  getMyAddresses = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendError(res, "Authentication required", 401);
      }
      const addresses = await this.addressService.getMyAddresses(req.user.userId);
      return sendSuccess(res, addresses, "Addresses fetched successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch addresses";
      return sendError(res, "Failed to fetch addresses", 500, message);
    }
  };

  createAddress = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendError(res, "Authentication required", 401);
      }
      const data: CreateAddressDTO = req.body;
      const address = await this.addressService.createAddress(req.user.userId, data);
      return sendSuccess(res, address, "Address created successfully", 201);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create address";
      return sendError(res, "Failed to create address", 500, message);
    }
  };

  updateAddress = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendError(res, "Authentication required", 401);
      }
      const id = req.params.id as string;
      const data: UpdateAddressDTO = req.body;

      const address = await this.addressService.updateAddress(req.user.userId, id, data);
      if (!address) {
        return sendError(res, "Address not found", 404);
      }
      return sendSuccess(res, address, "Address updated successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update address";
      if (message === "FORBIDDEN") {
        return sendError(res, "You do not own this address", 403);
      }
      return sendError(res, "Failed to update address", 500, message);
    }
  };

  deleteAddress = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendError(res, "Authentication required", 401);
      }
      const id = req.params.id as string;
      const address = await this.addressService.deleteAddress(req.user.userId, id);
      if (!address) {
        return sendError(res, "Address not found", 404);
      }
      return sendSuccess(res, null, "Address deleted successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete address";
      if (message === "FORBIDDEN") {
        return sendError(res, "You do not own this address", 403);
      }
      return sendError(res, "Failed to delete address", 500, message);
    }
  };

  setDefaultAddress = async (req: Request, res: Response) => {
    try {
      if (!req.user) return sendError(res, "Authentication required", 401);
      const address = await this.addressService.setDefaultAddress(req.user.userId, req.params.id as string);
      return address ? sendSuccess(res, address, "Default address updated") : sendError(res, "Address not found", 404);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update default address";
      return sendError(res, message, 500);
    }
  };
}
