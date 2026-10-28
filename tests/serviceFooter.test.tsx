import { render, screen } from "@testing-library/react";
import { createElement } from "react";

import { ServiceFooter } from "@/view/components/ServiceFooter";

describe("ServiceFooter", () => {
  it("shows the RexSoft copyright for the current year", () => {
    render(createElement(ServiceFooter));

    expect(screen.getByRole("contentinfo")).toHaveTextContent(`© ${new Date().getFullYear()} RexSoft`);
  });
});
