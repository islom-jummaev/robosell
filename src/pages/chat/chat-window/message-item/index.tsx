import React, { FC } from "react";
import { Image } from "antd";
import styles from "@/pages/chat/styles.module.scss";
import { formatDate } from "@utils/formatters";
import { IChatWithUserItemModel } from "@/businessLogic/models/chat";
import { DownloadIcon } from "@assets/icons";
import { VideoUi } from "@ui/video";
import { useTranslation } from "react-i18next";

type PropsTypes = {
  item: IChatWithUserItemModel
}

export const ChatWindowMessageItem: FC<PropsTypes> = (props) => {
  const { item } = props;

  return (
    <div className={item.is_bot ? styles.chatAreaMessageMineWrap : styles.chatAreaMessageForMeWrap}>
      <div
        className={`
          ${styles.chatAreaMessageItem}
          ${item.is_bot ? styles.chatAreaMessageMine : styles.chatAreaMessageForMe}
          ${item.file && (item.file.type === "image" || item.file.type === "video") ? styles.chatAreaMessageImageItem : ""}
        `}
      >
        {item.file ? (
          <div className={styles.chatAreaMessageFile}>
            {item.file.type === "image" ? (
              <div className={styles.chatAreaMessageImageFile}>
                <Image
                  src={item.file.url}
                  alt={item.file.name}
                />
              </div>
            ) : item.file.type === "video" ? (
              <div className={styles.chatAreaMessageVideoFile}>
                <VideoUi url={item.file.url} />
              </div>
            ) : (
              <a href={item.file.url} target="_blank" download>
                <span className={styles.chatAreaMessageFileIcon}>
                  <DownloadIcon />
                </span>
                <span>{item.file.name}</span>
              </a>
            )}
          </div>
        ) : null}
        {!!item.text && (
          <div className={`${styles.chatAreaMessageText} ${!!item.file ? styles.hasFile : ""}`}>
            {item.text.replaceAll("&#x27;", "‘")}
          </div>
        )}
        <div className={styles.chatAreaMessageTime}>
          {formatDate(item.created_at, "HH:mm")}
        </div>
      </div>
    </div>
  );
};