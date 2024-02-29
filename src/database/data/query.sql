DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'geoara') THEN
        CREATE DATABASE geoara
            WITH
            OWNER = postgres
            ENCODING = 'UTF8'
            LC_COLLATE = 'pt_BR.UTF-8'
            LC_CTYPE = 'pt_BR.UTF-8'
            TABLESPACE = pg_default
            CONNECTION LIMIT = -1
            IS_TEMPLATE = False;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_database WHERE datname = 'geoara') THEN
        CREATE TABLE IF NOT EXISTS construction(
            id                          char(50) CONSTRAINT construction_id PRIMARY KEY,
            construction_type           varchar(20)         NOT NULL,
            construction_status         varchar(15)         NOT NULL,
            mark_type                   varchar(20)         NOT NULL,
            construction_name           varchar(40)         NOT NULL,
            construction_desc           varchar(300)        NOT NULL,
            date_init                   date                NOT NULL,
            date_prev                   date                NOT NULL,
			latitude					double precision    NOT NULL,	
			longitude					double precision    NOT NULL,
            construction_image_name_origin char(255),   
            construction_image_name_file_path     char(255),
            construction_image_path     char(255)
        );
    END IF;
END $$;
