import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders its children text", () => {
    render(<Button>Simpan</Button>);
    expect(screen.getByRole("button", { name: "Simpan" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Klik saya</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Klik saya" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not trigger onClick when disabled", async () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Nonaktif
      </Button>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Nonaktif" }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies the correct data-variant attribute", () => {
    render(<Button variant="destructive">Hapus</Button>);
    expect(screen.getByRole("button", { name: "Hapus" })).toHaveAttribute(
      "data-variant",
      "destructive",
    );
  });

  it("applies the correct data-size attribute", () => {
    render(<Button size="lg">Besar</Button>);
    expect(screen.getByRole("button", { name: "Besar" })).toHaveAttribute(
      "data-size",
      "lg",
    );
  });

  it("merges custom className with the base variant classes", () => {
    render(<Button className="my-custom-class">Custom</Button>);
    expect(screen.getByRole("button", { name: "Custom" })).toHaveClass(
      "my-custom-class",
    );
  });
});
