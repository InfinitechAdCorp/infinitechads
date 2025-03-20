import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define PlanType locally since it's not exported by @prisma/client
type PlanType = 'Basic' | 'Standard' | 'Advance' | 'Premium' | 'Vip' | 'Addons';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const planType = url.searchParams.get('type');

    const whereCondition = planType ? { name: planType as PlanType } : {};

    const plans = await prisma.plan.findMany({
        where: whereCondition,
    });

    return NextResponse.json(plans);
}

export async function POST(request: NextRequest) {
    const data = await request.json();
    const { name, serviceTitle, description, price } = data;

    if (!name || !serviceTitle || !description || !price) {
        return NextResponse.json({ error: 'Name, service title, description, and price are required' }, { status: 400 });
    }

    const validPlanTypes: PlanType[] = ['Basic', 'Standard', 'Advance', 'Premium', 'Vip', 'Addons'];
    if (!validPlanTypes.includes(name)) {
        return NextResponse.json({ error: 'Invalid PlanType' }, { status: 400 });
    }

    try {
        const newPlan = await prisma.plan.create({
            data: {
                name,
                serviceTitle,
                description,
                price
            },
        });
        return NextResponse.json({ message: 'Plan created successfully!', newPlan }, { status: 201 });
    } catch (error) {
        console.error('Failed to create plan:', error);
        return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const data = await request.json();
    const { name, serviceTitle, description, price } = data;

    const updateData: {
        name?: PlanType;
        serviceTitle?: string;
        description?: string;
        price?: number;
    } = {};

    if (name) {
        const validPlanTypes: PlanType[] = ['Basic', 'Standard', 'Advance', 'Premium', 'Vip', 'Addons'];

        if (!validPlanTypes.includes(name)) {
            return NextResponse.json({ error: 'Invalid PlanType' }, { status: 400 });
        }

        updateData.name = name as PlanType;
    }

    if (serviceTitle) updateData.serviceTitle = serviceTitle;
    if (description) updateData.description = description;
    if (price) updateData.price = price;

    try {
        const updatedPlan = await prisma.plan.update({
            where: { id: Number(id) },
            data: updateData,
        });
        return NextResponse.json({ message: 'Plan updated successfully!', updatedPlan }, { status: 200 });
    } catch (error) {
        console.error('Failed to update plan:', error);
        return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        await prisma.plan.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ message: 'Plan deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting plan:', error);
        return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
    }
}
