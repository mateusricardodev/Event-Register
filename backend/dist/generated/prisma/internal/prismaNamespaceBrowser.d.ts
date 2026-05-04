import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Event: "Event";
    readonly EventPaymentMethod: "EventPaymentMethod";
    readonly Ticket: "Ticket";
    readonly Registration: "Registration";
    readonly Payment: "Payment";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly password: "password";
    readonly role: "role";
    readonly createdAt: "createdAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const EventScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly location: "location";
    readonly date: "date";
    readonly endDate: "endDate";
    readonly bannerUrl: "bannerUrl";
    readonly slug: "slug";
    readonly category: "category";
    readonly maxParticipants: "maxParticipants";
    readonly organizerPhone: "organizerPhone";
    readonly isPublished: "isPublished";
    readonly about: "about";
    readonly formFields: "formFields";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum];
export declare const EventPaymentMethodScalarFieldEnum: {
    readonly id: "id";
    readonly eventId: "eventId";
    readonly type: "type";
    readonly value: "value";
    readonly installments: "installments";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly createdAt: "createdAt";
};
export type EventPaymentMethodScalarFieldEnum = (typeof EventPaymentMethodScalarFieldEnum)[keyof typeof EventPaymentMethodScalarFieldEnum];
export declare const TicketScalarFieldEnum: {
    readonly id: "id";
    readonly eventId: "eventId";
    readonly name: "name";
    readonly price: "price";
    readonly quantity: "quantity";
    readonly createdAt: "createdAt";
};
export type TicketScalarFieldEnum = (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum];
export declare const RegistrationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly eventId: "eventId";
    readonly ticketId: "ticketId";
    readonly status: "status";
    readonly cpf: "cpf";
    readonly phone: "phone";
    readonly birthDate: "birthDate";
    readonly createdAt: "createdAt";
};
export type RegistrationScalarFieldEnum = (typeof RegistrationScalarFieldEnum)[keyof typeof RegistrationScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly registrationId: "registrationId";
    readonly amount: "amount";
    readonly status: "status";
    readonly provider: "provider";
    readonly createdAt: "createdAt";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
