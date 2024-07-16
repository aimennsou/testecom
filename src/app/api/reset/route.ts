
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';

export async function DELETE(req: NextRequest) {
  if (req.method !== 'DELETE') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {

    await prisma.category.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.cartItem.deleteMany({});

    console.log('Database reset');

    return NextResponse.json({ message: 'Database reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}