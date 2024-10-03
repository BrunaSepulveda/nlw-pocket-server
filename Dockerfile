FROM bitnami/postgresql:13.16.0

ENV POSTGRES_USER=${DB_USER}
ENV POSTGRES_PASSWORD=${DB_PASSWORD}
ENV POSTGRES_DB=${DB_NAME}

EXPOSE 5432

CMD ["postgres", "-c", "listen_addresses='*'", "-c", "unix_socket_directories='/var/run/postgresql'"]