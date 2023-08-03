import React, { useEffect, useState, useMemo } from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { $sourceDelete, $sourceList } from "@stores/source";
import { Link } from "react-router-dom";
import { TableUI } from "@ui/table";
import { Spinner } from "@ui/spinner";
import { ColumnsType } from "antd/lib/table/interface";
import { ISourceListFilterParams, ISourceListItemModel } from "@/businessLogic/models/source";

import { $currentBot } from "@stores/bots";
import { ButtonUI } from "@ui/button";
import { DeleteIcon } from "@assets/icons";
import { notificationSuccess } from "@ui/notifications";
import { ModalConfirm } from "@ui/modalConfirm";
import { formatCount, formatDate } from "@utils/formatters";
import { useModalControl } from "@/hooks/useModalControl";
import { ModalUI } from "@ui/modal";
import { SourceAdd } from "@/pages/marketing/source/source-list/add";


const SourceList = () => {
  const { t } = useTranslation();

  const { currentBot } = $currentBot.useStore();
  const { request: getSourceList, reset: resetSourceList, ...sourceListState } = $sourceList.useStore();
  const { request: sourceDelete, reset: resetSourceDelete, ...sourceDeleteState } = $sourceDelete.useStore();

  const sourceAddModalControl = useModalControl();

  const [filterParams, setFilterParams] = useState<ISourceListFilterParams>({});

  const getList = () => {
    if (currentBot) {
      getSourceList({
        ...filterParams,
        bot_id: currentBot.id,
      });
    }
  };

  useEffect(() => {
    return () => {
      resetSourceList();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getList();
    }
  }, [currentBot, filterParams]);

  useEffect(() => {
    if (sourceDeleteState.success) {
      notificationSuccess(t("source.deleted", { ns: namespaces.marketing }));
      resetSourceDelete();
      getList();
    }
  }, [sourceDeleteState.success]);


  const onFilterChange = (params: ISourceListFilterParams) => {
    setFilterParams({ ...filterParams, offset: undefined, ...params });
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: (page - 1) * 10 });
  };

  const onDelete = (id: number) => {
    sourceDelete(id);
  };

  const tableColumns = useMemo(() => {
    const columns: ColumnsType<ISourceListItemModel> = [
      {
        title: t("link"),
        dataIndex: "name",
        render: (_, row) => <Link to={row.url} target="_blank">{row.name}</Link>,
      },
      {
        title: t("visits"),
        dataIndex: "total_visits",
        render: (_, row) => formatCount(row.total_visits),
      },
      {
        title: t("current_clients"),
        dataIndex: "clients",
        render: (_, row) => formatCount(row.old_visits),
      },
      {
        title: t("unique_clients"),
        dataIndex: "unique_clients",
        render: (_, row) => formatCount(row.new_visits),
      },
      {
        title: t("order_count"),
        dataIndex: "order_count",
        render: (_, row) => formatCount(row.order_count),
      },
      {
        title: t("sideNavigation.orders"),
        dataIndex: "order_sum",
        render: (_, row) => <>{formatCount(row.order_sum)} {t("uzs")}</>,
      },
      {
        title: t("lastVisit"),
        dataIndex: "last_visit_time",
        render: (_, row) => <div className="w-n-r">{formatDate(row.last_visit_time)}</div>,
      },
      {
        title: t("dateAdded"),
        dataIndex: "created_at",
        render: (_, row) => <div className="w-n-r">{formatDate(row.created_at)}</div>,
      },
      {
        title: t("actions"),
        dataIndex: "actions",
        render: (_, row) => {
          return (
            <div className="table-actions-btns">
              <ModalConfirm
                title={t("notifications.confirmDelete")}
                onOk={() => onDelete(row.id)}
                okType={"danger"}
              >
                <ButtonUI
                  type="primary"
                  loading={sourceDeleteState.loading}
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
        <h1>{t("source.title", { ns: namespaces.marketing })}</h1>
      )}
    >

      {!sourceListState.data ? (
        <div className="bg-loader">
          <Spinner />
        </div>
      ) : (
        <>
          <ContentLayout.Actions>
            <div></div>
            <ButtonUI
              type="primary"
              onClick={() => sourceAddModalControl.open()}
            >
              {`${t("source.create", { ns: namespaces.marketing })} +`}
            </ButtonUI>
          </ContentLayout.Actions>
          <TableUI
            loading={sourceListState.loading || sourceDeleteState.loading}
            dataSource={sourceListState.data.results}
            columns={tableColumns}
            pagination={{
              total: sourceListState.data.count,
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
        open={sourceAddModalControl.modalProps.open}
        onCancel={sourceAddModalControl.close}
        width={500}
      >
        <SourceAdd
          modalControl={sourceAddModalControl}
          callback={getList}
        />
      </ModalUI>
    </ContentLayout>
  )
};

export default SourceList;