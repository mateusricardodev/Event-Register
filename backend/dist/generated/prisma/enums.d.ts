export declare const Role: {
    readonly admin: "admin";
    readonly organizer: "organizer";
    readonly user: "user";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const RegistrationStatus: {
    readonly pending: "pending";
    readonly confirmed: "confirmed";
    readonly canceled: "canceled";
};
export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];
export declare const PaymentStatus: {
    readonly pending: "pending";
    readonly paid: "paid";
    readonly failed: "failed";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
