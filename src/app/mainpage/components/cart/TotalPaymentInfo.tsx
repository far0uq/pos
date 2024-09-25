import { Flex, Card } from "antd";
import { OrderResponse } from "../../../interface/OrderInterface";

const { Meta } = Card;

function TotalPaymentInfo({ totalAll }: { totalAll: OrderResponse }) {
  return (
    <Flex vertical>
      <Flex justify="space-between">
        <Meta title="Total Discount" />
        <p style={{ fontWeight: "bolder" }}>
          $ {totalAll.totalDiscountMoney.toLocaleString()}
        </p>
      </Flex>
      <Flex justify="space-between">
        <Meta title="Total Tax" />
        <p style={{ fontWeight: "bolder" }}>
          $ {totalAll.totalTaxMoney.toLocaleString()}
        </p>
      </Flex>
      <Flex justify="space-between">
        <Meta title="Total without Tax + Discounts" />
        <p style={{ fontWeight: "bolder" }} className="total-money">
          $ {totalAll.totalMoney.toLocaleString()}
        </p>
      </Flex>
      <Flex justify="space-between">
        <Meta title="Total with Tax + Discounts" />
        <p style={{ fontWeight: "bolder" }} className="total-money">
          ${" "}
          {(
            totalAll.totalMoney +
            totalAll.totalDiscountMoney +
            totalAll.totalTaxMoney
          ).toLocaleString()}
        </p>
      </Flex>
    </Flex>
  );
}

export default TotalPaymentInfo;
