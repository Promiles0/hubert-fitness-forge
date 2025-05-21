
// Get status badge color mapping
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500 hover:bg-green-600';
    case 'suspended': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'expired': return 'bg-red-500 hover:bg-red-600';
    case 'pending': return 'bg-blue-500 hover:bg-blue-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};
