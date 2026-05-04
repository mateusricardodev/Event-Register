import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EventPaymentMethodModel = runtime.Types.Result.DefaultSelection<Prisma.$EventPaymentMethodPayload>;
export type AggregateEventPaymentMethod = {
    _count: EventPaymentMethodCountAggregateOutputType | null;
    _avg: EventPaymentMethodAvgAggregateOutputType | null;
    _sum: EventPaymentMethodSumAggregateOutputType | null;
    _min: EventPaymentMethodMinAggregateOutputType | null;
    _max: EventPaymentMethodMaxAggregateOutputType | null;
};
export type EventPaymentMethodAvgAggregateOutputType = {
    value: runtime.Decimal | null;
    installments: number | null;
};
export type EventPaymentMethodSumAggregateOutputType = {
    value: runtime.Decimal | null;
    installments: number | null;
};
export type EventPaymentMethodMinAggregateOutputType = {
    id: string | null;
    eventId: string | null;
    type: string | null;
    value: runtime.Decimal | null;
    installments: number | null;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date | null;
};
export type EventPaymentMethodMaxAggregateOutputType = {
    id: string | null;
    eventId: string | null;
    type: string | null;
    value: runtime.Decimal | null;
    installments: number | null;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date | null;
};
export type EventPaymentMethodCountAggregateOutputType = {
    id: number;
    eventId: number;
    type: number;
    value: number;
    installments: number;
    startDate: number;
    endDate: number;
    createdAt: number;
    _all: number;
};
export type EventPaymentMethodAvgAggregateInputType = {
    value?: true;
    installments?: true;
};
export type EventPaymentMethodSumAggregateInputType = {
    value?: true;
    installments?: true;
};
export type EventPaymentMethodMinAggregateInputType = {
    id?: true;
    eventId?: true;
    type?: true;
    value?: true;
    installments?: true;
    startDate?: true;
    endDate?: true;
    createdAt?: true;
};
export type EventPaymentMethodMaxAggregateInputType = {
    id?: true;
    eventId?: true;
    type?: true;
    value?: true;
    installments?: true;
    startDate?: true;
    endDate?: true;
    createdAt?: true;
};
export type EventPaymentMethodCountAggregateInputType = {
    id?: true;
    eventId?: true;
    type?: true;
    value?: true;
    installments?: true;
    startDate?: true;
    endDate?: true;
    createdAt?: true;
    _all?: true;
};
export type EventPaymentMethodAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventPaymentMethodWhereInput;
    orderBy?: Prisma.EventPaymentMethodOrderByWithRelationInput | Prisma.EventPaymentMethodOrderByWithRelationInput[];
    cursor?: Prisma.EventPaymentMethodWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EventPaymentMethodCountAggregateInputType;
    _avg?: EventPaymentMethodAvgAggregateInputType;
    _sum?: EventPaymentMethodSumAggregateInputType;
    _min?: EventPaymentMethodMinAggregateInputType;
    _max?: EventPaymentMethodMaxAggregateInputType;
};
export type GetEventPaymentMethodAggregateType<T extends EventPaymentMethodAggregateArgs> = {
    [P in keyof T & keyof AggregateEventPaymentMethod]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEventPaymentMethod[P]> : Prisma.GetScalarType<T[P], AggregateEventPaymentMethod[P]>;
};
export type EventPaymentMethodGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventPaymentMethodWhereInput;
    orderBy?: Prisma.EventPaymentMethodOrderByWithAggregationInput | Prisma.EventPaymentMethodOrderByWithAggregationInput[];
    by: Prisma.EventPaymentMethodScalarFieldEnum[] | Prisma.EventPaymentMethodScalarFieldEnum;
    having?: Prisma.EventPaymentMethodScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventPaymentMethodCountAggregateInputType | true;
    _avg?: EventPaymentMethodAvgAggregateInputType;
    _sum?: EventPaymentMethodSumAggregateInputType;
    _min?: EventPaymentMethodMinAggregateInputType;
    _max?: EventPaymentMethodMaxAggregateInputType;
};
export type EventPaymentMethodGroupByOutputType = {
    id: string;
    eventId: string;
    type: string;
    value: runtime.Decimal;
    installments: number;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
    _count: EventPaymentMethodCountAggregateOutputType | null;
    _avg: EventPaymentMethodAvgAggregateOutputType | null;
    _sum: EventPaymentMethodSumAggregateOutputType | null;
    _min: EventPaymentMethodMinAggregateOutputType | null;
    _max: EventPaymentMethodMaxAggregateOutputType | null;
};
export type GetEventPaymentMethodGroupByPayload<T extends EventPaymentMethodGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EventPaymentMethodGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EventPaymentMethodGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EventPaymentMethodGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EventPaymentMethodGroupByOutputType[P]>;
}>>;
export type EventPaymentMethodWhereInput = {
    AND?: Prisma.EventPaymentMethodWhereInput | Prisma.EventPaymentMethodWhereInput[];
    OR?: Prisma.EventPaymentMethodWhereInput[];
    NOT?: Prisma.EventPaymentMethodWhereInput | Prisma.EventPaymentMethodWhereInput[];
    id?: Prisma.StringFilter<"EventPaymentMethod"> | string;
    eventId?: Prisma.StringFilter<"EventPaymentMethod"> | string;
    type?: Prisma.StringFilter<"EventPaymentMethod"> | string;
    value?: Prisma.DecimalFilter<"EventPaymentMethod"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntFilter<"EventPaymentMethod"> | number;
    startDate?: Prisma.DateTimeNullableFilter<"EventPaymentMethod"> | Date | string | null;
    endDate?: Prisma.DateTimeNullableFilter<"EventPaymentMethod"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"EventPaymentMethod"> | Date | string;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
};
export type EventPaymentMethodOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    installments?: Prisma.SortOrder;
    startDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    endDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    event?: Prisma.EventOrderByWithRelationInput;
};
export type EventPaymentMethodWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EventPaymentMethodWhereInput | Prisma.EventPaymentMethodWhereInput[];
    OR?: Prisma.EventPaymentMethodWhereInput[];
    NOT?: Prisma.EventPaymentMethodWhereInput | Prisma.EventPaymentMethodWhereInput[];
    eventId?: Prisma.StringFilter<"EventPaymentMethod"> | string;
    type?: Prisma.StringFilter<"EventPaymentMethod"> | string;
    value?: Prisma.DecimalFilter<"EventPaymentMethod"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntFilter<"EventPaymentMethod"> | number;
    startDate?: Prisma.DateTimeNullableFilter<"EventPaymentMethod"> | Date | string | null;
    endDate?: Prisma.DateTimeNullableFilter<"EventPaymentMethod"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"EventPaymentMethod"> | Date | string;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
}, "id">;
export type EventPaymentMethodOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    installments?: Prisma.SortOrder;
    startDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    endDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.EventPaymentMethodCountOrderByAggregateInput;
    _avg?: Prisma.EventPaymentMethodAvgOrderByAggregateInput;
    _max?: Prisma.EventPaymentMethodMaxOrderByAggregateInput;
    _min?: Prisma.EventPaymentMethodMinOrderByAggregateInput;
    _sum?: Prisma.EventPaymentMethodSumOrderByAggregateInput;
};
export type EventPaymentMethodScalarWhereWithAggregatesInput = {
    AND?: Prisma.EventPaymentMethodScalarWhereWithAggregatesInput | Prisma.EventPaymentMethodScalarWhereWithAggregatesInput[];
    OR?: Prisma.EventPaymentMethodScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EventPaymentMethodScalarWhereWithAggregatesInput | Prisma.EventPaymentMethodScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"EventPaymentMethod"> | string;
    eventId?: Prisma.StringWithAggregatesFilter<"EventPaymentMethod"> | string;
    type?: Prisma.StringWithAggregatesFilter<"EventPaymentMethod"> | string;
    value?: Prisma.DecimalWithAggregatesFilter<"EventPaymentMethod"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntWithAggregatesFilter<"EventPaymentMethod"> | number;
    startDate?: Prisma.DateTimeNullableWithAggregatesFilter<"EventPaymentMethod"> | Date | string | null;
    endDate?: Prisma.DateTimeNullableWithAggregatesFilter<"EventPaymentMethod"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"EventPaymentMethod"> | Date | string;
};
export type EventPaymentMethodCreateInput = {
    id?: string;
    type: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: number;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    createdAt?: Date | string;
    event: Prisma.EventCreateNestedOneWithoutPaymentMethodsInput;
};
export type EventPaymentMethodUncheckedCreateInput = {
    id?: string;
    eventId: string;
    type: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: number;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    createdAt?: Date | string;
};
export type EventPaymentMethodUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    event?: Prisma.EventUpdateOneRequiredWithoutPaymentMethodsNestedInput;
};
export type EventPaymentMethodUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventPaymentMethodCreateManyInput = {
    id?: string;
    eventId: string;
    type: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: number;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    createdAt?: Date | string;
};
export type EventPaymentMethodUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventPaymentMethodUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventPaymentMethodListRelationFilter = {
    every?: Prisma.EventPaymentMethodWhereInput;
    some?: Prisma.EventPaymentMethodWhereInput;
    none?: Prisma.EventPaymentMethodWhereInput;
};
export type EventPaymentMethodOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EventPaymentMethodCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    installments?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventPaymentMethodAvgOrderByAggregateInput = {
    value?: Prisma.SortOrder;
    installments?: Prisma.SortOrder;
};
export type EventPaymentMethodMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    installments?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventPaymentMethodMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    installments?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventPaymentMethodSumOrderByAggregateInput = {
    value?: Prisma.SortOrder;
    installments?: Prisma.SortOrder;
};
export type EventPaymentMethodCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.EventPaymentMethodCreateWithoutEventInput, Prisma.EventPaymentMethodUncheckedCreateWithoutEventInput> | Prisma.EventPaymentMethodCreateWithoutEventInput[] | Prisma.EventPaymentMethodUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventPaymentMethodCreateOrConnectWithoutEventInput | Prisma.EventPaymentMethodCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.EventPaymentMethodCreateManyEventInputEnvelope;
    connect?: Prisma.EventPaymentMethodWhereUniqueInput | Prisma.EventPaymentMethodWhereUniqueInput[];
};
export type EventPaymentMethodUncheckedCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.EventPaymentMethodCreateWithoutEventInput, Prisma.EventPaymentMethodUncheckedCreateWithoutEventInput> | Prisma.EventPaymentMethodCreateWithoutEventInput[] | Prisma.EventPaymentMethodUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventPaymentMethodCreateOrConnectWithoutEventInput | Prisma.EventPaymentMethodCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.EventPaymentMethodCreateManyEventInputEnvelope;
    connect?: Prisma.EventPaymentMethodWhereUniqueInput | Prisma.EventPaymentMethodWhereUniqueInput[];
};
export type EventPaymentMethodUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.EventPaymentMethodCreateWithoutEventInput, Prisma.EventPaymentMethodUncheckedCreateWithoutEventInput> | Prisma.EventPaymentMethodCreateWithoutEventInput[] | Prisma.EventPaymentMethodUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventPaymentMethodCreateOrConnectWithoutEventInput | Prisma.EventPaymentMethodCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.EventPaymentMethodUpsertWithWhereUniqueWithoutEventInput | Prisma.EventPaymentMethodUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.EventPaymentMethodCreateManyEventInputEnvelope;
    set?: Prisma.EventPaymentMethodWhereUniqueInput | Prisma.EventPaymentMethodWhereUniqueInput[];
    disconnect?: Prisma.EventPaymentMethodWhereUniqueInput | Prisma.EventPaymentMethodWhereUniqueInput[];
    delete?: Prisma.EventPaymentMethodWhereUniqueInput | Prisma.EventPaymentMethodWhereUniqueInput[];
    connect?: Prisma.EventPaymentMethodWhereUniqueInput | Prisma.EventPaymentMethodWhereUniqueInput[];
    update?: Prisma.EventPaymentMethodUpdateWithWhereUniqueWithoutEventInput | Prisma.EventPaymentMethodUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.EventPaymentMethodUpdateManyWithWhereWithoutEventInput | Prisma.EventPaymentMethodUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.EventPaymentMethodScalarWhereInput | Prisma.EventPaymentMethodScalarWhereInput[];
};
export type EventPaymentMethodUncheckedUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.EventPaymentMethodCreateWithoutEventInput, Prisma.EventPaymentMethodUncheckedCreateWithoutEventInput> | Prisma.EventPaymentMethodCreateWithoutEventInput[] | Prisma.EventPaymentMethodUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventPaymentMethodCreateOrConnectWithoutEventInput | Prisma.EventPaymentMethodCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.EventPaymentMethodUpsertWithWhereUniqueWithoutEventInput | Prisma.EventPaymentMethodUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.EventPaymentMethodCreateManyEventInputEnvelope;
    set?: Prisma.EventPaymentMethodWhereUniqueInput | Prisma.EventPaymentMethodWhereUniqueInput[];
    disconnect?: Prisma.EventPaymentMethodWhereUniqueInput | Prisma.EventPaymentMethodWhereUniqueInput[];
    delete?: Prisma.EventPaymentMethodWhereUniqueInput | Prisma.EventPaymentMethodWhereUniqueInput[];
    connect?: Prisma.EventPaymentMethodWhereUniqueInput | Prisma.EventPaymentMethodWhereUniqueInput[];
    update?: Prisma.EventPaymentMethodUpdateWithWhereUniqueWithoutEventInput | Prisma.EventPaymentMethodUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.EventPaymentMethodUpdateManyWithWhereWithoutEventInput | Prisma.EventPaymentMethodUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.EventPaymentMethodScalarWhereInput | Prisma.EventPaymentMethodScalarWhereInput[];
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EventPaymentMethodCreateWithoutEventInput = {
    id?: string;
    type: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: number;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    createdAt?: Date | string;
};
export type EventPaymentMethodUncheckedCreateWithoutEventInput = {
    id?: string;
    type: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: number;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    createdAt?: Date | string;
};
export type EventPaymentMethodCreateOrConnectWithoutEventInput = {
    where: Prisma.EventPaymentMethodWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventPaymentMethodCreateWithoutEventInput, Prisma.EventPaymentMethodUncheckedCreateWithoutEventInput>;
};
export type EventPaymentMethodCreateManyEventInputEnvelope = {
    data: Prisma.EventPaymentMethodCreateManyEventInput | Prisma.EventPaymentMethodCreateManyEventInput[];
    skipDuplicates?: boolean;
};
export type EventPaymentMethodUpsertWithWhereUniqueWithoutEventInput = {
    where: Prisma.EventPaymentMethodWhereUniqueInput;
    update: Prisma.XOR<Prisma.EventPaymentMethodUpdateWithoutEventInput, Prisma.EventPaymentMethodUncheckedUpdateWithoutEventInput>;
    create: Prisma.XOR<Prisma.EventPaymentMethodCreateWithoutEventInput, Prisma.EventPaymentMethodUncheckedCreateWithoutEventInput>;
};
export type EventPaymentMethodUpdateWithWhereUniqueWithoutEventInput = {
    where: Prisma.EventPaymentMethodWhereUniqueInput;
    data: Prisma.XOR<Prisma.EventPaymentMethodUpdateWithoutEventInput, Prisma.EventPaymentMethodUncheckedUpdateWithoutEventInput>;
};
export type EventPaymentMethodUpdateManyWithWhereWithoutEventInput = {
    where: Prisma.EventPaymentMethodScalarWhereInput;
    data: Prisma.XOR<Prisma.EventPaymentMethodUpdateManyMutationInput, Prisma.EventPaymentMethodUncheckedUpdateManyWithoutEventInput>;
};
export type EventPaymentMethodScalarWhereInput = {
    AND?: Prisma.EventPaymentMethodScalarWhereInput | Prisma.EventPaymentMethodScalarWhereInput[];
    OR?: Prisma.EventPaymentMethodScalarWhereInput[];
    NOT?: Prisma.EventPaymentMethodScalarWhereInput | Prisma.EventPaymentMethodScalarWhereInput[];
    id?: Prisma.StringFilter<"EventPaymentMethod"> | string;
    eventId?: Prisma.StringFilter<"EventPaymentMethod"> | string;
    type?: Prisma.StringFilter<"EventPaymentMethod"> | string;
    value?: Prisma.DecimalFilter<"EventPaymentMethod"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntFilter<"EventPaymentMethod"> | number;
    startDate?: Prisma.DateTimeNullableFilter<"EventPaymentMethod"> | Date | string | null;
    endDate?: Prisma.DateTimeNullableFilter<"EventPaymentMethod"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"EventPaymentMethod"> | Date | string;
};
export type EventPaymentMethodCreateManyEventInput = {
    id?: string;
    type: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: number;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    createdAt?: Date | string;
};
export type EventPaymentMethodUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventPaymentMethodUncheckedUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventPaymentMethodUncheckedUpdateManyWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installments?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventPaymentMethodSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    type?: boolean;
    value?: boolean;
    installments?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    createdAt?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["eventPaymentMethod"]>;
