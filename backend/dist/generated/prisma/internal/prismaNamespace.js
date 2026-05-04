import * as runtime from "@prisma/client/runtime/client";
export const PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export const PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export const PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export const PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export const PrismaClientValidationError = runtime.PrismaClientValidationError;
export const sql = runtime.sqltag;
export const empty = runtime.empty;
export const join = runtime.join;
export const raw = runtime.raw;
export const Sql = runtime.Sql;
export const Decimal = runtime.Decimal;
export const getExtensionContext = runtime.Extensions.getExtensionContext;
export const prismaVersion = {
    client: "7.8.0",
    engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    User: 'User',
    Event: 'Event',
    EventPaymentMethod: 'EventPaymentMethod',
    Ticket: 'Ticket',
    Registration: 'Registration',
    Payment: 'Payment'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const UserScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt'
};
export const EventScalarFieldEnum = {
    id: 'id',
    title: 'title',
    description: 'description',
    location: 'location',
    date: 'date',
    endDate: 'endDate',
    bannerUrl: 'bannerUrl',
    slug: 'slug',
    category: 'category',
    maxParticipants: 'maxParticipants',
    organizerPhone: 'organizerPhone',
    isPublished: 'isPublished',
    about: 'about',
    formFields: 'formFields',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
export const EventPaymentMethodScalarFieldEnum = {
    id: 'id',
    eventId: 'eventId',
    type: 'type',
    value: 'value',
    installments: 'installments',
    startDate: 'startDate',
    endDate: 'endDate',
    createdAt: 'createdAt'
};
export const TicketScalarFieldEnum = {
    id: 'id',
    eventId: 'eventId',
    name: 'name',
    price: 'price',
    quantity: 'quantity',
    createdAt: 'createdAt'
};
export const RegistrationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    eventId: 'eventId',
    ticketId: 'ticketId',
    status: 'status',
    cpf: 'cpf',
    phone: 'phone',
    birthDate: 'birthDate',
    createdAt: 'createdAt'
};
export const PaymentScalarFieldEnum = {
    id: 'id',
    registrationId: 'registrationId',
    amount: 'amount',
    status: 'status',
    provider: 'provider',
    createdAt: 'createdAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
export const defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map