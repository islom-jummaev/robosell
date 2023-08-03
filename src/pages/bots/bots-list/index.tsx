import React, { useEffect } from "react";

import { ContentLayout } from "@/components/content-layout";
import { AvatarIcon, PlusIcon, TelegramIcon } from "@assets/icons";

import styles from "./styles.module.scss";
import { formatCount } from "@utils/formatters";
import { $botsList } from "@stores/bots";
import { useModalControl } from "@/hooks/useModalControl";
import { ModalUI } from "@ui/modal";
import { BotCreate } from "@/pages/bots/components/create";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";

const BotsList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { request: getBotsList, reset: resetBotsList, ...botsListState } = $botsList.useStore();

  const { data: botsData } = botsListState;

  const botAddModalControl = useModalControl();

  return (
    <ContentLayout
      title={(
        <h1>{t("botList", { ns: namespaces.bots })}</h1>
      )}
    >
      <div className={styles.botsWrap}>
        <div className={styles.bots}>
          <div className={styles.itemOuter}>
            <div className={styles.item} onClick={() => botAddModalControl.open()}>
              <div className={styles.itemIcon}>
                <PlusIcon />
              </div>
              <div className={styles.itemBody}>
                <div className={styles.itemTitle}>{t("createBot", { ns: namespaces.bots })}</div>
              </div>
            </div>
          </div>
          {botsData?.map((item) => (
            <div className={styles.itemOuter} key={item.id}>
              <div className={styles.item} onClick={() => navigate(`/bots-list/${item.id}`)}>
                <div className={styles.itemIcon}>
                  <TelegramIcon />
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.itemTitle}>{item.firstname}</div>
                  <div className={styles.itemStatus}>{item.is_active ? t("statuses.active", { ns: namespaces.bots }) : t("statuses.inActive", { ns: namespaces.bots })}</div>
                  <div className={styles.itemUsersCount}>
                    <div className={styles.itemUsersCountIcon}>
                      <AvatarIcon />
                    </div>
                    <div className={styles.itemUsersCountText}>
                      {formatCount(item.users)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModalUI
        open={botAddModalControl.modalProps.open}
        onCancel={botAddModalControl.close}
      >
        <BotCreate modalControl={botAddModalControl} />
      </ModalUI>
    </ContentLayout>
  )
};

export default BotsList;