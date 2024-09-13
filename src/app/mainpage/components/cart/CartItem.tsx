"use client";
import { Product } from "@/app/interface/ProductInterface";
import { Card, Flex, Image, theme } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useTotalStore } from "@/app/store/store";
import TaxDropdown from "./TaxDropdown";
import DiscountDropdown from "./DiscountDropdown";
import { TaxQuery } from "@/app/interface/TaxInterface";
import { DiscountQuery } from "@/app/interface/DiscountInterface";

const { Meta } = Card;
const { useToken } = theme;

function CartItem({
  item,
  itemQuantity,
  taxes,
  discounts,
}: {
  item: Product;
  itemQuantity: number;
  taxes: TaxQuery;
  discounts: DiscountQuery;
}) {
  const { token } = useToken();
  const addProduct = useTotalStore((state) => state.addProduct);
  const removeProduct = useTotalStore((state) => state.removeProduct);

  return (
    <Card
      actions={[
        <MinusCircleOutlined key="minus" onClick={() => removeProduct(item)} />,
        <PlusCircleOutlined key="add" onClick={() => addProduct(item)} />,
        <p style={{ color: "black" }} key="price">
          {item.price}
        </p>,
      ]}
    >
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
        </Flex>
      </Flex>

      <DiscountDropdown discounts={discounts} productID={item.id} />
      <TaxDropdown taxes={taxes} productID={item.id} />
    </Card>
  );
}

export default CartItem;
