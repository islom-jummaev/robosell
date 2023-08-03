import React, { useEffect, useState, useMemo } from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { $productChangePosition, $productDelete, $productsList } from "@stores/products";
import { TableUI } from "@ui/table";
import { Spinner } from "@ui/spinner";
import { ColumnsType } from "antd/lib/table/interface";
import { IProductsListFilterParams, IProductsListItemModel } from "@/businessLogic/models/products";
import { ModalUI } from "@ui/modal";
import { useModalControl } from "@/hooks/useModalControl";
import { ProductAddEdit, ProductAddEditModalPropTypes } from "./add-edit";
import { $currentBot } from "@stores/bots";
import { ButtonUI } from "@ui/button";
import { DeleteIcon, EditIcon, MenuIcon } from "@assets/icons";
import { notificationSuccess } from "@ui/notifications";
import { ModalConfirm } from "@ui/modalConfirm";
import { getCurrentLang } from "@utils/getters";
import { StatusUI } from "@ui/status";
import { ProductsListFilter } from "@/pages/products/products-list/filter";
import * as productsModels from "@/businessLogic/models/products";
import { Image } from "antd";

const ProductsList = () => {
  const { t } = useTranslation();
  const currentLang = getCurrentLang();

  const { currentBot } = $currentBot.useStore();
  const { request: getProductsList, reset: resetProductsList, ...productsListState } = $productsList.useStore();
  const { request: productDelete, reset: resetProductDelete, ...productDeleteState } = $productDelete.useStore();
  const { request: productChangePosition, reset: resetProductChangePosition, ...productChangePositionState } = $productChangePosition.useStore();


  const productAddEditModalControl = useModalControl<ProductAddEditModalPropTypes>();

  const [filterParams, setFilterParams] = useState<IProductsListFilterParams>({});

  const [dataSource, setDataSource] = useState<Array<productsModels.IProductsListItemModel>>([]);

  const getList = () => {
    if (currentBot) {
      getProductsList({
        ...filterParams,
        bot_id: currentBot.id,
      });
    }
  }

  useEffect(() => {
    return () => {
      resetProductsList();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getList();
    }
  }, [currentBot, filterParams]);

  useEffect(() => {
    if (productDeleteState.success) {
      notificationSuccess(t("deleted", { ns: namespaces.products }));
      resetProductDelete();
      getList();
    }
  }, [productDeleteState.success]);

  useEffect(() => {
    if (productChangePositionState.success) {
      notificationSuccess(t("positionChanged", { ns: namespaces.products }));
      resetProductChangePosition();
      getList();
    }
  }, [productChangePositionState.success]);

  useEffect(() => {
    if (productsListState.data) {
      setDataSource(productsListState.data.results);
    }
  }, [productsListState.data]);


  const onFilterChange = (params: IProductsListFilterParams) => {
    setFilterParams({ ...filterParams, offset: undefined, ...params });
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: (page - 1) * 10 });
  };


  const onDelete = (id: number) => {
    productDelete(id);
  };

  const tableColumns = useMemo(() => {
    const columns: ColumnsType<IProductsListItemModel> = [
      {
        title: "ID",
        dataIndex: "num",
        width: 50,
        render: (_, row) => <div>#{row.id}</div>,
      },
      {
        title: t("image"),
        dataIndex: "photo",
        render: (_, row) => (
          <div className="table-photo withoutbg">
            {row.photo ? (
              <Image
                src={row.photo}
                alt=""
                height={40}
              />
            ): (
              "-"
            )}
          </div>
        ),
      },
      {
        title: t("fields.name"),
        dataIndex: "name",
        render: (_, row) => row.name[currentLang],
      },
      {
        title: t("category"),
        dataIndex: "category",
        render: (_, row) => row.category[currentLang],
      },
      {
        title: t("price"),
        dataIndex: "price",
        render: (_, row) => (
          <>
            {row.skus.map((item) => (
              <div key={item.id}>
                <strong>{item.name[currentLang]}:</strong> {item.price} {t("uzs")}
              </div>
            ))}
          </>
        ),
      },
      {
        title: t("status"),
        dataIndex: "name",
        render: (_, row) => (
          <StatusUI status={row.is_active ? "ACTIVE" : "IN_ACTIVE"}>
            {row.is_active ? t("active") : t("inActive")}
          </StatusUI>
        ),
      },
      {
        title: t("actions"),
        dataIndex: "actions",
        width: 90,
        render: (_, row) => {
          return (
            <div className="table-actions-btns">
              <ButtonUI
                type="secondary"
                withIcon
                circle
                onClick={() => productAddEditModalControl.open({ id: row.id })}
              >
                <EditIcon />
              </ButtonUI>
              <ModalConfirm
                title={t("notifications.confirmDelete")}
                onOk={() => onDelete(row.id)}
                okType={"danger"}
              >
                <ButtonUI
                  type="primary"
                  loading={productDeleteState.loading}
                  withIcon
                  circle
                >
                  <DeleteIcon />
                </ButtonUI>
              </ModalConfirm>
            </div>
          )
        }
      }
    ];

    return columns;
  }, []);

  return (
    <ContentLayout
      title={(
        <h1>{t("title", { ns: namespaces.products })}</h1>
      )}
    >
      {!productsListState.data ? (
        <div className="bg-loader">
          <Spinner />
        </div>
      ) : (
        <>
          <ContentLayout.Actions>
            <ProductsListFilter
              filterParams={filterParams}
              onFilterChange={onFilterChange}
            />
            <ButtonUI
              type="primary"
              onClick={() => productAddEditModalControl.open()}
            >
              {`${t("create", { ns: namespaces.products })} +`}
            </ButtonUI>
          </ContentLayout.Actions>

          <TableUI
            loading={productsListState.loading || productDeleteState.loading || productChangePositionState.loading}
            columns={tableColumns}
            dataSource={dataSource}
            pagination={{
              total: productsListState.data.count,
              pageSize: 10,
              current: filterParams.offset ? filterParams.offset / 10 + 1 : 1,
              hideOnSinglePage: true,
              onChange: onChangePagination,
            }}
            bordered={true}
          />
        </>
      )}
      <ModalUI
        open={productAddEditModalControl.modalProps.open}
        onCancel={productAddEditModalControl.close}
        width={700}
      >
        <ProductAddEdit
          modalControl={productAddEditModalControl}
          callback={getList}
        />
      </ModalUI>
    </ContentLayout>
  )
};

export default ProductsList;