import React, { useEffect, FC } from "react";


import { ButtonUI } from "@ui/button";
import { useTranslation } from "react-i18next";

import styles from "../../styles.module.scss";
import { namespaces } from "@core/localization/i18n.constants";
import { $botsList, $botStop } from "@stores/bots";
import { notificationSuccess } from "@ui/notifications";

type PropsTypes = {
  botId: string;
}

export const BotSettingsStop: FC<PropsTypes> = (props) => {
  const { botId } = props;

  const { t } = useTranslation();
  const {
    request: botStopRequest,
    reset: resetBotStop,
    ...botStopState
  } = $botStop.useStore();
  const { request: getBotsList } = $botsList.useStore();

  useEffect(() => {
    if (botStopState.data) {
      notificationSuccess(t("notifications.botStopped"));
      getBotsList();
      resetBotStop();
    }
  }, [botStopState.data])

  const onStop = () => {
    botStopRequest(botId);
  };

  return (
    <div className={styles.settingsStopBot}>
      <div className={styles.settingsRow}>
        <div className={styles.settingsRowTitle}>
          {t("settings.stop.title", { ns: namespaces.bots })}
        </div>
        <div className={styles.settingsRowText}>
          {t("settings.stop.text", { ns: namespaces.bots })}
        </div>
      </div>
      <ButtonUI
        type="primary"
        onClick={onStop}
        loading={botStopState.loading}
      >
        {t("buttons.stop")}
      </ButtonUI>
    </div>
  )
};