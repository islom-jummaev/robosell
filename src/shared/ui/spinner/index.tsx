import React, { FC } from "react";
import "./styles.scss";

type PropsTypes = {
 fallback?: boolean;
}

const SpinCustom = () => {
  return (
    <div className="custom-spinner">
      <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
    </div>
  )
};

export const Spinner: FC<PropsTypes> = (props) => {
  if (props.fallback) {
    return (
      <div className="fallback-loader">
        <SpinCustom />
      </div>
    )
  }

  return (
    <SpinCustom />
  )
};