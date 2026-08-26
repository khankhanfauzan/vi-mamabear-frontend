import { cn } from "./utils";

describe("cn", () => {
  it("merges multiple class names into one string", () => {
    expect(cn("p-2", "text-red-500")).toBe("p-2 text-red-500");
  });

  it("removes falsy values", () => {
    expect(cn("p-2", false, undefined, null, "text-red-500")).toBe(
      "p-2 text-red-500",
    );
  });

  it("resolves conflicting tailwind classes, keeping the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("supports conditional object syntax from clsx", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });
});
