"use client";
import { Product } from "@/app/interface/ProductInterface";
import { Card, Flex, Image, theme } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useTotalStore } from "@/app/store/store";
import DiscountDropdown from "./DiscountDropdown";
import { DiscountQuery } from "@/app/interface/DiscountInterface";
import { LineItemResponseCleaned } from "@/app/interface/OrderInterface";

const { Meta } = Card;
const { useToken } = theme;

function CartItem({
  item,
  itemQuantity,
  discounts,
  individualCost,
}: {
  item: Product;
  itemQuantity: number;
  discounts: DiscountQuery;
  individualCost: LineItemResponseCleaned;
}) {
  const { token } = useToken();
  const addProduct = useTotalStore((state) => state.addProduct);
  const removeProduct = useTotalStore((state) => state.removeProduct);

  console.log("individualCost", individualCost);
  return (
    <Card
      actions={[
        <MinusCircleOutlined key="minus" onClick={() => removeProduct(item)} />,
        <PlusCircleOutlined key="add" onClick={() => addProduct(item)} />,
        <p style={{ color: "black" }} key="price">
          $ {item.price * itemQuantity}
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
            <p style={{ fontWeight: "bolder", color: "gray" }}>
              x {itemQuantity}
            </p>
            {individualCost && (
              <p style={{ fontWeight: "bolder", color: "gray" }}>
                Discount: $ {individualCost.totalDiscountMoney}
              </p>
            )}
            {individualCost && (
              <p style={{ fontWeight: "bolder", color: "gray" }}>
                Tax: $ {individualCost.totalTaxMoney}
              </p>
            )}
          </Flex>
        </Flex>

        <DiscountDropdown discounts={discounts} productID={item.id} />
      </Flex>
    </Card>
  );
}

export default CartItem;
