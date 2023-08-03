import React, { FC, useEffect, useState } from "react";
import { IOrderDetailsModel } from "@/businessLogic/models/orders";
import { Form, Radio, Space } from "antd";
import { useTranslation } from "react-i18next";
import { FormUI } from "@ui/form";
import { $orderUpdate } from "@stores/orders";
import { notificationSuccess, notificationWarning } from "@ui/notifications";
import { InputUI } from "@ui/input";
import { ButtonUI } from "@ui/button";
import { DeliveryTypeSelect } from "@/pickers/delivery-type-select";
import { namespaces } from "@core/localization/i18n.constants";
import { requiredFormRules } from "@utils/constants/common";
import { getCurrentLang } from "@utils/getters";
import { DeleteIcon } from "@assets/icons";
import { ModalUI } from "@ui/modal";
import { useModalControl } from "@/hooks/useModalControl";
import { ProductSelect } from "@/pickers/product-select";
import { ISkusItem } from "@/businessLogic/models/products";
import { ILocalizeModel } from "@customTypes/apiResponseModels";

type SelectedProductType = {
  id: number;
  name: ILocalizeModel;
  skus: Array<ISkusItem>;
}

type ProductEntityType = {
  id: number;
  name: string;
  count: number;
  price: string;
  initialPrice: string;
}

type PropsTypes = {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  details: IOrderDetailsModel;
  callback: () => void;
}

