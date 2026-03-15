STATUS_PENDING = "PENDING"
STATUS_ACTIVE = "ACTIVE"
STATUS_ORPHANED = "ORPHANED"

STATUS_CHOICES = [
    (STATUS_PENDING, "Pending upload"),
    (STATUS_ACTIVE, "Confirmed / in use"),
    (STATUS_ORPHANED, "Orphaned / no longer needed"),
]
