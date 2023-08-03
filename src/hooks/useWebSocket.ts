import { useMemo } from "react";
import { Client } from "@stomp/stompjs";
import { $currentBot } from "@stores/bots";

export const useWebSocket = () => {
  const { currentBot } = $currentBot.useStore();

  const client = useMemo(() => {
    return new Client({
      brokerURL: `wss://polkadot.webapi.subscan.io/socket`,
      debug: function (str) {

      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  }, []);

  const setUpConnection = (onConnect: any) => {
    client.onConnect = onConnect;
    client.activate();
  };

  const removeConnection = () => {
    client.deactivate();
  };

  return {
    client,
    setUpConnection,
    removeConnection,
  };
};
