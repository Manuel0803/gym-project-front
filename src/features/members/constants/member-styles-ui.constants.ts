export const statusTranslations: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  SUSPENDED: 'Vencido / Suspendido',
  Activo: 'Activo',
  Vencido: 'Vencido',
  Inactivo: 'Inactivo',
  Suspendido: 'Suspendido',
};

export const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-success-surface text-success-main border-success-main/30',
  SUSPENDED: 'bg-warning-surface text-warning-main border-warning-main/30',
  INACTIVE: 'bg-surface-hover text-text-muted border-border-primary',
  Activo: 'bg-success-surface text-success-main border-success-main/30',
  Vencido: 'bg-warning-surface text-warning-main border-warning-main/30',
  Inactivo: 'bg-surface-hover text-text-muted border-border-primary',
  Suspendido: 'bg-warning-surface text-warning-main border-warning-main/30',
};

export const dotStyles: Record<string, string> = {
  ACTIVE: 'bg-success-main',
  SUSPENDED: 'bg-warning-main',
  INACTIVE: 'bg-text-muted',
  Activo: 'bg-success-main',
  Vencido: 'bg-warning-main',
  Inactivo: 'bg-text-muted',
  Suspendido: 'bg-warning-main',
};

export const STATUS_TRANSLATIONS: Record<string, string> = { 
  ACTIVE: 'ACTIVO', 
  INACTIVE: 'INACTIVO', 
  SUSPENDED: 'VENCIDO / SUSPENDIDO' 
};

export const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'border-success-main/30 bg-success-surface text-success-main',
  INACTIVE: 'border-border-primary bg-surface-hover text-text-muted',
  SUSPENDED: 'border-warning-main/30 bg-warning-surface text-warning-main',
};
