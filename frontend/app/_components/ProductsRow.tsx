import { Avatar, IndexTable, Link, Text, TextField } from "@shopify/polaris";
import React from "react";

function ProductsRow({
  data,
  index,
  selectedResources,
  onChangeRowItemDiscount,
}: {
  data: any;
  index: number;
  selectedResources: string[];
  onChangeRowItemDiscount: (
    value: string,
    index: number,
    price: number
  ) => void;
}) {
  const {
    id,
    name,
    price,
    imageUrl,
    category,
    percentageValue,
    discountedPrice,
  } = data;
  return (
    <IndexTable.Row
      id={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <Link dataPrimaryLink onClick={() => {}}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Avatar customer name={name} source={imageUrl} />
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {name}
            </Text>
          </div>
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>{category}</IndexTable.Cell>
      <IndexTable.Cell>${Number(price).toFixed(2)} USD</IndexTable.Cell>
      <IndexTable.Cell>
        <TextField
          label=""
          type="number"
          value={percentageValue}
          prefix="%"
          onChange={(value) => {
            onChangeRowItemDiscount(value, index, price);
          }}
          autoComplete="off"
        />
      </IndexTable.Cell>
    </IndexTable.Row>
  );
}

export default ProductsRow;
