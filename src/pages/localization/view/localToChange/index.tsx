import React, { useEffect, useState, useRef } from "react";

import { SelectUI } from "@ui/select";

import { useModalControl } from "@/hooks/useModalControl";
import { ModalUI } from "@ui/modal";
import { ChangeWordModal } from "./changeWordModal";
import { ButtonUI } from "@ui/button";
import { notificationSuccess } from "@ui/notifications";

import styles from "../styles.module.scss";

const Tree = ({ changeWord, data, parent = null, comma = false, parents = [] }: any) => {


  return (
    <div className={parent ? styles.treeSubItem : ""}>
      {parent && (
        <div className={styles.treeParent}>"{parent}": {"{"}</div>
      )}
      {data.map((item: any, index: any) => {
        const [ key, val ] = item;
        const isSingle = typeof val === "string";

        if (isSingle) {
          return (
            <div className={`${styles.treeItem} ${val === "notTranslated" ? styles.notTranslated : ""}`} key={key}>
              <strong>"{key}": </strong>
              <span className={styles.treeItemVal} onClick={() => changeWord([ ...parents, key ], val)}>"{val}"</span>{index + 1 === data.length ? "" : ","}
            </div>
          )
        } else {
          return <Tree changeWord={changeWord} data={Object.entries(val)} parent={key} comma={index + 1 !== data.length} parents={[ ...parents, key ]} key={key} />;
        }
      })}
      {parent && (
        <div className={styles.treeParent}>{"}"} {comma ? "," : ""}</div>
      )}
    </div>
  )
};

const tran: (a: any, b: any, c?: any, d?: any) => any = (jsonFileMain, translateFile = {}, level = 1, parents = []) => {
  const result:any = {};

  Object.keys(jsonFileMain).forEach((key) => {
    const isSingle = typeof jsonFileMain[key] === "string";

    if (isSingle) {
      const word = translateFile[key];

      result[key] = word !== undefined ? word : "notTranslated";
    } else {
      const parentKey = key;

      const fields = tran(jsonFileMain[key], translateFile[key], level + 1, [ ...parents, parentKey ]);

      result[key] = fields;
    }
  });

  return result;
};

export const LocalToChange = (props: any) => {
  const { languages, defaultFileName, defaultUpdateFiles, defaultSelectedFiles, selectedBaseFile } = props;


  const [ selectedLang, setSelectedLang ] = useState(defaultFileName);
  const [ currentFile, setCurrentFile ] = useState(null);
  const textDataRef = useRef(null);

  const changeWordModalControl = useModalControl();

  const data = selectedBaseFile && currentFile ? tran(selectedBaseFile.file, currentFile) : null;

  let updateSelectedFiles = defaultUpdateFiles;
  let selectedFiles = defaultSelectedFiles;

  useEffect(() => {
    if (selectedBaseFile && selectedBaseFile.name) {
      const myFiles = languages.find((item: any) => item.value === selectedLang).files;

      const file = myFiles.find((item: any) => item.name === selectedBaseFile.name).file;

      setCurrentFile(file);
    }
  }, [ selectedBaseFile ]);

  const onLangChange = (val: any, option: any) => {
    const { files, updateFiles } = option["data-option"];
    const curfile = files.find((item: any) => item.name === selectedBaseFile.name).file;

    updateSelectedFiles = updateFiles;
    selectedFiles = files;

    setSelectedLang(val);
    setCurrentFile(curfile);
  };

  const changeWord = (parents: any, val: any) => {
    changeWordModalControl.open({ parents, val });
  };

  const onCopy = () => {
    notificationSuccess("Скопировано");

    const dataForClipboard = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(dataForClipboard);
  }

  return (
    <div>
      <div className={styles.headPanel}>
        <ButtonUI onClick={onCopy}>
          Скопировать
        </ButtonUI>
      </div>
      <div className={styles.select}>
        <SelectUI
          onChange={onLangChange}
          value={selectedLang}
          allowClear={false}
        >
          {languages.map((item: any) => (
            <SelectUI.Option value={item.value} key={item.value} data-option={item}>
              {item.name}
            </SelectUI.Option>
          ))}
        </SelectUI>
      </div>
      {data && (
        <div ref={textDataRef} className={styles.treeWrap}>
          <strong>{"{"}</strong>
          <div className={styles.tree}>
            <Tree changeWord={changeWord} data={Object.entries(data)} />
          </div>
          <strong>{"}"}</strong>
        </div>
      )}
      <ModalUI
        open={changeWordModalControl.modalProps.open}
        onCancel={changeWordModalControl.close}
        width={700}
      >
        <ChangeWordModal
          modalControl={changeWordModalControl}
          updateSelectedFiles={updateSelectedFiles}
          selectedFiles={selectedFiles}
          selectedBaseFile={selectedBaseFile}
          setCurrentFile={setCurrentFile}
          data={data}
        />
      </ModalUI>
    </div>
  )
};