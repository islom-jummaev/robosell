import React, { useEffect, FC } from "react";


import { ButtonUI } from "@ui/button";
import { useTranslation } from "react-i18next";

import styles from "../../styles.module.scss";
import { namespaces } from "@core/localization/i18n.constants";
import { $botDelete, $botsList } from "@stores/bots";
import { notificationSuccess } from "@ui/notifications";
import { useNavigate } from "react-router";

type PropsTypes = {
  botId: string;
}

export const BotSettingsDelete: FC<PropsTypes> = (props) => {
  const { botId } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    request: botDeleteRequest,
    reset: resetBotDelete,
    ...botDeleteState
  } = $botDelete.useStore();
  const { request: getBotsList } = $botsList.useStore();

  useEffect(() => {
    if (botDeleteState.success) {
      notificationSuccess(t("notifications.botDeleted"));
      getBotsList();
      resetBotDelete();
      navigate("/bots-list");
    }
  }, [botDeleteState.success])

  const onDelete = () => {
    botDeleteRequest(botId);
  };

  return (
    <div className={styles.settingsDeleteBot}>
      <div className={styles.settingsRow}>
        <div className={styles.settingsRowTitle}>
          {t("settings.delete.title", { ns: namespaces.bots })}
        </div>
        <div className={styles.settingsRowText}>
          {t("settings.delete.text", { ns: namespaces.bots })}
        </div>
      </div>
      <ButtonUI
        type="danger"
        onClick={onDelete}
        loading={botDeleteState.loading}
      >
        {t("buttons.delete")}
      </ButtonUI>
    </div>
  )
};