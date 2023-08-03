import React, { useEffect, useState } from "react";
import { SelectUI } from "@ui/select";

import styles from "../styles.module.scss";

const Tree = ({ data, parent = null }: any) => {


  return (
    <div className={parent ? styles.treeSubItem : ""}>
      {parent && (
        <div className={styles.treeParent}>{parent}: {"{"}</div>
      )}
      {data.map((item: any) => {
        const [ key, val ] = item;
        const isSingle = typeof val === "string";

        if (isSingle) {
          return <div className={styles.treeItem} key={key}><strong>{key}: </strong> "{val}"</div>
        } else {
          return <Tree data={Object.entries(val)} parent={key} key={key} />;
        }
      })}
      {parent && (
        <div className={styles.treeParent}>{"}"}</div>
      )}
    </div>
  )
};

export const MainLocale = (props: any) => {
  const { files, selectedBaseFile, setSelectedBaseFile } = props;





  const updateCurrentFile = (file: any, name: any) => {
    setSelectedBaseFile({
      file,
      name
    });
  };

  useEffect(() => {
    updateCurrentFile(files[0].file, "common.json");
  }, []);

  const onMainFileChange = (val: any, option: any) => {
    const file = option["data-option"];
    updateCurrentFile(file, val);
  };

  return (
    <div>
      {selectedBaseFile && (
        <>
          <div className={styles.headPanel}></div>
          <div className={styles.select}>
            <SelectUI
              value={selectedBaseFile.name}
              onChange={onMainFileChange}
              allowClear={false}
            >
              {files.map((item: any) => (
                <SelectUI.Option value={item.name} key={item.name} data-option={item.file}>
                  {item.name}
                </SelectUI.Option>
              ))}
            </SelectUI>
          </div>
          <div className={styles.treeWrap}>
            <strong>{"{"}</strong>
            <div className={styles.tree}>
              <Tree data={Object.entries(selectedBaseFile.file)} />
            </div>
            <strong>{"}"}</strong>
          </div>
        </>
      )}
    </div>
  )
};