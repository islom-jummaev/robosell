import React from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";

import styles from "../styles.module.scss";
import { Link } from "react-router-dom";
import { TaggedText } from "@core/localization/component";

import { $documentationStep } from "@stores/documetation";
import { ArrowIcon } from "@assets/icons";

import doc6pic1 from "@assets/images/doc6pic1.png";
import doc6pic2 from "@assets/images/doc6pic2.png";
import doc6pic3 from "@assets/images/doc6pic3.png";

export const DocumentationStep6 = () => {
  const { t } = useTranslation();

  const { step, update: updateStep } = $documentationStep.useStore();

  return (
    <ContentLayout
      title={(
        <h1>{t("step6.title", { ns: namespaces.documentation })}</h1>
      )}
    >
      <div className={styles.docStepWrap}>
        <h2>{t("step6.description", { ns: namespaces.documentation })}</h2>
        <div className={styles.docContent}>
          <div className={styles.docContentItem}>
            <div>
              <img src={doc6pic1} width="900px" alt=""/>
            </div>
          </div>
        </div>
        <ol className={styles.categoryOl}>
          <li>
            {t("step6.text1", { ns: namespaces.documentation })}
          </li>
          <li>
            <TaggedText
              text={t("step6.text2", { ns: namespaces.documentation })}
              tags={{
                1: (text) => (
                  <a href="https://www.google.com/maps" target="_blank">
                    {text}
                  </a>
                )
              }}
            />
          </li>
        </ol>
        <div className={styles.docContent}>
          <div className={styles.docContentItem}>
            <img src={doc6pic3} alt=""/>
            <div>
              {t("step6.text3", { ns: namespaces.documentation })}
            </div>
          </div>
          <div className={styles.docContentItem}>
          </div>
          <div className={styles.docContentItem}>
            <h2>{t("step6.text4", { ns: namespaces.documentation })}</h2>
            <ul>
              <li>
                {t("step6.text5", { ns: namespaces.documentation })}
              </li>
              <li>
                <img src={doc6pic2} width="800px" alt=""/>
              </li>
            </ul>
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