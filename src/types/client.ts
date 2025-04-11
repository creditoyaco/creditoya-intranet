import { ScalarDocument } from "./documents";
import { ScalarLoanApplication } from "./loan";

export type ScalarClient = {
    id?: string;
    password: string;
    email: string;
    names: string;
    firstLastName: string;
    secondLastName: string;
    currentCompanie?: companiesUser;
    avatar?: string;
    phone?: string;
    residence_phone_number?: string;
    phone_is_wp?: boolean;
    phone_whatsapp?: string;
    birth_day?: Date;
    place_of_birth?: string;
    genre?: string;
    residence_address?: string;
    city?: string;
    isBan?: boolean;
    Document: ScalarDocument[];
    LoanApplication: ScalarLoanApplication[]
    createdAt?: Date;
    updatedAt?: Date;
};

export type companiesUser =
    | "incauca_sas"
    | "incauca_cosecha"
    | "providencia_sas"
    | "providencia_cosecha"
    | "con_alta"
    | "pichichi_sas"
    | "pichichi_coorte"
    | "valor_agregado"
    | "no";