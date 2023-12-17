import { ApplicationInsights } from "@microsoft/applicationinsights-web";

const key = process.env.NEXT_PUBLIC_APP_CONNECTION_KEY;
const appInsights = new ApplicationInsights({
  config: {
    connectionString: key,
  },
});
appInsights.loadAppInsights();
appInsights.trackPageView();

export const clickInsights = (buttonId: string) => {
  appInsights.trackEvent({
    name: "ButtonClicked",
    properties: { buttonId: buttonId },
  });
};

export const LeaveInsights = (PageName: string) => {
  appInsights.trackPageView({ name: PageName });
};

export const leaveAppInsights = () => {
  appInsights.flush();
};
export default appInsights;
