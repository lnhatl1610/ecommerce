export interface CreateAddressDTO {
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
  isDefault?: boolean;
}

export interface UpdateAddressDTO {
  recipientName?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  detail?: string;
  isDefault?: boolean;
}
