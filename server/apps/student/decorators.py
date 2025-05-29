from functools import wraps
from graphql import GraphQLError
from datetime import datetime

def student_payment_decorator(func):
    @wraps(func)
    def wrapper(root, info, *args, **kwargs):
        # Custom logic
        if info.context.user.is_student and info.context.user.student.expire_date.date() < datetime.now().date():
            raise GraphQLError("Та эрхээ сунгана уу")
        
        # # Call the original resolver function
        return func(root, info, *args, **kwargs)

    return wrapper