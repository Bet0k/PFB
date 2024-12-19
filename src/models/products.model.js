import {
    Schema,
    model
} from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, "El título es obligatorio."], //required true -- sino envia el mensaje
        uppercase: true,
        trim: true, //sacar espacios adelante y atrás
        minLenght: [2, "El título debe tener, al menos, 2 caracteres."],
        maxLenght: [25, "El título puede tener, como máximo, 20 caracteres."],
    },
    description: {
        type: String,
        required: [true, "La descripción es obligatoria."],
        uppercase: true,
        trim: true,
        minLenght: [2, "La descripción debe tener, al menos, 2 caracteres."],
        maxLenght: [50, "La descripción puede tener, como máximo, 50 caracteres."],
    },
    code: {
        type: String,
        required: [true, "El código es obligatorio."],
        uppercase: true,
        trim: true,
        unique: true,
        minLenght: [1, "El código debe tener, al menos, 1 caracter."],
        maxLenght: [10, "El código puede tener, como máximo, 10 caracteres."],
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio."],
        min: [1, "El precio debe tener, al menos, 1 peso."],
    },
    status: {
        type: Boolean,
        set: (value) => {
            return ["true", "on", "yes", "1", 1, true].includes(value) ? true : false;
        }
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio."],
        min: [0, "El stock debe 0 o mayor."],
    },
    category: {
        type: String,
        required: [true, "La categoria es obligatoria."],
        uppercase: true,
        trim: true,
        minLenght: [2, "La categoria debe tener, al menos, 2 caracteres."],
        maxLenght: [50, "La categoria puede tener, como máximo, 50 caracteres."],
    }
}, {
    timestamps: true,
    versionKey: false
});

//Le paso entre "" como se guarda en la BD
const Product = model("products", productSchema);

export default Product;