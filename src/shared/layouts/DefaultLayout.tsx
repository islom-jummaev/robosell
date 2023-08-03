import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { $currentUser } from "@stores/account";

import mainLoader from "@assets/images/loader.gif";
import { AppSidebar } from "@/components/sidebar";
import { AppNavbar } from "@/components/header";
import { $botsList, $currentBot } from "@stores/bots";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "@utils/getters";

export const DefaultLayout = () => {
  const { request: getCurrentUser, reset: resetCurrentUser, ...currentUserState } = $currentUser.useStore();
  const { request: getBotsList, reset: resetBotsList, ...botsListState } = $botsList.useStore();
  const { currentBot, update: updateCurrentBot } = $currentBot.useStore();

  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = getCurrentLang();

  const [openLayout, setOpenLayout] = useState<boolean>(false);

  useEffect(() => {
    const currentUserId: string | null = localStorage.getItem("currentUserId");

    if (currentUserId) {
      getCurrentUser(currentUserId);
    } else {
      navigate("/auth");
    }

    return () => {
      resetCurrentUser();
      resetBotsList();
    }
  }, []);

  useEffect(() => {
    if (currentUserState.data) {
      if (currentLang !== currentUserState.data.language) {
        i18n.changeLanguage(currentUserState.data.language).then(() => {
          getBotsList();
        });
      } else {
        getBotsList();
      }
    }
  }, [currentUserState.data]);

  useEffect(() => {
    if (botsListState.data && !openLayout) {
      setOpenLayout(true);

      const bot = botsListState.data.find((item) => item.is_current);

      updateCurrentBot(bot ? { id: String(bot.id), name: bot.firstname } : null);

      if (!botsListState.data.length) {
        navigate("/bots-list");
      }
    }
  }, [botsListState.data]);

  if (currentUserState.loading || !openLayout || currentBot === undefined) {
    return (
      <div className="default-layout__loader">
        <img src={mainLoader} alt="mainLoader" />
      </div>
    );
  }

  return (
    <div className="default-layout">
      <AppSidebar />

      <div className="container-layout">
        <div className="container-layout__box">
          <AppNavbar />

          <Outlet />
        </div>
      </div>
    </div>
  );
}
