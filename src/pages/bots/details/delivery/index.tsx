import React, { FC, useEffect, useState } from "react";
import type { RadioChangeEvent } from "antd";
import { Form, Radio, Space } from "antd";

import { $botAddress, $botDeliveryDetails, $botDeliveryDetailsUpdate } from "@stores/bots";

import styles from "../styles.module.scss";
import { FormUI } from "@ui/form";
import { ButtonUI } from "@ui/button";
import { notificationSuccess, notificationWarning } from "@ui/notifications";
import { Spinner } from "@ui/spinner";
import { SelectUI } from "@ui/select";
import { InputUI } from "@ui/input";
import { requiredFormRules } from "@utils/constants/common";
import { useModalControl } from "@/hooks/useModalControl";
import { ModalUI } from "@ui/modal";
import { BotDeliveryMap } from "@/pages/bots/details/delivery/map";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";
import { CountrySelect } from "@/pickers/country-select";
import { CitySelect } from "@/pickers/city-select";


type PropsTypes = {
  botId: string;
}

const DELIVERY_TYPES = {
  FREE: "FREE",
  FLEXABLE: "FLEXABLE",
  CUSTOM: "CUSTOM",
  FIXED: "FIXED",
  FIRST_FEW_KM: "FIRST_FEW_KM",
}

