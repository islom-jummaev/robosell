import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/pages/chat/styles.module.scss";
import { InputUI } from "@ui/input";
import userIcon from "@assets/images/user-icon.svg";
import { formatDate } from "@utils/formatters";
import { Badge } from "antd";
import { CheckIcon } from "@assets/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { $chatList, $chatListNewest } from "@stores/chat";
import { $currentBot } from "@stores/bots";
import { IChatListFilterParams, IChatListItemModel } from "@/businessLogic/models/chat";
import useEventListener from "@/hooks/useEventListener";
import cn from "classnames";
import { ChatListItem } from "@/pages/chat/chat-list/item";

const pageSize = 10;

type PropsTypes = {
  id: string | undefined;
}

export const ChatList: FC<PropsTypes> = (props) => {
  const { id: currentChatId } = props;
  const { t } = useTranslation();


  const productListRef = useRef<null | HTMLDivElement>(null);

  const { request: getChatList, reset: resetChatList, ...chatListState } = $chatList.useStore();
  const { list: chatListNewest, reset: resetChatListNewest } = $chatListNewest.useStore();

  const { currentBot } = $currentBot.useStore();

  const [filterParams, setFilterParams] = useState<IChatListFilterParams>({});
  const [chatList, setChatList] = useState<Array<IChatListItemModel>>([]);
  const [initCurrentBot, setInitCurrentBot] = useState(currentBot);

  const getList = () => {
    if (currentBot) {
      getChatList({
        bot_id: currentBot.id,
        ...filterParams
      });
    }
  };

  useEventListener("scroll", (e) => {
    const aa: any = productListRef.current;

    // @ts-ignore
    const scrollHeight = aa.scrollHeight;
    const scrollPosition = aa.scrollTop;
    const offsetHeight = aa.offsetHeight;

    const limit = (scrollHeight - offsetHeight);

    if (scrollPosition === limit && !chatListState.loading) {
      if (chatListState.data && chatListState.data.count > chatList.length) {
        onChangePagination(filterParams.offset ? filterParams.offset + pageSize : pageSize);
      }
    }
  }, productListRef);

  useEffect(() => {
    return () => {
      resetChatList();
      resetChatListNewest();
    }
  }, []);

  useEffect(() => {
    getList();
  }, [filterParams])

  useEffect(() => {
    if (currentBot && initCurrentBot && currentBot.id !== initCurrentBot.id) {
      setFilterParams({});
      setChatList([]);
      resetChatList();
      resetChatListNewest();
      setInitCurrentBot(currentBot);
    }
  }, [currentBot]);

  useEffect(() => {
    if (chatListState.data) {
      setChatList([
        ...chatList,
        ...chatListState.data.results
      ]);
    }
  }, [chatListState.data]);

  const chatFilters = useMemo(() => {
    return [
      { name: t("all"), key: "all", value: undefined },
      { name: t("read"), key: "read", value: false },
      { name: t("notRead"), key: "notRead", value: true }
    ];
  }, []);

  const onFilterChange = (params: IChatListFilterParams) => {
    setFilterParams({ ...filterParams, offset: 0, ...params });
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: page });
  };

  const onStatusChange = (val: boolean | undefined) => {
    if (filterParams.is_new !== val) {
      setChatList([]);
      resetChatList();
      resetChatListNewest();
      onFilterChange({ is_new: val });
    }
  };

  return (
    <div className={styles.chatLeft}>
      <div className={styles.chatListSearch}>
        <InputUI.Search
          placeholder={t("placeholders.searchContacts")}
          onChange={(e, search) => {
            setChatList([]);
            resetChatList();
            resetChatListNewest();
            onFilterChange({ search });
          }}
        />
      </div>
      <div className={styles.chatListFilter}>
        {chatFilters.map((item) => (
          <div
            className={`${cn(`${styles.chatListFilterItem}`, {
              [styles.chatListFilterItemActive]: filterParams.is_new === item.value
            })}`}
            onClick={() => onStatusChange(item.value)}
            key={item.key}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className={`${styles.chatList} fancy-scrollbar`} ref={productListRef}>
        {filterParams.is_new !== false && (
          <>
            {chatListNewest.map((item) => (
              <ChatListItem
                key={item.id}
                item={item}
                currentChatId={currentChatId}
                notHide={true}
              />
            ))}
          </>
        )}
        {chatList.map((item) => (
          <ChatListItem
            key={item.id}
            item={item}
            currentChatId={currentChatId}
          />
        ))}
      </div>
    </div>
  )
};