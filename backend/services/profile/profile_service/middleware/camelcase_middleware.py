import json
import inflection
from django.utils.deprecation import MiddlewareMixin


def to_snake(obj):
    if isinstance(obj, list):
        return [to_snake(i) for i in obj]
    elif isinstance(obj, dict):
        return {inflection.underscore(k): to_snake(v) for k, v in obj.items()}
    else:
        return obj


def to_camel(obj):
    if isinstance(obj, list):
        return [to_camel(i) for i in obj]
    elif isinstance(obj, dict):
        return {inflection.camelize(k, False): to_camel(v) for k, v in obj.items()}
    else:
        return obj


class CamelCaseMiddleware(MiddlewareMixin):
    def process_request(self, request):
        content_type = request.META.get("CONTENT_TYPE", "")

        if "application/json" in content_type:
            try:
                if not request.body:
                    return None

                data = json.loads(request.body.decode("utf-8"))

                snake_data = to_snake(data)

                # Replace request body so DRF sees snake_case
                request._body = json.dumps(snake_data).encode("utf-8")

            except Exception:
                pass

        return None

    def process_response(self, request, response):
        content_type = response.get("Content-Type", "")

        if "application/json" in content_type:
            try:
                content = json.loads(response.content)
                camel_content = to_camel(content)
                response.content = json.dumps(camel_content)
            except Exception:
                pass

        return response
