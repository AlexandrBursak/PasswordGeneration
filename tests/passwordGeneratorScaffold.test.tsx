import { render, screen } from "@testing-library/react";
import { createElement } from "react";

import { PasswordGeneratorScaffold } from "@/view/widgets/PasswordGenerator";

describe("PasswordGeneratorScaffold", () => {
  it("renders the generator scaffold", () => {
    render(createElement(PasswordGeneratorScaffold));

    expect(screen.getByRole("heading", { name: "passGeneration" })).toBeInTheDocument();
  });
});
