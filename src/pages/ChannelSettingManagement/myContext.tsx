import { createContext } from "react";
import type { ChannelSettingList } from "@/utils/data";

export default createContext<{
  siteData?: ChannelSettingList[],
  resourceData?: ChannelSettingList[],
  settingExtend?: boolean,
  refreshData?: () => void;
  setChannelKey?: (value: string) => void;
}>({});