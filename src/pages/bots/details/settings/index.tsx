import React, { FC } from "react";

import styles from "../styles.module.scss";

import { BotSettingsDetailsToken } from "./token";
import { BotSettingsReload } from "./reload";
import { BotSettingsStop } from "./stop";
import { BotSettingsDelete } from "./delete";


type PropsTypes = {
  botId: string;
}

export const BotSettingsDetails: FC<PropsTypes> = (props) => {
  const { botId } = props;


  return (
    <div className={styles.settings}>
      <BotSettingsDetailsToken botId={botId} />
      <BotSettingsReload botId={botId} />
      <BotSettingsStop botId={botId} />
      <BotSettingsDelete botId={botId} />
    </div>
  )
};