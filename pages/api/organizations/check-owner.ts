import { NextApiRequest, NextApiResponse } from "next";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, organization_id } = req.body;

  if (!user_id || !organization_id) {
    return res
      .status(400)
      .json({ error: "Missing required fields: user_id, organization_id" });
  }

  const supabase = supabaseBrowser();

  try {
    // First check if user is the owner of the organization
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("owner_id")
      .eq("id", organization_id)
      .single();

    if (orgError) {
      return res
        .status(500)
        .json({ error: "Error checking organization ownership" });
    }

    // If user is the owner, return true immediately
    if (organization?.owner_id === user_id) {
      return res.status(200).json({ isOwner: true });
    }

    // If not the owner, check their role in organization_users
    const { data: userRole, error: roleError } = await supabase
      .from("organization_users")
      .select("role")
      .eq("organization_id", organization_id)
      .eq("user_id", user_id)
      .single();
      

    if (roleError) {
      return res.status(500).json({ error: "Error checking user role" });
    }
    
    
    const isOwner = userRole?.role === "Owner";

    return res.status(200).json({ isOwner });
  } catch (err) {
    console.error("Error checking organization owner status:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
