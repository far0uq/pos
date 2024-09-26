import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Item from "@/app/mainpage/components/items/Item";
import { useTotalStore } from "@/app/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

xdescribe("Product Item in ItemContainer", () => {
  it("should render the item", () => {
    const product = {
      id: "1",
      name: "Dummy Item",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
      priceExists: true,
    };

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Item item={product} />
      </QueryClientProvider>
    );

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
      priceExists: true,
    };

    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Item item={product} />
      </QueryClientProvider>
    );
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
      priceExists: true,
    };

    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Item item={product} />
      </QueryClientProvider>
    );
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

  it("should not add item to cart if price does not exist", () => {
    const product = {
      id: "1",
      name: "Dummy No Price",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 0,
      priceExists: false,
    };

    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Item item={product} />
      </QueryClientProvider>
    );
    const addButton = container.getElementsByClassName("anticon-plus-circle");

    act(() => {
      fireEvent.click(addButton[0]);
    });

    let store = useTotalStore.getState();
    expect(store.cartProducts).toHaveLength(0);
  });
});
