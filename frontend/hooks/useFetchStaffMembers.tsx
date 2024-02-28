import { useState, useEffect } from "react";
import { AxiosHost } from "@/axiosGlobal";
import { Product, StaffMember } from "@/interfaces";

export function useFetchStaffMembers() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

  useEffect(() => {
    async function fetchStaffMembers() {
      try {
        const { data } = await AxiosHost.get("/staffMembers");
        setStaffMembers(data.staff);
      } catch (error) {}
    }
    fetchStaffMembers();
  }, []);

  return { staffMembers };
}
