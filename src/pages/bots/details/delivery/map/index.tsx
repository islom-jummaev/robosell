import React, { useEffect, useState, FC } from "react";
import { Map, Placemark, YMaps, TypeSelector } from "react-yandex-maps";
import { ModalUI } from "@ui/modal";
import { ButtonUI } from "@ui/button";

import styles from "../../styles.module.scss";
import { $botAddressUpdate } from "@stores/bots";
import { ModalControlType } from "@/hooks/useModalControl";
import { notificationWarning } from "@ui/notifications";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";

type PropsTypes = {
  modalControl: ModalControlType;
  botId: string,
  mapData: {
    pmCoords: Array<number>;
  };
  setMapData: (param: {
    pmCoords: Array<number>;
  }) => void;
};

export const BotDeliveryMap: FC<PropsTypes> = (props) => {
  const { modalControl, mapData, setMapData, botId } = props;

  const { t } = useTranslation();

  const {
    request: updateBotAddress,
    reset: resetUpdateBotAddress,
    ...botAddressUpdateState
  } = $botAddressUpdate.useStore();

  const [currentCoords, setCurrentCoords] = useState<{ pmCoords: Array<number>; centerCoords: Array<number>; }>({
    pmCoords: mapData.pmCoords,
    centerCoords: mapData.pmCoords
  });

  useEffect(() => {
    return () => {
      resetUpdateBotAddress();
    }
  }, []);

  useEffect(() => {
    if (botAddressUpdateState.data) {
      setMapData({
        pmCoords: currentCoords.pmCoords
      });
      modalControl.close();
    }
  }, [botAddressUpdateState.data]);

  const pmCoords = currentCoords.pmCoords.length ? currentCoords.pmCoords: "";
  const centerCoords = currentCoords.centerCoords.length ? currentCoords.centerCoords: [41.31010259156362, 69.24159990502929];

  const onMapClick = (event: any) => {
    const coords = event.get("coords");

    setCurrentCoords({ ...mapData, centerCoords: coords, pmCoords: coords });
  };

  const onFinish = () => {
    if (!currentCoords.pmCoords.length) {
      notificationWarning(t("notifications.setPoints"));
      return;
    }

    updateBotAddress({
      id: botId,
      latitude: currentCoords.pmCoords[0],
      longitude: currentCoords.pmCoords[1]
    });
  };

  return (
    <>
      <ModalUI.Loading show={botAddressUpdateState.loading} />
      <ModalUI.Header>
        <ModalUI.Title>{t("delivery.maps", { ns: namespaces.bots })}</ModalUI.Title>
      </ModalUI.Header>
      <ModalUI.Middle>
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
        <div className={styles.mapDescription}>
          {t("delivery.mapDescription", { ns: namespaces.bots })}
        </div>
      </ModalUI.Middle>
      <ModalUI.Footer>
        <ModalUI.Buttons>
          <ButtonUI type="primary" onClick={() => onFinish()}>
            {t("buttons.save")}
          </ButtonUI>
        </ModalUI.Buttons>
      </ModalUI.Footer>
    </>
  )
};