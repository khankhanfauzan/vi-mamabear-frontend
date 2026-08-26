import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  getProvinces,
  getCities,
  getDistricts,
  getSubdistricts,
} from "../services/shippingService";
import { createAddress } from "../services/addressService";
import { Region, Subdistrict } from "../types/shipping.types";
import { AddressFormData, Address } from "../types/address.types";

export function useAddressForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>();

  // State for dropdown options
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);

  // Loading states
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingSubdistricts, setIsLoadingSubdistricts] = useState(false);

  // Messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Watch selected IDs to trigger cascading fetches
  const selectedProvinceId = watch("provinceId");
  const selectedCityId = watch("cityId");
  const selectedDistrictId = watch("districtId");
  const selectedSubdistrictId = watch("subdistrictId");

  // 1. Fetch Provinces on Mount
  useEffect(() => {
    let isMounted = true;
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const data = await getProvinces();
        if (isMounted) setProvinces(data);
      } catch (error) {
        console.error("Failed to load provinces", error);
      } finally {
        if (isMounted) setIsLoadingProvinces(false);
      }
    };
    fetchProvinces();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Cities when Province changes
  useEffect(() => {
    let isMounted = true;
    if (!selectedProvinceId) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        resetField("cityId");
        resetField("districtId");
        resetField("subdistrictId");
        resetField("zipCode");

        const data = await getCities(parseInt(selectedProvinceId, 10));
        if (isMounted) setCities(data);
      } catch (error) {
        console.error("Failed to load cities", error);
      } finally {
        if (isMounted) setIsLoadingCities(false);
      }
    };
    fetchCities();
    return () => {
      isMounted = false;
    };
  }, [selectedProvinceId, resetField]);

  // 3. Fetch Districts when City changes
  useEffect(() => {
    let isMounted = true;
    if (!selectedCityId) {
      setDistricts([]);
      return;
    }
    const fetchDistricts = async () => {
      setIsLoadingDistricts(true);
      try {
        resetField("districtId");
        resetField("subdistrictId");
        resetField("zipCode");

        const data = await getDistricts(parseInt(selectedCityId, 10));
        if (isMounted) setDistricts(data);
      } catch (error) {
        console.error("Failed to load districts", error);
      } finally {
        if (isMounted) setIsLoadingDistricts(false);
      }
    };
    fetchDistricts();
    return () => {
      isMounted = false;
    };
  }, [selectedCityId, resetField]);

  // 4. Fetch Subdistricts when District changes
  useEffect(() => {
    let isMounted = true;
    if (!selectedDistrictId) {
      setSubdistricts([]);
      return;
    }
    const fetchSubdistricts = async () => {
      setIsLoadingSubdistricts(true);
      try {
        resetField("subdistrictId");
        resetField("zipCode");

        const data = await getSubdistricts(parseInt(selectedDistrictId, 10));
        if (isMounted) setSubdistricts(data);
      } catch (error) {
        console.error("Failed to load subdistricts", error);
      } finally {
        if (isMounted) setIsLoadingSubdistricts(false);
      }
    };
    fetchSubdistricts();
    return () => {
      isMounted = false;
    };
  }, [selectedDistrictId, resetField]);

  // 5. Auto-fill Zip Code when Subdistrict changes
  useEffect(() => {
    if (!selectedSubdistrictId || subdistricts.length === 0) return;

    const selectedSub = subdistricts.find(
      (sub) => sub.id.toString() === selectedSubdistrictId,
    );

    if (selectedSub && selectedSub.zip_code) {
      setValue("zipCode", selectedSub.zip_code);
    }
  }, [selectedSubdistrictId, subdistricts, setValue]);

  // Handle Form Submission with Real API
  const onSubmit = async (data: AddressFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Resolve full names for the Prisma Schema mapping
      const provinceName =
        provinces.find((p) => p.id.toString() === data.provinceId)?.name || "";
      const cityName =
        cities.find((c) => c.id.toString() === data.cityId)?.name || "";
      const districtName =
        districts.find((d) => d.id.toString() === data.districtId)?.name || "";
      const subdistrictName =
        subdistricts.find((s) => s.id.toString() === data.subdistrictId)
          ?.name || "";

      // Format complete address string based on inputs
      const detailStr = data.details ? `(${data.details}), ` : "";
      const completeAddress = `${data.street}, ${detailStr}Kec. ${districtName}, Kel. ${subdistrictName}, ${cityName}, ${provinceName} ${data.zipCode}`;

      // Map the form data EXACTLY to the Partial<Address> Prisma Schema
      const payload: Partial<Address> = {
        name: data.name,
        phone: `+62${data.phoneNumber}`,
        provinceId: parseInt(data.provinceId, 10),
        provinceName,
        cityId: parseInt(data.cityId, 10),
        cityName,
        districtId: parseInt(data.districtId, 10),
        districtName,
        subdistrictId: parseInt(data.subdistrictId, 10),
        subdistrictName,
        postalCode: data.zipCode,
        road: data.street,
        detail: data.details || "",
        usedFor: data.label,
        completeAddress,
      };

      await createAddress(payload);

      setSuccessMessage("Alamat berhasil disimpan!");

      // Redirect back to the account address list after a brief delay so user sees the success state
      setTimeout(() => {
        router.push("/account/addresses");
        router.refresh(); // Tell Next.js to re-fetch Server Components for the new data
      }, 1500);
    } catch (error) {
      console.error("Failed to save address:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan alamat.";
      setErrorMessage(message);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    dropdowns: {
      provinces,
      cities,
      districts,
      subdistricts,
    },
    loaders: {
      isLoadingProvinces,
      isLoadingCities,
      isLoadingDistricts,
      isLoadingSubdistricts,
    },
    successMessage,
    errorMessage, // Exposing error message for UI if you want to display it
  };
}
