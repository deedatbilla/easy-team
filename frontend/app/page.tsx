"use client";
import { AxiosHost } from "@/axiosGlobal";
import { Product } from "@/interfaces";
import {
  TextField,
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  Badge,
  useBreakpoints,
  Avatar,
  Link,
} from "@shopify/polaris";
import type { IndexFiltersProps, TabProps } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
const pageSize = 10;
export default function Home() {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([
    "All",
    "Unpaid",
    "Open",
    "Closed",
    "Local delivery",
    "Local pickup",
  ]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [displayedData, setDisplayedData] = useState<any[]>([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState("");

  const handlePrevious = () => {
    if (offset > 1) {
      const newOffset = offset - 10;
      const newLimit = limit - 10;
      setOffset(newOffset);
      setLimit(newLimit);
    }
  };
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const displayedData = allProducts.slice(offset, limit);
    setDisplayedData(displayedData);
  }, [limit, offset]);

  const handleNext = () => {
    // console.log({ offset, totalPages });
    if (limit < allProducts.length) {
      const newOffset = offset + 10;
      const newLimit = limit + 10;
      setOffset(newOffset);
      setLimit(newLimit);
    }
  };
  const deleteView = (index: number) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name: string) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs: TabProps[] = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value: string): Promise<boolean> => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value: string): Promise<boolean> => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));
  const [selected, setSelected] = useState(0);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(allProducts);
  const onCreateNewView = async (value: string) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const sortOptions: IndexFiltersProps["sortOptions"] = [
    { label: "Category", value: "order asc", directionLabel: "Ascending" },
    { label: "Order", value: "order desc", directionLabel: "Descending" },
    { label: "Customer", value: "customer asc", directionLabel: "A-Z" },
    { label: "Customer", value: "customer desc", directionLabel: "Z-A" },
    { label: "Date", value: "date asc", directionLabel: "A-Z" },
    { label: "Date", value: "date desc", directionLabel: "Z-A" },
    { label: "Total", value: "total asc", directionLabel: "Ascending" },
    { label: "Total", value: "total desc", directionLabel: "Descending" },
  ];
  const promotedBulkActions = [
    {
      content: "Apply to selected products",
      onAction: () => {
        const updated = [...allProducts];
        updated.forEach((el) => {
          if (selectedResources.some((r) => r === el?.id)) {
            el.price = el.price - (el.price * Number(discount)) / 100;
            el.discount = discount;
          }
        });
        setAllProducts(updated);
      },
    },
  ];
  const [sortSelected, setSortSelected] = useState(["order asc"]);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction: IndexFiltersProps["primaryAction"] =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };
  const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
    undefined
  );
  const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
    undefined
  );
  const [taggedWith, setTaggedWith] = useState("");
  const [queryValue, setQueryValue] = useState("");

  const handleAccountStatusChange = useCallback(
    (value: string[]) => setAccountStatus(value),
    []
  );
  const handleMoneySpentChange = useCallback(
    (value: [number, number]) => setMoneySpent(value),
    []
  );
  const handleTaggedWithChange = useCallback(
    (value: string) => setTaggedWith(value),
    []
  );
  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    []
  );
  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    []
  );
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    []
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await AxiosHost.get("/products");
      const all = data.products.map((item: Product) => ({
        ...item,
        discountedPrice: item.price,
      }));

      const initialData = all.slice(offset, limit); // Define pageSize for items per page
      const totalPages = Math.ceil(all.length / pageSize);
      setTotalPages(totalPages);
      setDisplayedData(initialData);
      setAllProducts(all);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const rowMarkup = displayedData.map(
    (
      { id, name, price, imageUrl, category, percentageValue, discountedPrice },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
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
        <IndexTable.Cell>
          ${Number(discountedPrice).toFixed(2)} USD
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            label=""
            type="number"
            value={percentageValue}
            prefix="%"
            onChange={(value) => {
              const newProducts = [...allProducts];
              newProducts[index].percentageValue = value;
              newProducts[index].discountedPrice =
                price - (price * Number(value)) / 100;
              console.log(newProducts[index]);
              setAllProducts(newProducts);
            }}
            autoComplete="off"
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <LegacyCard>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue("")}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={[]}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={[]}
          appliedFilters={[]}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
          loading={loading}
        />
        <IndexTable
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={allProducts.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Product" },
            { title: "Category" },
            { title: "Price" },
            { title: "Discount", alignment: "end" },
          ]}
          promotedBulkActions={promotedBulkActions}
          hasMoreItems
          pagination={{
            hasNext: true,
            hasPrevious: true,
            onNext: () => {
              handleNext();
            },
            onPrevious: () => {
              handlePrevious();
            },
          }}
        >
          {rowMarkup}
        </IndexTable>
        {selectedResources.length > 0 && (
          <TextField
            label="Discount"
            type="number"
            value={discount}
            prefix="%"
            onChange={(value) => {
              setDiscount(value);
            }}
            autoComplete="off"
          />
        )}
      </LegacyCard>
    </div>
  );
}
