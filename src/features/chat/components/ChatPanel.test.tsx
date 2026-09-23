import { render, screen } from "@testing-library/react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useChatSession } from "../hooks/useChatSession";
import { ChatPanel } from "./ChatPanel";

jest.mock("@/features/auth/hooks/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("../hooks/useChatSession", () => ({
  MAX_MESSAGE_LENGTH: 1000,
  useChatSession: jest.fn(),
}));
jest.mock("./ChatMessageList", () => ({ ChatMessageList: () => null }));

const mockUseAuth = useAuth as jest.Mock;
const mockUseChatSession = useChatSession as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

it("shows login and registration links without mounting chat for guests", () => {
  mockUseAuth.mockReturnValue({ isLoggedIn: false, isLoading: false });

  render(<ChatPanel />);

  expect(
    screen.getByText(
      "Halo Ma! Yuk login atau daftar dulu untuk mulai berkonsultasi dengan Mama Bear AI.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
    "href",
    "/login",
  );
  expect(screen.getByRole("link", { name: "Daftar" })).toHaveAttribute(
    "href",
    "/register",
  );
  expect(
    screen.queryByRole("textbox", { name: "Pesan chat" }),
  ).not.toBeInTheDocument();
  expect(mockUseChatSession).not.toHaveBeenCalled();
});

it("waits for session status before offering guest actions", () => {
  mockUseAuth.mockReturnValue({ isLoggedIn: false, isLoading: true });

  render(<ChatPanel />);

  expect(screen.getByText("Memeriksa sesi...")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  expect(mockUseChatSession).not.toHaveBeenCalled();
});

it("shows the chat composer for authenticated users", () => {
  mockUseAuth.mockReturnValue({ isLoggedIn: true, isLoading: false });
  mockUseChatSession.mockReturnValue({
    input: "",
    setInput: jest.fn(),
    isSending: false,
    conversationId: null,
    usingHistory: false,
    messages: [],
    listRef: { current: null },
    remainingChars: 1000,
    canSend: false,
    history: { isLoading: false, error: null, refetch: jest.fn() },
    sendMessage: jest.fn(),
    handleInputKeyDown: jest.fn(),
    sendQuickReply: jest.fn(),
  });

  render(<ChatPanel />);

  expect(
    screen.getByRole("textbox", { name: "Pesan chat" }),
  ).toBeInTheDocument();
  expect(mockUseChatSession).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
});
