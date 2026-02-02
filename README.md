Let's do this!

# create migration files for your app

docker compose run --rm auth-service python manage.py makemigrations <service_name>

# apply migrations to the database

docker compose run --rm auth-service python manage.py migrate
