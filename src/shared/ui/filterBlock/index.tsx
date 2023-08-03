import React, { ReactNode } from "react";

import "./styles.scss";

type PropsTypes = {
  className?: string;
  children: ReactNode;
};

const FilterBlockUI = (props: PropsTypes) => {
  const { className = "", children } = props;

  let classesCompose = "filter-block";

  if (className) {
    classesCompose = `${classesCompose} ${className}`;
  }

  return (
    <div className={classesCompose}>
      {children}
    </div>
  );
};

type FilterBlockItemTypes = {
  children: ReactNode;
};

const FilterBlockItem: React.FC<FilterBlockItemTypes> = ({ children }) => (
  <div className="filter-block__item">{children}</div>
);

const FilterBlockSearchItem: React.FC<FilterBlockItemTypes> = ({ children }) => {
  return <div className={`filter-block__item-search filter-block__item`}>{children}</div>;
};

FilterBlockUI.Item = FilterBlockItem;
FilterBlockUI.SearchItem = FilterBlockSearchItem;

export { FilterBlockUI };
