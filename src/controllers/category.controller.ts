/** @format */

import { Request, Response } from "express";
import prisma from "../utils/seed";

export default {
    getAllCategories: async (req: Request, res: Response) => {
        try {
            const categories = await prisma.category.findMany();
            return res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error });
        }
    },
    createCategories: async (req: Request, res: Response) => {
        const { name, description } = req.body;
        try {
            if (!name)
                return res
                    .status(401)
                    .json({ message: "please fill all fields" });
            const category = await prisma.category.create({
                data: {
                    name,
                    description,
                },
            });
            return res.status(201).json(category);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    updateCategory: async (req: Request, res: Response) => {
        const { name, description } = req.body;
        const id = req.params.productId;
        try {
            const product = await prisma.category.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name,
                    description,
                },
            });
            return res.status(201).json(product);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    deleteCategory: async (req: Request, res: Response) => {
        const id = req.params.productId;
        try {
            const product = await prisma.category.delete({
                where: {
                    id: parseInt(id),
                },
            });
            return res.status(201).json(product);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
};
