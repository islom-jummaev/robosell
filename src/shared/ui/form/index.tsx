import React, { FC, ReactNode } from "react";

import { Button, Col, Form, Row } from "antd";
import { ColProps } from "antd/lib/col";
import { FormProps, FormItemProps } from "antd/lib/form";
import { RowProps } from "antd/lib/row";

import "./styles.scss";

type UiFormPropsType = {
  phantomSubmit?: boolean;
  children: ReactNode;
} & FormProps;

type FormPropsType = {
  Item: typeof Item;
  Row: typeof ItemRow;
  Col: typeof ItemCol;
} & FC<UiFormPropsType>;

const FormUI: FormPropsType = (props) => {
  const { phantomSubmit = false, children, className, ...restProps } = props;

  return (
    <Form
      layout="vertical"
      autoComplete="off"
      className={`custom-form ${className ? className : ""}`}
      {...restProps}
    >
      {children}
      {phantomSubmit && (
        <div style={{ width: 0, height: 0, overflow: "hidden" }}>
          <Button htmlType="submit">Save</Button>
        </div>
      )}
    </Form>
  );
};

const Item: FC<FormItemProps> = (props) => {
  return (
    <Form.Item {...props} />
  );
};

const ItemRow: FC<RowProps> = (props) => {
  return (
    <Row gutter={[20, 0]} {...props} />
  );
};

const ItemCol: FC<ColProps> = (props) => {
  return (
    <Col span={12} {...props} />
  );
};

FormUI.Item = Item;
FormUI.Row = ItemRow;
FormUI.Col = ItemCol;

export { FormUI };
