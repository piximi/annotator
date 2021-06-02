import Divider from "@material-ui/core/Divider";
import React from "react";
import { SampleList } from "../SampleList";
import { AnnotationMode } from "../AnnotationMode";
import { InformationBox } from "../InformationBox";
import { useTranslation } from "../../../../hooks/useTranslation";

export const ObjectAnnotationOptions = () => {
  const t = useTranslation();

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Object annotation")} />

      <Divider />

      <AnnotationMode />

      <Divider />

      {/*<Divider />*/}

      {/*<SampleList />*/}
    </React.Fragment>
  );
};
