import React, { useEffect, useState, useMemo } from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { $mailingDelete, $mailingList, $mailingSend, $mailingCopy } from "@stores/mailing";
import { $currentBot } from "@stores/bots";
import { TableUI } from "@ui/table";
import { Spinner } from "@ui/spinner";
import { ModalUI } from "@ui/modal";
import { ButtonUI } from "@ui/button";
import { notificationSuccess } from "@ui/notifications";
import { ModalConfirm } from "@ui/modalConfirm";
import { ColumnsType } from "antd/lib/table/interface";
import { IMailingListFilterParams, IMailingListItemModel } from "@/businessLogic/models/mailing";
import { useModalControl } from "@/hooks/useModalControl";
import { MailingAddEdit, MailingAddEditModalPropTypes } from "./add-edit";
import { MailingAddTime, MailingAddTimeModalPropTypes } from "@/pages/marketing/mailing/mailing-list/add-time";
import { MailingStat, MailingStatModalPropTypes } from "./stat";
import { DeleteIcon, EditIcon, MonitoringIcon } from "@assets/icons";


import styles from "./styles.module.scss";
import { Image } from "antd";
import { formatDate } from "@utils/formatters";

const MailingList = () => {
  const { t } = useTranslation();

  const { currentBot } = $currentBot.useStore();
  const { request: getMailingList, reset: resetMailingList, ...mailingListState } = $mailingList.useStore();
  const { request: mailingDelete, reset: resetMailingDelete, ...mailingDeleteState } = $mailingDelete.useStore();
  const { request: mailingSend, reset: resetMailingSend, ...mailingSendState } = $mailingSend.useStore();
  const { request: mailingCopy, reset: resetMailingCopy, ...mailingCopyState } = $mailingCopy.useStore();

  const mailingAddEditModalControl = useModalControl<MailingAddEditModalPropTypes>();
  const mailingAddTimeModalControl = useModalControl<MailingAddTimeModalPropTypes>();
  const mailingStatModalControl = useModalControl<MailingStatModalPropTypes>();

  const [filterParams, setFilterParams] = useState<IMailingListFilterParams>({});

  const getList = () => {
    if (currentBot) {
      getMailingList({
        ...filterParams,
        bot_id: currentBot.id,
      });
    }
  }

  useEffect(() => {
    return () => {
      resetMailingList();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getList();
    }
  }, [currentBot, filterParams]);

  useEffect(() => {
    if (mailingDeleteState.success) {
      notificationSuccess(t("mailing.deleted", { ns: namespaces.marketing }));
      resetMailingDelete();
      getList();
    }
  }, [mailingDeleteState.success]);

  useEffect(() => {
    if (mailingSendState.success) {
      notificationSuccess(t("mailing.send", { ns: namespaces.marketing }));
      resetMailingSend();
      getList();
    }
  }, [mailingSendState.success]);

  useEffect(() => {
    if (mailingCopyState.success) {
      notificationSuccess(t("mailing.copy", { ns: namespaces.marketing }));
      resetMailingCopy();
      getList();
    }
  }, [mailingCopyState.success]);

  const onFilterChange = (params: IMailingListFilterParams) => {
    setFilterParams({ ...filterParams, offset: undefined, ...params });
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: (page - 1) * 10 });
  };

  const onCopyMailing = (id: number) => {
    mailingCopy(id);
  };

  const onSendMailing = (id: number) => {
    mailingSend(id);
  };

  const onDelete = (id: number) => {
    mailingDelete(id);
  };

  const tableColumns = useMemo(() => {
    const columns: ColumnsType<IMailingListItemModel> = [
      {
        title: "ID",
        dataIndex: "num",
        render: (_, row) => <div>#{row.id}</div>,
      },
      {
        title: t("image"),
        dataIndex: "photo",
        align: "center",
        render: (_, row) => (
          <>
            {row.photo ? (
              <div className="mailing-photo">
                <Image
                  src={row.photo}
                  alt=""
                />
              </div>
            ): (
              "-"
            )}
          </>
        ),
      },
      {
        title: t("buttons", { ns: namespaces.marketing }),
        dataIndex: "buttons",
        align: "center",
        render: (_, row) => (
          <div className={styles.linksWrap}>
            {row.buttons && row.buttons.length ? row.buttons.map((item) => (
              <ButtonUI link={item.url} target="_blank" key={item.id}>{item.name}</ButtonUI>
            )): t("noButtons", { ns: namespaces.marketing })}
          </div>
        ),
      },
      {
        title: t("publicationDate"),
        dataIndex: "publicationDate",
        align: "center",
        render: (_, row) => (
          <div className={styles.dateButtons}>
            {row.is_send ? (
              <ButtonUI
                type="primary"
                size="small"
                fullWidth
                onClick={() => onCopyMailing(row.id)}
                loading={mailingCopyState.loading}
              >
                {t("duplicate", { ns: namespaces.marketing })}
              </ButtonUI>
            ) : (
              <>
                <div>
                  {(row.schedule_date && row.schedule_time) && (
                    <div className={styles.scheduleDate}>
                      <div>{formatDate(row.schedule_date, "DD.MM.YYYY")}</div>
                      <div>{row.schedule_time.substring(0, 5)}</div>
                    </div>
                  )}
                  <ButtonUI
                    type="success"
                    size="small"
                    fullWidth
                    onClick={() => onSendMailing(row.id)}
                    loading={mailingSendState.loading}
                  >
                    {t("publicateNow", { ns: namespaces.marketing })}
                  </ButtonUI>
                </div>
                <div>
                  <ButtonUI
                    type="primary"
                    size="small"
                    fullWidth
                    onClick={() => mailingAddTimeModalControl.open({ id: row.id })}
                  >
                    {t("mailing.setTime", { ns: namespaces.marketing })}
                  </ButtonUI>
                </div>
              </>
            )}
          </div>
        ),
      },
      {
        title: t("actions"),
        dataIndex: "actions",
        align: "center",
        render: (_, row) => {
          return (
            <div className="table-actions-btns">
              <ButtonUI
                type="secondary"
                withIcon
                circle
                onClick={() => mailingAddEditModalControl.open({ id: row.id })}
              >
                <EditIcon />
              </ButtonUI>
              <ButtonUI
                type="secondary"
                withIcon
                circle
                onClick={() => mailingStatModalControl.open({ id: row.id })}
              >
                <MonitoringIcon />
              </ButtonUI>
              <ModalConfirm
                title={t("notifications.confirmDelete")}
                onOk={() => onDelete(row.id)}
                okType={"danger"}
              >
                <ButtonUI
                  type="primary"
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
        <h1>{t("mailing.title", { ns: namespaces.marketing })}</h1>
      )}
    >

      {!mailingListState.data ? (
        <div className="bg-loader">
          <Spinner />
        </div>
      ) : (
        <>
          <ContentLayout.Actions>
            <div></div>
            <ButtonUI
              type="primary"
              onClick={() => mailingAddEditModalControl.open()}
            >
              {`${t("mailing.create", { ns: namespaces.marketing })} +`}
            </ButtonUI>
          </ContentLayout.Actions>
          <TableUI
            loading={mailingListState.loading || mailingDeleteState.loading || mailingSendState.loading}
            dataSource={mailingListState.data.results}
            columns={tableColumns}
            pagination={{
              total: mailingListState.data.count,
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
        open={mailingAddEditModalControl.modalProps.open}
        onCancel={mailingAddEditModalControl.close}
        width={700}
      >
        <MailingAddEdit
          modalControl={mailingAddEditModalControl}
          callback={getList}
        />
      </ModalUI>
      <ModalUI
        open={mailingAddTimeModalControl.modalProps.open}
        onCancel={mailingAddTimeModalControl.close}
        width={700}
      >
        <MailingAddTime
          modalControl={mailingAddTimeModalControl}
          callback={getList}
        />
      </ModalUI>
      <ModalUI
        open={mailingStatModalControl.modalProps.open}
        onCancel={mailingStatModalControl.close}
        width={700}
      >
        <MailingStat
          modalControl={mailingStatModalControl}
        />
      </ModalUI>
    </ContentLayout>
  )
};

export default MailingList;