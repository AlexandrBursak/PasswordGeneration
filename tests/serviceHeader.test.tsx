import { render, screen, within } from "@testing-library/react";
import { createElement } from "react";

import { ServiceHeader } from "@/view/components/ServiceHeader";

describe("ServiceHeader", () => {
  it("lists RexSoft services in the shared order with a theme switch", () => {
    render(createElement(ServiceHeader));
    const nav = screen.getByRole("navigation", { name: "RexSoft services" });

    expect(within(nav).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Password Generator",
      "Markdown to HTML",
      "Snap Link",
    ]);
    expect(within(nav).getByRole("link", { name: "Password Generator" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Snap Link" })).toHaveAttribute("href", "https://snap-link.rexsoftproduction.com/");
    expect(within(nav.closest("header")!).getByRole("group", { name: "Theme" })).toBeInTheDocument();
  });
});
