import React, { useEffect, useMemo, useState } from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { $branchesList, $branchDelete } from "@stores/branches";
import { TableUI } from "@ui/table";
import { Spinner } from "@ui/spinner";
import { ColumnsType } from "antd/lib/table/interface";
import { IBranchesListItemModel, IBranchesListFilterParams } from "@/businessLogic/models/branches";
import { ButtonUI } from "@ui/button";
import { ModalUI } from "@ui/modal";
import { useModalControl } from "@/hooks/useModalControl";
import { BranchAddEdit, BranchAddEditModalPropTypes } from "./add-edit";
import { $currentBot } from "@stores/bots";
import { getCurrentLang } from "@utils/getters";
import { StatusUI } from "@ui/status";
import { DeleteIcon, EditIcon } from "@assets/icons";
import { ModalConfirm } from "@ui/modalConfirm";
import { notificationSuccess } from "@ui/notifications";
import { BranchesListFilter } from "@/pages/branches/branches-list/filter";


const BranchesList = () => {
  const { t } = useTranslation();

  const currentLang = getCurrentLang();

  const { request: getBranchesList, reset: resetBranchesList, ...branchesListState } = $branchesList.useStore();
  const { request: branchDelete, reset: resetBranchDelete, ...branchDeleteState } = $branchDelete.useStore();

  const { currentBot } = $currentBot.useStore();

  const branchAddModalControl = useModalControl<BranchAddEditModalPropTypes>();

  const [filterParams, setFilterParams] = useState<IBranchesListFilterParams>({});

  const getList = () => {
    if (currentBot) {
      getBranchesList({
        bot_id: currentBot.id,
        ...filterParams
      });
    }
  };

  useEffect(() => {
    return () => {
      resetBranchesList();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getList();
    }
  }, [currentBot, filterParams]);

  useEffect(() => {
    if (branchDeleteState.success) {
      notificationSuccess(t("deleted", { ns: namespaces.branches }));
      resetBranchDelete();
      getList();
    }
  }, [branchDeleteState.success]);

  const onFilterChange = (params: IBranchesListFilterParams) => {
    setFilterParams({ ...filterParams, offset: undefined, ...params });
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: (page - 1) * 10 });
  };

  const onDelete = (id: number) => {
    branchDelete(id);
  };

  const tableColumns = useMemo(() => {
    const columns: ColumnsType<IBranchesListItemModel> = [
      {
        title: "ID",
        dataIndex: "num",
        width: 50,
        render: (_, row) => <div>{row.id}</div>,
      },
      {
        title: t("fields.name"),
        dataIndex: "name",
        render: (_, row) => row.name[currentLang],
      },
      {
        title: t("address"),
        dataIndex: "address",
        render: (_, row) => row.address,
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
                onClick={() => branchAddModalControl.open({ id: row.id })}
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
                  loading={branchDeleteState.loading}
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
        <h1>{t("branchesList", { ns: namespaces.branches })}</h1>
      )}
    >
      {!branchesListState.data ? (
        <div className="bg-loader">
          <Spinner />
        </div>
      ) : (
        <div>
          <ContentLayout.Actions>
            <BranchesListFilter
              filterParams={filterParams}
              onFilterChange={onFilterChange}
            />
            <ButtonUI
              type="primary"
              onClick={() => branchAddModalControl.open()}
            >
              {t("createBranch", { ns: namespaces.branches })} +
            </ButtonUI>
          </ContentLayout.Actions>
          <TableUI
            loading={branchesListState.loading}
            dataSource={branchesListState.data.results}
            columns={tableColumns}
            pagination={{
              total: branchesListState.data.count,
              pageSize: 10,
              current: filterParams.offset ? filterParams.offset / 10 + 1 : 1,
              hideOnSinglePage: true,
              onChange: onChangePagination,
            }}
            bordered={true}
          />
        </div>
      )}
      <ModalUI
        open={branchAddModalControl.modalProps.open}
        onCancel={branchAddModalControl.close}
        width={700}
      >
        <BranchAddEdit
          modalControl={branchAddModalControl}
          callback={getList}
        />
      </ModalUI>
    </ContentLayout>
  )
};

export default BranchesList;