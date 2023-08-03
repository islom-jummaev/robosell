import React, { FC, useEffect, useState } from "react";
import { ModalUI } from "@ui/modal";
import { ModalControlType } from "@/hooks/useModalControl";
import { FormUI } from "@ui/form";
import { ButtonUI } from "@ui/button";
import { Form, Switch, Upload } from "antd";
import { $productCreate, $productUpdate, $productDetails } from "@stores/products";
import { useTranslation } from "react-i18next";
import { isFileCorrespondType, isFileCorrespondSize, getBase64, UPLOAD_FILE_TYPES } from "@utils/formatters";
import { DeleteIcon, UploadPlus } from "@assets/icons";
import { notificationWarning, notificationSuccess } from "@ui/notifications";
import { namespaces } from "@core/localization/i18n.constants";
import { $currentBot } from "@stores/bots";
import { InputUI } from "@ui/input";
import { requiredFormRules } from "@utils/constants/common";
import { CategorySelect } from "@/pickers/category-select";
import { ProductStatusSelect } from "@/pickers/product-status-select";
import { getCurrentLang } from "@utils/getters";
import { FormLanguage } from "@/components/form-language";


export type ProductAddEditModalPropTypes = {
  id?: number;
};

type PropsTypes = {
  modalControl: ModalControlType<ProductAddEditModalPropTypes>;
  callback: () => void;
};

