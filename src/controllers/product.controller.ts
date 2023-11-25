/** @format */

import { Response, Request } from "express";
import prisma from "../utils/seed";
import cloud from "../utils/cloudinary";

interface Product {
    id?: number;
    name: string;
    category: number;
    description: string;
    price: number;
}

export default {
    getAllProduct: async (req: Request, res: Response) => {
        try {
            const products = await prisma.product.findMany();
            return res.status(200).json(products);
        } catch (error) {
            res.status(501).json({ error });
        }
    },
    getByCategory: async (req: Request, res: Response) => {
        const category = req.params.category;
        try {
            const cat = await prisma.category.findUnique({
                where: {
                    name: category,
                },
            });
            if (cat) {
                const products = await prisma.product.findMany({
                    where: {
                        categoryId: cat.id,
                    },
                });
                return res.status(200).json(products);
            } else {
                return res
                    .status(404)
                    .json({ message: "There is no product in that category" });
            }
        } catch (error) {
            return res.status(500).json({ error });
        }
    },
    getProductById: async (req: Request, res: Response) => {
        const productId = req.params.id;
        try {
            const product = await prisma.product.findUnique({
                where: {
                    id: parseInt(productId),
                },
            });
            if (product) {
                return res.status(200).json(product);
            } else {
                return res
                    .status(404)
                    .json({ message: "product does not exists" });
            }
        } catch (error) {
            return res.status(500).json({ error });
        }
    },
    createProduct: async (req: Request, res: Response) => {
        const { name, price, category, description } = req.body;
        let imageUrl = req.file?.path;

        if (!name || !price || !category)
            res.status(400).json({
                message: "All required Fields must be fill",
            });
        try {
            const result = await cloud.uploader.upload(imageUrl!);
            const cat = await prisma.category.findUnique({
                where: {
                    name: category,
                },
            });
            if (cat) {
                const product = await prisma.product.create({
                    data: {
                        name,
                        price: parseFloat(price),
                        categoryId: cat.id,
                        description,
                        imageUrl: result.secure_url,
                    },
                });
                return res.status(201).json(product);
            } else {
                return res
                    .status(404)
                    .json({ message: "Category does not exist" });
            }
        } catch (error) {
            return res.status(500).json({ error });
        }
    },
};
