import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const { produitId, quantite, prixUnitaire } = await req.json();


    if (!produitId || !quantite || !prixUnitaire) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: produitId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

  
    if (existingProduct.quantiteStock < quantite) {
      return NextResponse.json({ error: 'Not enough stock available' }, { status: 400 });
    }

    let cart = await prisma.panier.findFirst();

    if (!cart) {
      cart = await prisma.panier.create({
        data: {
          articles: {
            create: [{ produitId, quantite, prixUnitaire }],
          },
        },
        include: {
          articles: true,
        },
      });
    } else {

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          panierId: cart.id,
          produitId,
        },
      });

      if (existingItem) {
    
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantite: existingItem.quantite + quantite,
            prixUnitaire, 
          },
        });
      } else {
       
        await prisma.cartItem.create({
          data: {
            produitId,
            quantite,
            prixUnitaire,
            panier: {
              connect: { id: cart.id },
            },
          },
        });
      }


      cart = await prisma.panier.findUnique({
        where: { id: cart.id },
        include: {
          articles: true,
        },
      });
    }

 
    await prisma.product.update({
      where: { id: produitId },
      data: { quantiteStock: existingProduct.quantiteStock - quantite },
    });

    console.log('Item added to cart:', { produitId, quantite, prixUnitaire });

    return NextResponse.json(cart?.id, { status: 201 });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (req.method !== 'DELETE') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID must be provided' }, { status: 400 });
    }

  
    const itemToDelete = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!itemToDelete) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

 
    const product = await prisma.product.findUnique({
      where: { id: itemToDelete.produitId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }


    await prisma.cartItem.delete({
      where: { id: itemId },
    });

 
    await prisma.product.update({
      where: { id: itemToDelete.produitId },
      data: { quantiteStock: product.quantiteStock + itemToDelete.quantite },
    });

    console.log('Item removed from cart:', itemId);

    return NextResponse.json({ message: 'Item removed from cart successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const items = await prisma.cartItem.findMany();

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching panier:', error);
    return NextResponse.json({ error: 'Failed to fetch panier' }, { status: 500 });
  }
}
