import React, { FC, useEffect } from "react";
import { ModalUI } from "@ui/modal";
import { ModalControlType } from "@/hooks/useModalControl";
import { FormUI } from "@ui/form";
import { requiredFormRules } from "@utils/constants/common";
import { ButtonUI } from "@ui/button";
import { Form, DatePicker, TimePicker } from "antd";
import { useTranslation } from "react-i18next";

import { notificationSuccess } from "@ui/notifications";
import { namespaces } from "@core/localization/i18n.constants";
import { RANGE_DATE_FORMAT } from "@ui/rangePicker";
import { $mailingAddTime } from "@stores/mailing";


export type MailingAddTimeModalPropTypes = {
  id: number;
};

type PropsTypes = {
  modalControl: ModalControlType<MailingAddTimeModalPropTypes>;
  callback: () => void;
};

const timeFormat = "HH:mm";

export const MailingAddTime: FC<PropsTypes> = (props) => {
  const { modalControl, callback } = props;
  const { t } = useTranslation();
  const { id } = modalControl.modalProps;
  const [form] = Form.useForm();

  const { request: mailingAddTimeRequest, reset: resetMailingAddTime, ...mailingAddTimeState } = $mailingAddTime.useStore();


  useEffect(() => {


    return () => {
      resetMailingAddTime();
    }
  }, []);

  useEffect(() => {
    if (mailingAddTimeState.data) {
      notificationSuccess(t("mailing.timeAdded", { ns: namespaces.marketing }));
      modalControl.close();
      callback && callback();
    }
  }, [mailingAddTimeState.data]);


  const onFinish = (formData: any) => {
    const data = {
      id: id,
      date: formData.schedule_date.format(RANGE_DATE_FORMAT),
      time: formData.schedule_time.format(timeFormat)
    }

    mailingAddTimeRequest(data);
  };


  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Loading show={mailingAddTimeState.loading} />
      <ModalUI.Middle>
        <FormUI
          phantomSubmit
          form={form}
          onFinish={onFinish}
        >
          <FormUI.Item
            name="schedule_date"
            label={t("publicationDate")}
            rules={requiredFormRules}
          >
            <DatePicker />
          </FormUI.Item>
          <FormUI.Item
            name="schedule_time"
            label={t("fields.publicationTime")}
            rules={requiredFormRules}
          >
            <TimePicker format={timeFormat} />
          </FormUI.Item>
        </FormUI>
        <ModalUI.Buttons>
          <ButtonUI type="primary" onClick={() => form.submit()}>
            {t("buttons.save")}
          </ButtonUI>
        </ModalUI.Buttons>
      </ModalUI.Middle>
    </>
  );
};