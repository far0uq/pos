"use client";
import { Product } from "@/app/interface/ProductInterface";
import { Card, Flex, Image, theme } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { useToken } = theme;

function CartItem({ item }: { item: Product }) {
  const { token } = useToken();
  return (
    <Card
      actions={[
        <MinusCircleOutlined key="minus" />,
        <PlusCircleOutlined key="add" />,
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
          <p style={{ fontWeight: "bolder", color: "gray" }}>x 2</p>
        </Flex>
      </Flex>
    </Card>
  );
}

export default CartItem;
