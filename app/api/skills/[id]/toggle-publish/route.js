import { NextResponse } from 'next/server';
import Skill from '@/lib/models/Skill';
import { verifyAdmin } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const auth = verifyAdmin(request);
    if (auth.error) {
      return auth.error;
    }

    const { id } = await params;
    const result = await Skill.togglePublish(id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error toggling skill publish status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle publish status' },
      { status: 500 }
    );
  }
}
