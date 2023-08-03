import React, { FC, useEffect, useState } from "react";
import { ModalUI } from "@ui/modal";
import { ModalControlType } from "@/hooks/useModalControl";
import { FormUI } from "@ui/form";
import { requiredFormRules } from "@utils/constants/common";
import { InputUI } from "@ui/input";
import { ButtonUI } from "@ui/button";
import { Form, Upload } from "antd";
import { $mailingCreate, $mailingUpdate, $mailingDetails } from "@stores/mailing";
import { useTranslation } from "react-i18next";
import { isFileCorrespondType, isFileCorrespondSize, getBase64, UPLOAD_FILE_TYPES } from "@utils/formatters";
import { DeleteIcon, UploadPlus } from "@assets/icons";
import { notificationWarning, notificationSuccess } from "@ui/notifications";
import { namespaces } from "@core/localization/i18n.constants";
import { $currentBot } from "@stores/bots";
import { isValidUrl } from "@utils/common";


export type MailingAddEditModalPropTypes = {
  id?: number;
};

type PropsTypes = {
  modalControl: ModalControlType<MailingAddEditModalPropTypes>;
  callback: () => void;
};

export const MailingAddEdit: FC<PropsTypes> = (props) => {
  const { modalControl, callback } = props;
  const { t } = useTranslation();
  const { id } = modalControl.modalProps;
  const [form] = Form.useForm();

  const { currentBot } = $currentBot.useStore();
  const { request: mailingCreateRequest, reset: resetMailingCreate, ...mailingCreateState } = $mailingCreate.useStore();
  const { request: mailingUpdateRequest, reset: resetMailingUpdate, ...mailingUpdateState } = $mailingUpdate.useStore();
  const { request: getMailingDetails, reset: resetMailingDetails, ...mailingDetailsState } = $mailingDetails.useStore();

  const [ uploadedPhoto, setUploadedPhoto ] = useState(undefined);
  const [ photoUrl, setPhotoUrl ] = useState<any>("");

  useEffect(() => {
    if (id) {
      getMailingDetails(id);
    }

    return () => {
      resetMailingCreate();
      resetMailingUpdate();
      resetMailingDetails();
    }
  }, []);

  useEffect(() => {
    if (mailingCreateState.data) {
      notificationSuccess(t("mailing.created", { ns: namespaces.marketing }));
      modalControl.close();
      callback && callback();
    }
  }, [mailingCreateState.data]);

  useEffect(() => {
    if (mailingUpdateState.data) {
      notificationSuccess(t("notifications.updated"));
      modalControl.close();
      callback && callback();
    }
  }, [mailingUpdateState.data]);

  useEffect(() => {
    if (mailingDetailsState.data) {
      if (mailingDetailsState.data.photo) {
        setPhotoUrl(`${mailingDetailsState.data.photo}`);
      }

      form.setFieldsValue({
        buttons: mailingDetailsState.data.buttons.map((item) => ({ name: item.name, url: item.url })),
        description: mailingDetailsState.data.text,
      });
    }
  }, [mailingDetailsState.data]);

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

  const onFinish = (formData: any) => {
    const data = new FormData();

    if (!uploadedPhoto && !photoUrl) {
      notificationWarning(t("notifications.addPhoto"));
      return;
    }

    if (uploadedPhoto) {
      data.append("photo", uploadedPhoto);
    }

    data.append("bot", String(currentBot?.id));
    data.append("text", formData.description);
    if (formData.buttons?.length) {
      data.append("buttons", JSON.stringify(formData.buttons));
    }
    // @ts-ignore
    //data.append("is_send", false);

    if (id) {
      mailingUpdateRequest({
        id,
        data,
        isPatch: !uploadedPhoto
      });
    } else {
      mailingCreateRequest(data);
    }
  };



  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Loading show={mailingCreateState.loading || mailingUpdateState.loading || mailingDetailsState.loading} />
      <ModalUI.Middle>
        <FormUI
          phantomSubmit
          form={form}
          onFinish={onFinish}
        >
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
                {photoUrl ? <img src={photoUrl} alt="mailingphoto" style={{ width: '100%' }} /> : (
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
          <FormUI.Item
            name="description"
            label={t("fields.description")}
            rules={requiredFormRules}
          >
            <InputUI.TextArea rows={4} />
          </FormUI.Item>
          <Form.List name="buttons">
            {(fields, { add, remove }) => (
              <div className="form-list-wrap">
                {fields.map(({ key, name, ...restField }) => (
                  <FormUI.Row key={key}>
                    <FormUI.Col>
                      <FormUI.Item
                        name={[name, "name"]}
                        label={t("fields.name")}
                        rules={requiredFormRules}
                        {...restField}
                      >
                        <InputUI />
                      </FormUI.Item>
                    </FormUI.Col>
                    <FormUI.Col>
                      <FormUI.Item
                        name={[name, "url"]}
                        label={t("linkOnButton")}
                        rules={[
                          ...requiredFormRules,
                          {
                            validator: async (_, urlItem) => {
                              if (!isValidUrl(urlItem)) {
                                const message = t("notifications.wrongFormat");
                                return Promise.reject(new Error(message));
                              }
                            },
                          },
                        ]}
                        {...restField}
                      >
                        <InputUI />
                      </FormUI.Item>
                      <div className="form-list-btn" onClick={() => remove(name)}>
                        {t("buttons.delete")}
                      </div>
                    </FormUI.Col>
                  </FormUI.Row>
                ))}
                <div className="form-list-btn" onClick={() => add()}>
                  + {t("buttonCreate")}
                </div>
              </div>
            )}
          </Form.List>
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