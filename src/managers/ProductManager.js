import paths from "../utils/paths.js";
import ErrorManager from "./ErrorManager.js";
import ProductModel from "../models/products.model.js"
import {
    isValidID
} from "../config/mongoose.config.js";

export default class ProductManager {
    #product;

    constructor() {
        this.#product = ProductModel;
    }

    async $findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID Inválido", 400);
        }

        const productFound = await this.#product.findById(id);

        if (!productFound) {
            throw new ErrorManager("No se encontró ningún producto con el ID ingresado.", 404);
        }

        return productFound;
    }

    async getAll(params, limit, sort = 1, currentPage = 1, baseUrl = "") {
        try {
            const $and = [];

            if (params?.title) {
                $and.push({
                    title: {
                        $regex: params.title,
                        $options: "i"
                    }
                });
            }

            if (params?.description) {
                $and.push({
                    description: {
                        $regex: params.description,
                        $options: "i"
                    }
                });
            }

            if (params?.category) {
                $and.push({
                    category: {
                        $regex: params.category,
                        $options: "i"
                    }
                });
            }

            const filters = $and.length > 0 ? {
                $and
            } : {};

            const totalDocs = await this.#product.countDocuments(filters);
            const totalPages = Math.ceil(totalDocs / limit);

            if (currentPage > totalPages || currentPage < 1) {
                throw new ErrorManager("La página solicitada no existe.", 404);
            }

            const skip = (currentPage - 1) * limit;

            let sortCriteria = {};
            if (sort) {
                if (![1, -1].includes(sort)) {
                    throw new ErrorManager("El parámetro 'sort' debe ser 1 (ascendente) o -1 (descendente).", 400);
                }
                sortCriteria = {
                    price: sort
                };
            }

            const results = await this.#product.find(filters)
                .skip(skip)
                .limit(limit)
                .sort(sortCriteria);

            const hasPrevPage = currentPage > 1;
            const hasNextPage = currentPage < totalPages;
            const prevPage = hasPrevPage ? currentPage - 1 : null;
            const nextPage = hasNextPage ? currentPage + 1 : null;
            const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}` : null;
            const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}` : null;

            return {
                status: "success",
                payload: results,
                totalDocs,
                totalPages,
                page: currentPage,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                prevLink,
                nextLink,
            };
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async getOneById(id) {
        try {
            const productFound = await this.$findOneById(id);
            return productFound;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async insertOne(data) {
        try {
            const product = await this.#product.create(data);
            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async updateOneById(id, data) {
        try {
            const productFound = await this.getOneById(id);
            if (!productFound) {
                throw new ErrorManager(`Producto con ID ${id} no encontrado.`, 404);
            }

            Object.keys(data).forEach((key) => {
                productFound[key] = data[key];
            });

            await productFound.save();

            return productFound;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async deleteOneById(id) {
        try {
            const productFound = await this.getOneById(id);
            await productFound.deleteOne();

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}