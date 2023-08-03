import React, { useEffect, useState, useRef } from "react";
import { withDebounce } from "@ui/input";
import { Input } from "antd";

import { BuyCartIcon, SearchIconSvgIcon } from "@assets/icons";
import { $webAppProducts, $webAppEntry } from "@stores/web-app";
import { IWebAppProductsFilterParams, IWebAppProductsItemModel } from "@/businessLogic/models/web-app";
import { ShopAppProductForm } from "@/pages/shop/products/form";
import { ShopAppModal } from "@/pages/shop/shared-ui/modal";
import { renderProductsSkeleton } from "@/pages/shop/shared-ui/skeleton";
import { formatCount } from "@utils/formatters";
import { TaggedText } from "@core/localization/component";
import { useTranslation } from "react-i18next";

const pageSize = 10;

export const ShopProductsList = () => {
  const { t } = useTranslation();


  const { request: getProducts, reset: resetProducts, ...webAppProductsState } = $webAppProducts.useStore();
  const { bot_id, user_lang, category_id } = $webAppEntry.useStore();

  const searchRef = useRef<null | HTMLDivElement>(null);
  const productListRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  const [searchVal, setSearchVal] = useState<string>("");
  const [filterParams, setFilterParams] = useState<IWebAppProductsFilterParams>({
    offset: 0,
    category_id: undefined
  });
  const [modalProductControl, setModalProductControl] = useState<{ open: boolean; data: null | IWebAppProductsItemModel }>({
    open: false,
    data: null
  });
  const [isFetching, setIsFetching] = useState<any>(false);

  const [products, setProducts] = useState<Array<IWebAppProductsItemModel>>([]);
  const [searchedProducts, setSearchedProducts] = useState<Array<IWebAppProductsItemModel>>([]);
  const [isFocusedSearch, setIsFocusedSearch] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);

    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [isFetching]);

  useEffect(() => {
    if (isFetching && !webAppProductsState.loading && webAppProductsState.data) {
      if (webAppProductsState.data.count - (searchedProducts.length || products.length) > 0) {
        const offset = (filterParams.offset || 0) + pageSize;
        onFilterChange({ offset: offset });
      }
    }
  }, [isFetching]);

  useEffect(() => {
    if (category_id && category_id !== filterParams.category_id) {
      if (productListRef.current && productListRef.current.style.paddingBottom) {
        productListRef.current.style.paddingBottom = "0";
      }

      if (products.length) {
        setProducts([]);
      }

      if (isFetching) {
        setIsFetching(false);
      }

      onFilterChange({ category_id: category_id, offset: 0, search: "" });
    }
  }, [category_id]);

  useEffect(() => {
    if (filterParams.category_id) {
      getProducts({
        ...filterParams,
        bot_id
      });
    }
  }, [filterParams]);

  useEffect(() => {
    if (webAppProductsState.data) {
      if (!filterParams.search) {
        setProducts([
          ...products,
          ...webAppProductsState.data.results
        ]);
        if (searchedProducts.length) {
          setSearchedProducts([]);
        }
      } else {
        setSearchedProducts([
          ...searchedProducts,
          ...webAppProductsState.data.results
        ]);
      }

      if (isFetching) {
        setIsFetching(false);
      }
    }
  }, [webAppProductsState.data]);

  const scrollHandler = (e: any) => {
    if (!isFetching) {
      const scrollHeight = e.target.documentElement.scrollHeight;
      const scrollTop = e.target.documentElement.scrollTop;
      const innerHeight = window.innerHeight;

      if (scrollHeight - (scrollTop + innerHeight) < 100) {
        setIsFetching(true);
      }

      // const siteWrapper = document.querySelector<HTMLElement>(".shop-app");
      // if (siteWrapper && siteWrapper.style.marginTop && siteWrapper.style.marginTop !== "0px") {
      //   siteWrapper.style.marginTop = `0px`;
      // }
      // try outline touch start blur
      //inputRef.current?.blur();
      if (searchRef.current) {
        //searchRef.current.className = "shop-app__search";
      }
    }
  };

  const onFilterChange = (params: IWebAppProductsFilterParams) => {
    setFilterParams({ ...filterParams, offset: 0, ...params });
  };

  const onSelectProduct = (item: IWebAppProductsItemModel) => {
    if (document.documentElement.scrollTop === 0) {
      document.body.style.paddingBottom = `5px`;
      document.documentElement.scrollTop = 5;
    }

    document.body.classList.add("disable-scroll");

    setModalProductControl({
      open: true,
      data: item
    });
  };

  const onSearchFocus = () => {
    const containerWrapper = document.getElementsByClassName("main-container")[0];

    const siteWrapperPadding = 90;
    const offsetBlock = searchRef.current ? searchRef.current.offsetTop : 0;
    const containerMinHeight = (window.innerHeight - siteWrapperPadding) + offsetBlock;

    if (containerWrapper) {
      containerWrapper.setAttribute("style", `min-height: ${containerMinHeight}px`);
    }

    searchRef.current?.scrollIntoView(true);


    // if (searchRef.current) {
    //   //searchRef.current.className = "shop-app__search active";
    // }
    //
    // if (newBtn.current && !mytestState) {
    //   newBtn.current.click();
    // }
    //
    // if (mytestState && newBtn.current) {
    //   setTimeout(() => {
    //     if (newBtn.current) {
    //       newBtn.current.click();
    //     }
    //   }, 2000)
    // }

    // for (let i = 0; i < 200; i++) {
    //   console.log("log", i);
    // }

    inputRef.current.focus({
      preventScroll: true
    });

    setIsFocusedSearch(true);


    // setTimeout(() => {
    //   if (inputRef.current) {
    //     inputRef.current.focus();
    //   }
    // }, 100);
    //window.scroll(0, searchRef.current?.offsetTop || 0);
    //window.scroll(0, 100);
    // if (siteWrapper) {
    //   siteWrapper.style.marginTop = `-${searchRef.current?.offsetTop || 0}px`;
    // }
  };

  const onCloseModal = () => {
    document.body.style.paddingBottom = "0px";
    document.body.classList.remove("disable-scroll");

    setModalProductControl({
      open: false,
      data: null
    });
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    setSearchVal(search);

    withDebounce(() => {
      setProducts([]);
      setSearchedProducts([]);
      onFilterChange({ search });
    });
  };

  return (
    <div
      className="shop-app__products"
      onTouchMove={() => {
        if (inputRef.current && isFocusedSearch) {
          inputRef.current.blur();
          setIsFocusedSearch(false);
        }
      }}
    >
      <div ref={searchRef} className="shop-app__search">
        <div className="shop-app__search__clear" onClick={onSearchFocus}></div>
        <Input
          className={"my-input"}
          placeholder={t("search")}
          ref={inputRef}
          value={searchVal}
          onChange={onSearchChange}
          prefix={
            <div>
              <SearchIconSvgIcon />
            </div>
          }
          allowClear
        />
      </div>
      <div ref={productListRef} className="shop-app__products__list">
        {(searchedProducts.length ? searchedProducts : products).map((item) => (
          <div className={`shop-app__products__list__item sale-item2`} key={item.id} onClick={() => onSelectProduct(item)}>
            <div className="shop-app__products__list__item__body">
              <div className="shop-app__products__list__item__photo">
                <img src={item.photo} alt={`${item.name[user_lang]}`}/>
              </div>
              <div className="shop-app__products__list__item__mid">
                <div>
                  <div className={`shop-app__products__list__item__name`}>
                    {item.name[user_lang]}
                  </div>
                  <div className="shop-app__products__list__item__text">
                    {item.desc[user_lang]}
                  </div>
                </div>
                <div className="shop-app__products__list__item__price">
                  <TaggedText
                    text={t("fromPrice")}
                    tags={{
                      1: (text) => (
                        <strong>
                          {formatCount(item.price)}
                        </strong>
                      )
                    }}
                  />
                </div>
              </div>

            </div>
            <div className="shop-app__products__list__item__button">
              <BuyCartIcon />
            </div>
          </div>
        ))}

        {(webAppProductsState.loading && webAppProductsState.data) && (
          <>
            <div className="shop-app__products__skeleton">
              {renderProductsSkeleton(
                      filterParams.search ? 3 :
                (webAppProductsState.data.count - products.length) > pageSize
                ? pageSize
                : webAppProductsState.data.count - (products.length))
              }
            </div>
          </>
        )}
      </div>

      <ShopAppModal
        open={modalProductControl.open}
        onCloseModal={onCloseModal}
      >
        <>
          {modalProductControl.data && (
            <ShopAppProductForm
              data={modalProductControl.data}
              closeModal={onCloseModal}
            />
          )}
        </>
      </ShopAppModal>

    </div>
  )
};