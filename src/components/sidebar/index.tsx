import React, { useEffect, ReactNode, useState, useMemo } from "react";
import { Menu } from "antd";

import { NavLink, Link } from "react-router-dom";

import { useLocation } from "react-router-dom";

import "./styles.scss";
import { MENU_COLLAPSED, MENU_NOT_COLLAPSED } from "@utils/constants/common";
import {
  PieIcon,
  ArrowIcon,
  CartIcon,
  UsersIcon,
  ChatIcon,
  ShareIcon,
  AddBotIcon,
  CategoryIcon,
  BranchesIcon,
  DocumentsIcon, ProductIcon
} from "@assets/icons";

import logoFull from "@assets/images/logo-full.png";
import logoMin from "@assets/images/logo-min.png";
import { ButtonUI } from "@ui/button";
import { useTranslation } from "react-i18next";
import { SidebarBotsItem } from "@/components/sidebar/bots-item";
import { $currentBot } from "@stores/bots";
import { DocumentationSubMenu } from "@/components/sidebar/documentation-item";


const findOpenKeysInTree = (tree: any, path: string, parents: Array<any>) : Array<any> | null => {
  if (!tree || !tree.length) {
    return null;
  }

  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    const newParents = [...parents];

    newParents.push(item.key || item.path);

    if (item.path === path || item.key === path) {
      return newParents;
    }

    const subParents = findOpenKeysInTree(item.sub, path, newParents);

    if (subParents) {
      return subParents;
    }
  }

  return null;
};

const findOpenKeysInSubPath = (menuData: any, pathname: string): any => {
  const arrayPath: any = pathname.split("/");
  arrayPath.splice(-1, 1);

  if (arrayPath <= 1) {
    return null;
  }

  const newPath = arrayPath.join("/");

  const openKeys = findOpenKeysInTree(menuData, newPath, []);

  if (openKeys) {
    return openKeys;
  }

  return findOpenKeysInSubPath(menuData, newPath);
};

const getOpenKeys = (menuData: any, location: any) => {
  let openKeys = findOpenKeysInTree(menuData, location.pathname, []);

  if (!openKeys) {
    openKeys = findOpenKeysInSubPath(menuData, location.pathname);
  }

  return openKeys || [];
};

type SideNavigationItem = {
  key: string;
  label: ReactNode;
  children?: SideNavigationList;
  onTitleClick?: ({ key }: { key: string }) => void;
};

type SideNavigationList = Array<SideNavigationItem>;

export const AppSidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const menuData = useMemo(() => {
    return [
      {
        path: "/",
        name: t("sideNavigation.dashboard"),
        icon: <PieIcon />,
        linkProps: { end: true },
      },
      {
        path: "/orders",
        name: t("sideNavigation.orders"),
        icon: <CartIcon />,
      },
      {
        path: "/users",
        name: t("sideNavigation.users"),
        icon: <UsersIcon />,
      },
      {
        path: "/chat/empty",
        key: "/chat",
        name: t("sideNavigation.chat"),
        icon: <ChatIcon />,
      },
      {
        key: "/marketing",
        name: t("sideNavigation.marketing"),
        icon: <ShareIcon />,
        sub: [
          {
            path: "/marketing/mailing",
            name: t("sideNavigation.mailing"),
          },
          {
            path: "/marketing/source",
            name: t("sideNavigation.sources"),
          },
          {
            path: "/marketing/news",
            name: t("sideNavigation.news"),
          }
        ]
      },
      {
        path: "/bots-list",
        name: t("sideNavigation.bots"),
        icon: <AddBotIcon />,
      },
      {
        path: "/category",
        name: t("sideNavigation.category"),
        icon: <CategoryIcon />,
      },
      {
        path: "/product",
        name: t("sideNavigation.product"),
        icon: <ProductIcon />,
      },
      {
        path: "/branches",
        name: t("sideNavigation.branches"),
        icon: <BranchesIcon />,
      },
      {
        path: "/documentation",
        name: t("sideNavigation.documentation"),
        icon: <DocumentsIcon />,
        linkProps: { target: "_blank" }
      }
    ];
  }, []);

  const { currentBot } = $currentBot.useStore();

  const [collapsed, setCollapsed] = useState<boolean>(window.innerWidth > 1200 ? localStorage.getItem("menuCollapsed") === MENU_COLLAPSED : true);
  const [openKeys, setOpenKeys] = useState(getOpenKeys(menuData, location));
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
    setOpenKeys(getOpenKeys(menuData, location));

    if (window.innerWidth < 1201 && !collapsed) {
      setCollapsed(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth < 1201) {
      if (!collapsed) {
        document.body.classList.add("disable-scroll");
      } else {
        document.body.classList.remove("disable-scroll");
      }
    }
  }, [collapsed]);

  const onParentClick = ({ key }: { key: string }) => {
    let newOpenKeys = [...openKeys];
    const findIndex = openKeys.findIndex((item) => item === key);

    if (findIndex > -1) {
      newOpenKeys = newOpenKeys.filter((item) => !item.includes(key));
    } else {
      if (openKeys.find((item) => key.includes(item))) {
        newOpenKeys.push(key);
      } else {
        newOpenKeys = [key];
      }
    }

    setOpenKeys(newOpenKeys);
  };

  const getMenu = (menu: Array<any>, level = 1): SideNavigationList => {
    const className = level === 1 ? "left-menu__item" : "left-menu__sub-item";

    const menuStructure: SideNavigationList = [];

    menu.forEach((item: any) => {
      const menuItem = (
        <div className={className}>
          {item.path ? (
            <NavLink to={currentBot ? item.path : "/bots-list"} {...item.linkProps}>
              <div className="left-menu__item__icon">
                {item.icon}
              </div>
              <span>{item.name}</span>
            </NavLink>
          ) : (
            <div className="left-menu__sub-item-link">
              <div className="left-menu__item__icon">
                {item.icon}
              </div>
              <span>{item.name}</span>
              <div className="left-menu__sub-item-arrow">
                <ArrowIcon />
              </div>
            </div>
          )}
        </div>
      );

      const itemObj: SideNavigationItem = {
        key: item.key || item.path,
        label: menuItem,
      };

      if (item.sub && item.sub.length) {
        menuStructure.push({
          ...itemObj,
          children: getMenu(item.sub, level + 1),
          onTitleClick: onParentClick,
        });
      } else {
        menuStructure.push(itemObj);
      }
    });

    return menuStructure;
  };

  const onCollapsedChange = () => {
    const type = collapsed ? MENU_NOT_COLLAPSED : MENU_COLLAPSED;
    localStorage.setItem("menuCollapsed", type);
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed-sidebar" : ""}`}>
      <div className="sidebar__button">
        <ButtonUI type="primary" withIcon onClick={onCollapsedChange}>
          <ArrowIcon />
        </ButtonUI>
      </div>
      <div className="sidebar__top">
        <div className="sidebar__logo">
          <Link to={currentBot ? "/" : "/bots-list"}>
            <span className="s1">
            <img src={logoMin} alt="logo"/>
            </span>
            <span className="s2">
              <img src={logoFull} alt="logo"/>
            </span>
          </Link>
        </div>
      </div>

      <div className="left-menu-wrapper fancy-scrollbar">
        {location.pathname === "/documentation" ? (
          <DocumentationSubMenu />
        ) : (
          <>
            <SidebarBotsItem collapsed={collapsed} setCollapsed={setCollapsed} />
            <Menu mode="inline" className="left-menu" inlineCollapsed={collapsed} {...menuProps} items={getMenu(menuData)} />
          </>
        )}
      </div>
    </div>
  );
}
