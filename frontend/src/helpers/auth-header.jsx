export const authHeader = ({ token }) => {
  if (!token) {
    return {}
  }
  return { 'Authorization': `Bearer ${token}` };
};