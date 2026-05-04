import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RegistrationModel = runtime.Types.Result.DefaultSelection<Prisma.$RegistrationPayload>;
export type AggregateRegistration = {
    _count: RegistrationCountAggregateOutputType | null;
    _min: RegistrationMinAggregateOutputType | null;
    _max: RegistrationMaxAggregateOutputType | null;
};
export type RegistrationMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    eventId: string | null;
    ticketId: string | null;
    status: $Enums.RegistrationStatus | null;
    cpf: string | null;
    phone: string | null;
    birthDate: Date | null;
    createdAt: Date | null;
};
export type RegistrationMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    eventId: string | null;
    ticketId: string | null;
    status: $Enums.RegistrationStatus | null;
    cpf: string | null;
    phone: string | null;
    birthDate: Date | null;
    createdAt: Date | null;
};
export type RegistrationCountAggregateOutputType = {
    id: number;
    userId: number;
    eventId: number;
    ticketId: number;
    status: number;
    cpf: number;
    phone: number;
    birthDate: number;
    createdAt: number;
    _all: number;
};
export type RegistrationMinAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    ticketId?: true;
    status?: true;
    cpf?: true;
    phone?: true;
    birthDate?: true;
    createdAt?: true;
};
export type RegistrationMaxAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    ticketId?: true;
    status?: true;
    cpf?: true;
    phone?: true;
    birthDate?: true;
    createdAt?: true;
};
export type RegistrationCountAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    ticketId?: true;
    status?: true;
    cpf?: true;
    phone?: true;
    birthDate?: true;
    createdAt?: true;
    _all?: true;
};
export type RegistrationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RegistrationWhereInput;
    orderBy?: Prisma.RegistrationOrderByWithRelationInput | Prisma.RegistrationOrderByWithRelationInput[];
    cursor?: Prisma.RegistrationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RegistrationCountAggregateInputType;
    _min?: RegistrationMinAggregateInputType;
    _max?: RegistrationMaxAggregateInputType;
};
export type GetRegistrationAggregateType<T extends RegistrationAggregateArgs> = {
    [P in keyof T & keyof AggregateRegistration]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRegistration[P]> : Prisma.GetScalarType<T[P], AggregateRegistration[P]>;
};
export type RegistrationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RegistrationWhereInput;
    orderBy?: Prisma.RegistrationOrderByWithAggregationInput | Prisma.RegistrationOrderByWithAggregationInput[];
    by: Prisma.RegistrationScalarFieldEnum[] | Prisma.RegistrationScalarFieldEnum;
    having?: Prisma.RegistrationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RegistrationCountAggregateInputType | true;
    _min?: RegistrationMinAggregateInputType;
    _max?: RegistrationMaxAggregateInputType;
};
export type RegistrationGroupByOutputType = {
    id: string;
    userId: string;
    eventId: string;
    ticketId: string;
    status: $Enums.RegistrationStatus;
    cpf: string | null;
    phone: string | null;
    birthDate: Date | null;
    createdAt: Date;
    _count: RegistrationCountAggregateOutputType | null;
    _min: RegistrationMinAggregateOutputType | null;
    _max: RegistrationMaxAggregateOutputType | null;
};
export type GetRegistrationGroupByPayload<T extends RegistrationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RegistrationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RegistrationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RegistrationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RegistrationGroupByOutputType[P]>;
}>>;
export type RegistrationWhereInput = {
    AND?: Prisma.RegistrationWhereInput | Prisma.RegistrationWhereInput[];
    OR?: Prisma.RegistrationWhereInput[];
    NOT?: Prisma.RegistrationWhereInput | Prisma.RegistrationWhereInput[];
    id?: Prisma.StringFilter<"Registration"> | string;
    userId?: Prisma.StringFilter<"Registration"> | string;
    eventId?: Prisma.StringFilter<"Registration"> | string;
    ticketId?: Prisma.StringFilter<"Registration"> | string;
    status?: Prisma.EnumRegistrationStatusFilter<"Registration"> | $Enums.RegistrationStatus;
    cpf?: Prisma.StringNullableFilter<"Registration"> | string | null;
    phone?: Prisma.StringNullableFilter<"Registration"> | string | null;
    birthDate?: Prisma.DateTimeNullableFilter<"Registration"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Registration"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
    ticket?: Prisma.XOR<Prisma.TicketScalarRelationFilter, Prisma.TicketWhereInput>;
    payment?: Prisma.XOR<Prisma.PaymentNullableScalarRelationFilter, Prisma.PaymentWhereInput> | null;
};
export type RegistrationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    cpf?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    birthDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    event?: Prisma.EventOrderByWithRelationInput;
    ticket?: Prisma.TicketOrderByWithRelationInput;
    payment?: Prisma.PaymentOrderByWithRelationInput;
};
export type RegistrationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RegistrationWhereInput | Prisma.RegistrationWhereInput[];
    OR?: Prisma.RegistrationWhereInput[];
    NOT?: Prisma.RegistrationWhereInput | Prisma.RegistrationWhereInput[];
    userId?: Prisma.StringFilter<"Registration"> | string;
    eventId?: Prisma.StringFilter<"Registration"> | string;
    ticketId?: Prisma.StringFilter<"Registration"> | string;
    status?: Prisma.EnumRegistrationStatusFilter<"Registration"> | $Enums.RegistrationStatus;
    cpf?: Prisma.StringNullableFilter<"Registration"> | string | null;
    phone?: Prisma.StringNullableFilter<"Registration"> | string | null;
    birthDate?: Prisma.DateTimeNullableFilter<"Registration"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Registration"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
    ticket?: Prisma.XOR<Prisma.TicketScalarRelationFilter, Prisma.TicketWhereInput>;
    payment?: Prisma.XOR<Prisma.PaymentNullableScalarRelationFilter, Prisma.PaymentWhereInput> | null;
}, "id">;
export type RegistrationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    cpf?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    birthDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RegistrationCountOrderByAggregateInput;
    _max?: Prisma.RegistrationMaxOrderByAggregateInput;
    _min?: Prisma.RegistrationMinOrderByAggregateInput;
};
export type RegistrationScalarWhereWithAggregatesInput = {
    AND?: Prisma.RegistrationScalarWhereWithAggregatesInput | Prisma.RegistrationScalarWhereWithAggregatesInput[];
    OR?: Prisma.RegistrationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RegistrationScalarWhereWithAggregatesInput | Prisma.RegistrationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Registration"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Registration"> | string;
    eventId?: Prisma.StringWithAggregatesFilter<"Registration"> | string;
    ticketId?: Prisma.StringWithAggregatesFilter<"Registration"> | string;
    status?: Prisma.EnumRegistrationStatusWithAggregatesFilter<"Registration"> | $Enums.RegistrationStatus;
    cpf?: Prisma.StringNullableWithAggregatesFilter<"Registration"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"Registration"> | string | null;
    birthDate?: Prisma.DateTimeNullableWithAggregatesFilter<"Registration"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Registration"> | Date | string;
};
export type RegistrationCreateInput = {
    id?: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutRegistrationsInput;
    event: Prisma.EventCreateNestedOneWithoutRegistrationsInput;
    ticket: Prisma.TicketCreateNestedOneWithoutRegistrationsInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutRegistrationInput;
};
export type RegistrationUncheckedCreateInput = {
    id?: string;
    userId: string;
    eventId: string;
    ticketId: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
    payment?: Prisma.PaymentUncheckedCreateNestedOneWithoutRegistrationInput;
};
export type RegistrationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutRegistrationsNestedInput;
    event?: Prisma.EventUpdateOneRequiredWithoutRegistrationsNestedInput;
    ticket?: Prisma.TicketUpdateOneRequiredWithoutRegistrationsNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutRegistrationNestedInput;
};
export type RegistrationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payment?: Prisma.PaymentUncheckedUpdateOneWithoutRegistrationNestedInput;
};
export type RegistrationCreateManyInput = {
    id?: string;
    userId: string;
    eventId: string;
    ticketId: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
};
export type RegistrationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationListRelationFilter = {
    every?: Prisma.RegistrationWhereInput;
    some?: Prisma.RegistrationWhereInput;
    none?: Prisma.RegistrationWhereInput;
};
export type RegistrationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RegistrationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RegistrationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RegistrationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RegistrationScalarRelationFilter = {
    is?: Prisma.RegistrationWhereInput;
    isNot?: Prisma.RegistrationWhereInput;
};
export type RegistrationCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutUserInput, Prisma.RegistrationUncheckedCreateWithoutUserInput> | Prisma.RegistrationCreateWithoutUserInput[] | Prisma.RegistrationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutUserInput | Prisma.RegistrationCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.RegistrationCreateManyUserInputEnvelope;
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
};
export type RegistrationUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutUserInput, Prisma.RegistrationUncheckedCreateWithoutUserInput> | Prisma.RegistrationCreateWithoutUserInput[] | Prisma.RegistrationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutUserInput | Prisma.RegistrationCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.RegistrationCreateManyUserInputEnvelope;
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
};
export type RegistrationUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutUserInput, Prisma.RegistrationUncheckedCreateWithoutUserInput> | Prisma.RegistrationCreateWithoutUserInput[] | Prisma.RegistrationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutUserInput | Prisma.RegistrationCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.RegistrationUpsertWithWhereUniqueWithoutUserInput | Prisma.RegistrationUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.RegistrationCreateManyUserInputEnvelope;
    set?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    disconnect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    delete?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    update?: Prisma.RegistrationUpdateWithWhereUniqueWithoutUserInput | Prisma.RegistrationUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.RegistrationUpdateManyWithWhereWithoutUserInput | Prisma.RegistrationUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.RegistrationScalarWhereInput | Prisma.RegistrationScalarWhereInput[];
};
export type RegistrationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutUserInput, Prisma.RegistrationUncheckedCreateWithoutUserInput> | Prisma.RegistrationCreateWithoutUserInput[] | Prisma.RegistrationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutUserInput | Prisma.RegistrationCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.RegistrationUpsertWithWhereUniqueWithoutUserInput | Prisma.RegistrationUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.RegistrationCreateManyUserInputEnvelope;
    set?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    disconnect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    delete?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    update?: Prisma.RegistrationUpdateWithWhereUniqueWithoutUserInput | Prisma.RegistrationUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.RegistrationUpdateManyWithWhereWithoutUserInput | Prisma.RegistrationUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.RegistrationScalarWhereInput | Prisma.RegistrationScalarWhereInput[];
};
export type RegistrationCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutEventInput, Prisma.RegistrationUncheckedCreateWithoutEventInput> | Prisma.RegistrationCreateWithoutEventInput[] | Prisma.RegistrationUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutEventInput | Prisma.RegistrationCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.RegistrationCreateManyEventInputEnvelope;
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
};
export type RegistrationUncheckedCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutEventInput, Prisma.RegistrationUncheckedCreateWithoutEventInput> | Prisma.RegistrationCreateWithoutEventInput[] | Prisma.RegistrationUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutEventInput | Prisma.RegistrationCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.RegistrationCreateManyEventInputEnvelope;
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
};
export type RegistrationUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutEventInput, Prisma.RegistrationUncheckedCreateWithoutEventInput> | Prisma.RegistrationCreateWithoutEventInput[] | Prisma.RegistrationUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutEventInput | Prisma.RegistrationCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.RegistrationUpsertWithWhereUniqueWithoutEventInput | Prisma.RegistrationUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.RegistrationCreateManyEventInputEnvelope;
    set?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    disconnect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    delete?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    update?: Prisma.RegistrationUpdateWithWhereUniqueWithoutEventInput | Prisma.RegistrationUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.RegistrationUpdateManyWithWhereWithoutEventInput | Prisma.RegistrationUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.RegistrationScalarWhereInput | Prisma.RegistrationScalarWhereInput[];
};
export type RegistrationUncheckedUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutEventInput, Prisma.RegistrationUncheckedCreateWithoutEventInput> | Prisma.RegistrationCreateWithoutEventInput[] | Prisma.RegistrationUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutEventInput | Prisma.RegistrationCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.RegistrationUpsertWithWhereUniqueWithoutEventInput | Prisma.RegistrationUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.RegistrationCreateManyEventInputEnvelope;
    set?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    disconnect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    delete?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    update?: Prisma.RegistrationUpdateWithWhereUniqueWithoutEventInput | Prisma.RegistrationUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.RegistrationUpdateManyWithWhereWithoutEventInput | Prisma.RegistrationUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.RegistrationScalarWhereInput | Prisma.RegistrationScalarWhereInput[];
};
export type RegistrationCreateNestedManyWithoutTicketInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutTicketInput, Prisma.RegistrationUncheckedCreateWithoutTicketInput> | Prisma.RegistrationCreateWithoutTicketInput[] | Prisma.RegistrationUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutTicketInput | Prisma.RegistrationCreateOrConnectWithoutTicketInput[];
    createMany?: Prisma.RegistrationCreateManyTicketInputEnvelope;
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
};
export type RegistrationUncheckedCreateNestedManyWithoutTicketInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutTicketInput, Prisma.RegistrationUncheckedCreateWithoutTicketInput> | Prisma.RegistrationCreateWithoutTicketInput[] | Prisma.RegistrationUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutTicketInput | Prisma.RegistrationCreateOrConnectWithoutTicketInput[];
    createMany?: Prisma.RegistrationCreateManyTicketInputEnvelope;
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
};
export type RegistrationUpdateManyWithoutTicketNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutTicketInput, Prisma.RegistrationUncheckedCreateWithoutTicketInput> | Prisma.RegistrationCreateWithoutTicketInput[] | Prisma.RegistrationUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutTicketInput | Prisma.RegistrationCreateOrConnectWithoutTicketInput[];
    upsert?: Prisma.RegistrationUpsertWithWhereUniqueWithoutTicketInput | Prisma.RegistrationUpsertWithWhereUniqueWithoutTicketInput[];
    createMany?: Prisma.RegistrationCreateManyTicketInputEnvelope;
    set?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    disconnect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    delete?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    update?: Prisma.RegistrationUpdateWithWhereUniqueWithoutTicketInput | Prisma.RegistrationUpdateWithWhereUniqueWithoutTicketInput[];
    updateMany?: Prisma.RegistrationUpdateManyWithWhereWithoutTicketInput | Prisma.RegistrationUpdateManyWithWhereWithoutTicketInput[];
    deleteMany?: Prisma.RegistrationScalarWhereInput | Prisma.RegistrationScalarWhereInput[];
};
export type RegistrationUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutTicketInput, Prisma.RegistrationUncheckedCreateWithoutTicketInput> | Prisma.RegistrationCreateWithoutTicketInput[] | Prisma.RegistrationUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutTicketInput | Prisma.RegistrationCreateOrConnectWithoutTicketInput[];
    upsert?: Prisma.RegistrationUpsertWithWhereUniqueWithoutTicketInput | Prisma.RegistrationUpsertWithWhereUniqueWithoutTicketInput[];
    createMany?: Prisma.RegistrationCreateManyTicketInputEnvelope;
    set?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    disconnect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    delete?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    connect?: Prisma.RegistrationWhereUniqueInput | Prisma.RegistrationWhereUniqueInput[];
    update?: Prisma.RegistrationUpdateWithWhereUniqueWithoutTicketInput | Prisma.RegistrationUpdateWithWhereUniqueWithoutTicketInput[];
    updateMany?: Prisma.RegistrationUpdateManyWithWhereWithoutTicketInput | Prisma.RegistrationUpdateManyWithWhereWithoutTicketInput[];
    deleteMany?: Prisma.RegistrationScalarWhereInput | Prisma.RegistrationScalarWhereInput[];
};
export type EnumRegistrationStatusFieldUpdateOperationsInput = {
    set?: $Enums.RegistrationStatus;
};
export type RegistrationCreateNestedOneWithoutPaymentInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutPaymentInput, Prisma.RegistrationUncheckedCreateWithoutPaymentInput>;
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutPaymentInput;
    connect?: Prisma.RegistrationWhereUniqueInput;
};
export type RegistrationUpdateOneRequiredWithoutPaymentNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCreateWithoutPaymentInput, Prisma.RegistrationUncheckedCreateWithoutPaymentInput>;
    connectOrCreate?: Prisma.RegistrationCreateOrConnectWithoutPaymentInput;
    upsert?: Prisma.RegistrationUpsertWithoutPaymentInput;
    connect?: Prisma.RegistrationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RegistrationUpdateToOneWithWhereWithoutPaymentInput, Prisma.RegistrationUpdateWithoutPaymentInput>, Prisma.RegistrationUncheckedUpdateWithoutPaymentInput>;
};
export type RegistrationCreateWithoutUserInput = {
    id?: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
    event: Prisma.EventCreateNestedOneWithoutRegistrationsInput;
    ticket: Prisma.TicketCreateNestedOneWithoutRegistrationsInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutRegistrationInput;
};
export type RegistrationUncheckedCreateWithoutUserInput = {
    id?: string;
    eventId: string;
    ticketId: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
    payment?: Prisma.PaymentUncheckedCreateNestedOneWithoutRegistrationInput;
};
export type RegistrationCreateOrConnectWithoutUserInput = {
    where: Prisma.RegistrationWhereUniqueInput;
    create: Prisma.XOR<Prisma.RegistrationCreateWithoutUserInput, Prisma.RegistrationUncheckedCreateWithoutUserInput>;
};
export type RegistrationCreateManyUserInputEnvelope = {
    data: Prisma.RegistrationCreateManyUserInput | Prisma.RegistrationCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type RegistrationUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.RegistrationWhereUniqueInput;
    update: Prisma.XOR<Prisma.RegistrationUpdateWithoutUserInput, Prisma.RegistrationUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.RegistrationCreateWithoutUserInput, Prisma.RegistrationUncheckedCreateWithoutUserInput>;
};
export type RegistrationUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.RegistrationWhereUniqueInput;
    data: Prisma.XOR<Prisma.RegistrationUpdateWithoutUserInput, Prisma.RegistrationUncheckedUpdateWithoutUserInput>;
};
export type RegistrationUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.RegistrationScalarWhereInput;
    data: Prisma.XOR<Prisma.RegistrationUpdateManyMutationInput, Prisma.RegistrationUncheckedUpdateManyWithoutUserInput>;
};
export type RegistrationScalarWhereInput = {
    AND?: Prisma.RegistrationScalarWhereInput | Prisma.RegistrationScalarWhereInput[];
    OR?: Prisma.RegistrationScalarWhereInput[];
    NOT?: Prisma.RegistrationScalarWhereInput | Prisma.RegistrationScalarWhereInput[];
    id?: Prisma.StringFilter<"Registration"> | string;
    userId?: Prisma.StringFilter<"Registration"> | string;
    eventId?: Prisma.StringFilter<"Registration"> | string;
    ticketId?: Prisma.StringFilter<"Registration"> | string;
    status?: Prisma.EnumRegistrationStatusFilter<"Registration"> | $Enums.RegistrationStatus;
    cpf?: Prisma.StringNullableFilter<"Registration"> | string | null;
    phone?: Prisma.StringNullableFilter<"Registration"> | string | null;
    birthDate?: Prisma.DateTimeNullableFilter<"Registration"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Registration"> | Date | string;
};
export type RegistrationCreateWithoutEventInput = {
    id?: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutRegistrationsInput;
    ticket: Prisma.TicketCreateNestedOneWithoutRegistrationsInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutRegistrationInput;
};
export type RegistrationUncheckedCreateWithoutEventInput = {
    id?: string;
    userId: string;
    ticketId: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
    payment?: Prisma.PaymentUncheckedCreateNestedOneWithoutRegistrationInput;
};
export type RegistrationCreateOrConnectWithoutEventInput = {
    where: Prisma.RegistrationWhereUniqueInput;
    create: Prisma.XOR<Prisma.RegistrationCreateWithoutEventInput, Prisma.RegistrationUncheckedCreateWithoutEventInput>;
};
export type RegistrationCreateManyEventInputEnvelope = {
    data: Prisma.RegistrationCreateManyEventInput | Prisma.RegistrationCreateManyEventInput[];
    skipDuplicates?: boolean;
};
export type RegistrationUpsertWithWhereUniqueWithoutEventInput = {
    where: Prisma.RegistrationWhereUniqueInput;
    update: Prisma.XOR<Prisma.RegistrationUpdateWithoutEventInput, Prisma.RegistrationUncheckedUpdateWithoutEventInput>;
    create: Prisma.XOR<Prisma.RegistrationCreateWithoutEventInput, Prisma.RegistrationUncheckedCreateWithoutEventInput>;
};
export type RegistrationUpdateWithWhereUniqueWithoutEventInput = {
    where: Prisma.RegistrationWhereUniqueInput;
    data: Prisma.XOR<Prisma.RegistrationUpdateWithoutEventInput, Prisma.RegistrationUncheckedUpdateWithoutEventInput>;
};
export type RegistrationUpdateManyWithWhereWithoutEventInput = {
    where: Prisma.RegistrationScalarWhereInput;
    data: Prisma.XOR<Prisma.RegistrationUpdateManyMutationInput, Prisma.RegistrationUncheckedUpdateManyWithoutEventInput>;
};
export type RegistrationCreateWithoutTicketInput = {
    id?: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutRegistrationsInput;
    event: Prisma.EventCreateNestedOneWithoutRegistrationsInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutRegistrationInput;
};
export type RegistrationUncheckedCreateWithoutTicketInput = {
    id?: string;
    userId: string;
    eventId: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
    payment?: Prisma.PaymentUncheckedCreateNestedOneWithoutRegistrationInput;
};
export type RegistrationCreateOrConnectWithoutTicketInput = {
    where: Prisma.RegistrationWhereUniqueInput;
    create: Prisma.XOR<Prisma.RegistrationCreateWithoutTicketInput, Prisma.RegistrationUncheckedCreateWithoutTicketInput>;
};
export type RegistrationCreateManyTicketInputEnvelope = {
    data: Prisma.RegistrationCreateManyTicketInput | Prisma.RegistrationCreateManyTicketInput[];
    skipDuplicates?: boolean;
};
export type RegistrationUpsertWithWhereUniqueWithoutTicketInput = {
    where: Prisma.RegistrationWhereUniqueInput;
    update: Prisma.XOR<Prisma.RegistrationUpdateWithoutTicketInput, Prisma.RegistrationUncheckedUpdateWithoutTicketInput>;
    create: Prisma.XOR<Prisma.RegistrationCreateWithoutTicketInput, Prisma.RegistrationUncheckedCreateWithoutTicketInput>;
};
export type RegistrationUpdateWithWhereUniqueWithoutTicketInput = {
    where: Prisma.RegistrationWhereUniqueInput;
    data: Prisma.XOR<Prisma.RegistrationUpdateWithoutTicketInput, Prisma.RegistrationUncheckedUpdateWithoutTicketInput>;
};
export type RegistrationUpdateManyWithWhereWithoutTicketInput = {
    where: Prisma.RegistrationScalarWhereInput;
    data: Prisma.XOR<Prisma.RegistrationUpdateManyMutationInput, Prisma.RegistrationUncheckedUpdateManyWithoutTicketInput>;
};
export type RegistrationCreateWithoutPaymentInput = {
    id?: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutRegistrationsInput;
    event: Prisma.EventCreateNestedOneWithoutRegistrationsInput;
    ticket: Prisma.TicketCreateNestedOneWithoutRegistrationsInput;
};
export type RegistrationUncheckedCreateWithoutPaymentInput = {
    id?: string;
    userId: string;
    eventId: string;
    ticketId: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
};
export type RegistrationCreateOrConnectWithoutPaymentInput = {
    where: Prisma.RegistrationWhereUniqueInput;
    create: Prisma.XOR<Prisma.RegistrationCreateWithoutPaymentInput, Prisma.RegistrationUncheckedCreateWithoutPaymentInput>;
};
export type RegistrationUpsertWithoutPaymentInput = {
    update: Prisma.XOR<Prisma.RegistrationUpdateWithoutPaymentInput, Prisma.RegistrationUncheckedUpdateWithoutPaymentInput>;
    create: Prisma.XOR<Prisma.RegistrationCreateWithoutPaymentInput, Prisma.RegistrationUncheckedCreateWithoutPaymentInput>;
    where?: Prisma.RegistrationWhereInput;
};
export type RegistrationUpdateToOneWithWhereWithoutPaymentInput = {
    where?: Prisma.RegistrationWhereInput;
    data: Prisma.XOR<Prisma.RegistrationUpdateWithoutPaymentInput, Prisma.RegistrationUncheckedUpdateWithoutPaymentInput>;
};
export type RegistrationUpdateWithoutPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutRegistrationsNestedInput;
    event?: Prisma.EventUpdateOneRequiredWithoutRegistrationsNestedInput;
    ticket?: Prisma.TicketUpdateOneRequiredWithoutRegistrationsNestedInput;
};
export type RegistrationUncheckedUpdateWithoutPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCreateManyUserInput = {
    id?: string;
    eventId: string;
    ticketId: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
};
export type RegistrationUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    event?: Prisma.EventUpdateOneRequiredWithoutRegistrationsNestedInput;
    ticket?: Prisma.TicketUpdateOneRequiredWithoutRegistrationsNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutRegistrationNestedInput;
};
export type RegistrationUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payment?: Prisma.PaymentUncheckedUpdateOneWithoutRegistrationNestedInput;
};
export type RegistrationUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCreateManyEventInput = {
    id?: string;
    userId: string;
    ticketId: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
};
export type RegistrationUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutRegistrationsNestedInput;
    ticket?: Prisma.TicketUpdateOneRequiredWithoutRegistrationsNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutRegistrationNestedInput;
};
export type RegistrationUncheckedUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payment?: Prisma.PaymentUncheckedUpdateOneWithoutRegistrationNestedInput;
};
export type RegistrationUncheckedUpdateManyWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCreateManyTicketInput = {
    id?: string;
    userId: string;
    eventId: string;
    status?: $Enums.RegistrationStatus;
    cpf?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    createdAt?: Date | string;
};
export type RegistrationUpdateWithoutTicketInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutRegistrationsNestedInput;
    event?: Prisma.EventUpdateOneRequiredWithoutRegistrationsNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutRegistrationNestedInput;
};
export type RegistrationUncheckedUpdateWithoutTicketInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payment?: Prisma.PaymentUncheckedUpdateOneWithoutRegistrationNestedInput;
};
export type RegistrationUncheckedUpdateManyWithoutTicketInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRegistrationStatusFieldUpdateOperationsInput | $Enums.RegistrationStatus;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    ticketId?: boolean;
    status?: boolean;
    cpf?: boolean;
    phone?: boolean;
    birthDate?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
    payment?: boolean | Prisma.Registration$paymentArgs<ExtArgs>;
}, ExtArgs["result"]["registration"]>;
export type RegistrationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    ticketId?: boolean;
    status?: boolean;
    cpf?: boolean;
    phone?: boolean;
    birthDate?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["registration"]>;
