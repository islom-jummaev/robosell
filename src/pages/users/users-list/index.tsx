import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { $usersList } from "@stores/users";
import { TableUI } from "@ui/table";
import { Spinner } from "@ui/spinner";
import { ColumnsType } from "antd/lib/table/interface";
import { IUsersListItemModel, IUsersListFilterParams } from "@/businessLogic/models/users";
import { $currentBot } from "@stores/bots";

import userIcon from "@assets/images/user-icon.svg";
import { ExternalLinkIcon, TelegramIcon } from "@assets/icons";
import { formatCount, formatDate } from "@utils/formatters";
import { UsersListFilter } from "@/pages/users/users-list/filter";
import { ButtonUI } from "@ui/button";
import { Image } from "antd";

const UsersList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { request: getUsersList, reset: resetUsersList, ...usersListState } = $usersList.useStore();

  const { currentBot } = $currentBot.useStore();

  const [filterParams, setFilterParams] = useState<IUsersListFilterParams>({});

  useEffect(() => {
    return () => {
      resetUsersList();
    }
  }, []);

  useEffect(() => {
    if (currentBot) {
      getUsersList({
        ...filterParams,
        bot_id: currentBot.id
      });
    }
  }, [currentBot, filterParams]);

  const onFilterChange = (params: IUsersListFilterParams) => {
    setFilterParams({ ...filterParams, offset: undefined, ...params });
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: (page - 1) * 10 });
  };



  const tableColumns = useMemo(() => {
    const columns: ColumnsType<IUsersListItemModel> = [
      {
        title: t("image"),
        dataIndex: "photo",
        render: (_, row) => (
          <div className="table-photo">
            {row.photo ? (
              <Image
                src={row.photo}
                alt=""
                height={40}
              />
            ): (
              <img className="table-photo__user" src={userIcon} alt=""/>
            )}
          </div>
        ),
      },
      {
        title: t("fields.firstname"),
        dataIndex: "firstname",
        render: (_, row) => <Link to={`/users/${row.id}`}>{row.firstname}</Link>,
      },
      {
        title: t("fields.username"),
        dataIndex: "username",
        render: (_, row) => (
          <>
          {row.username ? (
              <a className="link-with-icon" href={`https://t.me/${row.username}`} target="_blank">
                {row.username}
                <ExternalLinkIcon />
              </a>
            ) : (
              "-"
            )}
          </>
        ),
      },
      {
        title: t("fields.phone"),
        dataIndex: "phone",
        render: (_, row) => <a href={`tel:${row.phone}`}>{row.phone}</a>,
      },
      {
        title: t("order_count"),
        dataIndex: "order_count",
        render: (_, row) => formatCount(row.orders_count),
      },
      {
        title: t("dateAdded"),
        dataIndex: "created_at",
        render: (_, row) => <div className="w-n-r">{formatDate(row.created_at)}</div>,
      },
      {
        title: t("lastVisit"),
        dataIndex: "last_active",
        render: (_, row) => <div className="w-n-r">{formatDate(row.last_active)}</div>,
      },
      {
        title: t("chat"),
        dataIndex: "chat",
        width: 40,
        render: (_, row) => (
          <ButtonUI
            withIcon
            circle
            link={`/chat/${row.id}`}
          >
            <TelegramIcon width={"34"} height={"24"} />
          </ButtonUI>
        ),
      }
    ];

    return columns;
  }, [usersListState.data]);



  return (
    <ContentLayout
      title={(
        <h1>{t("usersList", { ns: namespaces.users })}</h1>
      )}
    >
      {!usersListState.data ? (
        <div className="bg-loader">
          <Spinner />
        </div>
      ) : (
        <>
          <ContentLayout.Actions>
            <UsersListFilter
              filterParams={filterParams}
              onFilterChange={onFilterChange}
            />
          </ContentLayout.Actions>
          <TableUI
            loading={usersListState.loading}
            dataSource={usersListState.data.results}
            columns={tableColumns}
            pagination={{
              total: usersListState.data.count,
              pageSize: 10,
              current: filterParams.offset ? filterParams.offset / 10 + 1 : 1,
              hideOnSinglePage: true,
              onChange: onChangePagination,
            }}
            bordered={true}
          />
        </>
      )}
    </ContentLayout>
  )
};

export default UsersList;