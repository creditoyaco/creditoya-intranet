import { ScalarLoanApplication } from "@/types/loan";
import { useState } from "react";

function useOverview() {
    const [loans, setLoans] = useState<ScalarLoanApplication | null>(null);

    return { loans }
}

export default useOverview;