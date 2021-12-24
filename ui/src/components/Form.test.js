import { render, screen } from "@testing-library/react";
import Form from "./Form";

describe("<App />", () => {
  it("Renders an text input box", () => {
    render(<Form />);
    const element = screen.getByPlaceholderText(/What's on your mind/i);
    expect(element).toBeInTheDocument();
  });

  it("Renders a post button", () => {
    render(<Form />);
    const element = screen.getByText(/Post/i);
    expect(element).toBeInTheDocument();
  });
});
