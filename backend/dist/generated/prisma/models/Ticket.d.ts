import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TicketModel = runtime.Types.Result.DefaultSelection<Prisma.$TicketPayload>;
export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null;
    _avg: TicketAvgAggregateOutputType | null;
    _sum: TicketSumAggregateOutputType | null;
    _min: TicketMinAggregateOutputType | null;
    _max: TicketMaxAggregateOutputType | null;
};
export type TicketAvgAggregateOutputType = {
    price: runtime.Decimal | null;
    quantity: number | null;
};
export type TicketSumAggregateOutputType = {
    price: runtime.Decimal | null;
    quantity: number | null;
};
export type TicketMinAggregateOutputType = {
    id: string | null;
    eventId: string | null;
    name: string | null;
    price: runtime.Decimal | null;
    quantity: number | null;
    createdAt: Date | null;
};
export type TicketMaxAggregateOutputType = {
    id: string | null;
    eventId: string | null;
    name: string | null;
    price: runtime.Decimal | null;
    quantity: number | null;
    createdAt: Date | null;
};
export type TicketCountAggregateOutputType = {
    id: number;
    eventId: number;
    name: number;
    price: number;
    quantity: number;
    createdAt: number;
    _all: number;
};
export type TicketAvgAggregateInputType = {
    price?: true;
    quantity?: true;
};
export type TicketSumAggregateInputType = {
    price?: true;
    quantity?: true;
};
export type TicketMinAggregateInputType = {
    id?: true;
    eventId?: true;
    name?: true;
    price?: true;
    quantity?: true;
    createdAt?: true;
};
export type TicketMaxAggregateInputType = {
    id?: true;
    eventId?: true;
    name?: true;
    price?: true;
    quantity?: true;
    createdAt?: true;
};
export type TicketCountAggregateInputType = {
    id?: true;
    eventId?: true;
    name?: true;
    price?: true;
    quantity?: true;
    createdAt?: true;
    _all?: true;
};
export type TicketAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TicketWhereInput;
    orderBy?: Prisma.TicketOrderByWithRelationInput | Prisma.TicketOrderByWithRelationInput[];
    cursor?: Prisma.TicketWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TicketCountAggregateInputType;
    _avg?: TicketAvgAggregateInputType;
    _sum?: TicketSumAggregateInputType;
    _min?: TicketMinAggregateInputType;
    _max?: TicketMaxAggregateInputType;
};
export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
    [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTicket[P]> : Prisma.GetScalarType<T[P], AggregateTicket[P]>;
};
export type TicketGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TicketWhereInput;
    orderBy?: Prisma.TicketOrderByWithAggregationInput | Prisma.TicketOrderByWithAggregationInput[];
    by: Prisma.TicketScalarFieldEnum[] | Prisma.TicketScalarFieldEnum;
    having?: Prisma.TicketScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TicketCountAggregateInputType | true;
    _avg?: TicketAvgAggregateInputType;
    _sum?: TicketSumAggregateInputType;
    _min?: TicketMinAggregateInputType;
    _max?: TicketMaxAggregateInputType;
};
export type TicketGroupByOutputType = {
    id: string;
    eventId: string;
    name: string;
    price: runtime.Decimal;
    quantity: number;
    createdAt: Date;
    _count: TicketCountAggregateOutputType | null;
    _avg: TicketAvgAggregateOutputType | null;
    _sum: TicketSumAggregateOutputType | null;
    _min: TicketMinAggregateOutputType | null;
    _max: TicketMaxAggregateOutputType | null;
};
export type GetTicketGroupByPayload<T extends TicketGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TicketGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TicketGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TicketGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TicketGroupByOutputType[P]>;
}>>;
export type TicketWhereInput = {
    AND?: Prisma.TicketWhereInput | Prisma.TicketWhereInput[];
    OR?: Prisma.TicketWhereInput[];
    NOT?: Prisma.TicketWhereInput | Prisma.TicketWhereInput[];
    id?: Prisma.StringFilter<"Ticket"> | string;
    eventId?: Prisma.StringFilter<"Ticket"> | string;
    name?: Prisma.StringFilter<"Ticket"> | string;
    price?: Prisma.DecimalFilter<"Ticket"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFilter<"Ticket"> | number;
    createdAt?: Prisma.DateTimeFilter<"Ticket"> | Date | string;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
    registrations?: Prisma.RegistrationListRelationFilter;
};
export type TicketOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    event?: Prisma.EventOrderByWithRelationInput;
    registrations?: Prisma.RegistrationOrderByRelationAggregateInput;
};
export type TicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TicketWhereInput | Prisma.TicketWhereInput[];
    OR?: Prisma.TicketWhereInput[];
    NOT?: Prisma.TicketWhereInput | Prisma.TicketWhereInput[];
    eventId?: Prisma.StringFilter<"Ticket"> | string;
    name?: Prisma.StringFilter<"Ticket"> | string;
    price?: Prisma.DecimalFilter<"Ticket"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFilter<"Ticket"> | number;
    createdAt?: Prisma.DateTimeFilter<"Ticket"> | Date | string;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
    registrations?: Prisma.RegistrationListRelationFilter;
}, "id">;
export type TicketOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.TicketCountOrderByAggregateInput;
    _avg?: Prisma.TicketAvgOrderByAggregateInput;
    _max?: Prisma.TicketMaxOrderByAggregateInput;
    _min?: Prisma.TicketMinOrderByAggregateInput;
    _sum?: Prisma.TicketSumOrderByAggregateInput;
};
export type TicketScalarWhereWithAggregatesInput = {
    AND?: Prisma.TicketScalarWhereWithAggregatesInput | Prisma.TicketScalarWhereWithAggregatesInput[];
    OR?: Prisma.TicketScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TicketScalarWhereWithAggregatesInput | Prisma.TicketScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Ticket"> | string;
    eventId?: Prisma.StringWithAggregatesFilter<"Ticket"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Ticket"> | string;
    price?: Prisma.DecimalWithAggregatesFilter<"Ticket"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntWithAggregatesFilter<"Ticket"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Ticket"> | Date | string;
};
export type TicketCreateInput = {
    id?: string;
    name: string;
    price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity: number;
    createdAt?: Date | string;
    event: Prisma.EventCreateNestedOneWithoutTicketsInput;
    registrations?: Prisma.RegistrationCreateNestedManyWithoutTicketInput;
};
export type TicketUncheckedCreateInput = {
    id?: string;
    eventId: string;
    name: string;
    price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity: number;
    createdAt?: Date | string;
    registrations?: Prisma.RegistrationUncheckedCreateNestedManyWithoutTicketInput;
};
export type TicketUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    event?: Prisma.EventUpdateOneRequiredWithoutTicketsNestedInput;
    registrations?: Prisma.RegistrationUpdateManyWithoutTicketNestedInput;
};
export type TicketUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    registrations?: Prisma.RegistrationUncheckedUpdateManyWithoutTicketNestedInput;
};
export type TicketCreateManyInput = {
    id?: string;
    eventId: string;
    name: string;
    price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity: number;
    createdAt?: Date | string;
};
export type TicketUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TicketUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TicketListRelationFilter = {
    every?: Prisma.TicketWhereInput;
    some?: Prisma.TicketWhereInput;
    none?: Prisma.TicketWhereInput;
};
export type TicketOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TicketCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TicketAvgOrderByAggregateInput = {
    price?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type TicketMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TicketMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TicketSumOrderByAggregateInput = {
    price?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type TicketNullableScalarRelationFilter = {
    is?: Prisma.TicketWhereInput | null;
    isNot?: Prisma.TicketWhereInput | null;
};
export type TicketCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.TicketCreateWithoutEventInput, Prisma.TicketUncheckedCreateWithoutEventInput> | Prisma.TicketCreateWithoutEventInput[] | Prisma.TicketUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.TicketCreateOrConnectWithoutEventInput | Prisma.TicketCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.TicketCreateManyEventInputEnvelope;
    connect?: Prisma.TicketWhereUniqueInput | Prisma.TicketWhereUniqueInput[];
};
export type TicketUncheckedCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.TicketCreateWithoutEventInput, Prisma.TicketUncheckedCreateWithoutEventInput> | Prisma.TicketCreateWithoutEventInput[] | Prisma.TicketUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.TicketCreateOrConnectWithoutEventInput | Prisma.TicketCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.TicketCreateManyEventInputEnvelope;
    connect?: Prisma.TicketWhereUniqueInput | Prisma.TicketWhereUniqueInput[];
};
export type TicketUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.TicketCreateWithoutEventInput, Prisma.TicketUncheckedCreateWithoutEventInput> | Prisma.TicketCreateWithoutEventInput[] | Prisma.TicketUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.TicketCreateOrConnectWithoutEventInput | Prisma.TicketCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.TicketUpsertWithWhereUniqueWithoutEventInput | Prisma.TicketUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.TicketCreateManyEventInputEnvelope;
    set?: Prisma.TicketWhereUniqueInput | Prisma.TicketWhereUniqueInput[];
    disconnect?: Prisma.TicketWhereUniqueInput | Prisma.TicketWhereUniqueInput[];
    delete?: Prisma.TicketWhereUniqueInput | Prisma.TicketWhereUniqueInput[];
    connect?: Prisma.TicketWhereUniqueInput | Prisma.TicketWhereUniqueInput[];
    update?: Prisma.TicketUpdateWithWhereUniqueWithoutEventInput | Prisma.TicketUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.TicketUpdateManyWithWhereWithoutEventInput | Prisma.TicketUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.TicketScalarWhereInput | Prisma.TicketScalarWhereInput[];
};
export type TicketUncheckedUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.TicketCreateWithoutEventInput, Prisma.TicketUncheckedCreateWithoutEventInput> | Prisma.TicketCreateWithoutEventInput[] | Prisma.TicketUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.TicketCreateOrConnectWithoutEventInput | Prisma.TicketCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.TicketUpsertWithWhereUniqueWithoutEventInput | Prisma.TicketUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.TicketCreateManyEventInputEnvelope;
    set?: Prisma.TicketWhereUniqueInput | Prisma.TicketWhereUniqueInput[];
    disconnect?: Prisma.TicketWhereUniqueInput | Prisma.TicketWhereUniqueInput[];
    delete?: Prisma.TicketWhereUniqueInput | Prisma.TicketWhereUniqueInput[];
    connect?: Prisma.TicketWhereUniqueInput | Prisma.TicketWhereUniqueInput[];
    update?: Prisma.TicketUpdateWithWhereUniqueWithoutEventInput | Prisma.TicketUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.TicketUpdateManyWithWhereWithoutEventInput | Prisma.TicketUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.TicketScalarWhereInput | Prisma.TicketScalarWhereInput[];
};
export type TicketCreateNestedOneWithoutRegistrationsInput = {
    create?: Prisma.XOR<Prisma.TicketCreateWithoutRegistrationsInput, Prisma.TicketUncheckedCreateWithoutRegistrationsInput>;
    connectOrCreate?: Prisma.TicketCreateOrConnectWithoutRegistrationsInput;
    connect?: Prisma.TicketWhereUniqueInput;
};
export type TicketUpdateOneWithoutRegistrationsNestedInput = {
    create?: Prisma.XOR<Prisma.TicketCreateWithoutRegistrationsInput, Prisma.TicketUncheckedCreateWithoutRegistrationsInput>;
    connectOrCreate?: Prisma.TicketCreateOrConnectWithoutRegistrationsInput;
    upsert?: Prisma.TicketUpsertWithoutRegistrationsInput;
    disconnect?: Prisma.TicketWhereInput | boolean;
    delete?: Prisma.TicketWhereInput | boolean;
    connect?: Prisma.TicketWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TicketUpdateToOneWithWhereWithoutRegistrationsInput, Prisma.TicketUpdateWithoutRegistrationsInput>, Prisma.TicketUncheckedUpdateWithoutRegistrationsInput>;
};
export type TicketCreateWithoutEventInput = {
    id?: string;
    name: string;
    price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity: number;
    createdAt?: Date | string;
    registrations?: Prisma.RegistrationCreateNestedManyWithoutTicketInput;
};
export type TicketUncheckedCreateWithoutEventInput = {
    id?: string;
    name: string;
    price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity: number;
    createdAt?: Date | string;
    registrations?: Prisma.RegistrationUncheckedCreateNestedManyWithoutTicketInput;
};
export type TicketCreateOrConnectWithoutEventInput = {
    where: Prisma.TicketWhereUniqueInput;
    create: Prisma.XOR<Prisma.TicketCreateWithoutEventInput, Prisma.TicketUncheckedCreateWithoutEventInput>;
};
export type TicketCreateManyEventInputEnvelope = {
    data: Prisma.TicketCreateManyEventInput | Prisma.TicketCreateManyEventInput[];
    skipDuplicates?: boolean;
};
export type TicketUpsertWithWhereUniqueWithoutEventInput = {
    where: Prisma.TicketWhereUniqueInput;
    update: Prisma.XOR<Prisma.TicketUpdateWithoutEventInput, Prisma.TicketUncheckedUpdateWithoutEventInput>;
    create: Prisma.XOR<Prisma.TicketCreateWithoutEventInput, Prisma.TicketUncheckedCreateWithoutEventInput>;
};
export type TicketUpdateWithWhereUniqueWithoutEventInput = {
    where: Prisma.TicketWhereUniqueInput;
    data: Prisma.XOR<Prisma.TicketUpdateWithoutEventInput, Prisma.TicketUncheckedUpdateWithoutEventInput>;
};
export type TicketUpdateManyWithWhereWithoutEventInput = {
    where: Prisma.TicketScalarWhereInput;
    data: Prisma.XOR<Prisma.TicketUpdateManyMutationInput, Prisma.TicketUncheckedUpdateManyWithoutEventInput>;
};
export type TicketScalarWhereInput = {
    AND?: Prisma.TicketScalarWhereInput | Prisma.TicketScalarWhereInput[];
    OR?: Prisma.TicketScalarWhereInput[];
    NOT?: Prisma.TicketScalarWhereInput | Prisma.TicketScalarWhereInput[];
    id?: Prisma.StringFilter<"Ticket"> | string;
    eventId?: Prisma.StringFilter<"Ticket"> | string;
    name?: Prisma.StringFilter<"Ticket"> | string;
    price?: Prisma.DecimalFilter<"Ticket"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFilter<"Ticket"> | number;
    createdAt?: Prisma.DateTimeFilter<"Ticket"> | Date | string;
};
export type TicketCreateWithoutRegistrationsInput = {
    id?: string;
    name: string;
    price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity: number;
    createdAt?: Date | string;
    event: Prisma.EventCreateNestedOneWithoutTicketsInput;
};
export type TicketUncheckedCreateWithoutRegistrationsInput = {
    id?: string;
    eventId: string;
    name: string;
    price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity: number;
    createdAt?: Date | string;
};
export type TicketCreateOrConnectWithoutRegistrationsInput = {
    where: Prisma.TicketWhereUniqueInput;
    create: Prisma.XOR<Prisma.TicketCreateWithoutRegistrationsInput, Prisma.TicketUncheckedCreateWithoutRegistrationsInput>;
};
export type TicketUpsertWithoutRegistrationsInput = {
    update: Prisma.XOR<Prisma.TicketUpdateWithoutRegistrationsInput, Prisma.TicketUncheckedUpdateWithoutRegistrationsInput>;
    create: Prisma.XOR<Prisma.TicketCreateWithoutRegistrationsInput, Prisma.TicketUncheckedCreateWithoutRegistrationsInput>;
    where?: Prisma.TicketWhereInput;
};
export type TicketUpdateToOneWithWhereWithoutRegistrationsInput = {
    where?: Prisma.TicketWhereInput;
    data: Prisma.XOR<Prisma.TicketUpdateWithoutRegistrationsInput, Prisma.TicketUncheckedUpdateWithoutRegistrationsInput>;
};
export type TicketUpdateWithoutRegistrationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    event?: Prisma.EventUpdateOneRequiredWithoutTicketsNestedInput;
};
export type TicketUncheckedUpdateWithoutRegistrationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TicketCreateManyEventInput = {
    id?: string;
    name: string;
    price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity: number;
    createdAt?: Date | string;
};
export type TicketUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    registrations?: Prisma.RegistrationUpdateManyWithoutTicketNestedInput;
};
export type TicketUncheckedUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    registrations?: Prisma.RegistrationUncheckedUpdateManyWithoutTicketNestedInput;
};
export type TicketUncheckedUpdateManyWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TicketCountOutputType = {
    registrations: number;
};
export type TicketCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    registrations?: boolean | TicketCountOutputTypeCountRegistrationsArgs;
};
export type TicketCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketCountOutputTypeSelect<ExtArgs> | null;
};
export type TicketCountOutputTypeCountRegistrationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RegistrationWhereInput;
};
export type TicketSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    name?: boolean;
    price?: boolean;
    quantity?: boolean;
    createdAt?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    registrations?: boolean | Prisma.Ticket$registrationsArgs<ExtArgs>;
    _count?: boolean | Prisma.TicketCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ticket"]>;
