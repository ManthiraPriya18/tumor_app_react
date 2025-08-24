export const ExpenseOptionsTableDetails = {
  TableName: "ExpenseOptions",
  ExpensePaidBy_ColName: "ExpensePaidBy",
  ExpenseGroup_ColName: "ExpenseGroup",
};

export const ExpenseDetailsTableDetails = {
  TableName: "ExpenseDetails",
  UserId_ColName: "userId",
  Id_ColName: "_id",
  ItemName_ColName: "itemName",
  Notes_ColName: "notes",
  ItemCost_ColName: "itemCost",
  PaidBy_ColName: "paidBy",
  ItemGroup_ColName: "itemGroup",
  SpendDateTime_ColName: "spendDateTime",
  SpendDateTimeZ_ColName: "spendDateTimeZ",
  EntryDateTime_ColName: "entryDateTime",
};

export const SupabaseFunctionsConstants = {
  // SUPABASE_BASEURL: "https://hbcxxuqccscrelbkwszk.supabase.co",
  CHAKRAM_AI_ENDPOINT: "chakram-ai",
};

//========================================================================

export const UsersTable = {
  TableName: "Users",
  Id_ColName: "id",
  CreatedAt_ColName: "created_at",
  Name_ColName: "name",
  UserId_ColName: "user_id",
  Age_ColName: "age",
  IsPatient_ColName: "is_patient",
};

export const ScansTable = {
  TableName: "Scans",
  Id_ColName: "id",
  CreatedAt_ColName: "created_at",
  CreatedBy_ColName: "created_by",
  PatientId_ColName: "patient_id",
  ScanInputImgPath_ColName: "scan_input_imgpath",
  ScanOutputImgPath_ColName: "scan_output_imgpath",
  ScanOutputText_ColName: "scan_output_text",
};

export const Bucket = {
  BucketName: "scans",
  InputImgFolder: "inputs",
  OutputImgFolder: "outputs",
};
