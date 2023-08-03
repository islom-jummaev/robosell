import React from "react";

import { $documentationStep } from "@stores/documetation";

import { DocumentationStep1 } from "./step1";
import { DocumentationStep2 } from "./step2";
import { DocumentationStep3 } from "./step3";
import { DocumentationStep4 } from "./step4";
import { DocumentationStep5 } from "./step5";
import { DocumentationStep6 } from "./step6";

const Documentation = () => {
  const { step } = $documentationStep.useStore();

  if (step === 2) {
    return (
      <DocumentationStep2 />
    )
  } else if (step === 3) {
    return (
      <DocumentationStep3 />
    )
  } else if (step === 4) {
    return (
      <DocumentationStep4 />
    )
  } else if (step === 5) {
    return (
      <DocumentationStep5 />
    )
  } else if (step === 6) {
    return (
      <DocumentationStep6 />
    )
  }

  return (
    <DocumentationStep1 />
  )
};

export default Documentation;