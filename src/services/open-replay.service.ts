import Tracker from "@openreplay/tracker";

export class OpenReplayInstance {
  private static instance: Tracker;

  public static getInstance(projectId: string): Tracker {
    if (!OpenReplayInstance.instance) {
      OpenReplayInstance.instance = new Tracker({
        projectKey: projectId,
        __DISABLE_SECURE_MODE: true,
        network: {
          failuresOnly: true,
          sessionTokenHeader: true,
          ignoreHeaders: false,
          capturePayload: true,
          captureInIframes: true,
        },
      });
    }
    return OpenReplayInstance.instance;
  }
}
