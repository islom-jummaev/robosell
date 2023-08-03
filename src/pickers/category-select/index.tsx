import React, { FC, useMemo } from "react";

import { api } from "@/businessLogic/api";
import { SelectUI } from "@ui/select";
import { create } from "zustand";
import { ICategoriesListItemModel, ICategoriesListParams } from "@/businessLogic/models/categories";
import { $currentBot } from "@stores/bots";
import { getCurrentLang } from "@utils/getters";

type CategoriesStoreCreateType = { data: [], loading: boolean, error: any, request: (params: ICategoriesListParams) => void; };

export const CategorySelect: FC<any> = (props) => {
  const { value, ...restProps } = props;
  const { currentBot } = $currentBot.useStore();
  const currentLang = getCurrentLang();

  const $items = useMemo(() => {
    return {
      useStore: create<CategoriesStoreCreateType>()((set) => ({
        data: [],
        loading: false,
        error: null,
        request: (params) => {
          set((state) => ({
            ...state,
            loading: true
          }));

          api.categories.getCategoriesList({ ...params, bot_id: currentBot?.id || "" })
            .then((response: any) => {
              set({
                loading: false,
                error: null,
                data: response.data.results.map((item: ICategoriesListItemModel) => ({
                  id: item.id,
                  name: item.name[currentLang]
                }))
              });
            })
            .catch((error: any) => {
              if (error.response) {
                set({ loading: false, data: [], error: error.response });
              }
            })
        }
      }))
    };

  }, []);

  return (
    <SelectUI.Lookup
      allowClear={true}
      showSearch={true}
      filterOption={false}
      defaultActiveFirstOption={false}
      dropdownMatchSelectWidth={false}
      itemsZustand={$items}
      value={value}
      {...restProps}
    />
  );
};
