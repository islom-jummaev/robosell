import React, { useMemo } from "react";
import { $documentationStep } from "@stores/documetation";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";
import cn from "classnames";

type MenuType = Array<{ name: string; step: number }>;

export const DocumentationSubMenu = () => {
  const { t } = useTranslation();

  const { step, update } = $documentationStep.useStore();

  const menu: MenuType = useMemo(() : MenuType => {
    return [
      { name: t("step1.title", { ns: namespaces.documentation }), step: 1 },
      { name: t("step2.title", { ns: namespaces.documentation }), step: 2 },
      { name: t("step3.title", { ns: namespaces.documentation }), step: 3 },
      { name: t("step4.title", { ns: namespaces.documentation }), step: 4 },
      { name: t("step5.title", { ns: namespaces.documentation }), step: 5 },
      { name: t("step6.title", { ns: namespaces.documentation }), step: 6 },
    ]
  }, []);

  return (
    <div className="documentation-submenu">
      {menu.map((item, index) => (
        <div
          className={`${cn("documentation-submenu__item", {
            ["active"]: item.step === step
          })}`}
          onClick={() => update(item.step)}
          key={index}
        >
          {item.name}
        </div>
      ))}
    </div>
  )
}