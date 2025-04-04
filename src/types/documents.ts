export type ScalarDocument = {
    id: string;
    userId: string;
    typeDocument: TypesDocument;
    documentSides: string;
    imageWithCC: string | undefined;
    number: string | undefined;
    createdAt: Date;
    updatedAt: Date;
    upId: string;
};

export type TypesDocument = "CC" | "CE" | "PASAPORTE";