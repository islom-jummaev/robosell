import React, { FC, ReactNode, useState } from "react";
import "./styles.scss";

import { Popover, Skeleton } from "antd";
import { ArrowIcon } from "@assets/icons";

type PropsTypes = {
  className?: string;
  status: string;
  type?: string;
  children: ReactNode;
  data?: Array<{ id: number; name: string; }>
};

const getStatusType = (status: string) => {
  switch (status) {
    case "1":
    case "NEW":
      return "success";
    case "ACTIVE":
      return "primary";
    case "PENDING":
    case "PROGRESS":
      return "pending";
    case "-1":
    case "IN_ACTIVE":
    case "CANCEL":
      return "danger";
    case "DELIVERY":
      return "aqua";
    case "ACCEPT":
      return "blue";
    case "ON_THE_WAY":
      return "dark";
    default:
      return "primary";
  }
};

export const StatusUI: FC<PropsTypes> = (props) => {
  const { status, children, type } = props;

  return (
    <div className={`custom-status ${type ? type : `${getStatusType(status)}`}`}>
      {children}
    </div>
  )
};

type StatusType = { value: string; key: string; };

type StatusUpdateTypes = {
  disabledStatus?: { [key: string]: boolean };
  status: {
    value: string;
    key: string;
  };
  request?: (key: string) => void;
  store: {
    [key: string]: Array<{
      value: string;
      key: string;
    }>
  };
  loading: boolean;
  update: (status: StatusType) => void;
  updateLoading: boolean;
}

export const StatusUpdate: FC<StatusUpdateTypes> = (props) => {
  const { status, disabledStatus, request, store, loading, update, updateLoading } = props;

  const [open, setOpen] = useState<boolean>(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (!(disabledStatus && disabledStatus[status.key])) {
      if (newOpen && !store[status.key] && request) {
        request(status.key);
      }

      setOpen(newOpen);
    }
  };

  const onStatusChange = (newStatus: StatusType) => {
    setOpen(false);
    update(newStatus);
  };

  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      content={(
        <div className="status-update-content">
          {loading ? (
            <div>
              <Skeleton.Button active block />
            </div>
          ) : (
            <>
              {store[status.key] ? store[status.key].map((item) => (
                <div
                  key={item.key}
                  className="status-update-content__item"
                  onClick={() => onStatusChange(item)}
                >
                  {item.value}
                </div>
              )) : null}
            </>
          )}
        </div>
      )}
    >
      <div className="status-update-wrap">
        {updateLoading ? (
          <Skeleton.Button active block />
        ) : (
          <StatusUI status={status.key}>
            {status.value}
            <span>
              {(disabledStatus && disabledStatus[status.key]) ? null : (
                <ArrowIcon />
              )}
            </span>
          </StatusUI>
        )}
      </div>
    </Popover>
  )
};