export type EventPaymentMethodSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    type?: boolean;
    value?: boolean;
    installments?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    createdAt?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["eventPaymentMethod"]>;
export type EventPaymentMethodSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    type?: boolean;
    value?: boolean;
    installments?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    createdAt?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["eventPaymentMethod"]>;
export type EventPaymentMethodSelectScalar = {
    id?: boolean;
    eventId?: boolean;
    type?: boolean;
    value?: boolean;
    installments?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    createdAt?: boolean;
};
export type EventPaymentMethodOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "eventId" | "type" | "value" | "installments" | "startDate" | "endDate" | "createdAt", ExtArgs["result"]["eventPaymentMethod"]>;
export type EventPaymentMethodInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type EventPaymentMethodIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type EventPaymentMethodIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type $EventPaymentMethodPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EventPaymentMethod";
    objects: {
        event: Prisma.$EventPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        eventId: string;
        type: string;
        value: runtime.Decimal;
        installments: number;
        startDate: Date | null;
        endDate: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["eventPaymentMethod"]>;
    composites: {};
};
export type EventPaymentMethodGetPayload<S extends boolean | null | undefined | EventPaymentMethodDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload, S>;
export type EventPaymentMethodCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EventPaymentMethodFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EventPaymentMethodCountAggregateInputType | true;
};
export interface EventPaymentMethodDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EventPaymentMethod'];
        meta: {
            name: 'EventPaymentMethod';
        };
    };
    findUnique<T extends EventPaymentMethodFindUniqueArgs>(args: Prisma.SelectSubset<T, EventPaymentMethodFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EventPaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EventPaymentMethodFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EventPaymentMethodFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventPaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EventPaymentMethodFindFirstArgs>(args?: Prisma.SelectSubset<T, EventPaymentMethodFindFirstArgs<ExtArgs>>): Prisma.Prisma__EventPaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EventPaymentMethodFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EventPaymentMethodFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventPaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EventPaymentMethodFindManyArgs>(args?: Prisma.SelectSubset<T, EventPaymentMethodFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EventPaymentMethodCreateArgs>(args: Prisma.SelectSubset<T, EventPaymentMethodCreateArgs<ExtArgs>>): Prisma.Prisma__EventPaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EventPaymentMethodCreateManyArgs>(args?: Prisma.SelectSubset<T, EventPaymentMethodCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EventPaymentMethodCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EventPaymentMethodCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EventPaymentMethodDeleteArgs>(args: Prisma.SelectSubset<T, EventPaymentMethodDeleteArgs<ExtArgs>>): Prisma.Prisma__EventPaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EventPaymentMethodUpdateArgs>(args: Prisma.SelectSubset<T, EventPaymentMethodUpdateArgs<ExtArgs>>): Prisma.Prisma__EventPaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EventPaymentMethodDeleteManyArgs>(args?: Prisma.SelectSubset<T, EventPaymentMethodDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EventPaymentMethodUpdateManyArgs>(args: Prisma.SelectSubset<T, EventPaymentMethodUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EventPaymentMethodUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EventPaymentMethodUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EventPaymentMethodUpsertArgs>(args: Prisma.SelectSubset<T, EventPaymentMethodUpsertArgs<ExtArgs>>): Prisma.Prisma__EventPaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$EventPaymentMethodPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EventPaymentMethodCountArgs>(args?: Prisma.Subset<T, EventPaymentMethodCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EventPaymentMethodCountAggregateOutputType> : number>;
    aggregate<T extends EventPaymentMethodAggregateArgs>(args: Prisma.Subset<T, EventPaymentMethodAggregateArgs>): Prisma.PrismaPromise<GetEventPaymentMethodAggregateType<T>>;
    groupBy<T extends EventPaymentMethodGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EventPaymentMethodGroupByArgs['orderBy'];
    } : {
        orderBy?: EventPaymentMethodGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EventPaymentMethodGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventPaymentMethodGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EventPaymentMethodFieldRefs;
}
export interface Prisma__EventPaymentMethodClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    event<T extends Prisma.EventDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventDefaultArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EventPaymentMethodFieldRefs {
    readonly id: Prisma.FieldRef<"EventPaymentMethod", 'String'>;
    readonly eventId: Prisma.FieldRef<"EventPaymentMethod", 'String'>;
    readonly type: Prisma.FieldRef<"EventPaymentMethod", 'String'>;
    readonly value: Prisma.FieldRef<"EventPaymentMethod", 'Decimal'>;
    readonly installments: Prisma.FieldRef<"EventPaymentMethod", 'Int'>;
    readonly startDate: Prisma.FieldRef<"EventPaymentMethod", 'DateTime'>;
    readonly endDate: Prisma.FieldRef<"EventPaymentMethod", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"EventPaymentMethod", 'DateTime'>;
}
export type EventPaymentMethodFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.EventPaymentMethodInclude<ExtArgs> | null;
    where: Prisma.EventPaymentMethodWhereUniqueInput;
};
export type EventPaymentMethodFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.EventPaymentMethodInclude<ExtArgs> | null;
    where: Prisma.EventPaymentMethodWhereUniqueInput;
};
export type EventPaymentMethodFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.EventPaymentMethodInclude<ExtArgs> | null;
    where?: Prisma.EventPaymentMethodWhereInput;
    orderBy?: Prisma.EventPaymentMethodOrderByWithRelationInput | Prisma.EventPaymentMethodOrderByWithRelationInput[];
    cursor?: Prisma.EventPaymentMethodWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventPaymentMethodScalarFieldEnum | Prisma.EventPaymentMethodScalarFieldEnum[];
};
export type EventPaymentMethodFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.EventPaymentMethodInclude<ExtArgs> | null;
    where?: Prisma.EventPaymentMethodWhereInput;
    orderBy?: Prisma.EventPaymentMethodOrderByWithRelationInput | Prisma.EventPaymentMethodOrderByWithRelationInput[];
    cursor?: Prisma.EventPaymentMethodWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventPaymentMethodScalarFieldEnum | Prisma.EventPaymentMethodScalarFieldEnum[];
};
export type EventPaymentMethodFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.EventPaymentMethodInclude<ExtArgs> | null;
    where?: Prisma.EventPaymentMethodWhereInput;
    orderBy?: Prisma.EventPaymentMethodOrderByWithRelationInput | Prisma.EventPaymentMethodOrderByWithRelationInput[];
    cursor?: Prisma.EventPaymentMethodWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventPaymentMethodScalarFieldEnum | Prisma.EventPaymentMethodScalarFieldEnum[];
};
export type EventPaymentMethodCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.EventPaymentMethodInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventPaymentMethodCreateInput, Prisma.EventPaymentMethodUncheckedCreateInput>;
};
export type EventPaymentMethodCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EventPaymentMethodCreateManyInput | Prisma.EventPaymentMethodCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EventPaymentMethodCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    data: Prisma.EventPaymentMethodCreateManyInput | Prisma.EventPaymentMethodCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EventPaymentMethodIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EventPaymentMethodUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.EventPaymentMethodInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventPaymentMethodUpdateInput, Prisma.EventPaymentMethodUncheckedUpdateInput>;
    where: Prisma.EventPaymentMethodWhereUniqueInput;
};
export type EventPaymentMethodUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EventPaymentMethodUpdateManyMutationInput, Prisma.EventPaymentMethodUncheckedUpdateManyInput>;
    where?: Prisma.EventPaymentMethodWhereInput;
    limit?: number;
};
export type EventPaymentMethodUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventPaymentMethodUpdateManyMutationInput, Prisma.EventPaymentMethodUncheckedUpdateManyInput>;
    where?: Prisma.EventPaymentMethodWhereInput;
    limit?: number;
    include?: Prisma.EventPaymentMethodIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EventPaymentMethodUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.EventPaymentMethodInclude<ExtArgs> | null;
    where: Prisma.EventPaymentMethodWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventPaymentMethodCreateInput, Prisma.EventPaymentMethodUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EventPaymentMethodUpdateInput, Prisma.EventPaymentMethodUncheckedUpdateInput>;
};
export type EventPaymentMethodDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.EventPaymentMethodInclude<ExtArgs> | null;
    where: Prisma.EventPaymentMethodWhereUniqueInput;
};
export type EventPaymentMethodDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventPaymentMethodWhereInput;
    limit?: number;
};
export type EventPaymentMethodDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.EventPaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.EventPaymentMethodInclude<ExtArgs> | null;
};
