import {
    Schema,
    model
} from "mongoose";

const productInCartSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "products",
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "La cantidad debe ser al menos 1."]
    }
}, {
    _id: false
});


const cartSchema = new Schema({
    products: [productInCartSchema],
}, {
    timestamps: true,
    versionKey: false
});

const Cart = model("carts", cartSchema);

export default Cart;