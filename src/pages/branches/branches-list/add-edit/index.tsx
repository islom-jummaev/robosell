import React, { FC, useEffect, useState } from "react";
import { Form, Switch } from "antd";
import { ModalUI } from "@ui/modal";
import { FormUI } from "@ui/form";
import { requiredFormRules } from "@utils/constants/common";
import { ButtonUI } from "@ui/button";
import { InputUI } from "@ui/input";
import { ModalControlType } from "@/hooks/useModalControl";
import { $createBranch, $branchDetails, $updateBranch } from "@stores/branches";
import { notificationSuccess, notificationWarning } from "@ui/notifications";


import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";
import { $currentBot } from "@stores/bots";
import { Map, Placemark, TypeSelector, YMaps } from "react-yandex-maps";
import { FormLanguage } from "@/components/form-language";

export type BranchAddEditModalPropTypes = {
  id?: number;
};

type PropsTypes = {
  modalControl: ModalControlType<BranchAddEditModalPropTypes>;
  callback: () => void;
};

export const BranchAddEdit: FC<PropsTypes> = (props) => {
  const { modalControl, callback } = props;
  const { t } = useTranslation();
  const { id } = modalControl.modalProps;
  const [form] = Form.useForm();

  const { currentBot } = $currentBot.useStore();
  const { request: getBranchDetailsRequest, reset: resetBranchDetails, ...branchDetailsState } = $branchDetails.useStore();
  const { request: createBranchRequest, reset: resetCreateBranch, ...createBranchState } = $createBranch.useStore();
  const { request: updateBranchRequest, reset: resetUpdateBranch, ...updateBranchState } = $updateBranch.useStore();

  const { data: createBotData, loading } = createBranchState;

  const { formLangValue, setFormLangValue } = FormLanguage.useFormLang();

  const [currentCoords, setCurrentCoords] = useState<{ pmCoords: Array<number>; centerCoords: Array<number>; }>({
    pmCoords: [],
    centerCoords: []
  });

  useEffect(() => {
    if (id) {
      getBranchDetailsRequest(id);
    }

    return () => {
      resetBranchDetails();
      resetCreateBranch();
      resetUpdateBranch();
    }
  }, []);

  useEffect(() => {
    if (createBotData) {
      notificationSuccess(t("branchCreated", { ns: namespaces.branches }));
      modalControl.close();
      callback && callback();
    }
  }, [createBotData]);

  useEffect(() => {
    if (updateBranchState.data) {
      notificationSuccess(t("notifications.updated"));
      modalControl.close();
      callback && callback();
    }
  }, [updateBranchState.data]);

  useEffect(() => {
    if (branchDetailsState.data) {
      form.setFieldsValue({
        nameRu: branchDetailsState.data.name.ru,
        nameUz: branchDetailsState.data.name.uz,
        nameEn: branchDetailsState.data.name.en,
        is_active: branchDetailsState.data.is_active
      });

      const coords = branchDetailsState.data.latitude && branchDetailsState.data.longitude
        ? [branchDetailsState.data.latitude, branchDetailsState.data.longitude]
        : [];

      setCurrentCoords({
        pmCoords: coords,
        centerCoords: coords
      });
    }
  }, [branchDetailsState.data]);

  const pmCoords = currentCoords.pmCoords.length ? currentCoords.pmCoords: "";
  const centerCoords = currentCoords.centerCoords.length ? currentCoords.centerCoords: [41.31010259156362, 69.24159990502929];

  const onMapClick = (event: any) => {
    const coords = event.get("coords");

    setCurrentCoords({ centerCoords: coords, pmCoords: coords });
  };

  const onFinish = () => {
    const formData = form.getFieldsValue(true);
    if (!currentCoords.pmCoords.length) {
      notificationWarning(t("notifications.setPoints"));
      return;
    }

    const data = {
      bot: currentBot ? currentBot.id: "",
      latitude: currentCoords.pmCoords[0],
      longitude: currentCoords.pmCoords[1],
      name: {
        ru: formData.nameRu || formData.nameUz || formData.nameEn,
        uz: formData.nameUz || formData.nameRu || formData.nameEn,
        en: formData.nameEn || formData.nameRu || formData.nameUz
      },
    };

    if (id) {
      updateBranchRequest({
        id,
        ...data
      });
    } else {
      createBranchRequest(data);
    }
  };

  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Loading show={loading || updateBranchState.loading} />
      <ModalUI.Middle>
        <FormUI
          phantomSubmit
          form={form}
          onFinish={onFinish}
          initialValues={{ is_active: true }}
        >
          <FormLanguage
            value={formLangValue}
            setValue={setFormLangValue}
          />
          {formLangValue === "ru" && (
            <Form.Item
              label={`${t("fields.name")} RU`}
              name="nameRu"
              rules={requiredFormRules}
            >
              <InputUI />
            </Form.Item>
          )}
          {formLangValue === "uz" && (
            <Form.Item
              label={`${t("fields.name")} UZ`}
              name="nameUz"
              rules={requiredFormRules}
            >
              <InputUI />
            </Form.Item>
          )}
          {formLangValue === "en" && (
            <Form.Item
              label={`${t("fields.name")} EN`}
              name="nameEn"
              rules={requiredFormRules}
            >
              <InputUI />
            </Form.Item>
          )}
          <Form.Item
            label={t("coords")}
          >
            <div className={`ya-pop `} style={{ height: "400px" }}>
              <YMaps
                query={{ apikey: "7ed63f44-0c83-4e1f-a456-c528f4ed6d19" }}
                //enterprise={true}
              >
                <Map
                  state={{ center: centerCoords, zoom: 10 }}
                  width={"100%"}
                  height={400}
                  onClick={onMapClick}
                >
                  <TypeSelector options={{ float: "right" }} />
                  {pmCoords ? (
                    <Placemark
                      key={pmCoords.join(",")}
                      geometry={pmCoords}
                    />
                  ) : null}
                </Map>
              </YMaps>
            </div>
          </Form.Item>
          <Form.Item
            label={t("status")}
            name="is_active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </FormUI>
        <ModalUI.Buttons>
          <ButtonUI type="primary" onClick={() => form.submit()}>
            {t("buttons.save")}
          </ButtonUI>
        </ModalUI.Buttons>
      </ModalUI.Middle>
    </>
  )
}