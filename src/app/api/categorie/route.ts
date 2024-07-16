

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';



export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
      return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
    }
  
    try {
      const { nom, description, parentId } = await req.json();
  
      const newCategory = await prisma.category.create({
        data: {
          nom,
          description,
          parentId: parentId ,
        },
      });
  
      console.log('Category created:', newCategory);
  
      return NextResponse.json({ message: 'Category created successfully' }, { status: 201 });
    } catch (error) {
      console.error('Error creating category:', error);
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
  }
export async function GET() {
  try {
    const categories = await prisma.category.findMany();

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (req.method !== 'PUT') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const { id, nom, description } = await req.json();

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        nom,
        description,
      },
    });

    console.log('Category updated:', updatedCategory);

    return NextResponse.json({ message: 'Category updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (req.method !== 'DELETE') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const { id } = await req.json();

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    console.log('Category deleted with id:', id);

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
