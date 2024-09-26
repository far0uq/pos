import { LineItemResponseCleaned } from "@/app/interface/OrderInterface";
import { OrderTotalResponseObject } from "@/app/interface/OrderInterface";

export const getProductMoneyDetails = (
  productID: string,
  mutationData: OrderTotalResponseObject | undefined
) => {
  if (mutationData) {
    const foundData = mutationData.lineItemDetails.find(
      (lineItem: LineItemResponseCleaned) => lineItem.uid === productID
    );
    return foundData;
  }
};
