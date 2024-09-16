import { Flex, Card } from "antd";
import { OrderResponse } from "../../../interface/OrderInterface";

const { Meta } = Card;

function TotalPaymentInfo({ totalAll }: { totalAll: OrderResponse }) {
  return (
    <Flex vertical>
      <Flex justify="space-between">
        <Meta title="Total Discount" />
        <p style={{ fontWeight: "bolder" }}>$ {totalAll.totalDiscountAmount}</p>
      </Flex>
      <Flex justify="space-between">
        <Meta title="Total Tax" />
        <p style={{ fontWeight: "bolder" }}>$ {totalAll.totalTaxAmount}</p>
      </Flex>
      <Flex justify="space-between">
        <Meta title="Total" />
        <p style={{ fontWeight: "bolder" }}>$ {totalAll.totalAmount}</p>
      </Flex>
    </Flex>
  );
}

export default TotalPaymentInfo;