export type TicketSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    name?: boolean;
    price?: boolean;
    quantity?: boolean;
    createdAt?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ticket"]>;
export type TicketSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    name?: boolean;
    price?: boolean;
    quantity?: boolean;
    createdAt?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ticket"]>;
export type TicketSelectScalar = {
    id?: boolean;
    eventId?: boolean;
    name?: boolean;
    price?: boolean;
    quantity?: boolean;
    createdAt?: boolean;
};
export type TicketOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "eventId" | "name" | "price" | "quantity" | "createdAt", ExtArgs["result"]["ticket"]>;
export type TicketInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    registrations?: boolean | Prisma.Ticket$registrationsArgs<ExtArgs>;
    _count?: boolean | Prisma.TicketCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TicketIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type TicketIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type $TicketPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Ticket";
    objects: {
        event: Prisma.$EventPayload<ExtArgs>;
        registrations: Prisma.$RegistrationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        eventId: string;
        name: string;
        price: runtime.Decimal;
        quantity: number;
        createdAt: Date;
    }, ExtArgs["result"]["ticket"]>;
    composites: {};
};
export type TicketGetPayload<S extends boolean | null | undefined | TicketDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TicketPayload, S>;
export type TicketCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TicketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TicketCountAggregateInputType | true;
};
export interface TicketDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Ticket'];
        meta: {
            name: 'Ticket';
        };
    };
    findUnique<T extends TicketFindUniqueArgs>(args: Prisma.SelectSubset<T, TicketFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TicketFindFirstArgs>(args?: Prisma.SelectSubset<T, TicketFindFirstArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TicketFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TicketFindManyArgs>(args?: Prisma.SelectSubset<T, TicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TicketCreateArgs>(args: Prisma.SelectSubset<T, TicketCreateArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TicketCreateManyArgs>(args?: Prisma.SelectSubset<T, TicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TicketCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TicketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TicketDeleteArgs>(args: Prisma.SelectSubset<T, TicketDeleteArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TicketUpdateArgs>(args: Prisma.SelectSubset<T, TicketUpdateArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TicketDeleteManyArgs>(args?: Prisma.SelectSubset<T, TicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TicketUpdateManyArgs>(args: Prisma.SelectSubset<T, TicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TicketUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TicketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TicketUpsertArgs>(args: Prisma.SelectSubset<T, TicketUpsertArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TicketCountArgs>(args?: Prisma.Subset<T, TicketCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TicketCountAggregateOutputType> : number>;
    aggregate<T extends TicketAggregateArgs>(args: Prisma.Subset<T, TicketAggregateArgs>): Prisma.PrismaPromise<GetTicketAggregateType<T>>;
    groupBy<T extends TicketGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TicketGroupByArgs['orderBy'];
    } : {
        orderBy?: TicketGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TicketFieldRefs;
}
export interface Prisma__TicketClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    event<T extends Prisma.EventDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventDefaultArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    registrations<T extends Prisma.Ticket$registrationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Ticket$registrationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TicketFieldRefs {
    readonly id: Prisma.FieldRef<"Ticket", 'String'>;
    readonly eventId: Prisma.FieldRef<"Ticket", 'String'>;
    readonly name: Prisma.FieldRef<"Ticket", 'String'>;
    readonly price: Prisma.FieldRef<"Ticket", 'Decimal'>;
    readonly quantity: Prisma.FieldRef<"Ticket", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Ticket", 'DateTime'>;
}
export type TicketFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    include?: Prisma.TicketInclude<ExtArgs> | null;
    where: Prisma.TicketWhereUniqueInput;
};
export type TicketFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    include?: Prisma.TicketInclude<ExtArgs> | null;
    where: Prisma.TicketWhereUniqueInput;
};
export type TicketFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TicketFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TicketFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TicketCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    include?: Prisma.TicketInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TicketCreateInput, Prisma.TicketUncheckedCreateInput>;
};
export type TicketCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TicketCreateManyInput | Prisma.TicketCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TicketCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    data: Prisma.TicketCreateManyInput | Prisma.TicketCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TicketIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TicketUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    include?: Prisma.TicketInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TicketUpdateInput, Prisma.TicketUncheckedUpdateInput>;
    where: Prisma.TicketWhereUniqueInput;
};
export type TicketUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TicketUpdateManyMutationInput, Prisma.TicketUncheckedUpdateManyInput>;
    where?: Prisma.TicketWhereInput;
    limit?: number;
};
export type TicketUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TicketUpdateManyMutationInput, Prisma.TicketUncheckedUpdateManyInput>;
    where?: Prisma.TicketWhereInput;
    limit?: number;
    include?: Prisma.TicketIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TicketUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    include?: Prisma.TicketInclude<ExtArgs> | null;
    where: Prisma.TicketWhereUniqueInput;
    create: Prisma.XOR<Prisma.TicketCreateInput, Prisma.TicketUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TicketUpdateInput, Prisma.TicketUncheckedUpdateInput>;
};
export type TicketDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    include?: Prisma.TicketInclude<ExtArgs> | null;
    where: Prisma.TicketWhereUniqueInput;
};
export type TicketDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TicketWhereInput;
    limit?: number;
};
export type Ticket$registrationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TicketDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    include?: Prisma.TicketInclude<ExtArgs> | null;
};
