import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Item from "@/app/mainpage/components/items/Item";
import { useTotalStore } from "@/app/store/store";

jest.mock("zustand");

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("Product Item in ItemContainer", () => {
  it("should render the item", () => {
    const product = {
      id: "1",
      name: "Dummy Item",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
    };

    render(<Item item={product} />);

    const itemname = screen.getByText(product.name);
    const itemprice = screen.getByText(product.price.toString());
    const itemImage = screen.getByAltText("book");
    const quantity = "Quantity: 0";
    const itemQuantity = screen.getByText(quantity);

    expect(itemname).toBeInTheDocument();
    expect(itemprice).toBeInTheDocument();
    expect(itemImage).toHaveAttribute("src", product.image);
    expect(itemQuantity).toBeInTheDocument();
  });

  it("should increase item quantity", () => {
    // Check if the add Button calls the addProduct state function and verify that the function results in a product being added to the state
    const product = {
      id: "1",
      name: "Dummy Increase",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
    };

    const { container } = render(<Item item={product} />);
    const addButton = container.getElementsByClassName("anticon-plus-circle");

    act(() => {
      fireEvent.click(addButton[0]);
    });
    let store = useTotalStore.getState();
    expect(store.cartProducts).toContainEqual(product);
  });

  it("should decrease item quanitity", () => {
    const product = {
      id: "1",
      name: "Dummy Decrease",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
    };

    const { container } = render(<Item item={product} />);
    const removeButton = container.getElementsByClassName(
      "anticon-minus-circle"
    );

    let store = useTotalStore.getState();
    act(() => {
      store.addProduct(product);
      fireEvent.click(removeButton[0]);
    });

    store = useTotalStore.getState();

    expect(store.cartProducts).toHaveLength(0);
  });
});
