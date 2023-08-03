import React, { useEffect, useState } from "react";

import styles from "../../styles.module.scss";
import cn from "classnames";
import userIcon from "@assets/images/user-icon.svg";
import { formatDate } from "@utils/formatters";
import { Badge } from "antd";
import { CheckIcon } from "@assets/icons";
import { IChatListItemModel } from "@/businessLogic/models/chat";
import { useNavigate } from "react-router";
import { $chatListNewest } from "@stores/chat";
import { useTranslation } from "react-i18next";

type PropsTypes = {
  item: IChatListItemModel;
  currentChatId: string | undefined;
  notHide?: boolean;
}

export const ChatListItem: React.FC<PropsTypes> = (props) => {
  const { item, currentChatId, notHide } = props;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const isActive = String(item.id) === String(currentChatId);

  const { ids: chatListNewestIds } = $chatListNewest.useStore();

  const [newChatsCount, setNewChatsCount] = useState<number>(isActive ? 0 : item.chat.new_chats_count);

  useEffect(() => {
    if (newChatsCount !== item.chat.new_chats_count) {
      setNewChatsCount(item.chat.new_chats_count);
    }
  }, [item.chat.new_chats_count]);

  return (
    <div
      className={`${cn(`${styles.chatListItem}`, {
        [styles.active]: isActive,
        [styles.hidden]: chatListNewestIds[item.id] && !notHide
      })}`}

      onClick={() => {
        if (!isActive) {
          setNewChatsCount(0);
          navigate(`/chat/${item.id}`);
        }
      }}
    >
      <div className={`${styles.chatListItemPic} ${item.photo ? "" : styles.emptyPic}`}>
        <img src={item.photo ? item.photo : userIcon} alt=""/>
      </div>
      <div className={styles.chatListItemNameWrap}>
        <div className={styles.chatListItemName}>{item.firstname}</div>
        <div className={styles.chatListItemLastMessage}>
          {item.chat.last_chat ? item.chat.last_chat : t("newUser")}
        </div>
      </div>
      <div className={styles.chatListItemVisit}>
        <div className={styles.chatListItemTime}>{formatDate(item.last_chat_time, "HH:mm")}</div>
        <div className={styles.chatListItemMessageStatus}>
          <div className={styles.chatListItemMessageRead}>
            {!!newChatsCount ? (
              <Badge count={newChatsCount} color="#6662f4" />
            ) : (
              <>
                {!!item.chat.last_chat && (
                  <>
                    <CheckIcon />
                    <CheckIcon />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};