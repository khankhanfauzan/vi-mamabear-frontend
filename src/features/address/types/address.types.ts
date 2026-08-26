/**
 * Defines the structure of the address form data.
 * Used by React Hook Form.
 */
export interface AddressFormData {
  name: string;
  phoneNumber: string; // The user's input (without the +62 prefix)
  provinceId: string;
  cityId: string;
  districtId: string;
  subdistrictId: string;
  zipCode: string;
  street: string;
  details: string;
  label: string; // e.g., "Kantor", "Rumah"
}

export interface Address {
  id: number; // Kept as number because BE returns address ID as number
  userId: string;
  name: string;
  phone: string;

  // Information and validation coming from Raja Ongkir API
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  districtId: number;
  districtName: string;
  subdistrictId: number; // Used for shipping cost calculation
  subdistrictName: string;
  postalCode: string; // Included in subdistrict validation response

  // Other information, no validation, user's responsibility
  road: string; // Jalan, no rumah etc.
  completeAddress: string; // Append all address information
  detail?: string; // Sebelah rumah pak RT (Optional)
  usedFor: string; // Kantor, Rumah (Label)
}