import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { GetAppConfig } from "../services/config/appConfig.ts";
import { SupabaseFunctionsConstants } from "./SupabaseConstants.ts";

export let supabase: SupabaseClient | undefined;
export const InitializeSupabaseClient = async () => {
    try {
        let config = await GetAppConfig();
        supabase = createClient(
            config.supabase.projectId,
            config.supabase.anonKey,
        );
    } catch (ex) {
        console.error("Error initializing Supabase client:", ex);
        supabase = undefined;
    }
};
export const GetChakramAIBaseUrl = async () => {
    return await PrepareSupabaseFunctionsUrl(
        SupabaseFunctionsConstants.CHAKRAM_AI_ENDPOINT,
    );
};

export const PrepareSupabaseFunctionsUrl = async (endpoint: string) => {
    let appConfig = await GetAppConfig();
    console.log("Preparing Supabase Functions URL for endpoint:", appConfig);
    return `${appConfig.supabase.projectId}/functions/v1/${endpoint}`;
};
