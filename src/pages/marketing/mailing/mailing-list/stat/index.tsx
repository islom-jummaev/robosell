import React, { FC, useEffect } from "react";
import { ModalUI } from "@ui/modal";
import { ModalControlType } from "@/hooks/useModalControl";
import { $mailingDetails } from "@stores/mailing";
import { useTranslation } from "react-i18next";
import { Pie, PieConfig } from '@ant-design/plots';

import styles from "./styles.module.scss";
import { namespaces } from "@core/localization/i18n.constants";

export type MailingStatModalPropTypes = {
  id: number;
};

type PropsTypes = {
  modalControl: ModalControlType<MailingStatModalPropTypes>;
};

export const MailingStat: FC<PropsTypes> = (props) => {
  const { modalControl } = props;
  const { t } = useTranslation();
  const { id } = modalControl.modalProps;


  const { request: getMailingDetails, reset: resetMailingDetails, ...mailingDetailsState } = $mailingDetails.useStore();

  console.log("mailingDetailsState", mailingDetailsState.data);

  useEffect(() => {
    if (id) {
      getMailingDetails(id);
    }

    return () => {

      resetMailingDetails();
    }
  }, []);


  if (!mailingDetailsState.data) {
    return (
      <div>
        <ModalUI.Loading show={mailingDetailsState.loading} />
      </div>
    );
  }

  const data = [
    {
      type: t("sent", { ns: namespaces.marketing }),
      value: mailingDetailsState.data?.success,
    },
    {
      type: t("notSent", { ns: namespaces.marketing }),
      value: mailingDetailsState.data?.error,
    },
    {
      type: t("totalClicks", { ns: namespaces.marketing }),
      value: mailingDetailsState.data?.total_clicked,
    },
  ];

  const config: PieConfig = {
    appendPadding: 10,
    data,
    width: 250,
    height: 360,
    angleField: "value",
    colorField: "type",
    color: ['#ffcd56', '#36a2eb', '#ff6384'],
    radius: 1,
    innerRadius: 0.6,
    legend: {
      position: "top",
      layout: "vertical"
    },
    label: {
      type: 'inner',
      offset: '-50%',
      autoRotate: false,
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: '',
      },
    },
  };

  const data2 = mailingDetailsState.data.buttons ? mailingDetailsState.data.buttons.map((item) => ({
    type: item.name,
    value: item.clicked,
  })) : [];

  const config2: PieConfig = {
    appendPadding: 10,
    data: data2,
    width: 250,
    height: 350,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    legend: {
      position: "top",
      layout: "vertical"
    },
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: '',
      },
    },
  };


  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Middle>
        <div className={styles.statWr}>
          <div>
            <Pie {...config} />
          </div>
          {mailingDetailsState.data.buttons && mailingDetailsState.data.buttons.length ? (
            <div>
              <Pie {...config2} />
            </div>
          ) : null}
        </div>
      </ModalUI.Middle>
    </>
  );
};