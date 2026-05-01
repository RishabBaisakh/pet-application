from rest_framework.pagination import CursorPagination


class FeedCursorPagination(CursorPagination):
    page_size = 20
    max_page_size = 100
    cursor_query_param = "cursor"

    def get_ordering(self, request, queryset, view):
        # Include 'id' as a tiebreaker so the cursor is fully deterministic
        # even when two posts share the exact same created_at timestamp.
        return ("-created_at", "id")
