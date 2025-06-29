import { envConfig } from "config/env.config";
import { toast } from "react-toastify";
import { QueryService } from "services/query.service";
import {
  GET_PROFILE_DETAILS,
  LINK_LI_ACCOUNT,
} from "./constants/browserEvents.constant";
import { IProfileResponseFromExtension } from "./interface/profile.interface";
import { ProfileQueryEnum } from "./query/profile.query";

export const checkIsExtensionInstalled = async (
  extensionId: string,
  extensionIconUrl: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = `chrome-extension://${extensionId}/${extensionIconUrl}`;
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
  });
};

export const linkLinkedInProfileFromExtension = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      envConfig.chromeExtensionId,
      { type: LINK_LI_ACCOUNT },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(response);
        }
      }
    );
  });
};

export const getProfileDetailsFromExtension =
  async (): Promise<IProfileResponseFromExtension> => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        envConfig.chromeExtensionId,
        { type: GET_PROFILE_DETAILS },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve(response);
          }
        }
      );
    });
  };

export const handleResponseFromExtension = async () => {
  const queryClient = QueryService.getQueryClient();
  try {
    const response = await linkLinkedInProfileFromExtension();
    if (response?.profileUrn) {
      toast("Connected", { type: "success" });
      queryClient.invalidateQueries(ProfileQueryEnum.GET_ALL_PROFILE);
    } else if (response?.errorCode && response?.message) {
      toast(response.message, { type: "error" });
    } else if (response?.message) {
      toast(response.message, { type: "info" });
    } else {
      window.open("https://www.linkedin.com", "_blank");
    }
  } catch (error: any) {
    toast(error ?? error?.message ?? "Something went wrong while connected", {
      type: "error",
    });
    window.open("https://www.linkedin.com", "_blank");
  }
};
