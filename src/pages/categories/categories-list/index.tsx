import React, { useEffect, useState, useMemo } from "react";

import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { $categoryDelete, $categoriesList, $categoryChangePosition } from "@stores/categories";
import { TableUI } from "@ui/table";
import { Spinner } from "@ui/spinner";
import { ColumnsType } from "antd/lib/table/interface";
import { ICategoriesListFilterParams, ICategoriesListItemModel } from "@/businessLogic/models/categories";
import { ModalUI } from "@ui/modal";
import { useModalControl } from "@/hooks/useModalControl";
import { CategoryAddEdit, CategoryAddEditModalPropTypes } from "./add-edit";
import { $currentBot } from "@stores/bots";
import { ButtonUI } from "@ui/button";
import { DeleteIcon, EditIcon, MenuIcon } from "@assets/icons";
import { notificationSuccess } from "@ui/notifications";
import { ModalConfirm } from "@ui/modalConfirm";
import { getCurrentLang } from "@utils/getters";
import { StatusUI } from "@ui/status";
import { formatDate } from "@utils/formatters";
import { CategoriesListFilter } from "@/pages/categories/categories-list/filter";
import * as categoriesModels from "@/businessLogic/models/categories";
import { Image } from "antd";

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <div
                ref={setActivatorNodeRef}
                style={{ touchAction: 'none', cursor: 'move' }}
                {...listeners}
              >
                <MenuIcon />
              </div>
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const CategoriesList = () => {
  const { t } = useTranslation();
  const currentLang = getCurrentLang();

  const { currentBot } = $currentBot.useStore();
  const { request: getCategoriesList, reset: resetCategoriesList, ...categoriesListState } = $categoriesList.useStore();
  const { request: categoryDelete, reset: resetCategoryDelete, ...categoryDeleteState } = $categoryDelete.useStore();
  const { request: categoryChangePosition, reset: resetCategoryChangePosition, ...categoryChangePositionState } = $categoryChangePosition.useStore();

  const categoryAddEditModalControl = useModalControl<CategoryAddEditModalPropTypes>();

  const [filterParams, setFilterParams] = useState<ICategoriesListFilterParams>({});

  const [dataSource, setDataSource] = useState<Array<categoriesModels.ICategoriesListItemModel>>([]);

  const getList = () => {
    if (currentBot) {
      getCategoriesList({
        ...filterParams,
        bot_id: currentBot.id,
      });
    }
  }

  useEffect(() => {
    return () => {
      resetCategoriesList();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getList();
    }
  }, [currentBot, filterParams]);

  useEffect(() => {
    if (categoryDeleteState.success) {
      notificationSuccess(t("deleted", { ns: namespaces.categories }));
      resetCategoryDelete();
      getList();
    }
  }, [categoryDeleteState.success]);

  useEffect(() => {
    if (categoryChangePositionState.success) {
      notificationSuccess(t("positionChanged", { ns: namespaces.products }));
      resetCategoryChangePosition();
      getList();
    }
  }, [categoryChangePositionState.success]);

  useEffect(() => {
    if (categoriesListState.data) {
      setDataSource(categoriesListState.data.results);
    }
  }, [categoriesListState.data]);


  const onFilterChange = (params: ICategoriesListFilterParams) => {
    setFilterParams({ ...filterParams, offset: undefined, ...params });
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: (page - 1) * 10 });
  };


  const onDelete = (id: number) => {
    categoryDelete(id);
  };

  const tableColumns = useMemo(() => {
    const columns: ColumnsType<ICategoriesListItemModel> = [
      {
        key: "sort",
        width: 50,
      },
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
        title: t("status"),
        dataIndex: "name",
        render: (_, row) => (
          <StatusUI status={row.is_active ? "ACTIVE" : "IN_ACTIVE"}>
            {row.is_active ? t("active") : t("inActive")}
          </StatusUI>
        ),
      },
      // {
      //   title: t("created_at"),
      //   dataIndex: "created_at",
      //   render: (_, row) => <div className="w-n-r">{formatDate(row.)}</div>,
      // },
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
                onClick={() => categoryAddEditModalControl.open({ id: row.id })}
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
                  loading={categoryDeleteState.loading}
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

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.id === active.id);
        const overIndex = previous.findIndex((i) => i.id === over?.id);

        let above_category = over ? over.id : undefined;

        if (activeIndex > overIndex) {

          above_category = previous.find((item, ind) => ind === (overIndex - 1))?.id;
        }


        categoryChangePosition({
          id: active.id,
          above_category
        });

        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  return (
    <ContentLayout
      title={(
        <h1>{t("title", { ns: namespaces.categories })}</h1>
      )}
    >
      {!categoriesListState.data ? (
        <div className="bg-loader">
          <Spinner />
        </div>
      ) : (
        <>
          <ContentLayout.Actions>
            <CategoriesListFilter
              filterParams={filterParams}
              onFilterChange={onFilterChange}
            />
            <ButtonUI
              type="primary"
              onClick={() => categoryAddEditModalControl.open()}
            >
              {`${t("create", { ns: namespaces.categories })} +`}
            </ButtonUI>
          </ContentLayout.Actions>

          <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext
              // rowKey array
              items={dataSource.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <TableUI
                loading={categoriesListState.loading || categoryChangePositionState.loading}
                components={{
                  body: {
                    row: Row,
                  },
                }}
                columns={tableColumns}
                dataSource={dataSource}
                pagination={{
                  total: categoriesListState.data.count,
                  pageSize: 10,
                  current: filterParams.offset ? filterParams.offset / 10 + 1 : 1,
                  hideOnSinglePage: true,
                  onChange: onChangePagination,
                }}
                bordered={true}
              />
            </SortableContext>
          </DndContext>
        </>
      )}
      <ModalUI
        open={categoryAddEditModalControl.modalProps.open}
        onCancel={categoryAddEditModalControl.close}
        width={700}
      >
        <CategoryAddEdit
          modalControl={categoryAddEditModalControl}
          callback={getList}
        />
      </ModalUI>
    </ContentLayout>
  )
};

export default CategoriesList;