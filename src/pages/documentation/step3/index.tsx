import React from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";

import styles from "../styles.module.scss";
import { TaggedText } from "@core/localization/component";
import { Link } from "react-router-dom";

import doc3pic1 from "@assets/images/doc3pic1.jpg";
import doc3pic2 from "@assets/images/doc3pic2.png";
import doc3pic3 from "@assets/images/doc3pic3.jpg";
import { ArrowIcon } from "@assets/icons";
import { $documentationStep } from "@stores/documetation";

export const DocumentationStep3 = () => {
  const { t } = useTranslation();

  const { step, update: updateStep } = $documentationStep.useStore();

  return (
    <ContentLayout
      title={(
        <h1>{t("step3.title", { ns: namespaces.documentation })}</h1>
      )}
    >
      <div className={styles.docStepWrap}>
        <h2>
          {t("step3.description", { ns: namespaces.documentation })}
        </h2>
        <div className={styles.docContent}>
          <div className={styles.docContentItem}>
            <h2>{t("step3.example", { ns: namespaces.documentation })}:</h2>
            <div className={styles.webappPics}>
              <img src={doc3pic1} alt=""/>
              <img src={doc3pic3} alt=""/>
            </div>
          </div>
          <div className={styles.docContentItem}></div>
          <div className={styles.docContentItem}>
            <h2>{t("step3.webapp.title", { ns: namespaces.documentation })}</h2>
            <TaggedText
              text={t("step3.webapp.text", { ns: namespaces.documentation })}
              tags={{
                1: (text) => (
                  <Link to="/webapp" target="_blank">
                    {text}
                  </Link>
                )
              }}
            />
            <div>
              <img src={doc3pic2} alt=""/>
            </div>
          </div>
        </div>
        <div className={styles.docStepBtns}>
          <span onClick={() => updateStep(step - 1)} className={styles.prev}><ArrowIcon /> {t("prev", { ns: namespaces.documentation })}</span>
          <span onClick={() => updateStep(step + 1)}>{t("next", { ns: namespaces.documentation })} <ArrowIcon /></span>
        </div>
      </div>
    </ContentLayout>
  )
};