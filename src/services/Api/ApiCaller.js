import { GetChakramAIBaseUrl, supabase } from "../../supabase/SupabaseClient.ts";
import { Bucket, ExpenseDetailsTableDetails, ExpenseOptionsTableDetails, ScansTable, SupabaseFunctionsConstants, UsersTable } from "../../supabase/SupabaseConstants.ts";
import { GetAppConfig } from "../config/appConfig.ts";
import { GetExpenseOptionsFromLocal, GetUserDetails, GetUserIdFromLocalStorage, SetExpenseOptionsInLocal, SetUserDetails } from "../Storage/LocalStorage";
import { CHAKRAM_STATUS_CODE, ENDPOINTS, HTTP_VERBS } from "./ApiHelpers";
import { apiRequest } from "./ApiSevice";

const CheckForUsingSupabase = async () => {
    let config = await GetAppConfig();
    return !config.useAzureFunctions
}

export const LoginUser = async (userId, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: userId, // Supabase uses email as the login ID
            password,
        });
        if (error) {
            return { success: false }
        }

        let userDetailResp = await supabase
            .from(UsersTable.TableName)
            .select(`${UsersTable.IsPatient_ColName}, ${UsersTable.Name_ColName}`)
            .eq(UsersTable.UserId_ColName, data?.user?.id).single();
        if (userDetailResp.error) {
            return { success: false }
        }
        let isPatient = userDetailResp?.data[UsersTable.IsPatient_ColName] ?? false;
        let userName = userDetailResp?.data[UsersTable.Name_ColName] ?? false;
        let resp = {
            "userId": data?.user?.id,
            "userName": data?.user?.email,
            "expirationTimeIST": new Date(data.session.expires_at * 1000).toISOString(),
            "token": data.session.access_token,
            "is_patient": isPatient,
            "userDisplayName": userName
        }
        console.log(resp)
        SetUserDetails(resp)
        return { success: true, data: resp };
    }
    catch (err) {
        console.log(err)
        return { success: false }
    }
}

export const GetPatientDropDownData = async () => {
    try {
        let userDetails = GetUserDetails();
        if (userDetails.is_patient) {
            return {
                success: true, data: [{
                    'key': userDetails.userId,
                    'value': userDetails.userDisplayName
                }]
            }
        }
        let { data, error } = await supabase
            .from(UsersTable.TableName)
            .select(`${UsersTable.UserId_ColName}, ${UsersTable.Name_ColName}`)
            .eq(UsersTable.IsPatient_ColName, true);
        if (error) {
            return { success: false }

        }
        const result = data.map(userDetails => ({
            key: userDetails[UsersTable.UserId_ColName],
            value: userDetails[UsersTable.Name_ColName]
        }));

        return { success: true, data: result };

    }
    catch (err) {
        console.log(err)
        return { success: false }
    }

}


export async function uploadFileToSupabase(file) {
    try {
        const filePath = `${Bucket.InputImgFolder}/${Date.now()}_${file.name}`;

        // upload file
        const { error } = await supabase.storage
            .from(Bucket.BucketName)
            .upload(filePath, file);

        if (error) throw error;

        // get public URL
        const { data: publicUrlData } = supabase.storage
            .from(Bucket.BucketName)
            .getPublicUrl(filePath);

        return {
            success: true,
            data: {
                path: filePath,
                url: publicUrlData.publicUrl
            }
        };
    } catch (err) {
        console.error("Upload failed:", err.message);
        return { success: false };
    }
}

export async function predictTumor(inputImageFilePath) {

    try {
        let config = await GetAppConfig()
        let payload = {
            "data": [
                {
                    "path": inputImageFilePath,
                    "meta": { "_type": "gradio.FileData" }
                }
            ]
        }
        const response = await fetch(config.huggingface.predictTumor, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.status !== 200) {
            return { success: false }
        }
        const result = await response.json();
        console.log(result)

        return { success: true, data: result }
    }
    catch {
        return { success: false }
    }
}

