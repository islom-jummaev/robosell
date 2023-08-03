import React from "react";

import { ModalUI } from "@ui/modal";
import { FormUI } from "@ui/form";
import { Form } from "antd";
import { InputUI } from "@ui/input";
import { ButtonUI } from "@ui/button";
import { notificationSuccess } from "@ui/notifications";

export const ChangeWordModal = (props: any) => {
  const { modalControl, updateSelectedFiles, selectedFiles, selectedBaseFile, setCurrentFile, data } = props;


  const { parents, val } = modalControl.modalProps;

  const [ form ] = Form.useForm();

  const onFinish = (formData: any) => {
    const { word } = formData;

    let newData = {};

    updateSelectedFiles(selectedFiles.map((item: any) => {
      let file = { ...item.file };

      if (item.name === selectedBaseFile.name) {
        file = JSON.parse(JSON.stringify(data));
        let res = file;

        parents.forEach((item: any, index: any) => {
          if (index + 1 === parents.length) {
            res[item] = word;
            newData = file;
          } else {
            res = res[item];
          }
        });
      }

      return {
        name: item.name,
        file
      }
    }));

    setCurrentFile(newData);

    notificationSuccess("Слово добавлено");

    modalControl.close();
  };

  const onSubmitClick = () => {
    form.submit();
  };

  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title>
          Добавить перевод
        </ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Middle>
        <FormUI
          phantomSubmit
          onFinish={onFinish}
          form={form}
          initialValues={{ word: val !== "notTranslated" ? val : "" }}
          layout={"vertical"}
        >
          <Form.Item
            name="word"
            label="Слово"
          >
            <InputUI placeholder="Введите слово" />
          </Form.Item>
        </FormUI>
      </ModalUI.Middle>
      <ModalUI.Footer>
        <ModalUI.Buttons>
          <ButtonUI fullWidth size="large" type="primary" onClick={onSubmitClick}>
            Готово
          </ButtonUI>
        </ModalUI.Buttons>
      </ModalUI.Footer>
    </>
  );
};