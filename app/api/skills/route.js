import { NextResponse } from 'next/server';
import Skill from '@/lib/models/Skill';
import { verifyAdmin } from '@/lib/auth';

// GET all skills or published skills
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    
    const result = published === 'true' 
      ? await Skill.getPublished() 
      : await Skill.getAll();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// CREATE new skill (admin only)
export async function POST(request) {
  try {
    const auth = verifyAdmin(request);
    if (auth.error) {
      return auth.error;
    }

    const data = await request.json();
    const result = await Skill.create(data);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}
