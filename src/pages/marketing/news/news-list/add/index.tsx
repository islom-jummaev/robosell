import React, { FC, useEffect, useState } from "react";
import { ModalUI } from "@ui/modal";
import { ModalControlType } from "@/hooks/useModalControl";
import { FormUI } from "@ui/form";
import { requiredFormRules } from "@utils/constants/common";
import { InputUI } from "@ui/input";
import { ButtonUI } from "@ui/button";
import { Form, Switch, Upload } from "antd";
import { $newsCreate, $newsUpdate, $newsDetails } from "@stores/news";
import { useTranslation } from "react-i18next";
import { notificationSuccess, notificationWarning } from "@ui/notifications";
import { namespaces } from "@core/localization/i18n.constants";
import { $currentBot } from "@stores/bots";
import { getBase64, isFileCorrespondSize, isFileCorrespondType, UPLOAD_FILE_TYPES } from "@utils/formatters";
import { DeleteIcon, UploadPlus } from "@assets/icons";
import { FormLanguage } from "@/components/form-language";

export type NewsAddEditModalPropTypes = {
  id?: number;
};

type PropsTypes = {
  modalControl: ModalControlType<NewsAddEditModalPropTypes>;
  callback: () => void;
};

export const NewsAdd: FC<PropsTypes> = (props) => {
  const { modalControl, callback } = props;
  const { t } = useTranslation();
  const { id } = modalControl.modalProps;
  const [form] = Form.useForm();

  const { currentBot } = $currentBot.useStore();
  const { request: newsCreateRequest, reset: resetNewsCreate, ...newsCreateState } = $newsCreate.useStore();
  const { request: newsUpdateRequest, reset: resetNewsUpdate, ...newsUpdateState } = $newsUpdate.useStore();
  const { request: getNewsDetails, reset: resetNewsDetails, ...newsDetailsState } = $newsDetails.useStore();

  const { formLangValue, setFormLangValue } = FormLanguage.useFormLang();

  const [ uploadedPhoto, setUploadedPhoto ] = useState(undefined);
  const [ photoUrl, setPhotoUrl ] = useState<any>("");

  useEffect(() => {
    if (id) {
      getNewsDetails(id);
    }

    return () => {
      resetNewsCreate();
      resetNewsUpdate();
      resetNewsDetails();
    }
  }, []);

  useEffect(() => {
    if (newsCreateState.data) {
      notificationSuccess(t("news.created", { ns: namespaces.marketing }));
      modalControl.close();
      callback && callback();
    }
  }, [newsCreateState.data]);

  useEffect(() => {
    if (newsUpdateState.data) {
      notificationSuccess(t("notifications.updated"));
      modalControl.close();
      callback && callback();
    }
  }, [newsUpdateState.data]);

  useEffect(() => {
    if (newsDetailsState.data) {
      if (newsDetailsState.data.photo) {
        setPhotoUrl(`${newsDetailsState.data.photo}`);
      }

      form.setFieldsValue({
        titleRu: newsDetailsState.data.title?.ru,
        titleUz: newsDetailsState.data.title?.uz,
        titleEn: newsDetailsState.data.title?.en,
        descriptionRu: newsDetailsState.data.desc?.ru,
        descriptionUz: newsDetailsState.data.desc?.uz,
        descriptionEn: newsDetailsState.data.desc?.en,
        is_active: newsDetailsState.data.is_active
      });
    }
  }, [newsDetailsState.data]);

  const beforeUploadPhoto = (file: any) => {
    const correspondType = isFileCorrespondType(file, UPLOAD_FILE_TYPES.PIC);
    const correspondSize = isFileCorrespondSize(file, 10);

    if (!correspondType) {
      notificationWarning(t("warnings.onlyImage"));
      return false;
    }

    if (!correspondSize) {
      notificationWarning(t("warnings.sizeMb", { fileSize: "10" }));
      return false;
    }

    if (correspondType && correspondSize) {
      setUploadedPhoto(file);
    }

    return false;
  };

  const onPhotoChange = async (info: any) => {
    const preview = await getBase64(info.file);

    setPhotoUrl(preview);
  };

  const onRemovePhoto = () => {
    setUploadedPhoto(undefined);
    setPhotoUrl("");
  };

  const onFinish = () => {
    const formData = form.getFieldsValue(true);
    const data = new FormData();

    if (!uploadedPhoto && !photoUrl) {
      notificationWarning(t("notifications.addPhoto"));
      return;
    }

    if (uploadedPhoto) {
      data.append("photo", uploadedPhoto);
    }

    data.append("bot", String(currentBot?.id));
    data.append("title", JSON.stringify({
      ru: formData.titleRu || formData.titleUz || formData.titleEn,
      uz: formData.titleUz || formData.titleRu || formData.titleEn,
      en: formData.titleEn || formData.titleRu || formData.titleUz
    }));
    data.append("desc", JSON.stringify({
      ru: formData.descriptionRu || formData.descriptionUz || formData.descriptionEn,
      uz: formData.descriptionUz || formData.descriptionRu || formData.descriptionEn,
      en: formData.descriptionEn || formData.descriptionRu || formData.descriptionUz
    }));
    data.append("is_active", formData.is_active);

    if (id) {
      newsUpdateRequest({
        id,
        data,
        isPatch: !uploadedPhoto
      });
    } else {
      newsCreateRequest(data);
    }
  };


  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Loading show={newsCreateState.loading} />
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
          <Form.Item
            label={t("image")}
          >
            <div className="uploadPhoto">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUploadPhoto}
                onChange={onPhotoChange}
              >
                {photoUrl ? <img src={photoUrl} alt="newsphoto" style={{ width: '100%' }} /> : (
                  <div className="uploadPhotoEmpty">
                    <div>
                      <UploadPlus />
                    </div>
                    <div>
                      <span>{t("upload")}</span>
                      {t("upTo")} 10 {t("megabytes")}
                    </div>
                  </div>
                )}
              </Upload>
              {!!photoUrl && (
                <ButtonUI
                  type="primary"
                  withIcon
                  circle
                  onClick={onRemovePhoto}
                >
                  <DeleteIcon />
                </ButtonUI>
              )}
            </div>
          </Form.Item>

          {formLangValue === "ru" && (
            <FormUI.Item
              name="titleRu"
              label={`${t("fields.title")} RU`}
              rules={requiredFormRules}
            >
              <InputUI />
            </FormUI.Item>
          )}
          {formLangValue === "uz" && (
            <FormUI.Item
              name="titleUz"
              label={`${t("fields.title")} UZ`}
              rules={requiredFormRules}
            >
              <InputUI />
            </FormUI.Item>
          )}
          {formLangValue === "en" && (
            <FormUI.Item
              name="titleEn"
              label={`${t("fields.title")} EN`}
              rules={requiredFormRules}
            >
              <InputUI />
            </FormUI.Item>
          )}

          {formLangValue === "ru" && (
            <FormUI.Item
              name="descriptionRu"
              label={`${t("fields.description")} RU`}
              rules={requiredFormRules}
            >
              <InputUI.TextArea rows={4} />
            </FormUI.Item>
          )}
          {formLangValue === "uz" && (
            <FormUI.Item
              name="descriptionUz"
              label={`${t("fields.description")} UZ`}
              rules={requiredFormRules}
            >
              <InputUI.TextArea rows={4} />
            </FormUI.Item>
          )}
          {formLangValue === "en" && (
            <FormUI.Item
              name="descriptionEn"
              label={`${t("fields.description")} EN`}
              rules={requiredFormRules}
            >
              <InputUI.TextArea rows={4} />
            </FormUI.Item>
          )}
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
  );
};