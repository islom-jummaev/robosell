import React, { useEffect, FC } from "react";


import { ButtonUI } from "@ui/button";
import { useTranslation } from "react-i18next";

import styles from "../../styles.module.scss";
import { namespaces } from "@core/localization/i18n.constants";
import { $botRestart, $botsList } from "@stores/bots";
import { notificationSuccess } from "@ui/notifications";

type PropsTypes = {
  botId: string;
}

export const BotSettingsReload: FC<PropsTypes> = (props) => {
  const { botId } = props;

  const { t } = useTranslation();
  const {
    request: botRestartRequest,
    reset: resetBotRestart,
    ...botRestartState
  } = $botRestart.useStore();
  const { request: getBotsList } = $botsList.useStore();

  useEffect(() => {
    if (botRestartState.data && botRestartState.data.message) {
      notificationSuccess(t("notifications.botReloaded"));
      getBotsList();
      resetBotRestart();
    }
  }, [botRestartState.data])

  const onReload = () => {
    botRestartRequest(botId);
  };

  return (
    <div className={styles.settingsReloadBot}>
      <div className={styles.settingsRow}>
        <div className={styles.settingsRowTitle}>
          {t("settings.reload.title", { ns: namespaces.bots })}
        </div>
        <div className={styles.settingsRowText}>
          {t("settings.reload.text", { ns: namespaces.bots })}
        </div>
      </div>
      <ButtonUI
        type="primary"
        onClick={onReload}
        loading={botRestartState.loading}
      >
        {t("buttons.reload")}
      </ButtonUI>
    </div>
  )
};