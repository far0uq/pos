import "@testing-library/jest-dom";
import { render, screen, act, fireEvent } from "@testing-library/react";
import CartContainer from "@/app/mainpage/components/cart/CartContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTotalStore } from "@/app/store/store";
import { useMutation } from "@tanstack/react-query";

jest.mock("zustand");
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"), // So that only useMutation is mocked
  useMutation: jest.fn(() => {
    return {
      data: null,
      error: null,
      isError: false,
      isPending: false,
      mutate: jest.fn(),
    };
  }),
}));

describe("Cart Container", () => {
  afterEach(() => {
    jest.clearAllMocks;
    jest.useRealTimers();
  });
  it("should handle appropriately when no products are in the cart", () => {
    const queryClient = new QueryClient();
    let { container } = render(
      <QueryClientProvider client={queryClient}>
        <CartContainer />
      </QueryClientProvider>
    );

    const cartBody = container.getElementsByClassName("ant-card")[0] ?? null;

    const emptyCartElement =
      container.getElementsByClassName("ant-empty")[0] ?? null;

    expect(emptyCartElement).toBeInTheDocument();
    expect(cartBody).toBeNull();
  });

  it("should handle appropriately when products are in the cart", () => {
    const product = {
      id: "1",
      name: "Dummy Item",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
    };
    let store = useTotalStore.getState();
    store.addProduct(product);

    const queryClient = new QueryClient();
    let { container } = render(
      <QueryClientProvider client={queryClient}>
        <CartContainer />
      </QueryClientProvider>
    );

    const cartBody = container.getElementsByClassName("ant-card")[0] ?? null;

    const emptyCartElement =
      container.getElementsByClassName("ant-empty")[0] ?? null;

    expect(emptyCartElement).toBeNull();
    expect(cartBody).toBeInTheDocument();
  });

  it("should call useMutation on clicking calculate order", () => {
    const product = {
      id: "1",
      name: "Dummy Item",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
    };
    let store = useTotalStore.getState();
    store.addProduct(product);

    const queryClient = new QueryClient();

    let { container } = render(
      <QueryClientProvider client={queryClient}>
        <CartContainer />
      </QueryClientProvider>
    );

    const calculateOrderButton =
      container.getElementsByClassName("ant-btn")[0] ?? null;

    act(() => {
      fireEvent.click(calculateOrderButton);
    });

    expect(useMutation).toHaveBeenCalled();
  });

  it("should show total amount when order is calculated successfully", () => {
    (useMutation as jest.Mock).mockImplementationOnce(() => ({
      data: {
        orderResponse: {
          totalMoney: 100,
          totalDiscountMoney: 10,
          totalTaxMoney: 5,
        },
        lineItemDetails: [],
      },
      error: null,
      isError: false,
      isPending: false,
      isSucessful: true,
      mutate: jest.fn(),
    }));

    const product = {
      id: "1",
      name: "Dummy Item",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
    };

    let store = useTotalStore.getState();
    store.addProduct(product);

    const queryClient = new QueryClient();
    let { container } = render(
      <QueryClientProvider client={queryClient}>
        <CartContainer />
      </QueryClientProvider>
    );

    const totalMoneyPara = container.getElementsByClassName("total-money")[0];

    const orderErrorText = "Error calculating order";
    const orderLoadingTest = "Calculating order...";

    const orderErrorElement =
      container.getElementsByClassName(orderErrorText)[0] ?? null;
    const orderLoadingElement =
      container.getElementsByClassName(orderLoadingTest)[0] ?? null;
    const orderEmptyElement =
      container.getElementsByClassName("ant-empty")[0] ?? null;

    expect(orderErrorElement).toBeNull();
    expect(orderLoadingElement).toBeNull();
    expect(orderEmptyElement).toBeNull();
    expect(totalMoneyPara).toBeInTheDocument();
  });

  it("should handle appropriately when order is being calculated", () => {
    (useMutation as jest.Mock).mockImplementationOnce(() => ({
      data: null,
      error: null,
      isError: false,
      isPending: true,
      mutate: jest.fn(),
    }));

    const product = {
      id: "1",
      name: "Dummy Item",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
    };

    let store = useTotalStore.getState();
    store.addProduct(product);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CartContainer />
      </QueryClientProvider>
    );

    const calculatingOrderText = "Calculating order...";
    const calculatingOrderElement = screen.getByText(calculatingOrderText);

    expect(calculatingOrderElement).toBeInTheDocument();
  });

  it("should handle appropriately when order is in error", () => {
    (useMutation as jest.Mock).mockImplementationOnce(() => ({
      data: null,
      error: null,
      isError: true,
      isPending: false,
      mutate: jest.fn(),
    }));

    const product = {
      id: "1",
      name: "Dummy Item",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
    };

    let store = useTotalStore.getState();

    store.addProduct(product);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CartContainer />
      </QueryClientProvider>
    );

    const orderErrorText = "Error calculating order";

    const orderErrorElement = screen.getByText(orderErrorText);
    expect(orderErrorElement).toBeInTheDocument();
  });
});
