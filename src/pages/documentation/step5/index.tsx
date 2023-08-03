import React from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";

import styles from "../styles.module.scss";
import { Link } from "react-router-dom";
import { TaggedText } from "@core/localization/component";

import doc5pic1 from "@assets/images/doc5pic1.png";
import { $documentationStep } from "@stores/documetation";
import { ArrowIcon } from "@assets/icons";

export const DocumentationStep5 = () => {
  const { t } = useTranslation();

  const { step, update: updateStep } = $documentationStep.useStore();

  return (
    <ContentLayout
      title={(
        <h1>{t("step5.title", { ns: namespaces.documentation })}</h1>
      )}
    >
      <div className={styles.docStepWrap}>
        <ol className={styles.categoryOl}>
          <li>
            <TaggedText
              text={t("step5.text1", { ns: namespaces.documentation })}
              tags={{
                1: (text) => (
                  <Link to="/product" target="_blank">
                    {text}
                  </Link>
                )
              }}
            />
          </li>
          <li>
            {t("step5.text2", { ns: namespaces.documentation })}
          </li>
        </ol>
        <div className={styles.docContent}>
          <div className={styles.docContentItem}>
            {t("step5.text3", { ns: namespaces.documentation })}
            <div className={styles.docContentItem}>
              <img src={doc5pic1} width="600px" alt=""/>
            </div>
            <TaggedText
              text={t("step5.text4", { ns: namespaces.documentation })}
              tags={{
                1: (text) => (
                  <strong>
                    {text}
                  </strong>
                )
              }}
            />
          </div>
        </div>
        <div className={styles.docContentItem}>
        </div>
        <div className={styles.docStepBtns}>
          <span onClick={() => updateStep(step - 1)} className={styles.prev}><ArrowIcon /> {t("prev", { ns: namespaces.documentation })}</span>
          <span onClick={() => updateStep(step + 1)}>{t("next", { ns: namespaces.documentation })} <ArrowIcon /></span>
        </div>
      </div>
    </ContentLayout>
  )
};