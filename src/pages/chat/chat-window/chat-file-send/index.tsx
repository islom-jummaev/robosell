import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "@utils/getters";
import { Form, Upload } from "antd";
import { notificationWarning } from "@ui/notifications";
import { isFileCorrespondSize } from "@utils/formatters";
import { ModalUI } from "@ui/modal";
import { FormUI } from "@ui/form";
import { ButtonUI } from "@ui/button";
import { ModalControlType } from "@/hooks/useModalControl";
import { $chatSendFileMessage } from "@stores/chat";
import { InputUI } from "@ui/input";
import dayjs from "dayjs";
import { IChatFileModel } from "@/businessLogic/models/chat";
import { VideoUi } from "@ui/video";

export type ChatFileSendModalPropTypes = {
  botuser_id?: number | string;
};

type PropsTypes = {
  modalControl: ModalControlType<ChatFileSendModalPropTypes>;
  callback: (p?: { file: IChatFileModel, caption: string, created_at: string }) => void;
  messageValue: string;
  uploadedFile: any;
  setUploadedFile: any;
};

export const ChatFileSend: FC<PropsTypes> = (props) => {
  const { modalControl, callback, messageValue, uploadedFile, setUploadedFile } = props;
  const { t } = useTranslation();
  const currentLang = getCurrentLang();
  const { botuser_id } = modalControl.modalProps;
  const [form] = Form.useForm();

  const { request: chatSendFileMessage, reset: resetChatSendFileMessage, ...chatSendFileMessageState } = $chatSendFileMessage.useStore();

  //const [vid, setVid] = useState("");

  useEffect(() => {

    return () => {
      resetChatSendFileMessage();
      onRemoveFile();
    }
  }, []);


  // useEffect(() => {
  //   if (chatSendFileMessageState.data) {
  //     callback({
  //       file: chatSendFileMessageState.data.file,
  //       caption: chatSendFileMessageState.data.text ? chatSendFileMessageState.data.text : "",
  //       created_at: dayjs(chatSendFileMessageState.data.created_at).format("YYYY-MM-DDTHH:mm")
  //     });
  //     modalControl.close();
  //   }
  // }, [chatSendFileMessageState.data]);

  const beforeUploadPhoto = (file: any) => {
    const correspondSize = isFileCorrespondSize(file, 10);

    if (!correspondSize) {
      notificationWarning(t("warnings.sizeMb", { fileSize: "10" }));
      return false;
    }

    if (correspondSize) {
      setUploadedFile(file);
    }

    return false;
  };

  const onRemoveFile = () => {
    setUploadedFile(undefined);
  }


  const onFinish = (formData: any) => {
    const data = new FormData();

    if (!uploadedFile) {
      notificationWarning(t("notifications.addFile"));
      return;
    }

    if (uploadedFile) {
      data.append("file", uploadedFile);
    }

    if (formData.caption) {
      data.append("text", formData.caption);
    }

    console.log("uploadedFile", uploadedFile);
    console.log("vvv", URL.createObjectURL(uploadedFile));

    let type = "text";

    if (uploadedFile.type) {
      type = uploadedFile.type.includes("image") ? "image" : uploadedFile.type.includes("video") ? "video" : "text";
    }

    callback({
      file: {
        url: URL.createObjectURL(uploadedFile),
        name: uploadedFile.name,
        type: type,
      },
      caption: formData.caption ? formData.caption : "",
      created_at: dayjs().format("YYYY-MM-DDTHH:mm")
    });
    modalControl.close();

    //setVid(URL.createObjectURL(uploadedFile));

    // chatSendFileMessage({
    //   botuser_id: botuser_id,
    //   data
    // });
  };


  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Loading show={chatSendFileMessageState.loading} />
      <ModalUI.Middle>
        <FormUI
          phantomSubmit
          form={form}
          onFinish={onFinish}
          initialValues={{ caption: messageValue }}
        >
          <Form.Item>
            <Upload
              beforeUpload={beforeUploadPhoto}
              onRemove={onRemoveFile}
              fileList={uploadedFile ? [uploadedFile] : []}
            >
              <ButtonUI>{uploadedFile ? t("selectAnotherFile") : t("selectFile")}</ButtonUI>
            </Upload>
          </Form.Item>
          <Form.Item
            label={t("caption")}
            name="caption"
          >
            <InputUI />
          </Form.Item>
        </FormUI>
        <ModalUI.Buttons>
          <ButtonUI type="primary" onClick={() => form.submit()}>
            {t("buttons.send")}
          </ButtonUI>
        </ModalUI.Buttons>
      </ModalUI.Middle>
    </>
  );
};