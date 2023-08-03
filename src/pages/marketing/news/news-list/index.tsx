import React, { useEffect, useState, useMemo } from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { $newsDelete, $newsList } from "@stores/news";
import { TableUI } from "@ui/table";
import { Spinner } from "@ui/spinner";
import { ColumnsType } from "antd/lib/table/interface";
import { INewsListFilterParams, INewsListItemModel } from "@/businessLogic/models/news";

import { $currentBot } from "@stores/bots";
import { ButtonUI } from "@ui/button";
import { DeleteIcon, EditIcon } from "@assets/icons";
import { notificationSuccess } from "@ui/notifications";
import { ModalConfirm } from "@ui/modalConfirm";
import { formatCount, formatDate } from "@utils/formatters";
import { useModalControl } from "@/hooks/useModalControl";
import { ModalUI } from "@ui/modal";
import { NewsAdd, NewsAddEditModalPropTypes } from "./add";
import { getCurrentLang } from "@utils/getters";
import { Image } from "antd";


const NewsList = () => {
  const { t } = useTranslation();
  const currentLang = getCurrentLang();

  const { currentBot } = $currentBot.useStore();
  const { request: getNewsList, reset: resetNewsList, ...newsListState } = $newsList.useStore();
  const { request: newsDelete, reset: resetNewsDelete, ...newsDeleteState } = $newsDelete.useStore();

  const newsAddEditModalControl = useModalControl<NewsAddEditModalPropTypes>();

  const [filterParams, setFilterParams] = useState<INewsListFilterParams>({});

  const getList = () => {
    if (currentBot) {
      getNewsList({
        ...filterParams,
        bot_id: currentBot.id,
      });
    }
  };

  useEffect(() => {
    return () => {
      resetNewsList();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getList();
    }
  }, [currentBot, filterParams]);

  useEffect(() => {
    if (newsDeleteState.success) {
      notificationSuccess(t("news.deleted", { ns: namespaces.marketing }));
      resetNewsDelete();
      getList();
    }
  }, [newsDeleteState.success]);


  const onFilterChange = (params: INewsListFilterParams) => {
    setFilterParams({ ...filterParams, offset: undefined, ...params });
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: (page - 1) * 10 });
  };

  const onDelete = (id: number) => {
    newsDelete(id);
  };

  const tableColumns = useMemo(() => {
    const columns: ColumnsType<INewsListItemModel> = [
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
        title: t("fields.title"),
        dataIndex: "title",
        render: (_, row) => row.title[currentLang],
      },
      {
        title: t("fields.text"),
        dataIndex: "text",
        render: (_, row) => row.desc[currentLang],
      },
      {
        title: t("dateAdded"),
        dataIndex: "created_at",
        render: (_, row) => <div className="w-n-r">{formatDate(row.created_at)}</div>,
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
                onClick={() => newsAddEditModalControl.open({ id: row.id })}
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
                  loading={newsDeleteState.loading}
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
        <h1>{t("news.title", { ns: namespaces.marketing })}</h1>
      )}
    >

      {!newsListState.data ? (
        <div className="bg-loader">
          <Spinner />
        </div>
      ) : (
        <>
          <ContentLayout.Actions>
            <div></div>
            <ButtonUI
              type="primary"
              onClick={() => newsAddEditModalControl.open()}
            >
              {`${t("news.create", { ns: namespaces.marketing })} +`}
            </ButtonUI>
          </ContentLayout.Actions>
          <TableUI
            loading={newsListState.loading || newsDeleteState.loading}
            dataSource={newsListState.data.results}
            columns={tableColumns}
            pagination={{
              total: newsListState.data.count,
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
        open={newsAddEditModalControl.modalProps.open}
        onCancel={newsAddEditModalControl.close}
        width={700}
      >
        <NewsAdd
          modalControl={newsAddEditModalControl}
          callback={getList}
        />
      </ModalUI>
    </ContentLayout>
  )
};

export default NewsList;