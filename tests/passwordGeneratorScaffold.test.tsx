import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";

import { PasswordGeneratorScaffold } from "@/view/widgets/PasswordGenerator";

describe("PasswordGeneratorScaffold", () => {
  it("renders the generator scaffold", () => {
    render(createElement(PasswordGeneratorScaffold));

    expect(screen.getByRole("heading", { name: "passGeneration" })).toBeInTheDocument();
  });

  it("switches from password generation to UUID generation", async () => {
    const user = userEvent.setup();
    render(createElement(PasswordGeneratorScaffold));

    await user.click(screen.getByRole("tab", { name: "UUID" }));

    expect(screen.getByRole("tab", { name: "UUID" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { name: "Generate UUIDs" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "UUID v4" })).toBeChecked();
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("generates a UUIDv7 batch with the requested quantity", async () => {
    const user = userEvent.setup();
    render(createElement(PasswordGeneratorScaffold));

    await user.click(screen.getByRole("tab", { name: "UUID" }));
    await user.click(screen.getByRole("radio", { name: "UUID v7" }));
    await user.click(screen.getByRole("radio", { name: "Batch" }));
    await user.clear(screen.getByRole("spinbutton", { name: "UUID quantity" }));
    await user.type(screen.getByRole("spinbutton", { name: "UUID quantity" }), "3");
    await user.click(screen.getByRole("button", { name: "Generate UUIDs" }));

    const generatedUUIDs = screen.getByRole("status", { name: "Generated UUIDs" }).textContent?.split("\n") ?? [];
    expect(generatedUUIDs).toHaveLength(3);
    expect(generatedUUIDs.every((uuid) => /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid))).toBe(true);
  });

  it("shows a validation message for an invalid UUID batch quantity", async () => {
    const user = userEvent.setup();
    render(createElement(PasswordGeneratorScaffold));

    await user.click(screen.getByRole("tab", { name: "UUID" }));
    await user.click(screen.getByRole("radio", { name: "Batch" }));
    await user.clear(screen.getByRole("spinbutton", { name: "UUID quantity" }));
    await user.click(screen.getByRole("button", { name: "Generate UUIDs" }));

    expect(screen.getByRole("status")).toHaveTextContent("UUID count must be an integer between 1 and 100.");
  });

  it("generates and copies a single UUIDv4", async () => {
    const user = userEvent.setup();
    render(createElement(PasswordGeneratorScaffold));

    await user.click(screen.getByRole("tab", { name: "UUID" }));
    await user.click(screen.getByRole("button", { name: "Generate UUID" }));
    const generatedUUID = screen.getByRole("status", { name: "Generated UUIDs" }).textContent ?? "";
    await user.click(screen.getByRole("button", { name: "Copy UUID" }));

    expect(generatedUUID).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(await navigator.clipboard.readText()).toBe(generatedUUID);
  });
});
