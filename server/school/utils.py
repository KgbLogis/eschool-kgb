def custom_paginate(queryset, page_number, items_per_page):
    start_index = (page_number - 1) * items_per_page
    end_index = page_number * items_per_page
    paginated_data = queryset[start_index:end_index]
    return paginated_data