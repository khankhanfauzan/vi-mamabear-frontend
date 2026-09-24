import { fireEvent, render, screen } from "@testing-library/react";
import { AddressForm } from "./CreateAddressForm";

jest.mock("../../hooks/useCreateAddressForm", () => ({
  useAddressForm: () => {
    const { useForm } = jest.requireActual("react-hook-form");
    const form = useForm();
    return {
      register: form.register,
      handleSubmit: form.handleSubmit,
      onSubmit: jest.fn(),
      errors: form.formState.errors,
      isSubmitting: false,
      dropdowns: {
        provinces: [],
        cities: [],
        districts: [],
        subdistricts: [],
      },
      loaders: {
        isLoadingProvinces: false,
        isLoadingCities: false,
        isLoadingDistricts: false,
        isLoadingSubdistricts: false,
      },
      successMessage: null,
    };
  },
}));

it("cleans the phone input and shows an error for an invalid starting digit", () => {
  render(<AddressForm />);
  const phone = screen.getByPlaceholderText("123456789");

  fireEvent.change(phone, { target: { value: "3" } });
  expect(phone).toHaveValue("");
  expect(screen.getByText("Nomor HP tidak valid")).toBeInTheDocument();

  fireEvent.change(phone, { target: { value: "081234567890" } });
  expect(phone).toHaveValue("81234567890");
  expect(screen.queryByText("Nomor HP tidak valid")).not.toBeInTheDocument();
});
