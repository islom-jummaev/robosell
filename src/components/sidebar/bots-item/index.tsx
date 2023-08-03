import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Menu } from "antd";

import { $botsList, $currentBot, $updateMainBot, CurrentBotType } from "@stores/bots";

import styles from "./styles.module.scss";
import cn from "classnames";
import { ArrowIcon, CurrentBotIcon, PlusCircleIcon } from "@assets/icons";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";


type PropsTypes = {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>
}

export const SidebarBotsItem: FC<PropsTypes> = (props) => {
  const { collapsed, setCollapsed } = props;

  const botsListState = $botsList.useStore();

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { currentBot, update: updateCurrentBot } = $currentBot.useStore();
  const { request: updateMainBot } = $updateMainBot.useStore();

  const [openKeys, setOpenKeys] = useState<Array<string>>([]);
  const [menuProps, setMenuProps] = useState({ selectedKeys: openKeys, openKeys: !collapsed ? openKeys : undefined });

  useEffect(() => {
    const menuProps: any = {
      selectedKeys: openKeys,
    };

    if (!collapsed) {
      menuProps.openKeys = openKeys;
    }

    setMenuProps(menuProps);
  }, [openKeys, collapsed]);

  useEffect(() => {
    if (openKeys.length) {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  const onSelectBot = (item: CurrentBotType) => {
    if (item) {
      updateMainBot(item.id);
    }
    updateCurrentBot(item);
    if (location.pathname.includes("/chat") && location.pathname !== "/chat/empty") {
      navigate("/chat/empty");
    }
    setOpenKeys([]);

    if (window.innerWidth < 1201 && !collapsed) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {currentBot && (
        <Menu
          mode="inline"
          className="left-menu"
          inlineCollapsed={collapsed}
          {...menuProps}
          items={[ {
            key: "/menu-bot",
            onTitleClick: () => {
              setOpenKeys((prevState) => prevState.length ? [] : [ "/menu-bot" ]);
            },
            label: (
              <div className="left-menu__item">
                <div className="left-menu__sub-item-link">
                  <div className="left-menu__item__icon">
                    <CurrentBotIcon />
                  </div>
                  <span>{currentBot.name}</span>
                  <div className="left-menu__sub-item-arrow">
                    <ArrowIcon />
                  </div>
                </div>
              </div>
            ),
            children: [{
              key: "/menu-bot/1",
              className: "left-menu-bot-popup",
              label: (
                <div className={styles.currentBotList}>
                  <div className={styles.currentBotPopupName}>{currentBot.name}</div>
                  {botsListState.data?.map((item) => (
                    <div
                      key={item.id}
                      className={`${cn(`${styles.currentBotListItem}`, {
                        [styles.currentBotListHiddenItem]: String(item.id) === currentBot.id
                      })}`}
                      onClick={() => onSelectBot({ id: String(item.id), name: item.firstname })}
                    >
                      {item.firstname}
                    </div>
                  ))}
                  <div
                    className={styles.currentBotListItem}
                    onClick={() => {
                      navigate("/bots-list");
                      setOpenKeys([]);
                    }}
                  >
                    <PlusCircleIcon /> {t("addBot", { ns: namespaces.bots })}
                  </div>
                </div>
              )
            }]
          } ]}
        />
      )}
    </>
  )
};