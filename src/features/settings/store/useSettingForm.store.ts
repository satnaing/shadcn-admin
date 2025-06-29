import { create } from "zustand";
import { IScrapeSettingForm } from "../interface/setting.interface";

type ScrapeSetting = Omit<IScrapeSettingForm, "keyword">;
type CommentSetting = {
  turnOnEmoji: boolean;
  turnOnExclamations: boolean;
  turnOnHashtags: boolean;
  about?: string;
  tagAuthor?: boolean;
};
interface ISettingFormStore {
  scrapeSetting?: ScrapeSetting;
  setScrapeSetting: (value: ScrapeSetting) => void;
  commentSetting?: CommentSetting;
  setCommentSetting: (value: CommentSetting) => void;
}

export const useSettingFormStore = create<ISettingFormStore>((set) => ({
  setScrapeSetting: (value: ScrapeSetting) => set({ scrapeSetting: value }),
  setCommentSetting: (value: CommentSetting) => set({ commentSetting: value }),
}));
