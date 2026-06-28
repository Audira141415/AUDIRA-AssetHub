import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();
    const updateData: any = {
      name: body.name,
      role: body.role,
      status: body.status,
    };

    if (body.password) {
      updateData.password = await hash(body.password, 10);
    }

    // Only allow email change if it's not taken
    if (body.email) {
      const exists = await prisma.user.findFirst({
        where: { email: body.email, NOT: { id: params.id } }
      });
      if (exists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
      updateData.email = body.email;
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      }
    });
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    // Prevent deleting the very last admin
    const adminCount = await prisma.user.count({
      where: { role: "Super Admin", status: "Active" }
    });

    const userToDelete = await prisma.user.findUnique({ where: { id: params.id }});
    
    if (userToDelete?.role === "Super Admin" && adminCount <= 1) {
      return NextResponse.json({ error: "Cannot delete the last Super Admin" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
