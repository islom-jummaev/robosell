
import styles from "./styles.module.scss";

import { ContentLayout } from "@/components/content-layout";

import { DashboardFilter } from "@/pages/dashboard/filter";
import { DashboardStats } from "@/pages/dashboard/stats";
import { DashboardCharts } from "@/pages/dashboard/charts";
import { DashboardTopClients } from "@/pages/dashboard/top-clients";
import { useTranslation } from "react-i18next";
import { namespaces } from "@core/localization/i18n.constants";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <ContentLayout
      title={(
        <h1>{t("title", { ns: namespaces.dashboard })}</h1>
      )}
    >
      <div className={styles.dashboard}>
        {/*<DashboardFilter />*/}
        <DashboardStats />
        <DashboardCharts />
        <DashboardTopClients />
      </div>
    </ContentLayout>
  );
}
