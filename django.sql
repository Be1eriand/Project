CREATE TABLE SmartFab.dbo.auth_group ( 
	id                   int    IDENTITY(1,1)  NOT NULL,
	name                 varchar(150)      NOT NULL,
	CONSTRAINT pk_auth_group PRIMARY KEY  ( id ) 
 );
GO

CREATE TABLE SmartFab.dbo.auth_user ( 
	id                   int    IDENTITY(1,1)  NOT NULL,
	password             varchar(128)      NOT NULL,
	last_login           datetime      NULL,
	is_superuser         bit      NOT NULL,
	username             varchar(150)      NOT NULL,
	last_name            varchar(150)      NOT NULL,
	email                varchar(254)      NOT NULL,
	is_staff             bit      NOT NULL,
	is_active            bit      NOT NULL,
	date_joined          datetime      NOT NULL,
	first_name           varchar(150)      NOT NULL,
	CONSTRAINT pk_auth_user PRIMARY KEY  ( id ) 
 );
GO

CREATE TABLE SmartFab.dbo.auth_user_groups ( 
	id                   int    IDENTITY(1,1)  NOT NULL,
	user_id              int      NOT NULL,
	group_id             int      NOT NULL,
	CONSTRAINT pk_auth_user_groups PRIMARY KEY  ( id ) 
 );
GO

CREATE TABLE SmartFab.dbo.django_content_type ( 
	id                   int      IDENTITY(1,1)  NOT NULL,
	app_label            varchar(100)      NOT NULL,
	model                varchar(100)      NOT NULL,
	CONSTRAINT pk_django_content_type PRIMARY KEY  ( id ) 
 );
GO

CREATE TABLE SmartFab.dbo.auth_permission ( 
	id                   int      IDENTITY(1,1)  NOT NULL,
	content_type_id      int      NOT NULL,
	codename             varchar(100)      NOT NULL,
	name                 varchar(255)      NOT NULL,
	CONSTRAINT pk_auth_permission PRIMARY KEY  ( id ) 
 );
GO

CREATE TABLE SmartFab.dbo.auth_user_user_permissions ( 
	id                   int     IDENTITY(1,1)   NOT NULL,
	user_id              int      NOT NULL,
	permission_id        int      NOT NULL,
	CONSTRAINT pk_auth_user_user_permissions PRIMARY KEY  ( id ) 
 );
GO

CREATE TABLE SmartFab.dbo.django_admin_log ( 
	id                   int      IDENTITY(1,1)  NOT NULL,
	action_time          datetime      NOT NULL,
	object_id            text      NULL,
	object_repr          varchar(200)      NOT NULL,
	change_message       text      NOT NULL,
	content_type_id      int      NULL,
	user_id              int      NOT NULL,
	action_flag          smallint      NOT NULL,
	[CHECK]              varchar(1)      NULL,
	CONSTRAINT pk_django_admin_log PRIMARY KEY  ( id ) ,
	CONSTRAINT Cns_django_admin_log_CHECK CHECK ( [action_flag]>=(0) )
 );
GO

CREATE TABLE SmartFab.dbo.auth_group_permissions ( 
	id                   int      IDENTITY(1,1)  NOT NULL,
	group_id             int      NOT NULL,
	permission_id        int      NOT NULL,
	CONSTRAINT pk_auth_group_permissions PRIMARY KEY  ( id ) 
 );
GO

CREATE  INDEX auth_user_groups_group_id_97559544 ON SmartFab.dbo.auth_user_groups ( group_id );
GO

CREATE  INDEX auth_user_groups_user_id_6a12ed8b ON SmartFab.dbo.auth_user_groups ( user_id );
GO

CREATE  INDEX auth_permission_content_type_id_2f476e4b ON SmartFab.dbo.auth_permission ( content_type_id );
GO

CREATE  INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON SmartFab.dbo.auth_user_user_permissions ( permission_id );
GO

CREATE  INDEX auth_user_user_permissions_user_id_a95ead1b ON SmartFab.dbo.auth_user_user_permissions ( user_id );
GO

CREATE  INDEX django_admin_log_content_type_id_c4bce8eb ON SmartFab.dbo.django_admin_log ( content_type_id );
GO

CREATE  INDEX django_admin_log_user_id_c564eba6 ON SmartFab.dbo.django_admin_log ( user_id );
GO

CREATE  INDEX auth_group_permissions_group_id_b120cbf9 ON SmartFab.dbo.auth_group_permissions ( group_id );
GO

CREATE  INDEX auth_group_permissions_permission_id_84c5c92e ON SmartFab.dbo.auth_group_permissions ( permission_id );
GO

ALTER TABLE SmartFab.dbo.auth_group_permissions ADD CONSTRAINT [FK_auth_group_permissions auth_group] FOREIGN KEY ( group_id ) REFERENCES SmartFab.dbo.auth_group( id );
GO

ALTER TABLE SmartFab.dbo.auth_group_permissions ADD CONSTRAINT [FK_auth_group_permissions auth_permission] FOREIGN KEY ( permission_id ) REFERENCES SmartFab.dbo.auth_permission( id );
GO

ALTER TABLE SmartFab.dbo.auth_permission ADD CONSTRAINT [FK_auth_permission django_content_type] FOREIGN KEY ( content_type_id ) REFERENCES SmartFab.dbo.django_content_type( id );
GO

ALTER TABLE SmartFab.dbo.auth_user_groups ADD CONSTRAINT [FK_auth_user_groups auth_group] FOREIGN KEY ( group_id ) REFERENCES SmartFab.dbo.auth_group( id );
GO

ALTER TABLE SmartFab.dbo.auth_user_groups ADD CONSTRAINT [FK_auth_user_groups auth_user] FOREIGN KEY ( user_id ) REFERENCES SmartFab.dbo.auth_user( id );
GO

ALTER TABLE SmartFab.dbo.auth_user_user_permissions ADD CONSTRAINT [FK_auth_user_user_permissions auth_permission] FOREIGN KEY ( permission_id ) REFERENCES SmartFab.dbo.auth_permission( id );
GO

ALTER TABLE SmartFab.dbo.auth_user_user_permissions ADD CONSTRAINT [FK_auth_user_user_permissions auth_user] FOREIGN KEY ( user_id ) REFERENCES SmartFab.dbo.auth_user( id );
GO

ALTER TABLE SmartFab.dbo.django_admin_log ADD CONSTRAINT [FK_django_admin_log auth_user] FOREIGN KEY ( user_id ) REFERENCES SmartFab.dbo.auth_user( id );
GO

ALTER TABLE SmartFab.dbo.django_admin_log ADD CONSTRAINT [FK_django_admin_log django_content_type] FOREIGN KEY ( content_type_id ) REFERENCES SmartFab.dbo.django_content_type( id );
GO
