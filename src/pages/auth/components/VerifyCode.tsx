import { Form } from "antd";
import { FormUI } from "@ui/form";
import { requiredFormRules } from "@utils/constants/common";
import { InputUI } from "@ui/input";
import InputMask from "react-input-mask";

import { ButtonUI } from "@ui/button";
import styles from "../auth.module.scss";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";

export default function VerifyCode(props: any) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const onFinish = (formData: any) => {

    props.onVerify({
      code: formData.code
    });
  };

  return (
    <div className={styles["register-form"]}>
      <FormUI
        phantomSubmit
        form={form}
        onFinish={onFinish}
      >
        <Form.Item name="code" rules={requiredFormRules}>
        <InputMask   
            mask="+\9\98 99 999-99-99"
            className="formcontrol"
            placeholder={t("fields.smsCode")}
            type="text"
          
            
          />
        
        </Form.Item>
        <p>
          {t("haveAccount", { ns: namespaces.auth })}{" "}
          <span className={styles.span} onClick={() => props.setRegisterForm(false)}>{t("signInNow", { ns: namespaces.auth })}</span>
        </p>

        <ButtonUI
          type="primary"
          loading={props.isLoading}
          onClick={() => form.submit()}
        >
          {t("buttons.confirm")}
        </ButtonUI>
      </FormUI>
    </div>
  );
}
