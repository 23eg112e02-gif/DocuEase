import AuditLog from '../models/AuditLog.js';

export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAIL: 'login_fail',
  LOGIN_LOCK: 'login_lock',
  REGISTER: 'register',
  LOGOUT: 'logout',
  LOGOUT_ALL: 'logout_all',
  REFRESH: 'refresh',
  PASSWORD_CHANGE: 'password_change',
  PASSWORD_RESET: 'password_reset',
  PROFILE_UPDATE: 'profile_update',
  DATA_EXPORT: 'data_export',
  ACCOUNT_DELETE: 'account_delete'
};

export const recordAudit = async ({ req, userId, action, ...details }) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      ip: req?.ip,
      userAgent: req?.get('user-agent'),
      ...details
    });
  } catch (_error) {
    return false;
  }
  return true;
};