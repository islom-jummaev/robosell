import React, { FC, useEffect, useRef, useState } from "react";
import { Upload } from "antd";
import styles from "../styles.module.scss";
import { ButtonUI } from "@ui/button";
import { AttachIcon, BasketBackIcon, CloseIcon, PhoneIcon, SendMessageIcon } from "@assets/icons";
import { InputUI } from "@ui/input";
import useEventListener from "@/hooks/useEventListener";
import { $chatListNewest, $chatWithUser, $chatWithUserDetails } from "@stores/chat";
import { $currentBot } from "@stores/bots";
import { IChatFileModel, IChatWithUserFilterParams, IChatWithUserItemModel } from "@/businessLogic/models/chat";
import { Spinner } from "@ui/spinner";
import dayjs from "dayjs";
import userIcon from "@assets/images/user-icon.svg";
import cn from "classnames";
import { $chatNotification, $sendChatNotification, $showNotifications } from "@stores/notifications";
import { ModalUI } from "@ui/modal";
import { useModalControl } from "@/hooks/useModalControl";
import { ChatFileSend, ChatFileSendModalPropTypes } from "@/pages/chat/chat-window/chat-file-send";
import { ChatWindowMessageItem } from "@/pages/chat/chat-window/message-item";
import { isFileCorrespondSize } from "@utils/formatters";
import { notificationWarning } from "@ui/notifications";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const pageSize = 20;

type PropsTypes =  {
  id: string | undefined;
};

