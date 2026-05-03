import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EventModel = runtime.Types.Result.DefaultSelection<Prisma.$EventPayload>;
export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null;
    _min: EventMinAggregateOutputType | null;
    _max: EventMaxAggregateOutputType | null;
};
export type EventMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    location: string | null;
    date: Date | null;
    bannerUrl: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type EventMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    location: string | null;
    date: Date | null;
    bannerUrl: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type EventCountAggregateOutputType = {
    id: number;
    title: number;
    description: number;
    location: number;
    date: number;
    bannerUrl: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type EventMinAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    location?: true;
    date?: true;
    bannerUrl?: true;
    createdBy?: true;
    createdAt?: true;
};
export type EventMaxAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    location?: true;
    date?: true;
    bannerUrl?: true;
    createdBy?: true;
    createdAt?: true;
};
export type EventCountAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    location?: true;
    date?: true;
    bannerUrl?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type EventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EventCountAggregateInputType;
    _min?: EventMinAggregateInputType;
    _max?: EventMaxAggregateInputType;
};
export type GetEventAggregateType<T extends EventAggregateArgs> = {
    [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEvent[P]> : Prisma.GetScalarType<T[P], AggregateEvent[P]>;
};
export type EventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithAggregationInput | Prisma.EventOrderByWithAggregationInput[];
    by: Prisma.EventScalarFieldEnum[] | Prisma.EventScalarFieldEnum;
    having?: Prisma.EventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventCountAggregateInputType | true;
    _min?: EventMinAggregateInputType;
    _max?: EventMaxAggregateInputType;
};
export type EventGroupByOutputType = {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    date: Date;
    bannerUrl: string | null;
    createdBy: string;
    createdAt: Date;
    _count: EventCountAggregateOutputType | null;
    _min: EventMinAggregateOutputType | null;
    _max: EventMaxAggregateOutputType | null;
};
export type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EventGroupByOutputType[P]>;
}>>;
export type EventWhereInput = {
    AND?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    OR?: Prisma.EventWhereInput[];
    NOT?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    id?: Prisma.StringFilter<"Event"> | string;
    title?: Prisma.StringFilter<"Event"> | string;
    description?: Prisma.StringNullableFilter<"Event"> | string | null;
    location?: Prisma.StringNullableFilter<"Event"> | string | null;
    date?: Prisma.DateTimeFilter<"Event"> | Date | string;
    bannerUrl?: Prisma.StringNullableFilter<"Event"> | string | null;
    createdBy?: Prisma.StringFilter<"Event"> | string;
    createdAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    tickets?: Prisma.TicketListRelationFilter;
    registrations?: Prisma.RegistrationListRelationFilter;
};
export type EventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    location?: Prisma.SortOrderInput | Prisma.SortOrder;
    date?: Prisma.SortOrder;
    bannerUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    tickets?: Prisma.TicketOrderByRelationAggregateInput;
    registrations?: Prisma.RegistrationOrderByRelationAggregateInput;
};
export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    OR?: Prisma.EventWhereInput[];
    NOT?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    title?: Prisma.StringFilter<"Event"> | string;
    description?: Prisma.StringNullableFilter<"Event"> | string | null;
    location?: Prisma.StringNullableFilter<"Event"> | string | null;
    date?: Prisma.DateTimeFilter<"Event"> | Date | string;
    bannerUrl?: Prisma.StringNullableFilter<"Event"> | string | null;
    createdBy?: Prisma.StringFilter<"Event"> | string;
    createdAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    tickets?: Prisma.TicketListRelationFilter;
    registrations?: Prisma.RegistrationListRelationFilter;
}, "id">;
export type EventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    location?: Prisma.SortOrderInput | Prisma.SortOrder;
    date?: Prisma.SortOrder;
    bannerUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.EventCountOrderByAggregateInput;
    _max?: Prisma.EventMaxOrderByAggregateInput;
    _min?: Prisma.EventMinOrderByAggregateInput;
};
export type EventScalarWhereWithAggregatesInput = {
    AND?: Prisma.EventScalarWhereWithAggregatesInput | Prisma.EventScalarWhereWithAggregatesInput[];
    OR?: Prisma.EventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EventScalarWhereWithAggregatesInput | Prisma.EventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Event"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Event"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Event"> | string | null;
    location?: Prisma.StringNullableWithAggregatesFilter<"Event"> | string | null;
    date?: Prisma.DateTimeWithAggregatesFilter<"Event"> | Date | string;
    bannerUrl?: Prisma.StringNullableWithAggregatesFilter<"Event"> | string | null;
    createdBy?: Prisma.StringWithAggregatesFilter<"Event"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Event"> | Date | string;
};
export type EventCreateInput = {
    id?: string;
    title: string;
    description?: string | null;
    location?: string | null;
    date: Date | string;
    bannerUrl?: string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutEventsInput;
    tickets?: Prisma.TicketCreateNestedManyWithoutEventInput;
    registrations?: Prisma.RegistrationCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateInput = {
    id?: string;
    title: string;
    description?: string | null;
    location?: string | null;
    date: Date | string;
    bannerUrl?: string | null;
    createdBy: string;
    createdAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutEventInput;
    registrations?: Prisma.RegistrationUncheckedCreateNestedManyWithoutEventInput;
};
export type EventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutEventsNestedInput;
    tickets?: Prisma.TicketUpdateManyWithoutEventNestedInput;
    registrations?: Prisma.RegistrationUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutEventNestedInput;
    registrations?: Prisma.RegistrationUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventCreateManyInput = {
    id?: string;
    title: string;
    description?: string | null;
    location?: string | null;
    date: Date | string;
    bannerUrl?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type EventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventListRelationFilter = {
    every?: Prisma.EventWhereInput;
    some?: Prisma.EventWhereInput;
    none?: Prisma.EventWhereInput;
};
export type EventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    bannerUrl?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    bannerUrl?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    bannerUrl?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventScalarRelationFilter = {
    is?: Prisma.EventWhereInput;
    isNot?: Prisma.EventWhereInput;
};
export type EventCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutUserInput, Prisma.EventUncheckedCreateWithoutUserInput> | Prisma.EventCreateWithoutUserInput[] | Prisma.EventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutUserInput | Prisma.EventCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.EventCreateManyUserInputEnvelope;
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
};
export type EventUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutUserInput, Prisma.EventUncheckedCreateWithoutUserInput> | Prisma.EventCreateWithoutUserInput[] | Prisma.EventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutUserInput | Prisma.EventCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.EventCreateManyUserInputEnvelope;
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
};
export type EventUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutUserInput, Prisma.EventUncheckedCreateWithoutUserInput> | Prisma.EventCreateWithoutUserInput[] | Prisma.EventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutUserInput | Prisma.EventCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.EventUpsertWithWhereUniqueWithoutUserInput | Prisma.EventUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.EventCreateManyUserInputEnvelope;
    set?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    disconnect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    delete?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    update?: Prisma.EventUpdateWithWhereUniqueWithoutUserInput | Prisma.EventUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.EventUpdateManyWithWhereWithoutUserInput | Prisma.EventUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
};
export type EventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutUserInput, Prisma.EventUncheckedCreateWithoutUserInput> | Prisma.EventCreateWithoutUserInput[] | Prisma.EventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutUserInput | Prisma.EventCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.EventUpsertWithWhereUniqueWithoutUserInput | Prisma.EventUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.EventCreateManyUserInputEnvelope;
    set?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    disconnect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    delete?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    update?: Prisma.EventUpdateWithWhereUniqueWithoutUserInput | Prisma.EventUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.EventUpdateManyWithWhereWithoutUserInput | Prisma.EventUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type EventCreateNestedOneWithoutTicketsInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutTicketsInput, Prisma.EventUncheckedCreateWithoutTicketsInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutTicketsInput;
    connect?: Prisma.EventWhereUniqueInput;
};
export type EventUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutTicketsInput, Prisma.EventUncheckedCreateWithoutTicketsInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutTicketsInput;
    upsert?: Prisma.EventUpsertWithoutTicketsInput;
    connect?: Prisma.EventWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EventUpdateToOneWithWhereWithoutTicketsInput, Prisma.EventUpdateWithoutTicketsInput>, Prisma.EventUncheckedUpdateWithoutTicketsInput>;
};
export type EventCreateNestedOneWithoutRegistrationsInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutRegistrationsInput, Prisma.EventUncheckedCreateWithoutRegistrationsInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutRegistrationsInput;
    connect?: Prisma.EventWhereUniqueInput;
};
export type EventUpdateOneRequiredWithoutRegistrationsNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutRegistrationsInput, Prisma.EventUncheckedCreateWithoutRegistrationsInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutRegistrationsInput;
    upsert?: Prisma.EventUpsertWithoutRegistrationsInput;
    connect?: Prisma.EventWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EventUpdateToOneWithWhereWithoutRegistrationsInput, Prisma.EventUpdateWithoutRegistrationsInput>, Prisma.EventUncheckedUpdateWithoutRegistrationsInput>;
};
export type EventCreateWithoutUserInput = {
    id?: string;
    title: string;
    description?: string | null;
    location?: string | null;
    date: Date | string;
    bannerUrl?: string | null;
    createdAt?: Date | string;
    tickets?: Prisma.TicketCreateNestedManyWithoutEventInput;
    registrations?: Prisma.RegistrationCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateWithoutUserInput = {
    id?: string;
    title: string;
    description?: string | null;
    location?: string | null;
    date: Date | string;
    bannerUrl?: string | null;
    createdAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutEventInput;
    registrations?: Prisma.RegistrationUncheckedCreateNestedManyWithoutEventInput;
};
export type EventCreateOrConnectWithoutUserInput = {
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateWithoutUserInput, Prisma.EventUncheckedCreateWithoutUserInput>;
};
export type EventCreateManyUserInputEnvelope = {
    data: Prisma.EventCreateManyUserInput | Prisma.EventCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type EventUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.EventWhereUniqueInput;
    update: Prisma.XOR<Prisma.EventUpdateWithoutUserInput, Prisma.EventUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.EventCreateWithoutUserInput, Prisma.EventUncheckedCreateWithoutUserInput>;
};
export type EventUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.XOR<Prisma.EventUpdateWithoutUserInput, Prisma.EventUncheckedUpdateWithoutUserInput>;
};
export type EventUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.EventScalarWhereInput;
    data: Prisma.XOR<Prisma.EventUpdateManyMutationInput, Prisma.EventUncheckedUpdateManyWithoutUserInput>;
};
export type EventScalarWhereInput = {
    AND?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
    OR?: Prisma.EventScalarWhereInput[];
    NOT?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
    id?: Prisma.StringFilter<"Event"> | string;
    title?: Prisma.StringFilter<"Event"> | string;
    description?: Prisma.StringNullableFilter<"Event"> | string | null;
    location?: Prisma.StringNullableFilter<"Event"> | string | null;
    date?: Prisma.DateTimeFilter<"Event"> | Date | string;
    bannerUrl?: Prisma.StringNullableFilter<"Event"> | string | null;
    createdBy?: Prisma.StringFilter<"Event"> | string;
    createdAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
};
export type EventCreateWithoutTicketsInput = {
    id?: string;
    title: string;
    description?: string | null;
    location?: string | null;
    date: Date | string;
    bannerUrl?: string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutEventsInput;
    registrations?: Prisma.RegistrationCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateWithoutTicketsInput = {
    id?: string;
    title: string;
    description?: string | null;
    location?: string | null;
    date: Date | string;
    bannerUrl?: string | null;
    createdBy: string;
    createdAt?: Date | string;
    registrations?: Prisma.RegistrationUncheckedCreateNestedManyWithoutEventInput;
};
export type EventCreateOrConnectWithoutTicketsInput = {
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateWithoutTicketsInput, Prisma.EventUncheckedCreateWithoutTicketsInput>;
};
export type EventUpsertWithoutTicketsInput = {
    update: Prisma.XOR<Prisma.EventUpdateWithoutTicketsInput, Prisma.EventUncheckedUpdateWithoutTicketsInput>;
    create: Prisma.XOR<Prisma.EventCreateWithoutTicketsInput, Prisma.EventUncheckedCreateWithoutTicketsInput>;
    where?: Prisma.EventWhereInput;
};
export type EventUpdateToOneWithWhereWithoutTicketsInput = {
    where?: Prisma.EventWhereInput;
    data: Prisma.XOR<Prisma.EventUpdateWithoutTicketsInput, Prisma.EventUncheckedUpdateWithoutTicketsInput>;
};
export type EventUpdateWithoutTicketsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutEventsNestedInput;
    registrations?: Prisma.RegistrationUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateWithoutTicketsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    registrations?: Prisma.RegistrationUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventCreateWithoutRegistrationsInput = {
    id?: string;
    title: string;
    description?: string | null;
    location?: string | null;
    date: Date | string;
    bannerUrl?: string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutEventsInput;
    tickets?: Prisma.TicketCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateWithoutRegistrationsInput = {
    id?: string;
    title: string;
    description?: string | null;
    location?: string | null;
    date: Date | string;
    bannerUrl?: string | null;
    createdBy: string;
    createdAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutEventInput;
};
export type EventCreateOrConnectWithoutRegistrationsInput = {
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateWithoutRegistrationsInput, Prisma.EventUncheckedCreateWithoutRegistrationsInput>;
};
export type EventUpsertWithoutRegistrationsInput = {
    update: Prisma.XOR<Prisma.EventUpdateWithoutRegistrationsInput, Prisma.EventUncheckedUpdateWithoutRegistrationsInput>;
    create: Prisma.XOR<Prisma.EventCreateWithoutRegistrationsInput, Prisma.EventUncheckedCreateWithoutRegistrationsInput>;
    where?: Prisma.EventWhereInput;
};
export type EventUpdateToOneWithWhereWithoutRegistrationsInput = {
    where?: Prisma.EventWhereInput;
    data: Prisma.XOR<Prisma.EventUpdateWithoutRegistrationsInput, Prisma.EventUncheckedUpdateWithoutRegistrationsInput>;
};
export type EventUpdateWithoutRegistrationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutEventsNestedInput;
    tickets?: Prisma.TicketUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateWithoutRegistrationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventCreateManyUserInput = {
    id?: string;
    title: string;
    description?: string | null;
    location?: string | null;
    date: Date | string;
    bannerUrl?: string | null;
    createdAt?: Date | string;
};
export type EventUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUpdateManyWithoutEventNestedInput;
    registrations?: Prisma.RegistrationUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutEventNestedInput;
    registrations?: Prisma.RegistrationUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bannerUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventCountOutputType = {
    tickets: number;
    registrations: number;
};
export type EventCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tickets?: boolean | EventCountOutputTypeCountTicketsArgs;
    registrations?: boolean | EventCountOutputTypeCountRegistrationsArgs;
};
export type EventCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventCountOutputTypeSelect<ExtArgs> | null;
};
export type EventCountOutputTypeCountTicketsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TicketWhereInput;
};
export type EventCountOutputTypeCountRegistrationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RegistrationWhereInput;
};
export type EventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    location?: boolean;
    date?: boolean;
    bannerUrl?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    tickets?: boolean | Prisma.Event$ticketsArgs<ExtArgs>;
    registrations?: boolean | Prisma.Event$registrationsArgs<ExtArgs>;
    _count?: boolean | Prisma.EventCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["event"]>;
