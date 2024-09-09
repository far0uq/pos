import React from "react";
import { Skeleton, Flex } from "antd";

function ItemsLoading() {
  return (
    <Flex wrap gap="large" style={{ width: "fit-content" }}>
      <Skeleton.Button active={true} style={{ width: 230, height: 320 }} />
      <Skeleton.Button active={true} style={{ width: 230, height: 320 }} />
      <Skeleton.Button active={true} style={{ width: 230, height: 320 }} />
      <Skeleton.Button active={true} style={{ width: 230, height: 320 }} />
      <Skeleton.Button active={true} style={{ width: 230, height: 320 }} />
    </Flex>
  );
}

export default ItemsLoading;
