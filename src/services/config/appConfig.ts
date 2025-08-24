export let appConfig: IAppConfig | undefined;
export const GetAndSetAppConfig = async (): Promise<IAppConfig> => {
  try {
    const response = await fetch(
      "https://manthirapriya18.github.io/files/tumor_app/config.json",
    );
    const data = await response.json() as IAppConfig;
    appConfig = data;
    return appConfig;
  } catch (error) {
    console.error("Error fetching the JSON file:", error);
    let dummyConfig = {
      useAzureFunctions: false,
      azureFunctionsBaseUrl: "",
      supabase: {
        projectId: "",
        anonKey: "your-anon-key",
      },
      huggingface: {
        predictTumor: "",
        getTumorResult: "",
      },
    };
    return dummyConfig;
  }
};

export const GetAppConfig = async (): Promise<IAppConfig> => {
  if (appConfig !== undefined) {
    return appConfig;
  }

  return await GetAndSetAppConfig();
};

export interface SupabaseConfig {
  projectId: string;
  anonKey: string;
}
export interface HuggingFaceConfig {
  predictTumor: string;
  getTumorResult: string;
}
export interface IAppConfig {
  supabase: SupabaseConfig;
  huggingface: HuggingFaceConfig;
}
