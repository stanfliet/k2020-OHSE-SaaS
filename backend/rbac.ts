import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

interface RequestWithUser extends Request {
  user?: any;
  role?: string;
}

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { persistSession: false } }
);

// Role hierarchy (lower number = higher privilege)
const ROLE_HIERARCHY: Record<string, number> = {
  'super_admin': 0,
  'admin': 1,
  'manager': 2,
  'supervisor': 3,
  'user': 4,
  'guest': 5
};

export async function authenticateUser(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Missing authorization token' 
      });
    }

    const token = authHeader.split(' ')[1];
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }

    req.user = data.user;
    
    // Get user profile with role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      req.role = 'user'; // Default role
    } else {
      req.role = profile?.role || 'user';
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    const userRole = req.role || 'guest';

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
}

export function requireMinimumRole(minimumRole: string) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    const userRole = req.role || 'guest';
    const userRoleLevel = ROLE_HIERARCHY[userRole] ?? 99;
    const minimumRoleLevel = ROLE_HIERARCHY[minimumRole] ?? 99;

    if (userRoleLevel > minimumRoleLevel) {
      return res.status(403).json({ 
        success: false, 
        error: `Insufficient permissions. Minimum role required: ${minimumRole}` 
      });
    }

    next();
  };
}

export function isCompanyOwner() {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.params.companyId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Company ID required' 
        });
      }

      const { data: company, error } = await supabaseAdmin
        .from('company_profiles')
        .select('user_id')
        .eq('id', req.params.companyId)
        .single();

      if (error || !company) {
        return res.status(404).json({ 
          success: false, 
          error: 'Company not found' 
        });
      }

      if (company.user_id !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized' 
        });
      }

      next();
    } catch (error) {
      console.error('Company ownership check error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Authorization check failed' 
      });
    }
  };
}

export function isProjectMember() {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.params.projectId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Project ID required' 
        });
      }

      const { data: project, error } = await supabaseAdmin
        .from('projects')
        .select('user_id')
        .eq('id', req.params.projectId)
        .single();

      if (error || !project) {
        return res.status(404).json({ 
          success: false, 
          error: 'Project not found' 
        });
      }

      if (project.user_id !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized' 
        });
      }

      next();
    } catch (error) {
      console.error('Project membership check error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Authorization check failed' 
      });
    }
  };
}

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  USER: 'user',
  GUEST: 'guest'
};
