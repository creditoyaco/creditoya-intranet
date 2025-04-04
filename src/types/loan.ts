import { ScalarClient } from "./client";

export type ScalarLoanApplication = {
    [x: string]: any;
    id?: string;
    userId: string;
    employeeId?: string;
    fisrt_flyer: string;
    upid_first_flayer: string;
    second_flyer: string;
    upid_second_flyer: string;
    third_flyer: string;
    upid_third_flayer: string;
    signature: string;
    upSignatureId: string;
    cantity: string;
    status: Status;
    reasonReject?: string;
    reasonChangeCantity?: string;
    newCantity?: string;
    newCantityOpt?: boolean;
    bankSavingAccount: boolean;
    bankNumberAccount: string;
    labor_card: string;
    upid_labor_card: string;
    entity: string;
    terms_and_conditions: boolean;
    clientInfo?: ScalarClient;
    created_at: Date;
    updated_at: Date;
};

export type Status =
    | "Pendiente"
    | "Aprobado"
    | "Aplazado"
    | "Borrador"
    | "Archivado"
    | "New-cantity";