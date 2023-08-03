import React, { useEffect, useRef, useState } from "react";
import { Popover } from "antd";
import { useNavigate } from "react-router-dom";

import { $changeLanguage, $currentUser } from "@stores/account";
import { ButtonUI } from "@ui/button";
import { LanguageIcon2, LogOutSvgIcon } from "@assets/icons";

import userLogo from "@assets/images/robo-user-logo.png";
import { LanguagePopup } from "@/components/language-popup";
import { useTranslation } from "react-i18next";
import { $currentBot } from "@stores/bots";
import { $chatNotification, $sendChatNotification, $showNotifications, $ordersNotification } from "@stores/notifications";
import { pushNotification } from "@ui/notifications";
import userIcon from "@assets/images/user-icon.svg";
import { formatCount } from "@utils/formatters";

export const AppNavbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const socket = useRef<null | WebSocket>(null);

  const { currentBot } = $currentBot.useStore();
  const currentUserState = $currentUser.useStore();
  const changeLanguageState = $changeLanguage.useStore();
  const chatNotificationState = $chatNotification.useStore();
  const ordersNotificationState = $ordersNotification.useStore();
  const sendChatNotificationState = $sendChatNotification.useStore();
  const showNotificationsState = $showNotifications.useStore();

  const currentUserId: string | null = localStorage.getItem("currentUserId");

  const [socketClosed, setSocketClosed] = useState<boolean>(false);

  useEffect(() => {
    //chatNotificationState.reset();
    connectNotificationSocket();
  }, [currentBot]);

  useEffect(() => {
    if (changeLanguageState.success && currentUserId) {
      changeLanguageState.reset();
      currentUserState.request(currentUserId);
    }
  }, [changeLanguageState.success]);

  useEffect(() => {
    if (socketClosed) {
      connectNotificationSocket();
    }
  }, [socketClosed]);

  useEffect(() => {
    if (sendChatNotificationState.data && socket.current) {
      socket.current.send(sendChatNotificationState.data);
      sendChatNotificationState.reset();
    }
  }, [sendChatNotificationState.data]);

  useEffect(() => {
    if (chatNotificationState.notification) {
      pushNotification((
        <div className="push-notification-toast__chat" onClick={() => navigate(`/chat/${chatNotificationState.notification?.data.botuser}`)}>
          <div
            className={`push-notification-toast__chat__photo ${chatNotificationState.notification.data.photo ? "" : "empty-pic"}`}
          >
            <img src={chatNotificationState.notification.data.photo ? chatNotificationState.notification.data.photo : userIcon} alt=""/>
          </div>
          <div className="push-notification-toast__chat__body">
            <div className="push-notification-toast__chat__body__name">{chatNotificationState.notification.data.firstname}</div>
            <div className="push-notification-toast__chat__body__message">{chatNotificationState.notification.data.message}</div>
          </div>
        </div>
      ));
      chatNotificationState.reset();
    }
  }, [chatNotificationState.notification]);

  useEffect(() => {
    if (ordersNotificationState.notification) {
      pushNotification((
        <div className="push-notification-toast__chat" onClick={() => navigate("/orders")}>
          <div className="push-notification-toast__chat__body">
            <div className="push-notification-toast__chat__body__name">{t("newOrder")}</div>
            <div className="push-notification-toast__chat__body__message">{formatCount(ordersNotificationState.notification.data.total_price)} {t("uzs")}</div>
          </div>
        </div>
      ));
      ordersNotificationState.reset();
    }
  }, [ordersNotificationState.notification]);

  const connectNotificationSocket = () => {
    socket.current = new WebSocket(`wss://notification.robosell.uz/ws/${currentBot?.id}`);

    if (socket.current) {
      socket.current.onopen = () => {
        console.log("connected");
        if (socketClosed) {
          setSocketClosed(false);
        }
      }

      socket.current.onclose = () => {
        console.log("close");
        setSocketClosed(true);
      }

      socket.current.onmessage = (e) => {
        console.log("onmessage", e.data);
        const notificationMessage = JSON.parse(e.data);

        if (notificationMessage.type === "CHAT") {
          chatNotificationState.update(notificationMessage);
        } else if (notificationMessage.type === "ORDER") {
          ordersNotificationState.update(notificationMessage);
        }
      };

      socket.current.onerror = (e) => {
        console.log("error", e);
      }
    }
  };

  const afterLangChange = (language: string) => {
    if (currentUserId) {
      changeLanguageState.request({
        language
      });
    }
  }

  const onLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUserId");
    navigate("/auth");
  };

  return (
    <div className="navbar">
      <div className="navbar__box">
        <div className="navbar__right">
          <LanguagePopup callback={afterLangChange}>
            <ButtonUI
              className="header-lang-btn"
              withIcon
            >
              <LanguageIcon2 />
            </ButtonUI>
          </LanguagePopup>
          <Popover
            overlayClassName="header-dropdown"
            placement="bottomRight"
            content={(
              <div>
                <div className="header-dropdown__head">
                  <div className="header-dropdown__name">{currentUserState.data?.firstname}</div>
                  <div className="header-dropdown__phone">{currentUserState.data?.phone}</div>
                </div>

                <ButtonUI
                  withIcon
                  onClick={onLogOut}
                >
                  <LogOutSvgIcon /> {t("buttons.signOut")}
                </ButtonUI>
              </div>
            )}
            trigger="click"
          >
            <div className="navbar__right--info">
              <img src={userLogo} alt="userLogo" />
              <span>{currentUserState.data?.firstname}</span>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
}