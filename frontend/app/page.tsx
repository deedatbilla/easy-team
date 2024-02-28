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
  ChoiceList,
  useBreakpoints,
} from "@shopify/polaris";
import type { IndexFiltersProps } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import SimulationForm from "./_components/SimulationForm";
import { useFetchStaffMembers } from "@/hooks/useFetchStaffMembers";
import ProductsRow from "./_components/ProductsRow";
import { usePagination } from "@/hooks/usePagination";
import { isEmpty } from "lodash";
import { useFetchProducts } from "@/hooks/useFetchProducts";
export default function Home() {
  const {
    products,
    loading,
    displayedData,
    setDisplayedData,
    setProducts,
    allProducts,
  } = useFetchProducts();

  const [discount, setDiscount] = useState("");
  const { offset, limit, handleNext, handlePrevious } = usePagination({
    products,
  });
  useEffect(() => {
    const displayedData = products.slice(offset, limit);
    setDisplayedData(displayedData);
  }, [limit, offset]);

  const [selected, setSelected] = useState(0);
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(products);

  const sortOptions: IndexFiltersProps["sortOptions"] = [
    { label: "Category", value: "category asc", directionLabel: "Ascending" },
    { label: "Category", value: "category desc", directionLabel: "Descending" },
    { label: "Category", value: "category asc", directionLabel: "A-Z" },
    { label: "Category", value: "category desc", directionLabel: "Z-A" },
  ];
  const promotedBulkActions = [
    {
      content: "Apply to selected products",
      onAction: () => {
        const updated = [...products];
        updated.forEach((el) => {
          if (selectedResources.some((r) => r === el?.id)) {
            el.discountedPrice = el.price - (el.price * Number(discount)) / 100;
            el.percentageValue = discount;
            el.commission = (el.price * Number(discount)) / 100;
          }
        });
        setProducts(updated);
        clearSelection();
      },
    },
  ];
  const [sortSelected, setSortSelected] = useState(["category asc"]);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};

  const [productCategory, setProductCategory] = useState<string[] | undefined>(
    undefined
  );
  const [queryValue, setQueryValue] = useState("");
  const handleProductCategoryChange = useCallback(
    (value: string[]) => {
      setProductCategory(value);
      let filtered = [];
      if (value && value.length > 0 && !queryValue) {
        filtered = allProducts.filter((product) =>
          value.some((category) => product.category.includes(category))
        );
      }

      if (value && value.length > 0 && queryValue && queryValue.length > 0) {
        filtered = allProducts.filter(
          (product) =>
            (product.name.toLowerCase().includes(queryValue.toLowerCase()) ||
              product.category
                .toLowerCase()
                .includes(queryValue.toLowerCase()) ||
              product.price.toString().includes(queryValue.toLowerCase())) &&
            value.some((category) => product.category.includes(category))
        );
      }
      setProducts(filtered);
      setDisplayedData(filtered.slice(offset, limit));
    },
    [products, displayedData]
  );

  const handleFiltersQueryChange = useCallback(
    (value: string) => {
      setQueryValue(value);
      let filtered = [];
      if (value && value.length > 0 && !productCategory) {
        filtered = allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(value.toLowerCase()) ||
            product.category.toLowerCase().includes(value.toLowerCase()) ||
            product.price.toString().includes(value.toLowerCase())
        );
      }

      if (
        value &&
        value.length > 0 &&
        productCategory &&
        productCategory?.length > 0
      ) {
        filtered = allProducts.filter(
          (product) =>
            (product.name.toLowerCase().includes(value.toLowerCase()) ||
              product.category.toLowerCase().includes(value.toLowerCase()) ||
              product.price.toString().includes(value.toLowerCase())) &&
            productCategory?.some((category) =>
              product.category.includes(category)
            )
        );
      }
      if (
        !value &&
        value.length === 0 &&
        productCategory &&
        productCategory?.length > 0
      ) {
        filtered = allProducts.filter((product) =>
          productCategory?.some((category) =>
            product.category.includes(category)
          )
        );
      }
      if (!value && value.length === 0 && !productCategory) {
        filtered = allProducts;
      }
      setProducts(filtered);
      setDisplayedData(filtered.slice(offset, limit));
    },
    [products, displayedData]
  );
  const handleProductCategoryRemove = useCallback(() => {
    setProductCategory(undefined);
    setProducts(allProducts);
    setDisplayedData(allProducts.slice(offset, limit));
  }, [products, displayedData]);

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    setProductCategory(undefined);
    handleQueryValueRemove();
    setProducts(allProducts);
    setDisplayedData(allProducts.slice(offset, limit));
  }, [handleQueryValueRemove, products, displayedData]);
  const { staffMembers } = useFetchStaffMembers();

  const resourceName = {
    singular: "product",
    plural: "products",
  };
  const filters = [
    {
      key: "category",
      label: "Product category",
      filter: (
        <ChoiceList
          title="Product category"
          titleHidden
          choices={Array.from(
            allProducts.reduce((categorySet, product) => {
              categorySet.add(product.category);
              return categorySet;
            }, new Set())
          ).map((category: any) => ({ label: category, value: category }))}
          selected={productCategory || []}
          onChange={handleProductCategoryChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters: IndexFiltersProps["appliedFilters"] = [];
  if (productCategory && !isEmpty(productCategory)) {
    const key = "category";
    appliedFilters.push({
      key,
      label: productCategory.map((val) => `Category ${val}`).join(", "),
      onRemove: handleProductCategoryRemove,
    });
  }
  const onChangeRowItemDiscount = (
    value: string,
    index: number,
    price: number
  ) => {
    const newProducts = [...products];
    newProducts[index].percentageValue = value;
    newProducts[index].discountedPrice = price - (price * Number(value)) / 100;
    newProducts[index].commission = (price * Number(value)) / 100;
    setProducts(newProducts);
  };
  const rowMarkup = displayedData.map((item, index) => (
    <ProductsRow
      key={index}
      onChangeRowItemDiscount={onChangeRowItemDiscount}
      index={index}
      data={item}
      selectedResources={selectedResources}
    />
  ));

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <LegacyCard>
        {selectedResources.length > 0 && (
          <div style={{ margin: 10 }}>
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
          </div>
        )}
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue("")}
          onSort={setSortSelected}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={[]}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
          loading={loading}
        />
        <IndexTable
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={products.length}
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
      </LegacyCard>

      <div style={{ marginTop: 50 }}>
        <SimulationForm
          selectedResources={selectedResources}
          staffMembers={staffMembers}
          products={products}
        />
      </div>
    </div>
  );
}
