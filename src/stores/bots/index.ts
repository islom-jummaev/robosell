import { storeCreator } from "@core/zustand";
import { initialStateConstructor } from "@utils/constructors/store";
import { api } from "@/businessLogic/api";
import * as botsModels from "@/businessLogic/models/bots";
import { create } from "zustand";

export type CurrentBotType = { id: string; name: string; } | null | undefined;

export const $currentBot = {
  useStore: create<{ currentBot: CurrentBotType, update: (p: CurrentBotType) => void; }>()((set) => ({
    currentBot: undefined,
    update: (currentBot) => {
      set({ currentBot });
    }
  }))
};

export const $updateMainBot = storeCreator<string, null, null>(
  api.bots.updateMainBot,
  initialStateConstructor(null)
);

export const $botsList = storeCreator<void, Array<botsModels.IBotsListItemModel>, null>(
  api.bots.getBotsList,
  initialStateConstructor(null)
);

export const $currentBotToken = storeCreator<string, { token: string }, null>(
  api.bots.getCurrentBotToken,
  initialStateConstructor(null)
);

export const $createBot = storeCreator<botsModels.IBotCreateModel, botsModels.IBotCreateResponseModel, null>(
  api.bots.createBot,
  initialStateConstructor(null)
);

export const $botGeneralDetails = storeCreator<string, botsModels.IBotGeneralDetailsModel, null>(
  api.bots.getBotGeneralDetails,
  initialStateConstructor(null)
);

export const $botGeneralDetailsUpdate = storeCreator<botsModels.IBotGeneralDetailsUpdateModel, botsModels.IBotGeneralDetailsUpdateResponseModel, null>(
  api.bots.botGeneralDetailsUpdate,
  initialStateConstructor(null)
);

export const $botLanguageDetails = storeCreator<string, botsModels.IBotLanguageDetailsModel, null>(
  api.bots.getBotLanguageDetails,
  initialStateConstructor(null)
);

export const $botLanguageDetailsUpdate = storeCreator<botsModels.IBotLanguageDetailsUpdateModel, botsModels.IBotLanguageDetailsUpdateResponseModel, null>(
  api.bots.botLanguageDetailsUpdate,
  initialStateConstructor(null)
);

export const $botDeliveryDetails = storeCreator<string, botsModels.IBotDeliveryDetailsModel, null>(
  api.bots.getBotDeliveryDetails,
  initialStateConstructor(null)
);

export const $botDeliveryDetailsUpdate = storeCreator<botsModels.IBotDeliveryDetailsUpdateModel, botsModels.IBotDeliveryDetailsUpdateResponseModel, null>(
  api.bots.botDeliveryDetailsUpdate,
  initialStateConstructor(null)
);

export const $botAddress = storeCreator<string, botsModels.IBotAddressDetailsModel, null>(
  api.bots.getBotAddressDetails,
  initialStateConstructor(null)
);

export const $botAddressUpdate = storeCreator<botsModels.IBotAddressUpdateModel, botsModels.IBotAddressUpdateResponseModel, null>(
  api.bots.botAddressUpdate,
  initialStateConstructor(null)
);

export const $botPaymentDetails = storeCreator<string, botsModels.IBotPaymentDetailsModel, null>(
  api.bots.getBotPaymentDetails,
  initialStateConstructor(null)
);

export const $botPaymentDetailsUpdate = storeCreator<botsModels.IBotPaymentDetailsUpdateModel, botsModels.IBotPaymentDetailsUpdateResponseModel, null>(
  api.bots.botPaymentDetailsUpdate,
  initialStateConstructor(null)
);

export const $botChangeToken = storeCreator<botsModels.IBotChangeTokenModel, botsModels.IBotChangeTokenResponseModel, null>(
  api.bots.botChangeToken,
  initialStateConstructor(null)
);

export const $botRestart = storeCreator<string, botsModels.IBotRestartResponseModel, null>(
  api.bots.botRestart,
  initialStateConstructor(null)
);

export const $botStop = storeCreator<string, botsModels.IBotStopResponseModel, null>(
  api.bots.botStop,
  initialStateConstructor(null)
);

export const $botDelete = storeCreator<string, botsModels.IBotDeleteResponseModel, null>(
  api.bots.botDelete,
  initialStateConstructor(null)
);

export const $countries = storeCreator<void, Array<botsModels.IBotCountryModel>, []>(
  api.bots.getCountries,
  initialStateConstructor([])
);

export const $cities = storeCreator<string, Array<botsModels.IBotCitiesModel>, []>(
  api.bots.getCities,
  initialStateConstructor([])
);