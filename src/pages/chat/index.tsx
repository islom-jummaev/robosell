import React from "react";

import { ContentLayout } from "@/components/content-layout";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ChatWindow } from "@/pages/chat/chat-window";
import { ChatList } from "@/pages/chat/chat-list";


const Chat = () => {
  const { id: currentChatId } = useParams<{ id: string }>();

  const { t } = useTranslation();

  return (
    <ContentLayout
      title={(
        <h1>
          {t("chat")}
        </h1>
      )}
    >
      <div className={`${styles.chatWrap} ${currentChatId !== "empty" ? styles.chatWrapOpened : styles.chatWrapEmpty}`}>
        <ChatList id={currentChatId} />
        <ChatWindow id={currentChatId} />
      </div>
    </ContentLayout>
  )
};

export default Chat;