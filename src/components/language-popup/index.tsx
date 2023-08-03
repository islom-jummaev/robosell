import React, { FC, ReactNode, useState } from "react";
import { Popover } from "antd";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { currentLangType, getCurrentLang } from "@utils/getters";

const languages = [
  { code: "ru", title: "Русский язык" },
  { code: "uz", title: "O'zbek tili" },
  { code: "en", title: "English" }
];

type PropsTypes = {
  children: ReactNode;
  callback?: (lang: currentLangType) => void;
}

export const LanguagePopup: FC<PropsTypes> = (props) => {
  const { callback, children } = props;
  const { i18n } = useTranslation();
  const currentLang = getCurrentLang();

  const [open, setOpen] = useState<boolean>(false);

  const onLangChange = (lang: string) => {
    if (lang !== currentLang) {
      i18n.changeLanguage(lang).then(() => {
        if (callback) {
          callback(lang as currentLangType);
        }
      });
    }

    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      overlayClassName="language-dropdown"
      placement="bottomRight"
      open={open}
      onOpenChange={handleOpenChange}
      trigger="click"
      content={(
        <div className="language-menu">
          {languages.map((item) => (
            <div
              className={`${cn("language-menu__item", {
                ["active-lang"]: item.code === currentLang
              })}`}
              key={item.code}
              onClick={() => onLangChange(item.code)}
            >
              {item.title}
            </div>
          ))}
        </div>
      )}
    >
      {children}
    </Popover>
  )
};