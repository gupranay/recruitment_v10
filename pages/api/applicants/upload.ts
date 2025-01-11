import { NextApiRequest, NextApiResponse } from "next";
import { supabaseBrowser } from "@/lib/supabase/browser";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = supabaseBrowser();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { parsedData, nameHeader, emailHeader, headShotHeader, recruitmentCycleId} = req.body;

  if (!parsedData || !nameHeader || !emailHeader) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Log for debugging purposes
  // console.log("recruitmentCycleId", recruitmentCycleId);
  // console.log("Headers - Name:", nameHeader, "Email:", emailHeader, "Headshot:", headShotHeader);

  const applicants = parsedData.map((record: any) => ({
    name: record[nameHeader],
    email: record[emailHeader],
    headshot_url: headShotHeader ? record[headShotHeader] : null,
    data: record,
    recruitment_cycle_id: recruitmentCycleId,
  }));

  const { data, error } = await supabase
    .from('applicants')
    .insert(applicants)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Applicants uploaded successfully", data });
}
