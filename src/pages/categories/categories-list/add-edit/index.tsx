import React, { FC, useEffect, useState } from "react";
import { ModalUI } from "@ui/modal";
import { ModalControlType } from "@/hooks/useModalControl";
import { FormUI } from "@ui/form";
import { ButtonUI } from "@ui/button";
import { Form, Switch, Upload } from "antd";
import { $categoryCreate, $categoryUpdate, $categoryDetails } from "@stores/categories";
import { useTranslation } from "react-i18next";
import { isFileCorrespondType, isFileCorrespondSize, getBase64, UPLOAD_FILE_TYPES } from "@utils/formatters";
import { DeleteIcon, UploadPlus } from "@assets/icons";
import { notificationWarning, notificationSuccess } from "@ui/notifications";
import { namespaces } from "@core/localization/i18n.constants";
import { $currentBot } from "@stores/bots";
import { InputUI } from "@ui/input";
import { requiredFormRules } from "@utils/constants/common";
import { FormLanguage } from "@/components/form-language";


export type CategoryAddEditModalPropTypes = {
  id?: number;
};

type PropsTypes = {
  modalControl: ModalControlType<CategoryAddEditModalPropTypes>;
  callback: () => void;
};

export const CategoryAddEdit: FC<PropsTypes> = (props) => {
  const { modalControl, callback } = props;
  const { t } = useTranslation();
  const { id } = modalControl.modalProps;
  const [form] = Form.useForm();

  const { currentBot } = $currentBot.useStore();
  const { request: getCategoryDetailsRequest, reset: resetCategoryDetails, ...categoryDetailsState } = $categoryDetails.useStore();
  const { request: categoryCreateRequest, reset: resetCategoryCreate, ...categoryCreateState } = $categoryCreate.useStore();
  const { request: categoryUpdateRequest, reset: resetCategoryUpdate, ...categoryUpdateState } = $categoryUpdate.useStore();

  const { formLangValue, setFormLangValue } = FormLanguage.useFormLang();

  const [ uploadedPhoto, setUploadedPhoto ] = useState(undefined);
  const [ photoUrl, setPhotoUrl ] = useState<any>("");

  useEffect(() => {
    if (id) {
      getCategoryDetailsRequest(id);
    }

    return () => {
      resetCategoryDetails();
      resetCategoryCreate();
      resetCategoryUpdate();
    }
  }, []);

  useEffect(() => {
    if (categoryDetailsState.data) {
      if (categoryDetailsState.data.medium_photo) {
        setPhotoUrl(`${categoryDetailsState.data.medium_photo}`);
      }

      form.setFieldsValue({
        nameRu: categoryDetailsState.data.name.ru,
        nameUz: categoryDetailsState.data.name.uz,
        nameEn: categoryDetailsState.data.name.en,
        is_active: categoryDetailsState.data.is_active
      });
    }
  }, [categoryDetailsState.data]);

  useEffect(() => {
    if (categoryCreateState.data) {
      notificationSuccess(t("created", { ns: namespaces.categories }));
      modalControl.close();
      callback && callback();
    }
  }, [categoryCreateState.data]);

  useEffect(() => {
    if (categoryUpdateState.data) {
      notificationSuccess(t("notifications.updated"));
      modalControl.close();
      callback && callback();
    }
  }, [categoryUpdateState.data]);

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
    data.append("name", JSON.stringify({
      ru: formData.nameRu || formData.nameUz || formData.nameEn,
      uz: formData.nameUz || formData.nameRu || formData.nameEn,
      en: formData.nameEn || formData.nameRu || formData.nameUz
    }));
    data.append("is_active", formData.is_active);

    if (id) {
      categoryUpdateRequest({
        id,
        data,
        isPatch: !uploadedPhoto
      });
    } else {
      categoryCreateRequest(data);
    }
  };


  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Loading show={categoryCreateState.loading || categoryUpdateState.loading || categoryDetailsState.loading} />
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
                {photoUrl ? <img src={photoUrl} alt="category-photo" style={{ width: '100%' }} /> : (
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