export type RegistrationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    ticketId?: boolean;
    status?: boolean;
    cpf?: boolean;
    phone?: boolean;
    birthDate?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["registration"]>;
export type RegistrationSelectScalar = {
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    ticketId?: boolean;
    status?: boolean;
    cpf?: boolean;
    phone?: boolean;
    birthDate?: boolean;
    createdAt?: boolean;
};
export type RegistrationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "eventId" | "ticketId" | "status" | "cpf" | "phone" | "birthDate" | "createdAt", ExtArgs["result"]["registration"]>;
export type RegistrationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
    payment?: boolean | Prisma.Registration$paymentArgs<ExtArgs>;
};
export type RegistrationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
};
export type RegistrationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
};
export type $RegistrationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Registration";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        event: Prisma.$EventPayload<ExtArgs>;
        ticket: Prisma.$TicketPayload<ExtArgs>;
        payment: Prisma.$PaymentPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        eventId: string;
        ticketId: string;
        status: $Enums.RegistrationStatus;
        cpf: string | null;
        phone: string | null;
        birthDate: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["registration"]>;
    composites: {};
};
export type RegistrationGetPayload<S extends boolean | null | undefined | RegistrationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RegistrationPayload, S>;
export type RegistrationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RegistrationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RegistrationCountAggregateInputType | true;
};
export interface RegistrationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Registration'];
        meta: {
            name: 'Registration';
        };
    };
    findUnique<T extends RegistrationFindUniqueArgs>(args: Prisma.SelectSubset<T, RegistrationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RegistrationClient<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RegistrationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RegistrationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RegistrationClient<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RegistrationFindFirstArgs>(args?: Prisma.SelectSubset<T, RegistrationFindFirstArgs<ExtArgs>>): Prisma.Prisma__RegistrationClient<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RegistrationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RegistrationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RegistrationClient<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RegistrationFindManyArgs>(args?: Prisma.SelectSubset<T, RegistrationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RegistrationCreateArgs>(args: Prisma.SelectSubset<T, RegistrationCreateArgs<ExtArgs>>): Prisma.Prisma__RegistrationClient<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RegistrationCreateManyArgs>(args?: Prisma.SelectSubset<T, RegistrationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RegistrationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RegistrationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RegistrationDeleteArgs>(args: Prisma.SelectSubset<T, RegistrationDeleteArgs<ExtArgs>>): Prisma.Prisma__RegistrationClient<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RegistrationUpdateArgs>(args: Prisma.SelectSubset<T, RegistrationUpdateArgs<ExtArgs>>): Prisma.Prisma__RegistrationClient<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RegistrationDeleteManyArgs>(args?: Prisma.SelectSubset<T, RegistrationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RegistrationUpdateManyArgs>(args: Prisma.SelectSubset<T, RegistrationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RegistrationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RegistrationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RegistrationUpsertArgs>(args: Prisma.SelectSubset<T, RegistrationUpsertArgs<ExtArgs>>): Prisma.Prisma__RegistrationClient<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RegistrationCountArgs>(args?: Prisma.Subset<T, RegistrationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RegistrationCountAggregateOutputType> : number>;
    aggregate<T extends RegistrationAggregateArgs>(args: Prisma.Subset<T, RegistrationAggregateArgs>): Prisma.PrismaPromise<GetRegistrationAggregateType<T>>;
    groupBy<T extends RegistrationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RegistrationGroupByArgs['orderBy'];
    } : {
        orderBy?: RegistrationGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RegistrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRegistrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RegistrationFieldRefs;
}
export interface Prisma__RegistrationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    event<T extends Prisma.EventDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventDefaultArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    ticket<T extends Prisma.TicketDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TicketDefaultArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    payment<T extends Prisma.Registration$paymentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Registration$paymentArgs<ExtArgs>>): Prisma.Prisma__PaymentClient<runtime.Types.Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RegistrationFieldRefs {
    readonly id: Prisma.FieldRef<"Registration", 'String'>;
    readonly userId: Prisma.FieldRef<"Registration", 'String'>;
    readonly eventId: Prisma.FieldRef<"Registration", 'String'>;
    readonly ticketId: Prisma.FieldRef<"Registration", 'String'>;
    readonly status: Prisma.FieldRef<"Registration", 'RegistrationStatus'>;
    readonly cpf: Prisma.FieldRef<"Registration", 'String'>;
    readonly phone: Prisma.FieldRef<"Registration", 'String'>;
    readonly birthDate: Prisma.FieldRef<"Registration", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Registration", 'DateTime'>;
}
export type RegistrationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelect<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    include?: Prisma.RegistrationInclude<ExtArgs> | null;
    where: Prisma.RegistrationWhereUniqueInput;
};
export type RegistrationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelect<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    include?: Prisma.RegistrationInclude<ExtArgs> | null;
    where: Prisma.RegistrationWhereUniqueInput;
};
export type RegistrationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelect<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    include?: Prisma.RegistrationInclude<ExtArgs> | null;
    where?: Prisma.RegistrationWhereInput;
    orderBy?: Prisma.RegistrationOrderByWithRelationInput | Prisma.RegistrationOrderByWithRelationInput[];
    cursor?: Prisma.RegistrationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RegistrationScalarFieldEnum | Prisma.RegistrationScalarFieldEnum[];
};
export type RegistrationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelect<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    include?: Prisma.RegistrationInclude<ExtArgs> | null;
    where?: Prisma.RegistrationWhereInput;
    orderBy?: Prisma.RegistrationOrderByWithRelationInput | Prisma.RegistrationOrderByWithRelationInput[];
    cursor?: Prisma.RegistrationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RegistrationScalarFieldEnum | Prisma.RegistrationScalarFieldEnum[];
};
export type RegistrationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelect<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    include?: Prisma.RegistrationInclude<ExtArgs> | null;
    where?: Prisma.RegistrationWhereInput;
    orderBy?: Prisma.RegistrationOrderByWithRelationInput | Prisma.RegistrationOrderByWithRelationInput[];
    cursor?: Prisma.RegistrationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RegistrationScalarFieldEnum | Prisma.RegistrationScalarFieldEnum[];
};
export type RegistrationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelect<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    include?: Prisma.RegistrationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RegistrationCreateInput, Prisma.RegistrationUncheckedCreateInput>;
};
export type RegistrationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RegistrationCreateManyInput | Prisma.RegistrationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RegistrationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    data: Prisma.RegistrationCreateManyInput | Prisma.RegistrationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RegistrationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RegistrationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelect<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    include?: Prisma.RegistrationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RegistrationUpdateInput, Prisma.RegistrationUncheckedUpdateInput>;
    where: Prisma.RegistrationWhereUniqueInput;
};
export type RegistrationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RegistrationUpdateManyMutationInput, Prisma.RegistrationUncheckedUpdateManyInput>;
    where?: Prisma.RegistrationWhereInput;
    limit?: number;
};
export type RegistrationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RegistrationUpdateManyMutationInput, Prisma.RegistrationUncheckedUpdateManyInput>;
    where?: Prisma.RegistrationWhereInput;
    limit?: number;
    include?: Prisma.RegistrationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RegistrationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelect<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    include?: Prisma.RegistrationInclude<ExtArgs> | null;
    where: Prisma.RegistrationWhereUniqueInput;
    create: Prisma.XOR<Prisma.RegistrationCreateInput, Prisma.RegistrationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RegistrationUpdateInput, Prisma.RegistrationUncheckedUpdateInput>;
};
export type RegistrationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelect<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    include?: Prisma.RegistrationInclude<ExtArgs> | null;
    where: Prisma.RegistrationWhereUniqueInput;
};
export type RegistrationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RegistrationWhereInput;
    limit?: number;
};
export type Registration$paymentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentSelect<ExtArgs> | null;
    omit?: Prisma.PaymentOmit<ExtArgs> | null;
    include?: Prisma.PaymentInclude<ExtArgs> | null;
    where?: Prisma.PaymentWhereInput;
};
export type RegistrationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RegistrationSelect<ExtArgs> | null;
    omit?: Prisma.RegistrationOmit<ExtArgs> | null;
    include?: Prisma.RegistrationInclude<ExtArgs> | null;
};