export const OrderEditForm: FC<PropsTypes> = (props) => {
  const { setEditMode, details, callback } = props;
  const { t } = useTranslation();
  const currentLang = getCurrentLang();
  const [form] = Form.useForm();

  const productModalControl = useModalControl();

  const { request: orderUpdate, reset: resetOrderUpdate, ...orderUpdateState } = $orderUpdate.useStore();

  const [selectedProduct, setSelectedProduct] = useState<SelectedProductType | null>(null);
  const [selectedSkus, setSelectedSkus] = useState<ISkusItem | null>(null);

  useEffect(() => {
    form.setFieldsValue({
      botuser: details.botuser,
      phone: details.phone,
      payment_type: details.payment_type,
      service_type: details.service_type.key,
      address: details.address,
      items: details.items.map((item) => ({
        id: item.skus.id,
        name: `${item.product[currentLang]} ${item.skus.name[currentLang]}`,
        count: item.count,
        price: item.skus.price,
        initialPrice: Number(item.skus.price) / item.count
      }))
    });

    return () => {
      resetOrderUpdate();
    }
  }, []);

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/[^0-9+]/g, '');

    form.setFieldValue("phone", value);
  };

  useEffect(() => {
    if (orderUpdateState.data) {
      notificationSuccess(t("notifications.updated"));
      setEditMode(false);
      callback && callback();
    }
  }, [orderUpdateState.data]);

  const onQtyChange = (count: number, key: number) => {
    const fields = form.getFieldsValue();
    const { items } = fields;

    const rowFields = items[key];

    Object.assign(rowFields, { price: rowFields.initialPrice * count, count });

    form.setFieldsValue({ items });
  };

  const onProductChange = (id: number, option: any) => {
    if (id) {
      const item = option["data-option"];
      setSelectedSkus(null);
      setSelectedProduct(item);
    }
  };

  const onChangeSkus = (e: any) => {
    const item = e.target["data-option"];

    setSelectedSkus(item);
  };

  const onAddProduct = () => {
    if (selectedProduct && selectedSkus) {
      const items = form.getFieldValue("items");

      let isExist = false;

      items.forEach((item: ProductEntityType) => {
        if (item.id === selectedSkus.id) {
          isExist = true;
        }
      });

      if (isExist) {
        notificationWarning(t("product_added", { ns: namespaces.orders }));
      } else {
        form.setFieldsValue({
          items: [
            ...items,
            {
              id: selectedSkus.id,
              name: `${selectedProduct.name} ${selectedSkus.name[currentLang]}`,
              count: 1,
              price: selectedSkus.price,
              initialPrice: selectedSkus.price
            }
          ]
        });

        setSelectedProduct(null);
        setSelectedSkus(null);

        productModalControl.close();
      }
    } else {
      notificationWarning(t("pickUnit"));
    }
  };

  const onFinish = (formData: any) => {
    orderUpdate({
      id: details.id,
      phone: formData.phone,
      service_type: formData.service_type,
      address: formData.address,
      items: formData.items.map((item: ProductEntityType) => ({ count: item.count, skus: item.id })),
    })
  };

  return (
    <>
      <ModalUI.Loading show={orderUpdateState.loading} />
      <FormUI
        form={form}
        onFinish={onFinish}
        phantomSubmit
      >
        <FormUI.Row>
          <FormUI.Col>
            <FormUI.Item
              label={t("client")}
              name="botuser"
            >
              <InputUI disabled={true} />
            </FormUI.Item>
          </FormUI.Col>
          <FormUI.Col>
            <FormUI.Item
              label={t("fields.phone")}
              name="phone"
            >
              <InputUI onChange={onPhoneChange} />
            </FormUI.Item>
          </FormUI.Col>
        </FormUI.Row>

        <FormUI.Row>
          <FormUI.Col>
            <FormUI.Item
              label={t("paymentType")}
              name="payment_type"
            >
              <InputUI disabled={true} />
            </FormUI.Item>
          </FormUI.Col>
          <FormUI.Col>
            <FormUI.Item
              label={t("deliveryType")}
              name="service_type"
            >
              <DeliveryTypeSelect />
            </FormUI.Item>
          </FormUI.Col>
        </FormUI.Row>

        <FormUI.Item
          label={t("address")}
          name="address"
        >
          <InputUI />
        </FormUI.Item>

        <Form.List
          name="items"
          rules={[
            {
              validator: async (_, items) => {
                if (!items || items.length < 1) {
                  const message = t("add_products", { ns: namespaces.orders });
                  return Promise.reject(new Error(message));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <div className="form-list-wrap">
              <div className="form-list-head">{t("order")}</div>
              {fields.map(({ key, name, ...restField }) => (
                <div className="form-list-product-row" key={key}>
                  <div className="form-list-product-row__left">
                    <FormUI.Item shouldUpdate>
                      {() => {
                        const items = form.getFieldValue("items");
                        const name = items[key].name;

                        return (
                          <div>
                            {name}
                          </div>
                        )
                      }}
                    </FormUI.Item>
                  </div>
                  <div className="form-list-product-row__right">
                    <div>
                      <FormUI.Item
                        shouldUpdate
                      >
                        {() => {
                          const items = form.getFieldValue("items");
                          const count = items[key].count;

                          return (
                            <div className="amount-btn-wr">
                              <ButtonUI
                                className="amount-btn"
                                onClick={() => onQtyChange(Number(count) - 1, key)}
                                disabled={count === 1}
                              >
                                -
                              </ButtonUI>
                              <div className="amount-input">
                                {count}
                              </div>
                              <ButtonUI
                                className="amount-btn"
                                onClick={() => onQtyChange(Number(count) + 1, key)}
                              >
                                +
                              </ButtonUI>
                            </div>
                          );
                        }}
                      </FormUI.Item>
                    </div>
                    <div>
                      <FormUI.Item
                        name={[name, "price"]}
                        rules={requiredFormRules}
                        {...restField}
                      >
                        <InputUI readOnly />
                      </FormUI.Item>
                    </div>
                    <div>
                      <ButtonUI
                        className="form-list-delete-row"
                        type="primary"
                        withIcon
                        circle
                        onClick={() => remove(name)}
                      >
                        <DeleteIcon />
                      </ButtonUI>
                    </div>
                  </div>
                </div>
              ))}
              <div className="form-list-btn" onClick={() => productModalControl.open()}>
                + {t("add")}
              </div>
              <Form.ErrorList errors={errors} />
            </div>
          )}
        </Form.List>

        <ButtonUI
          type="primary"
          onClick={() => form.submit()}
        >
          {t("buttons.save")}
        </ButtonUI>
      </FormUI>
      <ModalUI
        open={productModalControl.modalProps.open}
        onCancel={() => {
          setSelectedProduct(null);
          productModalControl.close();
        }}
        width={500}
      >
        <ModalUI.Header>
          <ModalUI.Title></ModalUI.Title>
        </ModalUI.Header>
        <ModalUI.Middle>
          <FormUI>
            <FormUI.Item label={t("sideNavigation.product")}>
              <ProductSelect
                allowClear={false}
                onChange={onProductChange}
                optionDetails={true}
              />
            </FormUI.Item>
            {selectedProduct && (
              <FormUI.Item>
                <Radio.Group onChange={onChangeSkus} value={selectedSkus?.id}>
                  <Space direction="vertical">
                    {selectedProduct.skus.map((item) => (
                      <Radio value={item.id} key={item.id} data-option={item}>
                        {item.name[currentLang]} - <strong>{item.price} {t("uzs")}</strong>
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </FormUI.Item>
            )}
            <ButtonUI
              type="primary"
              onClick={onAddProduct}
            >
              {t("add")}
            </ButtonUI>
          </FormUI>
        </ModalUI.Middle>
      </ModalUI>
    </>
  )
};