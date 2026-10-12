import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ChatMessageList } from "./ChatMessageList";

// react-markdown & remark-gfm are ESM-only and are not transformed by
// next/jest, so they are stubbed here. Markdown rendering itself is not
// under test in this file.
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));
jest.mock("remark-gfm", () => ({ __esModule: true, default: () => null }));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt?: string }) => (
    <span role="img" aria-label={alt ?? ""} />
  ),
}));

const clarificationMessage = {
  id: "2",
  role: "assistant" as const,
  content: "Boleh cerita dulu, Ma, lagi cari produk untuk kebutuhan apa?",
  products: [],
  type: "clarification" as const,
};

describe("ChatMessageList clarification", () => {
  it("renders the clarification question and no product cards", () => {
    render(<ChatMessageList messages={[clarificationMessage]} />);

    expect(
      screen.getByText(/Boleh cerita dulu, Ma/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Lihat Produk" })).toBeNull();
  });

  it("hides product cards even if a clarification somehow carries products", () => {
    render(
      <ChatMessageList
        messages={[
          {
            ...clarificationMessage,
            products: [
              {
                id: 7,
                name: "MamaBear Electric Pump",
                slug: "mamabear-electric-pump",
                formattedPrice: "Rp 450.000",
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.queryByRole("link", { name: "Lihat Produk" })).toBeNull();
    expect(screen.queryByText("MamaBear Electric Pump")).toBeNull();
  });

  it("renders product cards for an answer response", () => {
    render(
      <ChatMessageList
        messages={[
          {
            id: "3",
            role: "assistant",
            content: "Ini pilihannya, Ma!",
            type: "answer",
            products: [
              {
                id: 7,
                name: "MamaBear Electric Pump",
                slug: "mamabear-electric-pump",
                formattedPrice: "Rp 450.000",
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByText("MamaBear Electric Pump")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Lihat Produk" }),
    ).toHaveAttribute("href", "/products/mamabear-electric-pump");
  });

  it("renders a legacy message without type like a normal answer", () => {
    render(
      <ChatMessageList
        messages={[
          {
            id: "4",
            role: "assistant",
            content: "Halo Ma! Mama Bear bantu apa hari ini?",
            products: [
              {
                id: 7,
                name: "MamaBear Electric Pump",
                slug: "mamabear-electric-pump",
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByText("MamaBear Electric Pump")).toBeInTheDocument();
    expect(
      screen.queryByText("MamaBear butuh info lebih"),
    ).toBeNull();
  });
});

const productMessage = {
  id: "5",
  role: "assistant" as const,
  content: "Ini pilihannya, Ma!",
  type: "answer" as const,
  products: [
    {
      id: 7,
      name: "MamaBear Electric Pump",
      slug: "mamabear-electric-pump",
      formattedPrice: "Rp 450.000",
    },
  ],
};

const DISCLAIMER_MATCHER = /Informasi produk bersifat edukatif/i;

describe("ChatMessageList educational disclaimer", () => {
  it("renders the disclaimer once when an assistant message carries products", () => {
    render(<ChatMessageList messages={[productMessage]} />);

    expect(screen.getAllByText(DISCLAIMER_MATCHER)).toHaveLength(1);
    expect(screen.getByRole("note")).toBeInTheDocument();
    expect(screen.getByText("Catatan:")).toBeInTheDocument();
  });

  it("renders the disclaimer above the product list", () => {
    render(<ChatMessageList messages={[productMessage]} />);

    const note = screen.getByRole("note");
    const productLink = screen.getByRole("link", { name: "Lihat Produk" });

    const noteBeforeProduct =
      note.compareDocumentPosition(productLink) &
      Node.DOCUMENT_POSITION_FOLLOWING;

    expect(noteBeforeProduct).toBeTruthy();
  });

  it("does not render the disclaimer without products", () => {
    render(
      <ChatMessageList
        messages={[
          {
            id: "6",
            role: "assistant",
            content: "Halo Ma! Ada yang bisa dibantu?",
          },
        ]}
      />,
    );

    expect(screen.queryByRole("note")).toBeNull();
    expect(screen.queryByText(DISCLAIMER_MATCHER)).toBeNull();
  });

  it("does not render the disclaimer for user messages", () => {
    render(
      <ChatMessageList
        messages={[
          {
            id: "7",
            role: "user",
            content: "Rekomendasi pompa ASI dong",
          },
        ]}
      />,
    );

    expect(screen.queryByRole("note")).toBeNull();
    expect(screen.queryByText(DISCLAIMER_MATCHER)).toBeNull();
  });

  it("does not render the disclaimer for clarification messages", () => {
    render(
      <ChatMessageList
        messages={[
          {
            ...clarificationMessage,
            products: productMessage.products,
          },
        ]}
      />,
    );

    expect(screen.queryByRole("note")).toBeNull();
    expect(screen.queryByText(DISCLAIMER_MATCHER)).toBeNull();
  });

  it("renders one disclaimer per message that carries products", () => {
    render(
      <ChatMessageList
        messages={[
          productMessage,
          {
            id: "8",
            role: "user",
            content: "Ada yang lain?",
          },
          {
            ...productMessage,
            id: "9",
            content: "Ini juga ada, Ma!",
          },
        ]}
      />,
    );

    expect(screen.getAllByText(DISCLAIMER_MATCHER)).toHaveLength(2);
  });

  it("keeps the disclaimer when history is rendered with timestamps", () => {
    render(<ChatMessageList messages={[productMessage]} showTimestamps />);

    expect(screen.getByRole("note")).toBeInTheDocument();
    expect(screen.getByText("MamaBear Electric Pump")).toBeInTheDocument();
  });
});