export type EventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    location?: boolean;
    date?: boolean;
    bannerUrl?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["event"]>;
export type EventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    location?: boolean;
    date?: boolean;
    bannerUrl?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["event"]>;
export type EventSelectScalar = {
    id?: boolean;
    title?: boolean;
    description?: boolean;
    location?: boolean;
    date?: boolean;
    bannerUrl?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type EventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "description" | "location" | "date" | "bannerUrl" | "createdBy" | "createdAt", ExtArgs["result"]["event"]>;
export type EventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    tickets?: boolean | Prisma.Event$ticketsArgs<ExtArgs>;
    registrations?: boolean | Prisma.Event$registrationsArgs<ExtArgs>;
    _count?: boolean | Prisma.EventCountOutputTypeDefaultArgs<ExtArgs>;
};
export type EventIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type EventIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $EventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Event";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        tickets: Prisma.$TicketPayload<ExtArgs>[];
        registrations: Prisma.$RegistrationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        bannerUrl: string | null;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["event"]>;
    composites: {};
};
export type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EventPayload, S>;
export type EventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EventCountAggregateInputType | true;
};
export interface EventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Event'];
        meta: {
            name: 'Event';
        };
    };
    findUnique<T extends EventFindUniqueArgs>(args: Prisma.SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EventFindFirstArgs>(args?: Prisma.SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EventFindManyArgs>(args?: Prisma.SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EventCreateArgs>(args: Prisma.SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EventCreateManyArgs>(args?: Prisma.SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EventDeleteArgs>(args: Prisma.SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EventUpdateArgs>(args: Prisma.SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EventDeleteManyArgs>(args?: Prisma.SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EventUpdateManyArgs>(args: Prisma.SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EventUpsertArgs>(args: Prisma.SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EventCountArgs>(args?: Prisma.Subset<T, EventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EventCountAggregateOutputType> : number>;
    aggregate<T extends EventAggregateArgs>(args: Prisma.Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>;
    groupBy<T extends EventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EventGroupByArgs['orderBy'];
    } : {
        orderBy?: EventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EventFieldRefs;
}
export interface Prisma__EventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    tickets<T extends Prisma.Event$ticketsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Event$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    registrations<T extends Prisma.Event$registrationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Event$registrationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EventFieldRefs {
    readonly id: Prisma.FieldRef<"Event", 'String'>;
    readonly title: Prisma.FieldRef<"Event", 'String'>;
    readonly description: Prisma.FieldRef<"Event", 'String'>;
    readonly location: Prisma.FieldRef<"Event", 'String'>;
    readonly date: Prisma.FieldRef<"Event", 'DateTime'>;
    readonly bannerUrl: Prisma.FieldRef<"Event", 'String'>;
    readonly createdBy: Prisma.FieldRef<"Event", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Event", 'DateTime'>;
}
export type EventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
};
export type EventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
};
export type EventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type EventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type EventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type EventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventCreateInput, Prisma.EventUncheckedCreateInput>;
};
export type EventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EventCreateManyInput | Prisma.EventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    data: Prisma.EventCreateManyInput | Prisma.EventCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EventIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventUpdateInput, Prisma.EventUncheckedUpdateInput>;
    where: Prisma.EventWhereUniqueInput;
};
export type EventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EventUpdateManyMutationInput, Prisma.EventUncheckedUpdateManyInput>;
    where?: Prisma.EventWhereInput;
    limit?: number;
};
export type EventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventUpdateManyMutationInput, Prisma.EventUncheckedUpdateManyInput>;
    where?: Prisma.EventWhereInput;
    limit?: number;
    include?: Prisma.EventIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateInput, Prisma.EventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EventUpdateInput, Prisma.EventUncheckedUpdateInput>;
};
export type EventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
};
export type EventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
    limit?: number;
};
export type Event$ticketsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    include?: Prisma.TicketInclude<ExtArgs> | null;
    where?: Prisma.TicketWhereInput;
    orderBy?: Prisma.TicketOrderByWithRelationInput | Prisma.TicketOrderByWithRelationInput[];
    cursor?: Prisma.TicketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TicketScalarFieldEnum | Prisma.TicketScalarFieldEnum[];
};
export type Event$registrationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
};
