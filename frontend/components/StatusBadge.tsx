import { cn } from '@/lib/utils';
import {
  donationStatusColor,
  donationStatusLabel,
  requestStatusColor,
  requestStatusLabel,
  emergencyLevelColor,
  emergencyLevelLabel,
  deliveryStatusColor,
  deliveryStatusLabel,
} from '@/lib/utils';
import type {
  DonationStatus,
  RequestStatus,
  EmergencyLevel,
  DeliveryStatus,
} from '@/lib/types';

type BadgeType = 'donation' | 'request' | 'emergency' | 'delivery';

interface StatusBadgeProps {
  type: BadgeType;
  status: DonationStatus | RequestStatus | EmergencyLevel | DeliveryStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export default function StatusBadge({
  type,
  status,
  size = 'md',
  className,
}: StatusBadgeProps) {
  let colorClass = '';
  let label = '';

  switch (type) {
    case 'donation':
      colorClass = donationStatusColor(status as DonationStatus);
      label = donationStatusLabel(status as DonationStatus);
      break;
    case 'request':
      colorClass = requestStatusColor(status as RequestStatus);
      label = requestStatusLabel(status as RequestStatus);
      break;
    case 'emergency':
      colorClass = emergencyLevelColor(status as EmergencyLevel);
      label = emergencyLevelLabel(status as EmergencyLevel);
      break;
    case 'delivery':
      colorClass = deliveryStatusColor(status as DeliveryStatus);
      label = deliveryStatusLabel(status as DeliveryStatus);
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}
