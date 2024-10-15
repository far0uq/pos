"use client";
import { Product } from "@/app/interface/ProductInterface";
import { Card, Flex, Image, theme } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useTotalStore } from "@/app/store/store";
import DiscountDropdown from "./DiscountDropdown";
import { DiscountQuery } from "@/app/interface/DiscountInterface";
import { LineItemResponseCleaned } from "@/app/interface/OrderInterface";
import TaxDropdown from "./TaxDropdown";
import { TaxQuery } from "@/app/interface/TaxInterface";

const { Meta } = Card;
const { useToken } = theme;

function CartItem({
  item,
  itemQuantity,
  discountQuery,
  taxQuery,
  individualCost,
  refreshCart,
}: {
  item: Product;
  itemQuantity: number;
  discountQuery: DiscountQuery;
  taxQuery: TaxQuery;
  individualCost: LineItemResponseCleaned;
  refreshCart: () => void;
}) {
  const { token } = useToken();
  const addProduct = useTotalStore((state) => state.addProduct);
  const removeProduct = useTotalStore((state) => state.removeProduct);
  const handleAddProduct = (item: Product) => {
    addProduct(item);
    refreshCart();
  };
  const handleRemoveProduct = (item: Product) => {
    removeProduct(item);
    refreshCart();
  };

  return (
    <Card
      actions={[
        <MinusCircleOutlined
          key="minus"
          onClick={() => handleRemoveProduct(item)}
        />,
        <PlusCircleOutlined key="add" onClick={() => handleAddProduct(item)} />,
        <p style={{ color: "black" }} key="price" className="cart-item-total">
          ${" "}
          {individualCost
            ? (
                item.price * itemQuantity +
                individualCost.totalTaxMoney -
                individualCost.totalDiscountMoney
              ).toLocaleString()
            : (item.price * itemQuantity).toLocaleString()}
        </p>,
      ]}
    >
      <Flex vertical gap="large">
        <Flex justify="flex-start" gap="large" align="center">
          <Image
            width={60}
            height={100}
            src={item.image}
            preview={false}
            alt={item.name}
            style={{ borderRadius: token.borderRadius, objectFit: "cover" }}
          />

          <Flex vertical>
            <Meta title={item.name} />
            <p
              style={{ fontWeight: "bolder", color: "gray" }}
              className="cart-item-quantity"
            >
              x {itemQuantity}
            </p>
            {individualCost && (
              <p
                style={{ fontWeight: "bolder", color: "gray" }}
                className="cart-item-discount"
              >
                Discount: $ {individualCost.totalDiscountMoney.toLocaleString()}
              </p>
            )}
            {individualCost && (
              <p
                style={{ fontWeight: "bolder", color: "gray" }}
                className="cart-item-tax"
              >
                Tax: $ {individualCost.totalTaxMoney.toLocaleString()}
              </p>
            )}
            {individualCost && (
              <p
                style={{ fontWeight: "bolder", color: "gray" }}
                className="cart-item-raw-price"
              >
                Raw Price: $ {(item.price * itemQuantity).toLocaleString()}
              </p>
            )}
          </Flex>
        </Flex>

        <DiscountDropdown
          discountQuery={discountQuery}
          productID={item.id}
          refreshCart={refreshCart}
          dropDownType="item"
        />
        <TaxDropdown
          taxQuery={taxQuery}
          productID={item.id}
          refreshCart={refreshCart}
          dropDownType="item"
        />
      </Flex>
    </Card>
  );
}

export default CartItem;