export const ChatWindow: FC<PropsTypes> = (props) => {
  const { id } = props;
  const isEmpty = id === "empty";

  const { t } = useTranslation();
  const navigate = useNavigate();

  const messagesArea = useRef(null);

  const { currentBot } = $currentBot.useStore();
  const chatNotificationState = $chatNotification.useStore();
  const sendChatNotificationState = $sendChatNotification.useStore();
  const showNotificationsState = $showNotifications.useStore();
  const { update: updateChatListNewest } = $chatListNewest.useStore();
  const { request: getChatWithUser, reset: resetChatWithUser, ...chatWithUserState } = $chatWithUser.useStore();
  const { request: getChatWithUserDetails, reset: resetChatWithUserDetails, ...chatWithUserDetailsState } = $chatWithUserDetails.useStore();


  const [filterParams, setFilterParams] = useState<IChatWithUserFilterParams>({
    limit: pageSize,
    offset: 0
  });
  const [messages, setMessages] = useState<{ [key: string]: Array<IChatWithUserItemModel> }>({});
  const [liveMessages, setLiveMessages] = useState<{ [key: string]: Array<IChatWithUserItemModel> }>({});
  const [messageValue, setMessageValue] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState(undefined);

  const fileSendModalControl = useModalControl<ChatFileSendModalPropTypes>();

  const getMessages = (params: IChatWithUserFilterParams) => {
    if (id) {
      getChatWithUser({
        botuser: id,
        ...params
      });
    }
  };

  useEffect(() => {
    showNotificationsState.update(false);

    return () => {
      resetChatWithUser();
      showNotificationsState.update(true);
    }
  }, []);

  useEffect(() => {
    if (!isEmpty && id) {
      getChatWithUserDetails(id);

      if (Object.keys(messages).length) {
        setMessages({});
      }

      if (filterParams.offset && filterParams.offset > 0) {
        setFilterParams({
          limit: pageSize,
          offset: 0
        });
      }

      getMessages({
        ...filterParams,
        offset: 0
      });
    }

    if (chatWithUserState.success) {
      setMessages({});
      if (Object.keys(liveMessages).length) {
        setLiveMessages({});
      }
      resetChatWithUser();
    }

    if (chatWithUserDetailsState.success) {
      resetChatWithUserDetails();
    }
  }, [id]);


  useEffect(() => {
    if (chatWithUserState.data) {
      const messagesDate = {
        ...messages,
      };

      chatWithUserState.data.results.forEach((item) => {
        const curDate = dayjs(item.created_at).format("DD-MM-YYYY");

        if (messagesDate[curDate]) {
          messagesDate[curDate].push(item);
        } else {
          messagesDate[curDate] = [item];
        }
      });

      setMessages(messagesDate);
    }
  }, [chatWithUserState.data]);

  useEffect(() => {
    if (chatNotificationState.notification) {
      const { data: messageData } = chatNotificationState.notification;

      if (String(messageData.botuser) === String(id)) {
        const messagesDate = {
          ...liveMessages,
        };

        const curDate = dayjs(messageData.created_at).format("DD-MM-YYYY");

        const item = {
          file: null,
          is_bot: false,
          text: messageData.message,
          id: messageData.message_id,
          created_at: messageData.created_at,
          botuser: messageData.botuser,
          bot: currentBot ? currentBot.id : ""
        };

        if (messages[curDate]) {
          if (messagesDate["EXIST"]) {
            messagesDate["EXIST"].unshift(item);
          } else {
            messagesDate["EXIST"] = [item];
          }
        } else if (liveMessages[curDate]) {
          messagesDate[curDate].unshift(item);
        } else {
          messagesDate[curDate] = [item];
        }

        setLiveMessages(messagesDate);
      }

      updateChatListNewest({
        id: messageData.botuser,
        firstname: messageData.firstname,
        photo: messageData.photo,
        chat: {
          last_chat: messageData.message,
          new_chats_count: messageData.new_chats_count
        },
        last_chat_time: dayjs(messageData.created_at).format("YYYY-MM-DDTHH:mm"),
      });

      chatNotificationState.reset();
    }
  }, [chatNotificationState.notification]);

  const onFilterChange = (params: IChatWithUserFilterParams) => {
    const newFilterParams = { ...filterParams, offset: undefined, ...params };
    setFilterParams(newFilterParams);
    getMessages(newFilterParams);
  };

  const onChangePagination = (page: number) => {
    onFilterChange({ offset: page });
  };

  useEventListener("scroll", (e) => {
    const aa: any = messagesArea.current;

    // @ts-ignore
    const scrollHeight = aa.scrollHeight;
    const scrollPosition = aa.scrollTop * -1;
    const offsetHeight = aa.offsetHeight;

    const limit = (scrollHeight - offsetHeight);

    if (scrollPosition === limit && !chatWithUserState.loading) {
      const newOffset = filterParams.offset ? filterParams.offset + pageSize : pageSize;
      if (chatWithUserState.data && chatWithUserState.data.count > newOffset) {
        onChangePagination(newOffset);
      }
    }
  }, messagesArea);

  const onMessageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;

    setMessageValue(val);
  };

  const onSendMessage = (fileData?: { file: IChatFileModel; caption: string; created_at: string }) => {
    if (messageValue || fileData) {
      const data = {
        type: "CHAT",
        data: {
          botuser: id,
          message: messageValue
        }
      };

      if (!fileData) {
        sendChatNotificationState.update(JSON.stringify(data));
      }

      const messagesDate: any = {
        ...liveMessages,
      };

      const curDate = dayjs().format("DD-MM-YYYY");

      const item = {
        file: fileData ? fileData.file : null,
        is_bot: true,
        text: fileData ? fileData.caption : messageValue,
        id: dayjs().format("YYYY-MM-DD, HH:mm:ss:SSS"),
        created_at: fileData ? fileData.created_at : dayjs().format("YYYY-MM-DDTHH:mm"),
        botuser: id,
        bot: currentBot ? currentBot.id : ""
      };

      if (messages[curDate]) {
        if (messagesDate["EXIST"]) {
          messagesDate["EXIST"].unshift(item);
        } else {
          messagesDate["EXIST"] = [item];
        }
      } else if (liveMessages[curDate]) {
        messagesDate[curDate].unshift(item);
      } else {
        messagesDate[curDate] = [item];
      }

      setLiveMessages(messagesDate);

      updateChatListNewest({
        id: String(id),
        firstname: chatWithUserDetailsState.data ? chatWithUserDetailsState.data.firstname : "",
        photo: chatWithUserDetailsState.data ? chatWithUserDetailsState.data.photo : "",
        chat: {
          last_chat: fileData ? t("file") : messageValue,
          new_chats_count: 0
        },
        last_chat_time: item.created_at,
      });

      setMessageValue("");
    }
  }

  const beforeUploadPhoto = (file: any) => {
    const correspondSize = isFileCorrespondSize(file, 10);

    if (!correspondSize) {
      notificationWarning(t("warnings.sizeMb", { fileSize: "10" }));
      return false;
    }

    if (correspondSize) {
      setUploadedFile(file);
      fileSendModalControl.open({ botuser_id: id });
    }

    return false;
  };

  return (
    <div className={styles.chatRight}>
      {isEmpty && (
        <div className={styles.chatEmptyWr}>
          <div className={styles.chatEmpty}>
            {t("selectChat")}
          </div>
        </div>
      )}
      <>
        <div className={styles.chatHead}>
          <div className={`${styles.chatListItem}`}>
            <div className={styles.chatListItemBack}>
              <ButtonUI
                type="primary"
                withIcon
                circle
                onClick={() => {
                  navigate("/chat/empty");
                }}
              >
                <BasketBackIcon />
              </ButtonUI>
            </div>
            <div
              className={`${cn(`${styles.chatListItemPic}`, {
                [styles.emptyPic]: (chatWithUserDetailsState.data && !chatWithUserDetailsState.data.photo) || !chatWithUserDetailsState.data
              })}`}
            >
              <img src={chatWithUserDetailsState.data && chatWithUserDetailsState.data.photo ? chatWithUserDetailsState.data.photo : userIcon} alt=""/>
            </div>
            <div className={styles.chatListItemNameWrap}>
              <div className={styles.chatListItemName}>{chatWithUserDetailsState.data?.firstname}</div>
              <div className={`${styles.chatListItemLastMessage} ${styles.online}`}></div>
            </div>
            <div className={styles.chatHeadActions}>
              {(chatWithUserDetailsState.data && chatWithUserDetailsState.data.phone) && (
                <a href={`tel:${chatWithUserDetailsState.data.phone}`}>
                  <PhoneIcon />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className={styles.chatAreaWrap}>
          {chatWithUserState.loading && (
            <div className="bg-loader">
              <Spinner />
            </div>
          )}
          <div className={`${styles.chatArea} fancy-scrollbar`} ref={messagesArea}>
            {Object.entries(liveMessages).map(([date, messagesByDate]) => (
              <React.Fragment key={date}>
                {messagesByDate.map((item) => (
                  <ChatWindowMessageItem item={item} key={item.id} />
                ))}
                {date !== "EXIST" && (
                  <div className={styles.messageDate}>{date}</div>
                )}
              </React.Fragment>
            ))}

            {Object.entries(messages).map(([date, messagesByDate]) => (
              <React.Fragment key={date}>
                {messagesByDate.map((item) => (
                  <ChatWindowMessageItem item={item} key={item.id} />
                ))}
                <div className={styles.messageDate}>{date}</div>
              </React.Fragment>
            ))}
          </div>
          <div className={styles.chatFormWrap}>
            <div className={styles.chatFormText}>
              <InputUI.TextArea
                placeholder="Напишите сообщение"
                autoSize={true}
                value={messageValue}
                onChange={onMessageChange}
              />
            </div>
            <div className={styles.chatFormActions}>
              <Upload
                beforeUpload={beforeUploadPhoto}
                showUploadList={false}
              >
                <ButtonUI
                  withIcon
                >
                  <AttachIcon />
                </ButtonUI>
              </Upload>
              <ButtonUI
                withIcon
                onClick={() => onSendMessage()}
              >
                <SendMessageIcon />
              </ButtonUI>
            </div>
          </div>
        </div>
      </>
      <ModalUI
        open={fileSendModalControl.modalProps.open}
        onCancel={fileSendModalControl.close}
        width={700}
      >
        <ChatFileSend
          modalControl={fileSendModalControl}
          callback={onSendMessage}
          messageValue={messageValue}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        />
      </ModalUI>
    </div>
  );
};