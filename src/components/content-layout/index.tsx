import React, { FC, ReactNode } from "react";

import "./styles.scss";


type UiContentLayoutPropsTypes = {
  title?: ReactNode;
  children: ReactNode;
};

type ContentLayoutPropsTypes = {
  Actions: typeof Actions;
} & FC<UiContentLayoutPropsTypes>;

const ContentLayout: ContentLayoutPropsTypes = (props) => {
  const { title, children } = props;

  return (
    <div className="content-layout">
      <div className="content-layout__title">
        {title ? title : ""}
      </div>
      <div className="content-layout__in fancy-scrollbar">
        {children}
      </div>
    </div>
  )
};

type ActionsTypes = {
  children: ReactNode;
}

const Actions: FC<ActionsTypes> = (props) => {
  return (
    <div className="content-layout__actions">
      {props.children}
    </div>
  );
};

ContentLayout.Actions = Actions;

export { ContentLayout };