import { fireEvent, render, screen } from "@testing-library/react";
import { RegisterForm } from "./RegisterForm";

jest.mock("@/features/auth/hooks/useRegister", () => ({
  useRegister: () => ({
    loading: false,
    error: null,
    isSubmitted: false,
    handleRegister: jest.fn(),
  }),
}));

jest.mock("@/features/auth/components/SocialLogins", () => ({
  SocialLogins: () => null,
}));

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

it("cleans the phone input and shows an error for an invalid starting digit", () => {
  render(<RegisterForm />);
  const phone = screen.getByPlaceholderText("81234567890");

  fireEvent.change(phone, { target: { value: "3" } });
  expect(phone).toHaveValue("");
  expect(screen.getByText("Nomor HP tidak valid")).toBeInTheDocument();

  fireEvent.change(phone, { target: { value: "081234567890" } });
  expect(phone).toHaveValue("81234567890");
  expect(screen.queryByText("Nomor HP tidak valid")).not.toBeInTheDocument();
});
