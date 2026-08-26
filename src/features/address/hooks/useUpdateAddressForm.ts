import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  getProvinces,
  getCities,
  getDistricts,
  getSubdistricts,
} from "../services/shippingService";
import { updateAddress, deleteAddress } from "../services/addressService";
import { Region, Subdistrict } from "../types/shipping.types";
import { Address, AddressFormData } from "../types/address.types";

export function useUpdateAddressForm(initialAddress: Address) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    defaultValues: {
      name: initialAddress.name,
      phoneNumber: initialAddress.phone.replace("+62", ""),
      provinceId: initialAddress.provinceId.toString(),
      cityId: initialAddress.cityId.toString(),
      districtId: initialAddress.districtId.toString(),
      subdistrictId: initialAddress.subdistrictId.toString(),
      zipCode: initialAddress.postalCode,
      street: initialAddress.road,
      details: initialAddress.detail || "",
      label: initialAddress.usedFor,
    },
  });

  // Options State
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);

  // Loading States
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingSubdistricts, setIsLoadingSubdistricts] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Watching cascades
  const selectedProvinceId = watch("provinceId");
  const selectedCityId = watch("cityId");
  const selectedDistrictId = watch("districtId");
  const selectedSubdistrictId = watch("subdistrictId");

  // 1. Initial Load: Fetch options corresponding to existing address details
  useEffect(() => {
    let isMounted = true;

    const loadInitialCascades = async () => {
      setIsLoadingOptions(true);
      try {
        const provs = await getProvinces();
        if (!isMounted) return;
        setProvinces(provs);

        // Chain load cities, districts, and subdistricts based on initialAddress values
        const [cts, dts, subs] = await Promise.all([
          getCities(initialAddress.provinceId),
          getDistricts(initialAddress.cityId),
          getSubdistricts(initialAddress.districtId),
        ]);

        if (isMounted) {
          setCities(cts);
          setDistricts(dts);
          setSubdistricts(subs);
        }
      } catch (error) {
        console.error("Gagal memuat data wilayah awal:", error);
      } finally {
        if (isMounted) setIsLoadingOptions(false);
      }
    };

    loadInitialCascades();
    return () => {
      isMounted = false;
    };
  }, [initialAddress]);

  // 2. Cascade Handler: Province change
  useEffect(() => {
    let isMounted = true;
    if (isLoadingOptions || !selectedProvinceId) return;

    // Reset downstream if the province selection changes dynamically from its loaded state
    if (
      selectedProvinceId !== initialAddress.provinceId.toString() &&
      cities.length > 0
    ) {
      resetField("cityId");
      resetField("districtId");
      resetField("subdistrictId");
      resetField("zipCode");
      setCities([]);
      setDistricts([]);
      setSubdistricts([]);
    }

    const fetchNewCities = async () => {
      setIsLoadingCities(true);
      try {
        const data = await getCities(parseInt(selectedProvinceId, 10));
        if (isMounted) setCities(data);
      } catch (error) {
        console.error("Gagal memuat kota:", error);
      } finally {
        if (isMounted) setIsLoadingCities(false);
      }
    };

    fetchNewCities();
    return () => {
      isMounted = false;
    };
  }, [
    selectedProvinceId,
    isLoadingOptions,
    initialAddress.provinceId,
    resetField,
  ]);

  // 3. Cascade Handler: City change
  useEffect(() => {
    let isMounted = true;
    if (isLoadingOptions || !selectedCityId) return;

    if (
      selectedCityId !== initialAddress.cityId.toString() &&
      districts.length > 0
    ) {
      resetField("districtId");
      resetField("subdistrictId");
      resetField("zipCode");
      setDistricts([]);
      setSubdistricts([]);
    }

    const fetchNewDistricts = async () => {
      setIsLoadingDistricts(true);
      try {
        const data = await getDistricts(parseInt(selectedCityId, 10));
        if (isMounted) setDistricts(data);
      } catch (error) {
        console.error("Gagal memuat kecamatan:", error);
      } finally {
        if (isMounted) setIsLoadingDistricts(false);
      }
    };

    fetchNewDistricts();
    return () => {
      isMounted = false;
    };
  }, [selectedCityId, isLoadingOptions, initialAddress.cityId, resetField]);

  // 4. Cascade Handler: District change
  useEffect(() => {
    let isMounted = true;
    if (isLoadingOptions || !selectedDistrictId) return;

    if (
      selectedDistrictId !== initialAddress.districtId.toString() &&
      subdistricts.length > 0
    ) {
      resetField("subdistrictId");
      resetField("zipCode");
      setSubdistricts([]);
    }

    const fetchNewSubdistricts = async () => {
      setIsLoadingSubdistricts(true);
      try {
        const data = await getSubdistricts(parseInt(selectedDistrictId, 10));
        if (isMounted) setSubdistricts(data);
      } catch (error) {
        console.error("Gagal memuat kelurahan:", error);
      } finally {
        if (isMounted) setIsLoadingSubdistricts(false);
      }
    };

    fetchNewSubdistricts();
    return () => {
      isMounted = false;
    };
  }, [
    selectedDistrictId,
    isLoadingOptions,
    initialAddress.districtId,
    resetField,
  ]);

  // 5. Postal Code Sync
  useEffect(() => {
    if (!selectedSubdistrictId || subdistricts.length === 0) return;

    const matchedSub = subdistricts.find(
      (sub) => sub.id.toString() === selectedSubdistrictId,
    );

    if (matchedSub && matchedSub.zip_code) {
      setValue("zipCode", matchedSub.zip_code);
    }
  }, [selectedSubdistrictId, subdistricts, setValue]);

  // Submit Handler
  const onSubmit = async (data: AddressFormData) => {
    try {
      const provinceName =
        provinces.find((p) => p.id.toString() === data.provinceId)?.name || "";
      const cityName =
        cities.find((c) => c.id.toString() === data.cityId)?.name || "";
      const districtName =
        districts.find((d) => d.id.toString() === data.districtId)?.name || "";
      const subdistrictName =
        subdistricts.find((s) => s.id.toString() === data.subdistrictId)
          ?.name || "";

      // Append address information like Prisma completeAddress property expects
      const completeAddress = `${data.street}, ${subdistrictName}, ${districtName}, ${cityName}, ${provinceName} ${data.zipCode}`;

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
        detail: data.details,
        usedFor: data.label,
        completeAddress,
      };

      await updateAddress(initialAddress.id, payload);
      setFeedbackMessage({
        type: "success",
        text: "Alamat berhasil diperbarui!",
      });

      setTimeout(() => {
        router.push("/account/addresses");
        router.refresh();
      }, 1500);
    } catch (error: unknown) {
      console.error("Gagal memperbarui alamat:", error);
      const errMsg =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan sistem saat memperbarui alamat.";
      setFeedbackMessage({ type: "error", text: errMsg });
    }
  };

  // Delete Action Handler
  const handleDelete = async () => {
    setIsDeleting(true);
    setFeedbackMessage(null);
    try {
      await deleteAddress(initialAddress.id);
      setIsDeleteModalOpen(false);
      setFeedbackMessage({ type: "success", text: "Alamat berhasil dihapus!" });

      setTimeout(() => {
        router.push("/account/addresses");
        router.refresh();
      }, 1500);
    } catch (error: unknown) {
      console.error("Gagal menghapus alamat:", error);
      const errMsg =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan sistem saat menghapus alamat.";
      setFeedbackMessage({ type: "error", text: errMsg });
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    isDeleting,
    options: { provinces, cities, districts, subdistricts },
    loaders: {
      isLoadingOptions,
      isLoadingCities,
      isLoadingDistricts,
      isLoadingSubdistricts,
    },
    modal: { isDeleteModalOpen, setIsDeleteModalOpen, handleDelete },
    feedbackMessage,
  };
}
