import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";



export type ItemDocument = Item & Document
@Schema()
export class Item{
    @Prop({type:SchemaTypes.ObjectId, ref:"Product"})
    productId:Types.ObjectId;

    @Prop()
    quantity:number;	

    @Prop()
    subtotal:number;
}

export const ItemSchema=SchemaFactory.createForClass(Item);


