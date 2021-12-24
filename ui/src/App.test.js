import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { makeServer } from "./utils/testing";

import App from "./App";

let server;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

describe("<App />", () => {
  describe("empty state", () => {
    it("Renders the app title correctly", () => {
      render(<App />);
      const element = screen.getByText(/fakebird/i);
      expect(element).toBeInTheDocument();
    });

    it("Renders the app slogan correctly", () => {
      render(<App />);
      const element = screen.getByText(/I'm a bird/i);
      expect(element).toBeInTheDocument();
    });

    it("Renders an text input box", () => {
      render(<App />);
      const element = screen.getByPlaceholderText(/What's on your mind/i);
      expect(element).toBeInTheDocument();
    });

    it("Renders a post button", () => {
      render(<App />);
      const element = screen.getByText(/Post/);
      expect(element).toBeInTheDocument();
    });

    it("Renders an empty feed if there are no posts", () => {
      render(<App />);
      const element = screen.getByText(/No posts in your feed yet.../i);
      expect(element).toBeInTheDocument();
    });
  });

  describe("some comments present", () => {
    it("renders existing posts", async () => {
      const postContent = "Hello fakebird!";
      server.create("post", { content: postContent, uuid: "something" });
      render(<App />);
      await waitFor(() =>
        expect(screen.getByText(postContent)).toBeInTheDocument()
      );
    });
  });

  describe("create a new post", () => {
    it("renders recently created post", async () => {
      const postContent = "Hello fakebird!";
      render(<App />);
      const input = screen.getByPlaceholderText(/What's on your mind/i);
      fireEvent.change(input, {
        target: { value: postContent },
      });
      fireEvent.click(screen.getByText("Post"));
      await waitFor(() =>
        expect(screen.getByText(postContent)).toBeInTheDocument()
      );
      expect(input).toHaveValue("");
    });
  });
});
