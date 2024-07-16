
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';


export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const { nom, prix, quantiteStock , categoryy} = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        nom,
        prix: parseFloat(prix),
        quantiteStock: parseInt(quantiteStock),
        categoryy:parseInt(categoryy)
      },
    });

    console.log('Product created:', newProduct);

    return NextResponse.json({ message: 'Product created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (req.method !== 'PUT') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const { id, nom, prix, quantiteStock } = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        nom,
        prix: parseFloat(prix),
        quantiteStock: parseInt(quantiteStock),
      },
    });

    console.log('Product updated:', updatedProduct);

    return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (req.method !== 'DELETE') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const { id } = await req.json();

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    console.log('Product deleted with id:', id);

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
