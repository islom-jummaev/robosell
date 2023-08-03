import React from "react";
import { Link } from "react-router-dom";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { TaggedText } from "@core/localization/component";

import styles from "../styles.module.scss";

import subStep2 from "@assets/images/substep2.png";
import subStep6 from "@assets/images/substep6.png";
import { ArrowIcon } from "@assets/icons";
import { $documentationStep } from "@stores/documetation";

export const DocumentationStep1 = () => {
  const { t } = useTranslation();

  const { step, update: updateStep } = $documentationStep.useStore();

  return (
    <ContentLayout
      title={(
        <h1>{t("step1.title", { ns: namespaces.documentation })}</h1>
      )}
    >
      <div className={styles.docStepWrap}>
        <h2>
          <TaggedText
            text={t("step1.description", { ns: namespaces.documentation })}
            tags={{
              1: (text) => (
                <a target="_blank" href="https://t.me/BotFather">
                  {text}
                </a>
              )
            }}
          />
        </h2>
        <ol>
          <li>
            {t("step1.subStep1", { ns: namespaces.documentation })}
          </li>
          <li>
            <TaggedText
              text={t("step1.subStep2", { ns: namespaces.documentation })}
              tags={{
                1: (text) => (
                  <a target="_blank" href="https://t.me/BotFather">
                    {text}
                  </a>
                )
              }}
            />
            <div className={styles.docStepPic}>
              <img src={subStep2} alt=""/>
            </div>
          </li>
          <li>
            <TaggedText
              text={t("step1.subStep3", { ns: namespaces.documentation })}
              tags={{
                1: (text) => (
                  <code>
                    {text}
                  </code>
                )
              }}
            />
          </li>
          <li>
            {t("step1.subStep4", { ns: namespaces.documentation })}
          </li>
          <li>
            <TaggedText
              text={t("step1.subStep5", { ns: namespaces.documentation })}
              tags={{
                1: (text) => (
                  <code>
                    {text}
                  </code>
                )
              }}
            />
          </li>
          <li>
            <TaggedText
              text={t("step1.subStep6", { ns: namespaces.documentation })}
              tags={{
                1: (text) => (
                  <Link to="/bots-list" target="_blank">
                    {text}
                  </Link>
                )
              }}
            />
            <div className={styles.docStepPic}>
              <img src={subStep6} width={500} alt=""/>
            </div>
          </li>
        </ol>
        <div className={styles.docStepBtns}>
          <span onClick={() => updateStep(step + 1)}>{t("next", { ns: namespaces.documentation })} <ArrowIcon /></span>
        </div>
      </div>
    </ContentLayout>
  )
};