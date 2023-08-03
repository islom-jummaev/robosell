import React, { FC } from "react";

import { Table, TableProps } from "antd";

import styles from "./styles.module.scss";
import { Spinner } from "@ui/spinner";

export const TableUI: FC<TableProps<any>> = (props) => {
  const { pagination, loading, ...restProps } = props;

  return (
    <div className={styles.tableLayout}>
      {loading && (
        <div className="bg-loader">
          <Spinner />
        </div>
      )}
      <Table
        rowKey={"id"}
        className={styles.tableWr}
        pagination={{
          hideOnSinglePage: true,
          showSizeChanger: false,
          position: ["bottomCenter"],
          ...pagination,
        }}
        {...restProps}
      />
    </div>
  );
};
