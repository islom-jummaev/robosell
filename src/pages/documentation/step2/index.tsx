import React from "react";
import { ContentLayout } from "@/components/content-layout";
import { namespaces } from "@core/localization/i18n.constants";
import { useTranslation } from "react-i18next";
import { TaggedText } from "@core/localization/component";
import { ArrowIcon } from "@assets/icons";
import { $documentationStep } from "@stores/documetation";

import styles from "../styles.module.scss";

import doc2pic1 from "@assets/images/doc2pic1.png";
import doc2pic2 from "@assets/images/doc2pic2.png";
import doc2pic3 from "@assets/images/doc2pic3.png";
import doc2pic4 from "@assets/images/doc2pic4.png";
import doc2pic5 from "@assets/images/doc2pic5.png";


export const DocumentationStep2 = () => {
  const { t } = useTranslation();

  const { step, update: updateStep } = $documentationStep.useStore();

  return (
    <ContentLayout
      title={(
        <h1>{t("step2.title", { ns: namespaces.documentation })}</h1>
      )}
    >
      <div className={styles.docStepWrap}>
        <h2>
          {t("step2.description", { ns: namespaces.documentation })}
        </h2>
        <div className={styles.docContent}>
          <div>
            <h2>{t("step2.subDesc", { ns: namespaces.documentation })}</h2>
            <img src={doc2pic1} alt=""/>
          </div>
          <div className={styles.docContentItem}>
            <h2>{t("step2.general.title", { ns: namespaces.documentation })}</h2>
            {t("step2.general.desc", { ns: namespaces.documentation })}
            <ul>
              <li>
                <TaggedText
                  text={t("step2.general.text1", { ns: namespaces.documentation })}
                  tags={{
                    1: (text) => (
                      <i>
                        {text}
                      </i>
                    )
                  }}
                />
              </li>
              <li>
                <TaggedText
                  text={t("step2.general.text2", { ns: namespaces.documentation })}
                  tags={{
                    1: (text) => (
                      <code>
                        {text}
                      </code>
                    ),
                    2: (text) => (
                      <i>
                        {text}
                      </i>
                    )
                  }}
                />
              </li>
              <li>
                <TaggedText
                  text={t("step2.general.text3", { ns: namespaces.documentation })}
                  tags={{
                    1: (text) => (
                      <i>
                        {text}
                      </i>
                    )
                  }}
                />
              </li>
            </ul>
            <img src={doc2pic2} alt=""/>
          </div>
          <div className={styles.docContentItem}>
            <h2>{t("step2.delivery.title", { ns: namespaces.documentation })}</h2>
            {t("step2.delivery.desc", { ns: namespaces.documentation })}
            <ul>
              <li>
                <TaggedText
                  text={t("step2.delivery.text1", { ns: namespaces.documentation })}
                  tags={{
                    1: (text) => (
                      <i>
                        {text}
                      </i>
                    )
                  }}
                />
              </li>
              <li>
                <TaggedText
                  text={t("step2.delivery.text2", { ns: namespaces.documentation })}
                  tags={{
                    1: (text) => (
                      <i>
                        {text}
                      </i>
                    )
                  }}
                />
              </li>
              <li>
                <TaggedText
                  text={t("step2.delivery.text3", { ns: namespaces.documentation })}
                  tags={{
                    1: (text) => (
                      <i>
                        {text}
                      </i>
                    )
                  }}
                />
              </li>
            </ul>
            <img src={doc2pic3} alt=""/>
          </div>
          <div className={styles.docContentItem}>
            <h2>{t("step2.payment.title", { ns: namespaces.documentation })}</h2>
            {t("step2.payment.desc", { ns: namespaces.documentation })}
            <img src={doc2pic4} alt=""/>
          </div>
          <div className={styles.docContentItem}>
            <h2>{t("step2.settings.title", { ns: namespaces.documentation })}</h2>
            {t("step2.settings.desc", { ns: namespaces.documentation })}
            <span className={styles.note}>{t("step2.settings.note", { ns: namespaces.documentation })}</span>
            <img src={doc2pic5} alt=""/>
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