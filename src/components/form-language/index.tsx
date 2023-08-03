import React, { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { currentLangType } from "@utils/getters";
import cn from "classnames";

import styles from "./styles.module.scss";
import { FormProps } from "antd/lib/form";
import RuIcon from "@assets/images/ru-icon.svg";
import UzIcon from "@assets/images/uz-icon.svg";
import EnIcon from "@assets/images/en-icon.svg";
import { $botLanguageDetails, $currentBot } from "@stores/bots";

const getIcon = (code: string): string => {
  switch (code) {
    case "uz":
      return UzIcon;
    case "en":
      return EnIcon;
    default:
      return RuIcon;
  }
};

type UiFormPropsType = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
} & FormProps;

type FormPropsType = {
  useFormLang: typeof useFormLang;
} & FC<UiFormPropsType>;

const FormLanguage: FormPropsType = (props) => {
  const { value, setValue } = props;

  const { currentBot } = $currentBot.useStore();

  const {
    request: getBotLanguageDetails,
    reset: resetBotLanguageDetails,
    ...botLanguageDetailsState
  } = $botLanguageDetails.useStore();

  useEffect(() => {
    if (currentBot) {
      getBotLanguageDetails(currentBot.id);
    }

    return () => {
      resetBotLanguageDetails();
    }
  }, []);

  const langs = useMemo(() => {
    let items: Array<{ name: string; key: string; icon: string; }> = [];

    if (botLanguageDetailsState.data?.languages) {
      setValue(botLanguageDetailsState.data.languages[0].code);

      botLanguageDetailsState.data.languages.forEach((item) => {
        items.push({
          name: item.name,
          key: item.code,
          icon: getIcon(item.code)
        });
      })
    }

    return items;
  }, [botLanguageDetailsState.data]);

  return (
    <div className={styles.langItems}>
      {langs.map((item) => (
        <div
          key={item.key}
          className={`${cn(`${styles.langItem}`, {
            [styles.active]: value === item.key
          })}`}
          onClick={() => setValue(item.key)}
        >
          <img src={item.icon} alt="" />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  )
};

type UseFormLangReturnType = {
  formLangValue: string;
  setFormLangValue: Dispatch<SetStateAction<string>>;
}

const useFormLang = (): UseFormLangReturnType => {
  const [formLangValue, setFormLangValue] = useState<string>("");

  return {
    formLangValue,
    setFormLangValue
  };
};

FormLanguage.useFormLang = useFormLang;

export { FormLanguage };