export const BotDeliveryDetails: FC<PropsTypes> = (props) => {
  const { botId } = props;

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const {
    request: getBotDeliveryDetails,
    reset: resetBotDeliveryDetails,
    ...botDeliveryDetailsState
  } = $botDeliveryDetails.useStore();
  const {
    request: updateBotDeliveryDetails,
    reset: resetUpdateBotDeliveryDetails,
    ...botDeliveryDetailsUpdateState
  } = $botDeliveryDetailsUpdate.useStore();
  const {
    request: getBotAddress,
    reset: resetBotAddress,
    ...botAddressState
  } = $botAddress.useStore();

  const [showOnMap, setShowOnMap] = useState<boolean>(false);
  const [mapData, setMapData] = useState<{ pmCoords: Array<number>; }>({
    pmCoords: []
  });

  const botAddressModalControl = useModalControl();

  useEffect(() => {
    getBotDeliveryDetails(botId);
    getBotAddress(botId);

    return () => {
      resetBotDeliveryDetails();
      resetBotAddress();
      resetUpdateBotDeliveryDetails();
    }
  }, []);

  useEffect(() => {
    if (botDeliveryDetailsState.data) {
      const service_type: Array<string> = [];
      botDeliveryDetailsState.data.service_type.forEach((item) => {
        if (item.checked) {
          service_type.push(item.code);
        }
      });


      let delivery_type = "";
      botDeliveryDetailsState.data.delivery_type.forEach((item) => {
        if (item.checked) {
          delivery_type = item.code;
        }
      });

      form.setFieldsValue({
        service_type,
        delivery_type,
        delivery_price: botDeliveryDetailsState.data.delivery_price,
        max_km: botDeliveryDetailsState.data.max_km,
        country: botDeliveryDetailsState.data.country,
        city: botDeliveryDetailsState.data.city
      })
    }
  }, [botDeliveryDetailsState.data]);

  useEffect(() => {
    if (botAddressState.data && Object.keys(botAddressState.data).length) {
      setMapData({
        pmCoords: [botAddressState.data.latitude, botAddressState.data.longitude]
      });
    }
  }, [botAddressState.data]);

  useEffect(() => {
    if (botDeliveryDetailsUpdateState.data) {
      notificationSuccess(t("notifications.updated"));
      resetUpdateBotDeliveryDetails();
    }
  }, [botDeliveryDetailsUpdateState.data]);

  const onDeliveryTypeChange = (e: RadioChangeEvent) => {
    const value = e.target.value;

    if (value !== DELIVERY_TYPES.FIXED || value !== DELIVERY_TYPES.FIRST_FEW_KM) {
      form.setFieldValue("delivery_price", undefined);
    }

    if (value === DELIVERY_TYPES.FLEXABLE) {
      setShowOnMap(true);
    } else {
      if (showOnMap) {
        setShowOnMap(false);
      }
    }
  };

  const onCountryChange = (country: number) => {
    form.setFieldsValue({
      country,
      city: undefined
    });
  }


  const onFinish = (formData: any) => {
    const formDeliveryType = formData.delivery_type;

    if (formDeliveryType === DELIVERY_TYPES.FLEXABLE && !mapData.pmCoords.length) {
      notificationWarning(t("notifications.setPointsOnMap"));
      return;
    }

    updateBotDeliveryDetails({
      id: botId,
      max_km: formData.max_km,
      delivery_type: formDeliveryType,
      service_type: formData.service_type,
      delivery_custom_text: formDeliveryType === DELIVERY_TYPES.CUSTOM ? formData.delivery_custom_text : "",
      delivery_price: formDeliveryType === DELIVERY_TYPES.FIRST_FEW_KM || formDeliveryType === DELIVERY_TYPES.FIXED ? formData.delivery_price : 0,
      km_for_free: formDeliveryType === DELIVERY_TYPES.FIRST_FEW_KM ? formData.km_for_free : 0,
      country: formData.country,
      city: formData.city
    });
  };

  if (!botDeliveryDetailsState.data || botDeliveryDetailsState.loading) {
    return (
      <div className={styles.delivery}>
        <div className="bg-loader">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.delivery}>
      <FormUI
        phantomSubmit
        form={form}
        onFinish={onFinish}
      >
        <FormUI.Item
          name="delivery_type"
        >
          <Radio.Group onChange={onDeliveryTypeChange}>
            <Space direction="vertical">
              {botDeliveryDetailsState.data?.delivery_type.map((item) => (
                <Radio value={item.code} key={item.code}>{item.name}</Radio>
              ))}
            </Space>
          </Radio.Group>
        </FormUI.Item>

        {showOnMap && (
          <div className={styles.mapItem}>
            <ButtonUI
              onClick={() => botAddressModalControl.open()}
              disabled={!botAddressState.data}
            >
              {t("showMap")}
            </ButtonUI>
            <div>
              <span>
                {t("latitude")}: {mapData.pmCoords.length ? mapData.pmCoords[0] : "не указано"}, {t("longitude")} {mapData.pmCoords.length ? mapData.pmCoords[1] : t("notIndicated")}
              </span>
            </div>
          </div>
        )}

        <FormUI.Item shouldUpdate noStyle>
          {() => {
            const delivery_type = form.getFieldValue("delivery_type");

            if (delivery_type !== DELIVERY_TYPES.FIRST_FEW_KM) {
              return null;
            }

            return (
              <FormUI.Item
                name="km_for_free"
                rules={requiredFormRules}
              >
                <InputUI.Number placeholder={t("delivery.placeholders.freeKm", { ns: namespaces.bots })} min={1} />
              </FormUI.Item>
            )
          }}
        </FormUI.Item>


        <FormUI.Item shouldUpdate noStyle>
          {() => {
            const delivery_type = form.getFieldValue("delivery_type");

            if (delivery_type !== DELIVERY_TYPES.CUSTOM) {
              return null;
            }

            return (
              <FormUI.Item
                name="delivery_custom_text"
                rules={requiredFormRules}
              >
                <InputUI placeholder={t("delivery.placeholders.delivery_custom_text", { ns: namespaces.bots })} />
              </FormUI.Item>
            )
          }}
        </FormUI.Item>

        <FormUI.Item shouldUpdate noStyle>
          {() => {
            const delivery_type = form.getFieldValue("delivery_type");

            const condition = delivery_type === DELIVERY_TYPES.FIRST_FEW_KM || delivery_type === DELIVERY_TYPES.FIXED;

            return (
              <FormUI.Item
                name="delivery_price"
                label={t("delivery.labels.deliveryPrice", { ns: namespaces.bots })}
                rules={condition ? requiredFormRules : undefined}
              >
                <InputUI.Number disabled={!(condition)} />
              </FormUI.Item>
            )
          }}
        </FormUI.Item>

        <FormUI.Item
          name="max_km"
          label={t("delivery.labels.maxKm", { ns: namespaces.bots })}
        >
          <InputUI.Number />
        </FormUI.Item>

        <FormUI.Item
          name="country"
          label={t("delivery.labels.country", { ns: namespaces.bots })}
        >
          <CountrySelect onChange={onCountryChange} />
        </FormUI.Item>

        <FormUI.Item shouldUpdate noStyle>
          {() => {
            const country = form.getFieldValue("country");

            return (
              <FormUI.Item
                name="city"
                label={t("delivery.labels.city", { ns: namespaces.bots })}
              >
                <CitySelect
                  mode="multiple"
                  showSearch={false}
                  country={country}
                />
              </FormUI.Item>
            )
          }}
        </FormUI.Item>

        <FormUI.Item
          name="service_type"
          label={t("delivery.labels.serviceType", { ns: namespaces.bots })}
          rules={requiredFormRules}
        >
          <SelectUI
            mode="multiple"
            showSearch={false}
          >
            {botDeliveryDetailsState.data?.service_type.map((item) => (
              <SelectUI.Option value={item.code} key={item.code}>{item.name}</SelectUI.Option>
            ))}
          </SelectUI>
        </FormUI.Item>

        <ButtonUI
          type="primary"
          loading={botDeliveryDetailsUpdateState.loading}
          onClick={() => form.submit()}
        >
          {t("buttons.save")}
        </ButtonUI>
      </FormUI>
      <ModalUI
        open={botAddressModalControl.modalProps.open}
        onCancel={botAddressModalControl.close}
        width={950}
      >
        <BotDeliveryMap
          modalControl={botAddressModalControl}
          mapData={mapData}
          setMapData={setMapData}
          botId={botId}
        />
      </ModalUI>
    </div>
  )
};