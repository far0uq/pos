import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CartContainer from "@/app/mainpage/components/cart/CartContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTotalStore } from "@/app/store/store";
import { useMutation } from "@tanstack/react-query";
import { verifyCartTotal } from "@/app/api/productsAPI/utils/cartHelper";
import "matchMedia";

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
  });
  it("should handle appropriately when no products are in the cart", () => {
    const queryClient = new QueryClient();
    let { container } = render(
      <QueryClientProvider client={queryClient}>
        <CartContainer />
      </QueryClientProvider>
    );

    const cartBody = container.getElementsByClassName("ant-card")[0];

    const emptyCartElement = container.getElementsByClassName("ant-empty")[0];

    expect(emptyCartElement).toBeInTheDocument();
    expect(cartBody).toBeUndefined();
  });

  it("should handle appropriately when products are in the cart", () => {
    const product = {
      id: "1",
      name: "Dummy Item",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
      priceExists: true,
    };
    let store = useTotalStore.getState();
    store.addProduct(product);

    const queryClient = new QueryClient();
    let { container } = render(
      <QueryClientProvider client={queryClient}>
        <CartContainer />
      </QueryClientProvider>
    );

    const cartBody = container.getElementsByClassName("ant-card")[0];

    const emptyCartElement = container.getElementsByClassName("ant-empty")[0];

    expect(emptyCartElement).toBeFalsy();
    expect(cartBody).toBeInTheDocument();
  });

  it("should call useMutation on clicking rendering cart", () => {
    const product = {
      id: "1",
      name: "Dummy Item",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
      priceExists: true,
    };
    let store = useTotalStore.getState();
    store.addProduct(product);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CartContainer />
      </QueryClientProvider>
    );

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
      priceExists: true,
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
      container.getElementsByClassName(orderErrorText)[0];
    const orderLoadingElement =
      container.getElementsByClassName(orderLoadingTest)[0];
    const orderEmptyElement = container.getElementsByClassName("ant-empty")[0];

    expect(orderErrorElement).toBeUndefined();
    expect(orderLoadingElement).toBeUndefined();
    expect(orderEmptyElement).toBeUndefined();
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
      priceExists: true,
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
      priceExists: true,
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

  it("should handle price calculation for individual products correctly and display them", () => {
    const product = {
      id: "1",
      name: "Dummy Item",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
      price: 10,
      priceExists: true,
    };

    (useMutation as jest.Mock).mockImplementationOnce(() => ({
      data: {
        orderResponse: {
          totalMoney: 100,
          totalDiscountMoney: 10,
          totalTaxMoney: 5,
        },
        lineItemDetails: [
          {
            uid: "1",
            totalMoney: 10,
            totalDiscountMoney: 1,
            totalTaxMoney: 0.5,
          },
        ],
      },
      error: null,
      isError: false,
      isPending: false,
      isSucessful: true,
      mutate: jest.fn(),
    }));

    let store = useTotalStore.getState();
    store.addProduct(product);

    const queryClient = new QueryClient();
    let { container } = render(
      <QueryClientProvider client={queryClient}>
        <CartContainer />
      </QueryClientProvider>
    );

    const itemMoney =
      container.getElementsByClassName("cart-item-total")[0].innerHTML;
    const itemDiscount =
      container.getElementsByClassName("cart-item-discount")[0].innerHTML;
    const itemTax =
      container.getElementsByClassName("cart-item-tax")[0].innerHTML;
    const itemQuantity =
      container.getElementsByClassName("cart-item-quantity")[0].innerHTML;
    const itemRawPrice = container.getElementsByClassName(
      "cart-item-raw-price"
    )[0].innerHTML;

    const itemPriceValid = verifyCartTotal(
      itemTax,
      itemDiscount,
      itemQuantity,
      itemRawPrice,
      itemMoney
    );
    expect(itemPriceValid).toEqual(true);
  });
});
