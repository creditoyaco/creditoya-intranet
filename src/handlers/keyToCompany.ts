import { companiesUser } from "@/types/client";

const keyToCompanyMap: { [key in companiesUser | string]: string } = {
  incauca_sas: "Incauca S.A.S",
  incauca_cosecha: "Incauca Cosecha",
  providencia_sas: "Providencia S.A.S",
  providencia_cosecha: "Providencia Cosecha",
  con_alta: "Con Alta",
  pichichi_sas: "Pichichi S.A.S",
  pichichi_coorte: "Pichichi Coorte",
  valor_agregado: "Valor Agregado",
  no: "No Asignado",
};

export const handleKeyToCompany = (key: string): string => {
  return keyToCompanyMap[key as companiesUser] || key;
};