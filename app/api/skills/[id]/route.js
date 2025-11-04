import { NextResponse } from 'next/server';
import Skill from '@/lib/models/Skill';
import { verifyAdmin } from '@/lib/auth';

// GET single skill
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await Skill.getById(id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skill' },
      { status: 500 }
    );
  }
}

// UPDATE skill (admin only)
export async function PUT(request, { params }) {
  try {
    const auth = verifyAdmin(request);
    if (auth.error) {
      return auth.error;
    }

    const { id } = await params;
    const data = await request.json();
    const result = await Skill.update(id, data);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE skill (admin only)
export async function DELETE(request, { params }) {
  try {
    const auth = verifyAdmin(request);
    if (auth.error) {
      return auth.error;
    }

    const { id } = await params;
    const result = await Skill.delete(id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