export async function getTumorResult(eventId) {
    try {
        let config = await GetAppConfig();

        const response = await fetch(`${config.huggingface.getTumorResult}${eventId}`, {
            method: "GET",
            headers: { Accept: "application/json" } // 👈 force JSON
        });

        if (response.status !== 200) {
            return { success: false, error: `Status: ${response.status}` };
        }

        const text = await response.text(); // stream into text
        console.log("Raw response:", text);

        // Some HuggingFace endpoints wrap JSON in event-stream "data: ..."
        let clean = text
            .split("\n")
            .filter(line => line.startsWith("data:"))
            .map(line => line.replace(/^data:\s*/, ""))
            .join("");

        let result = JSON.parse(clean || text);
        console.log(result)
        if (
            !result[1] ||
            typeof result[1].url !== "string" ||
            result[1].url.trim() === ""
        ) {
            return { success: false };
        }
        return {
            success: true,
            data: {
                output_text: result[0],
                output_file_imgpath: result[1].url
            }
        };
    } catch (err) {
        console.error("Error:", err.message);
        return { success: false, error: err.message };
    }
}



export async function uploadImageFromUrlToSupabase(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Failed to fetch image");
        const blob = await response.blob();

        // give blob a "file-like" name
        const file = new File([blob], imageUrl.split("/").pop() || "image.jpg", { type: blob.type });

        return await uploadFileToSupabase(file); // reuse existing logic
    } catch (err) {
        console.error("Upload from URL failed:", err.message);
        return { success: false };
    }
}

export async function insertScanDataInSupabase(payload) {
    try {
        let { data, error } = await supabase.from(ScansTable.TableName).insert(payload);
        if (error) {
            return { success: false }
        }
        return { success: true }
    }
    catch {
        return { success: false }
    }
}

export async function getScanData() {
    try {
        let userDetails = await GetUserDetails();
        let wherCond = ScansTable.PatientId_ColName;
        if (!userDetails.is_patient) {
            wherCond = ScansTable.CreatedBy_ColName
        }
        const { data, error } = await supabase
            .from(ScansTable.TableName)
            .select(`
                    id:${ScansTable.Id_ColName},
                    datetime:${ScansTable.CreatedAt_ColName},
                    input_img:${ScansTable.ScanInputImgPath_ColName},
                    output_img:${ScansTable.ScanOutputImgPath_ColName},
                    oupt_textresult:${ScansTable.ScanOutputText_ColName},
                    patient:${UsersTable.TableName}!${ScansTable.PatientId_ColName} (
                    patientname:${UsersTable.Name_ColName},
                    age:${UsersTable.Age_ColName}
                    )
                `).eq(wherCond, userDetails.userId)
            .order(ScansTable.CreatedAt_ColName, { ascending: false });
        if (error) {
            return { success: false }
        }
        let finalRes = []
        for (let i = 0; i < data?.length; i++) {
            let temp = {
                id: data[i]?.id ?? "",
                patientName: data[i]?.patient?.patientname ?? "",
                patientAge: data[i]?.patient?.age ?? "",
                dateTime: data[i]?.datetime ?? "",
                imagePath: data[i]?.input_img ?? "",
                webpImagePath: data[i]?.output_img ?? "",
                analysisResult: data[i]?.oupt_textresult ?? ""
            }
            finalRes.push(temp)
        }
        console.log({ success: true, data: finalRes })
        return { success: true, data: finalRes }
    }
    catch {
        return { success: false }

    }
}

export const DeleteScanReport = async (scanId) => {
    try {
        let { error } = await supabase
            .from(ScansTable.TableName)
            .delete()
            .eq(ScansTable.Id_ColName, scanId);
        if (error) {
            return { success: false }
        }
        return { success: true }

    }
    catch {
        return { success: false }
    }
}