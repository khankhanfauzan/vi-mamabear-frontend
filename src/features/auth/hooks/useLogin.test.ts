import { renderHook, act } from "@testing-library/react";
import { useLogin } from "./useLogin";
import { signIn, getSession } from "next-auth/react";

const pushMock = jest.fn();
const refreshMock = jest.fn();
let searchParamsValue = "";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
  useSearchParams: () => new URLSearchParams(searchParamsValue),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
}));

describe("useLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    searchParamsValue = "";
  });

  it("sets a server error and stops loading when credentials are invalid", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: "CredentialsSignin" });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({
        email: "wrong@test.com",
        password: "wrongpass",
        remember: false,
      });
    });

    expect(result.current.serverError).toBe("Email atau password salah.");
    expect(result.current.loading).toBe(false);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("redirects a regular USER to the callback url on successful login", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    (getSession as jest.Mock).mockResolvedValue({
      user: { role: "USER" },
    });
    searchParamsValue = "callbackUrl=/account";

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({
        email: "user@test.com",
        password: "password",
        remember: true,
      });
    });

    expect(pushMock).toHaveBeenCalledWith("/account");
    expect(refreshMock).toHaveBeenCalled();
    expect(result.current.serverError).toBeNull();
  });

  it("redirects to the admin dashboard when the user role is ADMIN", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    (getSession as jest.Mock).mockResolvedValue({
      user: { role: "ADMIN" },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({
        email: "admin@test.com",
        password: "password",
        remember: false,
      });
    });

    expect(pushMock).toHaveBeenCalledWith("/admin/dashboard");
  });

  it("defaults the callback url to / when none is provided", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    (getSession as jest.Mock).mockResolvedValue({ user: { role: "USER" } });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({
        email: "user@test.com",
        password: "password",
        remember: false,
      });
    });

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