export const ProductAddEdit: FC<PropsTypes> = (props) => {
  const { modalControl, callback } = props;
  const { t } = useTranslation();
  const currentLang = getCurrentLang();
  const { id } = modalControl.modalProps;
  const [form] = Form.useForm();

  const { currentBot } = $currentBot.useStore();
  const { request: getProductDetailsRequest, reset: resetProductDetails, ...productDetailsState } = $productDetails.useStore();
  const { request: productCreateRequest, reset: resetProductCreate, ...productCreateState } = $productCreate.useStore();
  const { request: productUpdateRequest, reset: resetProductUpdate, ...productUpdateState } = $productUpdate.useStore();

  const { formLangValue, setFormLangValue } = FormLanguage.useFormLang();

  const [ uploadedPhoto, setUploadedPhoto ] = useState(undefined);
  const [ photoUrl, setPhotoUrl ] = useState<any>("");

  useEffect(() => {
    if (id) {
      getProductDetailsRequest(id);
    }

    return () => {
      resetProductDetails();
      resetProductCreate();
      resetProductUpdate();
    }
  }, []);

  useEffect(() => {
    if (productDetailsState.data) {
      if (productDetailsState.data.photo) {
        setPhotoUrl(`${productDetailsState.data.photo}`);
      }

      form.setFieldsValue({
        nameRu: productDetailsState.data.name.ru,
        nameUz: productDetailsState.data.name.uz,
        nameEn: productDetailsState.data.name.en,
        descRu: productDetailsState.data.desc?.ru,
        descUz: productDetailsState.data.desc?.uz,
        descEn: productDetailsState.data.desc?.en,
        is_active: productDetailsState.data.is_active,
        category: {
          id: productDetailsState.data.category?.id,
          name: productDetailsState.data.category?.name[currentLang],
        },
        skus: productDetailsState.data.skus.map((item) => ({
          nameRu: item.name.ru,
          nameUz: item.name.uz,
          nameEn: item.name.en,
          price: item.price,
          stock_status: item.stock_status,
          stock_count: item.stock_status === "LIMITED" ? item.stock_count : undefined
        }))
      });
    }
  }, [productDetailsState.data]);

  useEffect(() => {
    if (productCreateState.data) {
      notificationSuccess(t("created", { ns: namespaces.products }));
      modalControl.close();
      callback && callback();
    }
  }, [productCreateState.data]);

  useEffect(() => {
    if (productUpdateState.data) {
      notificationSuccess(t("notifications.updated"));
      modalControl.close();
      callback && callback();
    }
  }, [productUpdateState.data]);

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

  const onCategoryChange = (categoryId: number, option: any) => {
    const category = {
      id: categoryId,
      name: option ? option.children : "",
    };

    const currentField = {
      category: categoryId ? category : undefined,
    };

    form.setFieldsValue(currentField);
  };

  const onStatusChange = (status: string | undefined, key: number) => {
    const { skus } = form.getFieldsValue();

    const rowFields = skus[key];

    Object.assign(rowFields, { stock_count: undefined });

    form.setFieldsValue({ skus });
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

    const strArr = JSON.stringify(formData.skus.map((item: any) => ({
      name: {
        ru: item.nameRu || item.nameUz || item.nameEn,
        uz: item.nameUz || item.nameRu || item.nameEn,
        en: item.nameEn || item.nameRu || item.nameUz
      },
      price: String(item.price),
      stock_status: item.stock_status,
      stock_count: item.stock_status === "LIMITED" ? item.stock_count : undefined
    })));

    data.append("bot", String(currentBot?.id));
    data.append("name", JSON.stringify({
      ru: formData.nameRu || formData.nameUz || formData.nameEn,
      uz: formData.nameUz || formData.nameRu || formData.nameEn,
      en: formData.nameEn || formData.nameRu || formData.nameUz
    }));
    data.append("category", formData.category.id);
    data.append("desc", JSON.stringify({
      ru: formData.descRu || formData.descUz || formData.descEn,
      uz: formData.descUz || formData.descRu || formData.descEn,
      en: formData.descEn || formData.descRu || formData.descUz
    }));
    data.append("skus", strArr);
    data.append("is_active", formData.is_active);

    if (id) {
      productUpdateRequest({
        id,
        data,
        isPatch: !uploadedPhoto
      });
    } else {
      productCreateRequest(data);
    }
  };


  return (
    <>
      <ModalUI.Header>
        <ModalUI.Title></ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Loading show={productCreateState.loading || productUpdateState.loading || productDetailsState.loading} />
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
                {photoUrl ? <img src={photoUrl} alt="Product-photo" style={{ width: '100%' }} /> : (
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
          <FormUI.Item shouldUpdate noStyle>
            {() => {
              const category = form.getFieldValue("category");

              return (
                <FormUI.Item label={t("category")} name="category" rules={requiredFormRules}>
                  <CategorySelect onChange={onCategoryChange} value={category} />
                </FormUI.Item>
              );
            }}
          </FormUI.Item>
          {formLangValue === "ru" && (
            <FormUI.Item
              name="descRu"
              label={`${t("about_product", { ns: namespaces.products })} RU`}
              rules={requiredFormRules}
            >
              <InputUI.TextArea rows={4} />
            </FormUI.Item>
          )}
          {formLangValue === "uz" && (
            <FormUI.Item
              name="descUz"
              label={`${t("about_product", { ns: namespaces.products })} RU`}
              rules={requiredFormRules}
            >
              <InputUI.TextArea rows={4} />
            </FormUI.Item>
          )}
          {formLangValue === "en" && (
            <FormUI.Item
              name="descEn"
              label={`${t("about_product", { ns: namespaces.products })} EN`}
              rules={requiredFormRules}
            >
              <InputUI.TextArea rows={4} />
            </FormUI.Item>
          )}
          <Form.List
            name="skus"
            rules={[
              {
                validator: async (_, skus) => {
                  if (!skus || skus.length < 1) {
                    return Promise.reject(new Error(t("add_units", { ns: namespaces.products })));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <div className="form-list-wrap">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key}>
                    {formLangValue === "ru" && (
                      <FormUI.Item
                        name={[name, "nameRu"]}
                        label={`${t("unit")} RU`}
                        rules={requiredFormRules}
                        {...restField}
                      >
                        <InputUI />
                      </FormUI.Item>
                    )}
                    {formLangValue === "uz" && (
                      <FormUI.Item
                        name={[name, "nameUz"]}
                        label={`${t("unit")} UZ`}
                        rules={requiredFormRules}
                        {...restField}
                      >
                        <InputUI />
                      </FormUI.Item>
                    )}
                    {formLangValue === "en" && (
                      <FormUI.Item
                        name={[name, "nameEn"]}
                        label={`${t("unit")} EN`}
                        rules={requiredFormRules}
                        {...restField}
                      >
                        <InputUI />
                      </FormUI.Item>
                    )}
                    <FormUI.Item
                      name={[name, "price"]}
                      label={t("price")}
                      rules={requiredFormRules}
                      {...restField}
                    >
                      <InputUI.Number min={1} />
                    </FormUI.Item>
                    <FormUI.Row>
                      <FormUI.Col>
                        <FormUI.Item
                          name={[name, "stock_status"]}
                          label={t("status")}
                          rules={requiredFormRules}
                          {...restField}
                        >
                          <ProductStatusSelect onChange={(status: string | undefined) => onStatusChange(status, key)} />
                        </FormUI.Item>
                      </FormUI.Col>
                      <FormUI.Col>
                        <FormUI.Item shouldUpdate>
                          {() => {
                            const skus = form.getFieldValue("skus");
                            const status = skus[key]?.stock_status;

                            if (status !== "LIMITED") {
                              return null;
                            }

                            return (
                              <FormUI.Item
                                name={[name, "stock_count"]}
                                label={t("fields.qty")}
                                rules={requiredFormRules}
                                {...restField}
                              >
                                <InputUI.Number />
                              </FormUI.Item>
                            )
                          }}
                        </FormUI.Item>
                        <div className="form-list-btn" onClick={() => remove(name)}>
                          {t("buttons.delete")}
                        </div>
                      </FormUI.Col>
                    </FormUI.Row>
                  </div>
                ))}
                <div className="form-list-btn" onClick={() => add()}>
                  + {t("addUnit")}
                </div>
                <Form.ErrorList errors={errors} />
              </div>
            )}
          </Form.List>
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